/**
 * Nili Design System — public API.
 *
 * Deep imports (`nili-ui/dist/components/badge/badge`) are NOT supported and
 * will break without a major version. Import from here, or from the two
 * documented subpaths:
 *
 *   nili-ui           components, providers, hooks, cn
 *   nili-ui/icons     runtime string→icon lookup (pulls the full icon set)
 *   nili-ui/styles.css   the stylesheet
 */

/* ── components ── */
export * from './components/accordion';
export * from './components/activity-feed';
export * from './components/alert';
export * from './components/avatar';
export * from './components/badge';
export * from './components/banner';
export * from './components/breadcrumb';
export * from './components/checkbox';
export * from './components/color-picker';
export * from './components/content-divider';
export * from './components/date-picker';
export * from './components/button';
export * from './components/drawer';
export * from './components/dropdown';
export * from './components/empty-state';
export * from './components/file-upload';
export * from './components/key-components';
export * from './components/modal';
export * from './components/pagination';
export * from './components/progress-bar';
export * from './components/quick-actions';
export * from './components/radio';
export * from './components/rating';
export * from './components/slider';
export * from './components/step-indicator';
export * from './components/switch';
export * from './components/table';
export * from './components/tabs';
export * from './components/tag';
export * from './components/text-area';
export * from './components/text-input';
export * from './components/filter';
export * from './components/icon';
export * from './components/toggle';
export * from './components/tooltip';
export * from './components/typography';
export * from './components/video-player';

/* ── runtime ── */
export * from './providers';
export * from './hooks';
export { cn } from './lib/cn';
export { Slot } from './lib/slot';
export type { PolymorphicProps } from './lib/polymorphic';
export {
  toPersianDigits,
  toLatinDigits,
  formatNumber,
  parseLocalizedNumber,
} from './lib/numerals';
