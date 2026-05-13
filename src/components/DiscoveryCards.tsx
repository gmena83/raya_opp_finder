import { motion } from 'framer-motion';
import { Clock, TrendingUp, ExternalLink, ArrowRight, Archive } from 'lucide-react';
import type { Opportunity, OpportunityType, OpportunityStage } from '../types';

const typeConfig: Record<OpportunityType, { label: string; color: string; bg: string }> = {
  federal_grant:    { label: 'Federal Grant',    color: '#1d4ed8', bg: 'rgba(29,78,216,0.08)' },
  state_grant:      { label: 'State Grant',      color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  private_grant:    { label: 'Private Grant',     color: '#059669', bg: 'rgba(5,150,105,0.08)' },
  accelerator:      { label: 'Accelerator',       color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
  pitch_competition:{ label: 'Pitch Competition', color: '#db2777', bg: 'rgba(219,39,119,0.08)' },
  impact_investment:{ label: 'Impact Investment', color: '#0891b2', bg: 'rgba(8,145,178,0.08)' },
  sbir_sttr:        { label: 'SBIR/STTR',         color: '#4f46e5', bg: 'rgba(79,70,229,0.08)' },
};

const stageConfig: Record<OpportunityStage, { label: string; color: string }> = {
  discovered:  { label: 'Discovered',  color: '#6b7280' },
  reviewing:   { label: 'Reviewing',   color: '#d97706' },
  researching: { label: 'Researching', color: '#2563eb' },
  drafting:    { label: 'Drafting',    color: '#7c3aed' },
  submitted:   { label: 'Submitted',   color: '#059669' },
  awarded:     { label: 'Awarded',     color: '#16a34a' },
  rejected:    { label: 'Rejected',    color: '#dc2626' },
  archived:    { label: 'Archived',    color: '#9ca3af' },
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

interface Props {
  opportunities: Opportunity[];
  onUpdateStage: (id: string, stage: OpportunityStage) => void;
}

export const DiscoveryCards = ({ opportunities, onUpdateStage }: Props) => {
  if (opportunities.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-ink-quaternary)', fontFamily: 'var(--font-ui)', fontSize: '0.85rem' }}>
        No opportunities match your filters.
      </div>
    );
  }

  return (
    <div className="discovery-cards-grid">
      {opportunities.map((opp, i) => {
        const typeInfo = typeConfig[opp.type];
        const stageInfo = stageConfig[opp.stage];
        const deadlineInfo = getDeadlineInfo(opp.deadline);
        const scoreColor = getScoreColor(opp.relevanceScore);

        return (
          <motion.div
            key={opp.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="discovery-card"
          >
            {/* Header: Score + Type + Stage */}
            <div className="discovery-card__header">
              <div className="discovery-card__score" style={{ color: scoreColor }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>{opp.relevanceScore}</div>
                <div style={{ width: 40, height: 4, backgroundColor: 'var(--color-surface-1)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${opp.relevanceScore}%`, height: '100%', backgroundColor: scoreColor, borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span className="discovery-card__badge" style={{ backgroundColor: typeInfo.bg, color: typeInfo.color }}>{typeInfo.label}</span>
                <span className="discovery-card__badge" style={{ backgroundColor: `${stageInfo.color}12`, color: stageInfo.color }}>{stageInfo.label}</span>
              </div>
            </div>

            {/* Name */}
            <h3 className="discovery-card__name">{opp.name}</h3>

            {/* Meta row: Funding + Deadline */}
            <div className="discovery-card__meta">
              {opp.fundingAmount && (
                <div className="discovery-card__meta-item">
                  <TrendingUp size={12} style={{ color: 'var(--color-success)' }} />
                  <span>{opp.fundingAmount}</span>
                </div>
              )}
              {deadlineInfo && (
                <div className="discovery-card__meta-item">
                  <Clock size={12} style={{ color: deadlineInfo.color }} />
                  <span style={{ color: deadlineInfo.color, fontWeight: deadlineInfo.urgent ? 700 : 400 }}>
                    {deadlineInfo.urgent && '\u26A0 '}{new Date(opp.deadline!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({deadlineInfo.text})
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            {opp.tags && opp.tags.length > 0 && (
              <div className="discovery-card__tags">
                {opp.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="discovery-card__tag">{tag}</span>
                ))}
                {opp.tags.length > 4 && <span className="discovery-card__tag-overflow">+{opp.tags.length - 4}</span>}
              </div>
            )}

            {/* Match reasons */}
            {opp.matchReasons && opp.matchReasons.length > 0 && (
              <div className="discovery-card__reasons">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-quaternary)', marginBottom: 4 }}>Why this matches</div>
                {opp.matchReasons.slice(0, 2).map((reason, ri) => (
                  <div key={ri} className="discovery-card__reason">{reason}</div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="discovery-card__actions">
              {opp.stage === 'discovered' && (
                <button className="discovery-card__btn discovery-card__btn--primary" onClick={() => onUpdateStage(opp.id, 'reviewing')}>
                  Investigate <ArrowRight size={12} />
                </button>
              )}
              {opp.stage === 'reviewing' && (
                <button className="discovery-card__btn discovery-card__btn--primary" onClick={() => onUpdateStage(opp.id, 'researching')}>
                  Start Research <ArrowRight size={12} />
                </button>
              )}
              {opp.stage === 'researching' && (
                <button className="discovery-card__btn discovery-card__btn--primary" onClick={() => onUpdateStage(opp.id, 'drafting')}>
                  Begin Draft <ArrowRight size={12} />
                </button>
              )}
              {(opp.driveLink || opp.draftLink) && (
                <>
                  {opp.driveLink && <a href={opp.driveLink} target="_blank" rel="noopener noreferrer" className="discovery-card__btn discovery-card__btn--link">Drive <ExternalLink size={10} /></a>}
                  {opp.draftLink && <a href={opp.draftLink} target="_blank" rel="noopener noreferrer" className="discovery-card__btn discovery-card__btn--link">Draft <ExternalLink size={10} /></a>}
                </>
              )}
              {opp.stage !== 'archived' && opp.stage !== 'submitted' && opp.stage !== 'awarded' && (
                <button className="discovery-card__btn discovery-card__btn--ghost" onClick={() => onUpdateStage(opp.id, 'archived')}>
                  <Archive size={12} />
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
