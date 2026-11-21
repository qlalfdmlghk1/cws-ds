import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup } from './Avatar';
import { Row, Stack } from '../../stories/demo';

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar,
  args: { name: '최원서' },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};
export const Fallback: Story = { args: { name: undefined } };
export const Square: Story = { args: { name: 'Incross', shape: 'square' } };
export const Status: Story = { args: { name: '김지윤', status: 'online' } };

export const 모음: Story = {
  render: () => (
    <Stack>
      <Row label="size">{(['xs', 'sm', 'md', 'lg'] as const).map((s) => <Avatar key={s} name="최원서" size={s} />)}</Row>
      <Row label="group">
        <AvatarGroup max={3} size="sm">
          <Avatar name="최원서" />
          <Avatar name="김지윤" />
          <Avatar name="John Doe" />
          <Avatar name="박민" />
          <Avatar name="이서" />
        </AvatarGroup>
      </Row>
    </Stack>
  ),
};
