import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppProgress } from './AppProgress';

const meta = {
  title: 'Feedback/AppProgress',
  component: AppProgress,
  args: { label: '사진 올리는 중', value: 35, showValue: true },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
} satisfies Meta<typeof AppProgress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Steps: Story = { args: { label: '프로필 완성도', value: 3, max: 4, showValue: false, formatValue: (n: number, m: number) => `${n} / ${m}단계` } };
export const Done: Story = { args: { label: '백업 완료', value: 100, tone: 'success', size: 'sm', showValue: false } };
export const Indeterminate: Story = { args: { label: undefined, value: undefined, 'aria-label': '불러오는 중' } };
