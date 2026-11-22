import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppPagination } from './AppPagination';

const meta = {
  title: 'Navigation/AppPagination',
  component: AppPagination,
  args: { total: 248, pageSize: 20, defaultPage: 5, showTotal: true, onChange: fn() },
} satisfies Meta<typeof AppPagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Few: Story = { args: { total: undefined, pageSize: undefined, showTotal: false, pageCount: 5, defaultPage: 1 } };
export const SmallLastPage: Story = { args: { total: undefined, pageSize: undefined, showTotal: false, pageCount: 30, defaultPage: 30, size: 'sm' } };
