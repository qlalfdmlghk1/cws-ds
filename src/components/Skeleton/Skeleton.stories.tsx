import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';
import { Card } from '../Card/Card';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  args: { lines: 3 },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {};
export const 카드_로딩: Story = {
  render: () => (
    <Card>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton variant="circle" size={40} />
        <div style={{ flex: 1 }}><Skeleton lines={2} /></div>
      </div>
      <Skeleton variant="rect" height={64} />
    </Card>
  ),
};
