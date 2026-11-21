import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const regions = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종'].map((r) => ({ value: r, label: r }));

const meta = {
  title: 'Form Controls/Select',
  component: Select,
  args: { label: '지역', placeholder: '지역 선택', options: regions },
  decorators: [(Story) => <div style={{ minHeight: 320 }}><Story /></div>],
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = {
  args: {
    label: '직군',
    defaultValue: 'fe',
    defaultOpen: true,
    options: [
      { value: 'fe', label: '프론트엔드', description: 'Vue, React, TypeScript' },
      { value: 'be', label: '백엔드', description: 'Spring, Node.js' },
      { value: 'design', label: '디자인', description: 'UX, UI, BX' },
      { value: 'pm', label: '기획', disabled: true, description: '이번 모집에는 없어요' },
    ],
  },
};
export const Small: Story = { args: { label: '정렬', size: 'sm', defaultValue: 'new', options: [{ value: 'new', label: '최신순' }, { value: 'pop', label: '인기순' }] } };
export const Error: Story = { args: { label: '연도', required: true, placeholder: '연도 선택', error: '연도를 골라 주세요.', options: [{ value: '2026', label: '2026' }, { value: '2025', label: '2025' }] } };
export const Disabled: Story = { args: { label: '비활성', placeholder: '고를 수 없어요', disabled: true, options: [] } };
