import type { Meta, StoryObj } from '@storybook/react-vite';
import type { MouseEvent } from 'react';
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';

const go = (e: MouseEvent) => e.preventDefault();
const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  args: { items: [{ label: '홈', href: '#', onClick: go }, { label: '프로젝트', href: '#', onClick: go }, { label: '디자인 시스템' }] },
} satisfies Meta<typeof Breadcrumb>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Collapsed: Story = {
  args: {
    maxItems: 4,
    items: [
      ...['홈', '워크스페이스', '팀', '프로젝트', '설정'].map((label): BreadcrumbItem => ({ label, href: '#', onClick: go })),
      { label: '멤버' },
    ],
  },
};
