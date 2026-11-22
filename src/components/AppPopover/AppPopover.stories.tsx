import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppPopover } from './AppPopover';
import { AppButton } from '../AppButton/AppButton';
import { AppIconButton } from '../AppIconButton/AppIconButton';
import { AppCheckGroup } from '../AppCheckGroup/AppCheckGroup';
import { AppTextInput } from '../AppTextInput/AppTextInput';
import { icons } from '../../stories/demo';

const meta = {
  title: 'Feedback/AppPopover',
  component: AppPopover,
  args: { content: '전환율은 방문자 중 문의 버튼을 누른 사람의 비율이에요. 매일 자정에 갱신돼요.', children: <AppIconButton icon={icons.help} label="전환율 도움말" tooltip={false} /> },
  argTypes: { children: { control: false }, content: { control: false } },
  decorators: [(Story) => <div style={{ minHeight: 280 }}><Story /></div>],
} satisfies Meta<typeof AppPopover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Help: Story = {};
export const Filter: Story = {
  args: {
    title: '필터',
    defaultOpen: true,
    children: <AppButton variant="secondary" iconLeft={icons.filter}>필터</AppButton>,
    content: (api: { close: () => void }) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AppCheckGroup label="상태" defaultValue={['live']} options={[{ value: 'live', label: '운영 중' }, { value: 'ready', label: '준비' }, { value: 'fix', label: '점검' }]} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <AppButton variant="ghost" size="sm" onClick={api.close}>취소</AppButton>
          <AppButton size="sm" onClick={api.close}>적용</AppButton>
        </div>
      </div>
    ),
  },
};
export const Share: Story = {
  args: {
    title: '공유 링크',
    width: 320,
    children: <AppButton variant="secondary">공유</AppButton>,
    content: (api: { close: () => void }) => (
      <div style={{ display: 'flex', gap: 8 }}>
        <AppTextInput defaultValue="https://choi.dev/ds" readOnly fullWidth aria-label="공유 링크" />
        <AppButton onClick={api.close}>복사</AppButton>
      </div>
    ),
  },
};
