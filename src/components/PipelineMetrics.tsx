import { motion } from 'framer-motion';
import { BarChart3, Clock, Eye, Zap, Target } from 'lucide-react';
import type { Opportunity } from '../types';

interface Props {
  opportunities: Opportunity[];
}

function parseFunding(s?: string): number {
  if (!s) return 0;
  const match = s.match(/\$[\d,.]+[KMB]?/g);
  if (!match) return 0;
  const parse = (v: string) => {
    const n = parseFloat(v.replace(/[$,]/g, ''));
    if (v.endsWith('M')) return n * 1_000_000;
    if (v.endsWith('K')) return n * 1_000;
    if (v.endsWith('B')) return n * 1_000_000_000;
    return n;
  };
  // Use the upper end if range
  return parse(match[match.length - 1]);
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export const PipelineMetrics = ({ opportunities }: Props) => {
  const total = opportunities.length;
  const totalFunding = opportunities.reduce((sum, o) => sum + parseFunding(o.fundingAmount), 0);

  const now = new Date();
  const urgent = opportunities.filter((o) => {
    if (!o.deadline) return false;
    const diff = new Date(o.deadline).getTime() - now.getTime();
    return diff > 0 && diff < 14 * 24 * 60 * 60 * 1000;
  }).length;

  const awaiting = opportunities.filter((o) => o.stage === 'discovered').length;
  const active = opportunities.filter((o) => o.stage === 'researching' || o.stage === 'drafting').length;

  const metrics = [
    { label: 'In Pipeline', value: total.toString(), icon: BarChart3, color: 'var(--color-ink)' },
    { label: 'Funding Pursued', value: formatCurrency(totalFunding), icon: Target, color: 'var(--color-primary)' },
    { label: 'Urgent Deadlines', value: urgent.toString(), icon: Clock, color: urgent > 0 ? '#dc2626' : 'var(--color-ink-quaternary)' },
    { label: 'Awaiting Review', value: awaiting.toString(), icon: Eye, color: awaiting > 0 ? '#d97706' : 'var(--color-ink-quaternary)' },
    { label: 'Active Applications', value: active.toString(), icon: Zap, color: active > 0 ? '#16a34a' : 'var(--color-ink-quaternary)' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="metrics-strip">
      {metrics.map((m) => (
        <div key={m.label} className="metrics-strip__item">
          <m.icon size={14} style={{ color: m.color, flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: m.color, lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--color-ink-muted)', marginTop: 2 }}>{m.label}</div>
          </div>
        </div>
      ))}
    </motion.div>
  );
};
