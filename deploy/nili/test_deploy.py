"""Exercise deployment failure paths without Docker, SSH, or production access."""

import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest


SCRIPT = Path(__file__).with_name('deploy.sh').resolve()
DOCKER_STUB = r'''#!/usr/bin/env python3
import json
import os
from pathlib import Path
import sys

args = sys.argv[1:]
with open(os.environ['DOCKER_CALLS'], 'a') as log:
    log.write(json.dumps({'args': args, 'auth': os.environ['DOCKER_CONFIG']}) + '\n')
scenario = os.environ['SCENARIO']
if args[0] == 'login':
    sys.stdin.read()
    Path(os.environ['DOCKER_CONFIG'], 'config.json').write_text('temporary auth')
if args[0] == 'pull' and scenario == 'pull_failure':
    sys.exit(1)
if args[:2] == ['image', 'inspect']:
    print('wrong-revision' if scenario == 'revision_mismatch' else os.environ['DEPLOY_REVISION'])
if args[0] == 'compose' and 'up' in args:
    if scenario == 'health_failure' and 'TAG=new-tag' in Path('.env').read_text():
        sys.exit(1)
if args[0] == 'exec':
    sys.stdin.read()
    if scenario == 'smoke_failure':
        sys.exit(1)
'''


class DeploymentTest(unittest.TestCase):
    def run_deployment(self, scenario):
        temporary = tempfile.TemporaryDirectory(prefix='nili-deploy-test-')
        self.addCleanup(temporary.cleanup)
        root = Path(temporary.name)
        site = root / 'site'
        site.mkdir()
        env_before = 'IMAGE=previous-image\nTAG=previous-tag\nOTHER=preserved\n'
        compose_before = 'services:\n  web:\n    image: previous-image:previous-tag\n'
        (site / '.env').write_text(env_before)
        (site / '.env').chmod(0o600)
        (site / 'docker-compose.prod.yml').write_text(compose_before)
        release = root / 'release.yml'
        release.write_text('services:\n  web:\n    image: ${IMAGE}:${TAG}\n')
        binary = root / 'bin'
        binary.mkdir()
        (binary / 'docker').write_text(DOCKER_STUB)
        (binary / 'docker').chmod(0o755)
        calls_path = root / 'calls.jsonl'
        environment = {
            **os.environ,
            'PATH': f'{binary}:{os.environ["PATH"]}',
            'NILI_DEPLOY_DIR': str(site),
            'DEPLOY_IMAGE': 'new-image',
            'DEPLOY_TAG': 'new-tag',
            'DEPLOY_REVISION': 'new-revision',
            'GHCR_USER': 'test-user',
            'GHCR_TOKEN': 'test-token',
            'DOCKER_CALLS': str(calls_path),
            'SCENARIO': scenario,
        }
        result = subprocess.run(
            ['bash', str(SCRIPT), str(release)],
            env=environment, capture_output=True, text=True, timeout=15,
        )
        calls = [json.loads(line) for line in calls_path.read_text().splitlines()]
        for call in calls:
            self.assertFalse(Path(call['auth']).exists(), 'Temporary registry auth must be removed')
        self.assertNotIn('test-token', result.stdout + result.stderr)
        self.assertEqual((site / '.env').stat().st_mode & 0o777, 0o600)
        return result, site, calls, env_before, compose_before

    def test_success_keeps_backup_and_unrelated_settings(self):
        result, site, calls, before, compose_before = self.run_deployment('success')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual((site / '.env').read_text(), 'IMAGE=new-image\nTAG=new-tag\nOTHER=preserved\n')
        backups = list(site.glob('rollback.*'))
        self.assertEqual(len(backups), 1)
        self.assertEqual((backups[0] / '.env').read_text(), before)
        self.assertEqual((backups[0] / 'docker-compose.prod.yml').read_text(), compose_before)
        self.assertTrue(any('--wait' in c['args'] for c in calls))

    def test_pull_failure_does_not_change_running_release(self):
        self.assert_unchanged_before_rollout('pull_failure')

    def test_wrong_revision_does_not_change_running_release(self):
        self.assert_unchanged_before_rollout('revision_mismatch')

    def assert_unchanged_before_rollout(self, scenario):
        result, site, calls, before, compose_before = self.run_deployment(scenario)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual((site / '.env').read_text(), before)
        self.assertEqual((site / 'docker-compose.prod.yml').read_text(), compose_before)
        self.assertFalse(any('up' in c['args'] for c in calls))

    def test_unhealthy_release_rolls_back(self):
        self.assert_rolls_back('health_failure')

    def test_failed_locale_check_rolls_back(self):
        self.assert_rolls_back('smoke_failure')

    def assert_rolls_back(self, scenario):
        result, site, calls, before, compose_before = self.run_deployment(scenario)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual((site / '.env').read_text(), before)
        self.assertEqual((site / 'docker-compose.prod.yml').read_text(), compose_before)
        restarts = [c for c in calls if c['args'][0] == 'compose' and 'up' in c['args']]
        self.assertEqual(len(restarts), 2)
        self.assertIn('--pull', restarts[-1]['args'])
        self.assertIn('never', restarts[-1]['args'])


if __name__ == '__main__':
    unittest.main()
