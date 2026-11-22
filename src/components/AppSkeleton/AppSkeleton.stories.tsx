import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppSkeleton } from './AppSkeleton';
import { AppCard } from '../AppCard/AppCard';

const meta = {
  title: 'Feedback/AppSkeleton',
  component: AppSkeleton,
  args: { lines: 3 },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof AppSkeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {};
export const 카드_로딩: Story = {
  render: () => (
    <AppCard>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <AppSkeleton variant="circle" size={40} />
        <div style={{ flex: 1 }}><AppSkeleton lines={2} /></div>
      </div>
      <AppSkeleton variant="rect" height={64} />
    </AppCard>
  ),
};
