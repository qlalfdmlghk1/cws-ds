import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppIconButton } from './AppIconButton';
import { icons, Row, Stack } from '../../stories/demo';

const meta = {
  title: 'Actions/AppIconButton',
  component: AppIconButton,
  args: { icon: icons.close, label: '닫기', onClick: fn() },
  argTypes: { icon: { control: false } },
} satisfies Meta<typeof AppIconButton>;
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
        <AppIconButton icon={icons.close} label="닫기" />
        <AppIconButton icon={icons.search} label="검색" variant="secondary" />
        <AppIconButton icon={icons.plus} label="새로 만들기" variant="primary" />
        <AppIconButton icon={icons.trash} label="삭제" variant="danger" />
      </Row>
      <Row label="size">
        <AppIconButton icon={icons.more} label="더보기" size="sm" variant="secondary" />
        <AppIconButton icon={icons.more} label="더보기" size="md" variant="secondary" />
        <AppIconButton icon={icons.more} label="더보기" size="lg" variant="secondary" />
      </Row>
      <Row label="disabled">
        <AppIconButton icon={icons.close} label="닫기" disabled />
        <AppIconButton icon={icons.search} label="검색" variant="secondary" disabled />
      </Row>
    </Stack>
  ),
};
