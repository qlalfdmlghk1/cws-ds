import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DropdownMenu, type MenuItem } from './DropdownMenu';
import { IconButton } from '../IconButton/IconButton';
import { Button } from '../Button/Button';
import { icons } from '../../stories/demo';

const items: MenuItem[] = [
  { label: '편집', icon: icons.pencil, onSelect: fn() },
  { label: '복제', icon: icons.copy, shortcut: '⌘D', onSelect: fn() },
  { label: '링크 복사', icon: icons.link, onSelect: fn() },
  { label: '보관', icon: icons.trash, disabled: true },
  { divider: true },
  { label: '삭제', icon: icons.trash, danger: true, onSelect: fn() },
];

const meta = {
  title: 'Actions/DropdownMenu',
  component: DropdownMenu,
  args: { items, label: '프로젝트 메뉴', children: <IconButton icon={icons.more} label="더보기" variant="secondary" /> },
  argTypes: { children: { control: false } },
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ minHeight: 300 }}><Story /></div>],
} satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Open: Story = { args: { defaultOpen: true } };
export const ButtonTrigger: Story = {
  args: {
    items: [{ label: 'CSV로 내보내기', onSelect: fn() }, { label: 'Excel로 내보내기', onSelect: fn() }],
    children: <Button variant="secondary" iconRight={icons.chevron}>내보내기</Button>,
    label: undefined,
  },
};
