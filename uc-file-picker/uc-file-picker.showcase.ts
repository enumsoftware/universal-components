import { bool, defineShowcase, number, text } from '../workbench/core';
import { UcFilePicker } from './uc-file-picker';

export default defineShowcase({
  id: 'components/file-picker',
  group: 'Components',
  title: 'File Picker',
  component: UcFilePicker,
  knobs: {
    id: text('file-picker-1'),
    label: text('Upload image'),
    accept: text('image/*,image/svg+xml'),
    helperText: text('PNG, JPG or SVG (max 5MB)'),
    disabled: bool(false),
    maxFileSizeBytes: number(null, { description: 'Maximum accepted file size in bytes. Leave empty for no limit.' }),
    editImages: bool(false),
    imageEditorTitle: text('Crop image'),
  },
  examples: [
    {
      name: 'Image Editor',
      props: { editImages: true, helperText: 'Choose an image to crop, rotate or flip it before selection' },
    },
    { name: 'Disabled', props: { disabled: true } },
    {
      name: 'Document Upload',
      props: { label: 'Upload document', accept: '.pdf,.doc,.docx', helperText: 'PDF or Word documents only' },
    },
    {
      name: 'With Size Limit',
      props: { helperText: 'PNG, JPG or SVG (max 5MB)', maxFileSizeBytes: 5 * 1024 * 1024 },
    },
    {
      name: 'Tiny Size Limit',
      props: { helperText: 'Pick any file over 10KB to see the size error', maxFileSizeBytes: 10 * 1024 },
    },
  ],
});
