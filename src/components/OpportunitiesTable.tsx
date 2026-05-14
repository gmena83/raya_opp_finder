import { ExternalLink, Clock, TrendingUp, ArrowRight, Archive } from 'lucide-react';
import type { Opportunity, OpportunityType, OpportunityStage } from '../types';

/* ─── Config Maps ─────────────────────────────────────────────────── */

const typeConfig: Record<OpportunityType, { label: string; color: string; bg: string }> = {
  federal_grant:    { label: 'Federal Grant',    color: '#1d4ed8', bg: 'rgba(29,78,216,0.08)' },
  state_grant:      { label: 'State Grant',      color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  private_grant:    { label: 'Private Grant',     color: '#059669', bg: 'rgba(5,150,105,0.08)' },
  accelerator:      { label: 'Accelerator',       color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
  pitch_competition:{ label: 'Pitch Competition', color: '#db2777', bg: 'rgba(219,39,119,0.08)' },
  impact_investment:{ label: 'Impact Investment', color: '#0891b2', bg: 'rgba(8,145,178,0.08)' },
  sbir_sttr:        { label: 'SBIR/STTR',         color: '#4f46e5', bg: 'rgba(79,70,229,0.08)' },
};

const stageConfig: Record<OpportunityStage, { label: string; color: string; bg: string }> = {
  discovered:  { label: 'Discovered',  color: '#6b7280', bg: 'rgba(107,114,128,0.08)' },
  reviewing:   { label: 'Reviewing',   color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
  researching: { label: 'Researching', color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
  drafting:    { label: 'Drafting',    color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  submitted:   { label: 'Submitted',   color: '#059669', bg: 'rgba(5,150,105,0.08)' },
  awarded:     { label: 'Awarded',     color: '#16a34a', bg: 'rgba(22,163,74,0.12)' },
  rejected:    { label: 'Rejected',    color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  archived:    { label: 'Archived',    color: '#9ca3af', bg: 'rgba(156,163,175,0.08)' },
};

function getDeadlineInfo(deadline?: string) {
  if (!deadline) return null;
  const diffMs = new Date(deadline).getTime() - Date.now();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { text: 'Expired', color: '#9ca3af', urgent: false };
  if (diffDays <= 7) return { text: `${diffDays}d left`, color: '#dc2626', urgent: true };
  if (diffDays <= 14) return { text: `${diffDays}d left`, color: '#d97706', urgent: false };
  if (diffDays <= 30) return { text: `${diffDays}d left`, color: '#059669', urgent: false };
  return { text: `${diffDays}d`, color: 'var(--color-ink-quaternary)', urgent: false };
}

function getScoreColor(score: number) {
  if (score >= 90) return '#16a34a';
  if (score >= 75) return '#d97706';
  if (score >= 50) return '#6b7280';
  return '#dc2626';
}

function getNextStage(stage: OpportunityStage): OpportunityStage | null {
  const flow: Record<string, OpportunityStage> = { discovered: 'reviewing', reviewing: 'researching', researching: 'drafting' };
  return flow[stage] || null;
}

function getNextStageLabel(stage: OpportunityStage): string {
  const labels: Record<string, string> = { discovered: 'Investigate', reviewing: 'Research', researching: 'Draft' };
  return labels[stage] || '';
}

/* ─── Component ───────────────────────────────────────────────────── */

interface Props {
  opportunities: Opportunity[];
  onUpdateStage: (id: string, stage: OpportunityStage) => void;
  onSelect: (opp: Opportunity) => void;
}

export const OpportunitiesTable = ({ opportunities, onUpdateStage, onSelect }: Props) => {
  if (opportunities.length === 0) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-ink-quaternary)', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-xl)' }}>
        No opportunities match your filters.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-surface-1)' }}>
      <div style={{ overflowX: 'auto' }} className="custom-scrollbar">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', minWidth: 960 }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-surface-1)' }}>
              <th style={thStyle}>Fit</th>
              <th style={thStyle}>Opportunity</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Stage</th>
              <th style={thStyle}>Funding</th>
              <th style={thStyle}>Deadline</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opp) => {
              const typeInfo = typeConfig[opp.type];
              const stageInfo = stageConfig[opp.stage];
              const deadlineInfo = getDeadlineInfo(opp.deadline);
              const scoreColor = getScoreColor(opp.relevanceScore);
              const nextStage = getNextStage(opp.stage);

              return (
                <tr key={opp.id} style={{ borderBottom: '1px solid var(--color-surface-1)', transition: 'background-color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-launch)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>

                  {/* Score */}
                  <td style={{ ...tdStyle, width: 64 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: scoreColor }}>{opp.relevanceScore}</div>
                      <div style={{ width: 36, height: 4, backgroundColor: 'var(--color-surface-1)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${opp.relevanceScore}%`, height: '100%', backgroundColor: scoreColor, borderRadius: 2 }} />
                      </div>
                    </div>
                  </td>

                  {/* Name + Tags */}
                  <td style={{ ...tdStyle, maxWidth: 320 }}>
                    <div onClick={() => onSelect(opp)} style={{ color: 'var(--color-ink)', fontWeight: 500, lineHeight: 1.4, cursor: 'pointer' }} className="table-opp-name">{opp.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-ink-quaternary)', marginTop: 2, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opp.url}</div>
                    {opp.tags && opp.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                        {opp.tags.slice(0, 3).map(tag => (
                          <span key={tag} style={{ padding: '1px 8px', borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--color-surface-1)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-ink-muted)', whiteSpace: 'nowrap' }}>{tag}</span>
                        ))}
                        {opp.tags.length > 3 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-ink-quaternary)' }}>+{opp.tags.length - 3}</span>}
                      </div>
                    )}
                  </td>

                  {/* Type */}
                  <td style={tdStyle}>
                    <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-pill)', backgroundColor: typeInfo.bg, color: typeInfo.color, fontWeight: 500, fontSize: '0.72rem', whiteSpace: 'nowrap' }}>{typeInfo.label}</span>
                  </td>

                  {/* Stage */}
                  <td style={tdStyle}>
                    <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-pill)', backgroundColor: stageInfo.bg, color: stageInfo.color, fontWeight: 500, fontSize: '0.72rem', whiteSpace: 'nowrap' }}>{stageInfo.label}</span>
                  </td>

                  {/* Funding */}
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    {opp.fundingAmount ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-ink)' }}>
                        <TrendingUp size={12} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                        <span style={{ fontWeight: 500 }}>{opp.fundingAmount}</span>
                      </div>
                    ) : <span style={{ color: 'var(--color-ink-quaternary)' }}>&mdash;</span>}
                  </td>

                  {/* Deadline */}
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    {deadlineInfo ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={12} style={{ color: deadlineInfo.color, flexShrink: 0 }} />
                        <div>
                          <div style={{ color: 'var(--color-ink-muted)', fontSize: '0.75rem' }}>{new Date(opp.deadline!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: deadlineInfo.urgent ? 700 : 400, color: deadlineInfo.color }}>
                            {deadlineInfo.urgent && '\u26A0 '}{deadlineInfo.text}
                          </div>
                        </div>
                      </div>
                    ) : <span style={{ color: 'var(--color-ink-quaternary)' }}>&mdash;</span>}
                  </td>

                  {/* Actions */}
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {nextStage && (
                        <button onClick={() => onUpdateStage(opp.id, nextStage)} style={actionBtnStyle}>
                          {getNextStageLabel(opp.stage)} <ArrowRight size={10} />
                        </button>
                      )}
                      {opp.driveLink && <a href={opp.driveLink} target="_blank" rel="noopener noreferrer" style={linkStyle}>Drive <ExternalLink size={10} /></a>}
                      {opp.draftLink && <a href={opp.draftLink} target="_blank" rel="noopener noreferrer" style={linkStyle}>Draft <ExternalLink size={10} /></a>}
                      {opp.stage !== 'archived' && opp.stage !== 'submitted' && opp.stage !== 'awarded' && (
                        <button onClick={() => onUpdateStage(opp.id, 'archived')} style={{ ...actionBtnStyle, color: 'var(--color-ink-quaternary)' }}>
                          <Archive size={11} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ─── Styles ──────────────────────────────────────────────────────── */

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '12px 16px', color: 'var(--color-ink-muted)', fontWeight: 500, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' };
const tdStyle: React.CSSProperties = { padding: '14px 16px', verticalAlign: 'top' };
const linkStyle: React.CSSProperties = { color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.75rem' };
const actionBtnStyle: React.CSSProperties = { background: 'none', border: '1px solid var(--color-surface-1)', borderRadius: 'var(--radius-md)', padding: '4px 10px', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 500, color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', transition: 'all 0.15s' };
