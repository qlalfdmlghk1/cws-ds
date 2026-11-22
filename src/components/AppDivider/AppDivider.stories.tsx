import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppDivider } from './AppDivider';

const meta = {
  title: 'Data Display/AppDivider',
  component: AppDivider,
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
} satisfies Meta<typeof AppDivider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const WithLabel: Story = { args: { label: '또는' } };
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--ink-muted)' }}>
      수정 <AppDivider orientation="vertical" /> 복제 <AppDivider orientation="vertical" /> 삭제
    </div>
  ),
};
