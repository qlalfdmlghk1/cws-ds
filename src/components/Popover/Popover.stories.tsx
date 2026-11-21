import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './Popover';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { CheckGroup } from '../CheckGroup/CheckGroup';
import { TextInput } from '../TextInput/TextInput';
import { icons } from '../../stories/demo';

const meta = {
  title: 'Feedback/Popover',
  component: Popover,
  args: { content: '전환율은 방문자 중 문의 버튼을 누른 사람의 비율이에요. 매일 자정에 갱신돼요.', children: <IconButton icon={icons.help} label="전환율 도움말" tooltip={false} /> },
  argTypes: { children: { control: false }, content: { control: false } },
  decorators: [(Story) => <div style={{ minHeight: 280 }}><Story /></div>],
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Help: Story = {};
export const Filter: Story = {
  args: {
    title: '필터',
    defaultOpen: true,
    children: <Button variant="secondary" iconLeft={icons.filter}>필터</Button>,
    content: (api: { close: () => void }) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <CheckGroup label="상태" defaultValue={['live']} options={[{ value: 'live', label: '운영 중' }, { value: 'ready', label: '준비' }, { value: 'fix', label: '점검' }]} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="ghost" size="sm" onClick={api.close}>취소</Button>
          <Button size="sm" onClick={api.close}>적용</Button>
        </div>
      </div>
    ),
  },
};
export const Share: Story = {
  args: {
    title: '공유 링크',
    width: 320,
    children: <Button variant="secondary">공유</Button>,
    content: (api: { close: () => void }) => (
      <div style={{ display: 'flex', gap: 8 }}>
        <TextInput defaultValue="https://choi.dev/ds" readOnly fullWidth aria-label="공유 링크" />
        <Button onClick={api.close}>복사</Button>
      </div>
    ),
  },
};
