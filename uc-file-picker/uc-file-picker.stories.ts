import type { Meta, StoryObj } from '@storybook/angular';
import { UcFilePicker } from './uc-file-picker';

const meta: Meta<UcFilePicker> = {
  title: 'Components/File Picker',
  component: UcFilePicker,
  args: {
    id: 'file-picker-1',
    label: 'Upload image',
    accept: 'image/*,image/svg+xml',
    helperText: 'PNG, JPG or SVG (max 5MB)',
    disabled: false,
    maxFileSizeBytes: null,
  },
  argTypes: {
    maxFileSizeBytes: {
      control: { type: 'number' },
      description: 'Maximum accepted file size in bytes. Leave empty for no limit.',
    },
  },
};

export default meta;
type Story = StoryObj<UcFilePicker>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DocumentUpload: Story = {
  args: {
    label: 'Upload document',
    accept: '.pdf,.doc,.docx',
    helperText: 'PDF or Word documents only',
  },
};

export const WithSizeLimit: Story = {
  args: {
    helperText: 'PNG, JPG or SVG (max 5MB)',
    maxFileSizeBytes: 5 * 1024 * 1024,
  },
};

export const TinySizeLimit: Story = {
  args: {
    helperText: 'Pick any file over 10KB to see the size error',
    maxFileSizeBytes: 10 * 1024,
  },
};
