import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FileUploadArea,
  FileUploadCard,
  FileFormatIcon,
  ImageUpload,
  formatColorFor,
} from '.';

describe('FileUploadArea', () => {
  // Drag-and-drop is the enhancement; the input is the mechanism.
  it('keeps a real file input behind the drop zone', () => {
    render(<FileUploadArea onFiles={vi.fn()} label="Upload file" />);
    const input = screen.getByLabelText('Upload file');
    expect(input).toHaveAttribute('type', 'file');
  });

  it('reports files chosen through the picker', async () => {
    const user = userEvent.setup();
    const onFiles = vi.fn();
    render(<FileUploadArea onFiles={onFiles} label="Upload file" />);
    const file = new File(['x'], 'a.pdf', { type: 'application/pdf' });
    await user.upload(
      screen.getByLabelText('Upload file') as HTMLInputElement,
      file,
    );
    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  it('flags drag-over as real state, not a CSS hover', () => {
    const { container } = render(
      <FileUploadArea onFiles={vi.fn()} label="Upload" />,
    );
    const zone = container.firstElementChild as HTMLElement;
    expect(zone).not.toHaveAttribute('data-dragging');
  });
});

describe('FileUploadCard', () => {
  it('exposes progress as a real progressbar', () => {
    render(<FileUploadCard fileName="a.pdf" status="progress" progress={40} />);
    const bar = screen.getByRole('progressbar', { name: 'a.pdf' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
  });

  // A silent failed upload is the worst outcome here.
  it('announces failures', () => {
    render(
      <FileUploadCard
        fileName="a.pdf"
        status="error"
        errorMessage="Upload failed"
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Upload failed');
  });

  it('offers retry only on error', () => {
    const { rerender } = render(
      <FileUploadCard
        fileName="a.pdf"
        status="success"
        onRetry={vi.fn()}
        retryLabel="Retry"
      />,
    );
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();

    rerender(
      <FileUploadCard
        fileName="a.pdf"
        status="error"
        onRetry={vi.fn()}
        retryLabel="Retry"
      />,
    );
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
});

describe('FileFormatIcon', () => {
  it('keys colour off the extension', () => {
    expect(formatColorFor('report.pdf')).toBe('red');
    expect(formatColorFor('data.xlsx')).toBe('green');
    expect(formatColorFor('mystery.qqq')).toBe('gray');
  });

  it('is decorative — the file name carries the meaning', () => {
    const { container } = render(<FileFormatIcon fileName="report.pdf" />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('ImageUpload', () => {
  it('has a useful default width for aspect-ratio previews', () => {
    const { container } = render(
      <ImageUpload shape="16:9" onFiles={vi.fn()} label="Upload cover" />,
    );

    expect(container.querySelector('button')).toHaveClass(
      'w-24',
      'aspect-video',
    );
  });

  it('lets consumers override the default preview width', () => {
    const { container } = render(
      <ImageUpload
        shape="4:3"
        previewClassName="w-full"
        onFiles={vi.fn()}
        label="Upload photo"
      />,
    );

    expect(container.querySelector('button')).toHaveClass('w-full');
    expect(container.querySelector('button')).not.toHaveClass('w-24');
  });
});
