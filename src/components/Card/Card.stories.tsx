import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardBody, CardFooter, CardHeader, StatCard } from './Card';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { icons } from '../../stories/demo';

const meta = {
  title: 'Data Display/Card',
  component: Card,
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader eyebrow="포트폴리오" title="StockFolio" description="실시간 주식 포트폴리오 트래커" action={<IconButton icon={icons.more} label="더보기" size="sm" />} />
      <CardBody>Finnhub WebSocket으로 시세를 받아 보유 종목 수익률을 실시간으로 보여줘요.</CardBody>
      <CardFooter>
        <Button variant="ghost" size="sm">GitHub</Button>
        <Button variant="secondary" size="sm">자세히</Button>
      </CardFooter>
    </Card>
  ),
};
export const Filled: Story = {
  args: { variant: 'filled' },
  render: (args) => (
    <Card {...args}>
      <CardHeader title="filled" description="바탕색으로 구분하는 카드" />
      <CardBody>카드 안에 넣거나, 덜 눈에 띄어야 할 때 써요.</CardBody>
    </Card>
  ),
};
export const 선택_카드: Story = {
  render: function Render() {
    const [v, setV] = useState('pro');
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[['free', '무료', '0원'], ['pro', '프로', '9,900원']].map(([k, name, price]) => (
          <Card key={k} interactive padding="sm" selected={v === k} onClick={() => setV(k)}>
            <span style={{ fontWeight: 600 }}>{name}</span>
            <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>월 {price}</span>
          </Card>
        ))}
      </div>
    );
  },
};
export const 지표_카드: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 'none' }}><Story /></div>],
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 240px)', gap: 16 }}>
      <StatCard label="월 방문자" icon={icons.users} value="12,480" unit="명" delta={{ value: '+12.4%', direction: 'up' }} caption="지난달 대비" />
      <StatCard label="평균 응답 시간" icon={icons.clock} value="182" unit="ms" delta={{ value: '-8.1%', direction: 'down', tone: 'positive' }} caption="줄어서 좋은 지표" />
      <StatCard label="오류" icon={icons.alert} value="23" unit="건" delta={{ value: '+5건', direction: 'up', tone: 'negative' }} caption="어제 대비" />
    </div>
  ),
};
