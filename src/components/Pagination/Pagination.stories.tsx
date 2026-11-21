import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Pagination } from './Pagination';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  args: { total: 248, pageSize: 20, defaultPage: 5, showTotal: true, onChange: fn() },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Few: Story = { args: { total: undefined, pageSize: undefined, showTotal: false, pageCount: 5, defaultPage: 1 } };
export const SmallLastPage: Story = { args: { total: undefined, pageSize: undefined, showTotal: false, pageCount: 30, defaultPage: 30, size: 'sm' } };
