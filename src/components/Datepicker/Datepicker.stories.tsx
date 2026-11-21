import type { Meta, StoryObj } from '@storybook/react-vite';
import { Datepicker, datePresets as P } from './Datepicker';

function day(offset = 0) {
  const t = new Date();
  t.setDate(t.getDate() + offset);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}

const meta = {
  title: 'Form Controls/Datepicker',
  component: Datepicker,
  args: { label: '마감일', fullWidth: true },
  decorators: [(Story) => <div style={{ maxWidth: 320, minHeight: 440 }}><Story /></div>],
} satisfies Meta<typeof Datepicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = { args: { defaultValue: day(3), min: day(0), helperText: '오늘 이후만 고를 수 있어요.', defaultOpen: true } };
export const Range: Story = {
  args: { label: '조회 기간', mode: 'range', defaultValue: P.last7.range(), presets: [P.last7, P.last30, P.thisMonth, P.lastMonth], max: day(0) },
  decorators: [(Story) => <div style={{ maxWidth: 'none', width: 640 }}><Story /></div>],
};
export const Error: Story = { args: { label: '시작일', required: true, error: '시작일을 골라 주세요.' } };
export const Disabled: Story = { args: { label: '비활성', disabled: true, defaultValue: day(0) } };
