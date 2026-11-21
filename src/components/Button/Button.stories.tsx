import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';
import { icons, Row, Stack } from '../../stories/demo';

const meta = {
  title: 'Actions/Button',
  component: Button,
  args: { children: '저장', onClick: fn() },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', children: '취소' } };
export const Ghost: Story = { args: { variant: 'ghost', children: '편집' } };
export const Danger: Story = { args: { variant: 'danger', children: '삭제하기' } };
export const Loading: Story = { args: { loading: true, children: '저장 중' } };
export const WithIcon: Story = { args: { iconRight: icons.arrow, children: '다음' } };

export const 모음: Story = {
  render: () => (
    <Stack>
      <Row label="variant">
        <Button>저장</Button>
        <Button variant="secondary">취소</Button>
        <Button variant="ghost">편집</Button>
        <Button variant="danger">삭제하기</Button>
      </Row>
      <Row label="size">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Row>
      <Row label="state">
        <Button iconRight={icons.arrow}>다음</Button>
        <Button loading>저장 중</Button>
        <Button disabled>비활성</Button>
        <Button variant="secondary" disabled>비활성</Button>
      </Row>
    </Stack>
  ),
};
