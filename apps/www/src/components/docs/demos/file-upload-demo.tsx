'use client';

import { useState } from 'react';
import {
  FileUploadArea,
  FileUploadCard,
  FileFormatIcon,
  ImageUpload,
  Button,
} from '@www/components/nili';
import { DemoLabel, DemoRow, DemoSection } from './demo-section';
import { useDemoText } from './demo-text';
import { fileUploadText } from './file-upload-demo.text';

const FORMATS = [
  'report.pdf',
  'sheet.xlsx',
  'slides.pptx',
  'notes.docx',
  'photo.png',
  'clip.mp4',
  'archive.zip',
  'data.json',
];

/**
 * Responsive overview for the File Upload family:
 * Upload Area · File Card · File Format Icon · Image Upload
 */
export function FileUploadDemo() {
  const t = useDemoText(fileUploadText);
  const [files, setFiles] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Upload area ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('area.title')}
        description={t('area.body')}
        code={`import { FileUploadArea } from "@nili/ui"

export function Example() {
  return (
    <FileUploadArea
      multiple
      accept="image/*,application/pdf"
      label="Upload files"
      title="Choose a file or drag it here"
      description="PNG, JPG or PDF, up to 10 MB."
      onFiles={(files) => upload(files)}
    />
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-3">
          <FileUploadArea
            multiple
            accept="image/*,application/pdf"
            label={t('area.label')}
            title={t('area.title2')}
            description={t('area.hint')}
            onFiles={(dropped) =>
              setFiles(dropped.map((file) => file.name).slice(0, 3))
            }
          />
          {files.length > 0 ? (
            <p className="text-[12px] text-sub-600">
              {t('area.picked').replace('{files}', files.join(', '))}
            </p>
          ) : null}
        </div>
      </DemoSection>

      {/* ── Area states ─────────────────────────────────────────────── */}
      <DemoSection
        title={t('states.title')}
        description={t('states.body')}
        code={`import { FileUploadArea } from "@nili/ui"

export function Example() {
  return (
    <>
      <FileUploadArea label="Upload" onFiles={onFiles} />
      <FileUploadArea label="Upload" invalid onFiles={onFiles} />
      <FileUploadArea label="Upload" disabled onFiles={onFiles} />
    </>
  )
}`}
      >
        <div className="grid w-full gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('states.default')}</DemoLabel>
            <FileUploadArea
              label={t('states.upload')}
              title={t('states.choose')}
              onFiles={() => undefined}
            />
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('states.invalid')}</DemoLabel>
            <FileUploadArea
              label={t('states.upload')}
              invalid
              title={t('states.tooLarge')}
              description={t('states.maxSize')}
              onFiles={() => undefined}
            />
          </div>
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('states.disabled')}</DemoLabel>
            <FileUploadArea
              label={t('states.upload')}
              disabled
              title={t('states.paused')}
              description={t('states.noSpace')}
              onFiles={() => undefined}
            />
          </div>
        </div>
      </DemoSection>

      {/* ── File cards ──────────────────────────────────────────────── */}
      <DemoSection
        title={t('card.title')}
        description={t('card.body')}
        code={`import { FileUploadCard } from "@nili/ui"

export function Example() {
  return (
    <>
      <FileUploadCard
        fileName="annual-report.pdf"
        fileSize="2.4 MB"
        status="progress"
        progress={62}
        onRemove={cancel}
        removeLabel="Cancel upload"
      />

      <FileUploadCard
        fileName="photo.png"
        fileSize="840 KB"
        status="success"
        onRemove={remove}
        removeLabel="Remove file"
      />

      <FileUploadCard
        fileName="archive.zip"
        fileSize="18 MB"
        status="error"
        errorMessage="File is larger than 10 MB."
        onRetry={retry}
        retryLabel="Try again"
        onRemove={remove}
        removeLabel="Remove file"
      />
    </>
  )
}`}
      >
        <div className="flex w-full max-w-md flex-col gap-3">
          <FileUploadCard
            fileName="annual-report.pdf"
            fileSize="2.4 MB"
            status="progress"
            progress={62}
            onRemove={() => undefined}
            removeLabel={t('card.cancel')}
          />
          <FileUploadCard
            fileName="brand-photo.png"
            fileSize="840 KB"
            status="success"
            onRemove={() => undefined}
            removeLabel={t('card.remove')}
          />
          <FileUploadCard
            fileName="archive.zip"
            fileSize="18 MB"
            status="error"
            errorMessage={t('card.tooLarge')}
            onRetry={() => undefined}
            retryLabel={t('card.retry')}
            onRemove={() => undefined}
            removeLabel={t('card.remove')}
          />
        </div>
      </DemoSection>

      {/* ── Format icons ────────────────────────────────────────────── */}
      <DemoSection
        title={t('format.title')}
        description={t('format.body')}
        code={`import { FileFormatIcon } from "@nili/ui"

export function Example() {
  return (
    <>
      <FileFormatIcon fileName="report.pdf" />
      <FileFormatIcon fileName="sheet.xlsx" />
      <FileFormatIcon fileName="photo.png" size="xs" />
      <FileFormatIcon fileName="anything.bin" color="purple" />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-4">
          {(['md', 'xs'] as const).map((size) => (
            <div key={size} className="flex flex-col gap-2">
              <DemoLabel>{size}</DemoLabel>
              <DemoRow>
                {FORMATS.map((fileName) => (
                  <div
                    key={fileName}
                    className="flex flex-col items-center gap-1"
                  >
                    <FileFormatIcon fileName={fileName} size={size} />
                    <span className="font-mono text-[10px] text-sub-600">
                      {fileName.split('.').pop()}
                    </span>
                  </div>
                ))}
              </DemoRow>
            </div>
          ))}
        </div>
      </DemoSection>

      {/* ── Image upload ────────────────────────────────────────────── */}
      <DemoSection
        title={t('image.title')}
        description={t('image.body')}
        code={`import { ImageUpload, Button } from "@nili/ui"

export function Example() {
  return (
    <>
      <ImageUpload
        shape="avatar"
        label="Profile photo"
        hint="JPG or PNG, at least 256×256."
        onFiles={(files) => upload(files[0])}
        actions={<Button size="xs" appearance="stroke">Choose file</Button>}
      />

      <ImageUpload shape="16:9" alignment="horizontal" label="Cover" onFiles={onFiles} />
    </>
  )
}`}
      >
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-2">
            <DemoLabel>{t('image.shapes')}</DemoLabel>
            <div className="flex flex-wrap items-start gap-6">
              {(['avatar', 'company', 'square', '4:3', '16:9'] as const).map(
                (shape) => (
                  <div key={shape} className="flex flex-col items-center gap-2">
                    <ImageUpload
                      shape={shape}
                      label={t('image.uploadShape').replace('{shape}', shape)}
                      onFiles={() => undefined}
                    />
                    <span className="font-mono text-[11px] text-sub-600">
                      {shape}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <DemoLabel>{t('image.horizontal')}</DemoLabel>
            <div className="max-w-md">
              <ImageUpload
                shape="avatar"
                alignment="horizontal"
                label={t('image.photo')}
                hint={t('image.photoHint')}
                onFiles={() => undefined}
                actions={
                  <Button size="xs" appearance="stroke">
                    {t('image.chooseFile')}
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </DemoSection>
    </div>
  );
}
