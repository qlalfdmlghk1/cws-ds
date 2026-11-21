import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { Button } from '../Button/Button';

const meta = {
  title: 'Feedback/Tooltip',
  component: Tooltip,
  args: { content: '위에 떠요 (기본)', children: <Button variant="secondary" size="sm">마우스를 올려 보세요</Button> },
  argTypes: { children: { control: false } },
  decorators: [(Story) => <div style={{ padding: '56px 120px' }}><Story /></div>],
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Hover: Story = {};
export const 위치: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 96 }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
        <Tooltip key={p} content={p} placement={p} open><Button variant="secondary" size="sm">{p}</Button></Tooltip>
      ))}
    </div>
  ),
};
export const 비활성_버튼: Story = { args: { content: '편집 권한이 없어요', children: <Button disabled>편집</Button> } };
