import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppBadge } from './AppBadge';
import { Row, Stack } from '../../stories/demo';

const meta = {
  title: 'Data Display/AppBadge',
  component: AppBadge,
  args: { children: '운영 중', tone: 'success' },
} satisfies Meta<typeof AppBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Solid: Story = { args: { variant: 'solid', tone: 'brand', children: 'NEW' } };
export const OutlineDot: Story = { args: { variant: 'outline', dot: true } };

const TONES = [['neutral', '초안'], ['brand', 'NEW'], ['success', '운영 중'], ['danger', '점검']] as const;
export const 모음: Story = {
  render: () => (
    <Stack>
      {(['soft', 'solid', 'outline'] as const).map((variant) => (
        <Row key={variant} label={variant}>
          {TONES.map(([tone, text]) => <AppBadge key={tone} tone={tone} variant={variant} dot={variant === 'outline'}>{text}</AppBadge>)}
        </Row>
      ))}
      <Row label="sm · dot">{TONES.map(([tone, text]) => <AppBadge key={tone} tone={tone} size="sm" dot>{text}</AppBadge>)}</Row>
    </Stack>
  ),
};
