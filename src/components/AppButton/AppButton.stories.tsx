import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppButton } from './AppButton';
import { icons, Row, Stack } from '../../stories/demo';

const meta = {
  title: 'Actions/AppButton',
  component: AppButton,
  args: { children: '저장', onClick: fn() },
} satisfies Meta<typeof AppButton>;
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
        <AppButton>저장</AppButton>
        <AppButton variant="secondary">취소</AppButton>
        <AppButton variant="ghost">편집</AppButton>
        <AppButton variant="danger">삭제하기</AppButton>
      </Row>
      <Row label="size">
        <AppButton size="sm">Small</AppButton>
        <AppButton size="md">Medium</AppButton>
        <AppButton size="lg">Large</AppButton>
      </Row>
      <Row label="state">
        <AppButton iconRight={icons.arrow}>다음</AppButton>
        <AppButton loading>저장 중</AppButton>
        <AppButton disabled>비활성</AppButton>
        <AppButton variant="secondary" disabled>비활성</AppButton>
      </Row>
    </Stack>
  ),
};
