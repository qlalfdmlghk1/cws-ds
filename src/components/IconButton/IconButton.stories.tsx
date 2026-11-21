import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { IconButton } from './IconButton';
import { icons, Row, Stack } from '../../stories/demo';

const meta = {
  title: 'Actions/IconButton',
  component: IconButton,
  args: { icon: icons.close, label: '닫기', onClick: fn() },
  argTypes: { icon: { control: false } },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = {};
export const Secondary: Story = { args: { icon: icons.search, label: '검색', variant: 'secondary' } };
export const Primary: Story = { args: { icon: icons.plus, label: '새로 만들기', variant: 'primary' } };
export const Danger: Story = { args: { icon: icons.trash, label: '삭제', variant: 'danger' } };

export const 모음: Story = {
  render: () => (
    <Stack>
      <Row label="variant">
        <IconButton icon={icons.close} label="닫기" />
        <IconButton icon={icons.search} label="검색" variant="secondary" />
        <IconButton icon={icons.plus} label="새로 만들기" variant="primary" />
        <IconButton icon={icons.trash} label="삭제" variant="danger" />
      </Row>
      <Row label="size">
        <IconButton icon={icons.more} label="더보기" size="sm" variant="secondary" />
        <IconButton icon={icons.more} label="더보기" size="md" variant="secondary" />
        <IconButton icon={icons.more} label="더보기" size="lg" variant="secondary" />
      </Row>
      <Row label="disabled">
        <IconButton icon={icons.close} label="닫기" disabled />
        <IconButton icon={icons.search} label="검색" variant="secondary" disabled />
      </Row>
    </Stack>
  ),
};
