import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

const meta = {
  title: 'Data Display/Divider',
  component: Divider,
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
} satisfies Meta<typeof Divider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const WithLabel: Story = { args: { label: '또는' } };
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--ink-muted)' }}>
      수정 <Divider orientation="vertical" /> 복제 <Divider orientation="vertical" /> 삭제
    </div>
  ),
};
