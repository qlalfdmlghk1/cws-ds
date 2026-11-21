import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FileUpload } from './FileUpload';

const sample = () => [
  new File([new Uint8Array(482000)], '포트폴리오_최종.pdf', { type: 'application/pdf' }),
  new File([new Uint8Array(1240000)], '메인화면.png', { type: 'image/png' }),
];

const meta = {
  title: 'Form Controls/FileUpload',
  component: FileUpload,
  args: { label: '첨부 파일', fullWidth: true, onChange: fn() },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof FileUpload>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { accept: 'image/*', maxSize: 5 * 1024 * 1024, label: '프로필 사진' } };
export const Multiple: Story = {
  args: { multiple: true, maxFiles: 5, maxSize: 10 * 1024 * 1024, accept: '.pdf,image/*', helperText: '최대 5개까지 올릴 수 있어요.' },
  render: (args) => <FileUpload {...args} defaultValue={sample()} />,
};
export const Error: Story = { args: { label: '계약서', required: true, error: '계약서를 올려 주세요.' } };
export const Disabled: Story = { args: { label: '계약서', disabled: true } };
