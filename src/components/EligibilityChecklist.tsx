import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import type { EligibilityCheck, EligibilityStatus } from '../types';

const statusConfig: Record<EligibilityStatus, { icon: typeof CheckCircle2; color: string; bg: string; label: string }> = {
  pass:    { icon: CheckCircle2, color: '#16a34a', bg: 'rgba(22,163,74,0.08)', label: 'Pass' },
  warning: { icon: AlertTriangle, color: '#d97706', bg: 'rgba(217,119,6,0.08)', label: 'Warning' },
  fail:    { icon: XCircle, color: '#dc2626', bg: 'rgba(220,38,38,0.08)', label: 'Fail' },
  unknown: { icon: HelpCircle, color: '#6b7280', bg: 'rgba(107,114,128,0.08)', label: 'Unknown' },
};

interface Props {
  checks: EligibilityCheck[];
}

export const EligibilityChecklist = ({ checks }: Props) => {
  if (checks.length === 0) {
    return (
      <div className="eligibility-empty">
        No eligibility analysis available yet. Start research to run the eligibility matcher.
      </div>
    );
  }

  const passCount = checks.filter((c) => c.status === 'pass').length;
  const total = checks.length;
  const hasIssues = checks.some((c) => c.status === 'fail' || c.status === 'warning');

  return (
    <div className="eligibility-checklist">
      {/* Summary */}
      <div className="eligibility-checklist__summary">
        <div className="eligibility-checklist__summary-bar">
          <div className="eligibility-checklist__summary-fill" style={{ width: `${(passCount / total) * 100}%` }} />
        </div>
        <span className="eligibility-checklist__summary-text">
          {passCount} of {total} criteria met
          {hasIssues && <span style={{ color: '#d97706', marginLeft: 8 }}> — review required</span>}
        </span>
      </div>

      {/* Criteria list */}
      <div className="eligibility-checklist__items">
        {checks.map((check, i) => {
          const cfg = statusConfig[check.status];
          const Icon = cfg.icon;

          return (
            <div key={i} className="eligibility-checklist__item" style={{ borderLeftColor: cfg.color }}>
              <div className="eligibility-checklist__item-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={16} style={{ color: cfg.color, flexShrink: 0 }} />
                  <span className="eligibility-checklist__criterion">{check.criterion}</span>
                </div>
                <span className="eligibility-checklist__status-badge" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
                  {cfg.label}
                </span>
              </div>
              <div className="eligibility-checklist__notes">{check.notes}</div>
              {check.source && <div className="eligibility-checklist__source">{check.source}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
