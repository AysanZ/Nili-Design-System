/** Docs-only: Figma File Format Icons set (see src/docs). */
import { FileFormatIcon } from './file-upload';
import type { FileFormatColor } from './file-upload';

const COLORS: FileFormatColor[] = [
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'sky',
  'blue',
  'purple',
  'pink',
  'gray',
];

export function FileFormatIconSet() {
  return (
    <div className="flex flex-col gap-6">
      {(['md', 'xs'] as const).map((size) => (
        <div key={size} className="flex flex-wrap gap-6">
          {COLORS.map((color) => (
            <FileFormatIcon
              key={color}
              fileName="file.pdf"
              color={color}
              size={size}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
