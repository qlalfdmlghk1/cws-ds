import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppAvatar, AppAvatarGroup } from './AppAvatar';
import { Row, Stack } from '../../stories/demo';

const meta = {
  title: 'Data Display/AppAvatar',
  component: AppAvatar,
  args: { name: '최원서' },
} satisfies Meta<typeof AppAvatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};
export const Fallback: Story = { args: { name: undefined } };
export const Square: Story = { args: { name: 'Incross', shape: 'square' } };
export const Status: Story = { args: { name: '김지윤', status: 'online' } };

export const 모음: Story = {
  render: () => (
    <Stack>
      <Row label="size">{(['xs', 'sm', 'md', 'lg'] as const).map((s) => <AppAvatar key={s} name="최원서" size={s} />)}</Row>
      <Row label="group">
        <AppAvatarGroup max={3} size="sm">
          <AppAvatar name="최원서" />
          <AppAvatar name="김지윤" />
          <AppAvatar name="John Doe" />
          <AppAvatar name="박민" />
          <AppAvatar name="이서" />
        </AppAvatarGroup>
      </Row>
    </Stack>
  ),
};
