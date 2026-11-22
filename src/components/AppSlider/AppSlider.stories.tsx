import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppSlider } from './AppSlider';

const meta = {
  title: 'Form Controls/AppSlider',
  component: AppSlider,
  args: { label: '음량', defaultValue: 70, formatValue: (n: number) => `${n}%`, fullWidth: true, onChange: fn() },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof AppSlider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const StepAndEnds: Story = { args: { label: '예산', step: 10, defaultValue: 30, formatValue: (n: number) => `${n}만 원`, minLabel: '0원', maxLabel: '100만 원' } };
export const Disabled: Story = { args: { label: '잠긴 설정', defaultValue: 20, formatValue: undefined, disabled: true, helperText: '관리자만 바꿀 수 있어요.' } };
