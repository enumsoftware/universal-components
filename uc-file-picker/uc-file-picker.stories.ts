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
