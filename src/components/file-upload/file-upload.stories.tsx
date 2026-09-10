import { useState } from 'react';
import { Meta } from '@storybook/react';
import { useTranslation } from 'react-i18next';
import { FileUploadArea, FileUploadCard, FileFormatIcon, ImageUpload } from '.';
import { Button } from '@components/button';
import { FigmaFrame } from '../../docs/figma.docs';
import { FileFormatIconSet } from './file-upload.docs';

const meta: Meta<typeof FileUploadArea> = {
  title: 'Base Components/File Upload/File Upload',
  component: FileUploadArea,
  parameters: {
    docs: {
      description: {
        component: `The **File Upload** family, from the Figma "❖ File Upload" page: Upload Area (Default/Hover), Upload Cards (In Progress/Success/Error), Image Upload (Avatar·Company·1:1·4:3·16:9 × Empty/Uploaded × Vertical/Horizontal) and File Format Icons (10 colours × 2 sizes).

**A real \`<input type="file">\` sits behind the drop zone** — visually hidden but present, so the control is keyboard reachable, opens the OS picker, and participates in a form. Drag-and-drop is the enhancement, not the mechanism. Figma's "Hover" is a CSS state, but **drag-over is not**: it comes from DOM events, so it is real component state exposed as \`data-dragging\`.

**A failed upload announces itself.** The error message is \`role="alert"\` — the failure happens after the user has moved on, and a silent one is the worst outcome here. Progress is a real \`role="progressbar"\` with live values, not a decorative bar.

**File size is passed pre-formatted.** "1.2 MB" versus "۱٫۲ مگابایت" is a locale decision the call site owns, not something the component should guess.`,
      },
    },
  },
};

export const UploadArea = () => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<string[]>([]);
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <FileUploadArea
        multiple
        onFiles={(list) => setFiles(list.map((file) => file.name))}
        title={t('fileUpload.title')}
        description={t('fileUpload.description')}
        label={t('fileUpload.label')}
      />
      {files.map((name) => (
        <FileUploadCard
          key={name}
          fileName={name}
          status="success"
          removeLabel={t('fileUpload.remove')}
          onRemove={() => setFiles(files.filter((f) => f !== name))}
        />
      ))}
    </div>
  );
};

/** The three card states from Figma. */
export const CardStates = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <FileUploadCard
        fileName="quarterly-report.pdf"
        fileSize="2.4 MB"
        status="progress"
        progress={62}
        removeLabel={t('fileUpload.remove')}
        onRemove={() => {}}
      />
      <FileUploadCard
        fileName="design-tokens.xlsx"
        fileSize="1.2 MB"
        status="success"
        removeLabel={t('fileUpload.remove')}
        onRemove={() => {}}
      />
      <FileUploadCard
        fileName="presentation.pptx"
        fileSize="8.1 MB"
        status="error"
        errorMessage={t('fileUpload.failed')}
        retryLabel={t('fileUpload.retry')}
        removeLabel={t('fileUpload.remove')}
        onRetry={() => {}}
        onRemove={() => {}}
      />
    </div>
  );
};

/** Ten colours, keyed off the extension so a PDF is always red. */
export const FormatIcons = () => (
  <div className="flex flex-wrap gap-3">
    {[
      'a.pdf',
      'b.docx',
      'c.xlsx',
      'd.pptx',
      'e.zip',
      'f.png',
      'g.mp4',
      'h.mp3',
      'i.json',
      'j.txt',
    ].map((name) => (
      <div key={name} className="flex flex-col items-center gap-1">
        <FileFormatIcon fileName={name} />
        <span className="text-[11px] text-soft-400">{name.split('.')[1]}</span>
      </div>
    ))}
  </div>
);

export const ImageUploads = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start gap-6">
        <ImageUpload
          shape="avatar"
          alignment="horizontal"
          onFiles={() => {}}
          label={t('fileUpload.uploadImage')}
          hint={t('fileUpload.imageHint')}
          actions={
            <Button size="2xs" appearance="stroke" color="neutral">
              {t('fileUpload.change')}
            </Button>
          }
        />
        <ImageUpload
          shape="company"
          onFiles={() => {}}
          label={t('fileUpload.uploadImage')}
        />
      </div>
      <div className="grid w-full max-w-2xl grid-cols-3 gap-4">
        {(['square', '4:3', '16:9'] as const).map((shape) => (
          <ImageUpload
            key={shape}
            shape={shape}
            onFiles={() => {}}
            label={t('fileUpload.uploadImage')}
          />
        ))}
      </div>
    </div>
  );
};

// ====================== Figma component sets ======================

export const FileFormatIconsSet = () => (
  <FigmaFrame>
    <FileFormatIconSet />
  </FigmaFrame>
);
FileFormatIconsSet.storyName = 'File Format Icons set';
FileFormatIconsSet.parameters = { docs: { source: { code: null } } };

export default meta;
