import { useState } from 'react';
import { Trophy, XCircle, Clock, ChevronDown, ChevronRight, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import type { ApplicationOutcome, OutcomeResult } from '../types';

const resultConfig: Record<OutcomeResult, { label: string; color: string; bg: string; icon: typeof Trophy }> = {
  awarded: { label: 'Awarded', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.08)', icon: Trophy },
  rejected: { label: 'Rejected', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.08)', icon: XCircle },
  pending: { label: 'Pending', color: '#d97706', bg: 'rgba(217, 119, 6, 0.08)', icon: Clock },
  withdrawn: { label: 'Withdrawn', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.08)', icon: XCircle },
};

interface Props {
  outcomes: ApplicationOutcome[];
}

export const OutcomeTracker = ({ outcomes }: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const won = outcomes.filter(o => o.result === 'awarded');
  const lost = outcomes.filter(o => o.result === 'rejected');
  const totalFunding = won.reduce((sum, o) => sum + (o.fundingReceived || 0), 0);

  return (
    <div className="outcome-tracker">
      {/* Summary cards */}
      <div className="outcome-summary">
        <div className="outcome-summary__card outcome-summary__card--won">
          <Trophy size={16} />
          <div>
            <div className="outcome-summary__value">{won.length}</div>
            <div className="outcome-summary__label">Awarded</div>
          </div>
        </div>
        <div className="outcome-summary__card outcome-summary__card--lost">
          <XCircle size={16} />
          <div>
            <div className="outcome-summary__value">{lost.length}</div>
            <div className="outcome-summary__label">Rejected</div>
          </div>
        </div>
        <div className="outcome-summary__card outcome-summary__card--funding">
          <DollarSign size={16} />
          <div>
            <div className="outcome-summary__value">${(totalFunding / 1000000).toFixed(1)}M</div>
            <div className="outcome-summary__label">Total Funding Won</div>
          </div>
        </div>
        <div className="outcome-summary__card outcome-summary__card--rate">
          <TrendingUp size={16} />
          <div>
            <div className="outcome-summary__value">{outcomes.length > 0 ? Math.round((won.length / outcomes.length) * 100) : 0}%</div>
            <div className="outcome-summary__label">Win Rate</div>
          </div>
        </div>
      </div>

      {/* Outcome list */}
      <div className="outcome-list">
        {outcomes.map(outcome => {
          const cfg = resultConfig[outcome.result];
          const ResultIcon = cfg.icon;
          const isExpanded = expandedId === outcome.opportunityId;

          return (
            <div key={outcome.opportunityId} className="outcome-item" style={{ borderLeftColor: cfg.color }}>
              <div className="outcome-item__header" onClick={() => setExpandedId(isExpanded ? null : outcome.opportunityId)}>
                <div className="outcome-item__icon" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                  <ResultIcon size={14} />
                </div>
                <div className="outcome-item__info">
                  <div className="outcome-item__name">{outcome.opportunityName}</div>
                  <div className="outcome-item__meta">
                    <span className="outcome-item__badge" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    {outcome.fundingReceived && <span className="outcome-item__funding">${(outcome.fundingReceived / 1000).toFixed(0)}K</span>}
                    <span className="outcome-item__date">Submitted: {new Date(outcome.submittedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="outcome-item__toggle">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
              </div>

              {isExpanded && (
                <div className="outcome-item__detail">
                  <div className="outcome-item__notes">{outcome.notes}</div>

                  {outcome.lessonsLearned.length > 0 && (
                    <div className="outcome-item__section">
                      <div className="outcome-item__section-title">Lessons Learned</div>
                      <ul className="outcome-item__lessons">
                        {outcome.lessonsLearned.map((lesson, i) => <li key={i}>{lesson}</li>)}
                      </ul>
                    </div>
                  )}

                  <div className="outcome-item__tags-row">
                    {outcome.strengthTags.length > 0 && (
                      <div className="outcome-item__tag-group">
                        <TrendingUp size={10} style={{ color: '#16a34a' }} />
                        {outcome.strengthTags.map(tag => (
                          <span key={tag} className="outcome-item__tag outcome-item__tag--strength">{tag.replace(/_/g, ' ')}</span>
                        ))}
                      </div>
                    )}
                    {outcome.weaknessTags.length > 0 && (
                      <div className="outcome-item__tag-group">
                        <TrendingDown size={10} style={{ color: '#dc2626' }} />
                        {outcome.weaknessTags.map(tag => (
                          <span key={tag} className="outcome-item__tag outcome-item__tag--weakness">{tag.replace(/_/g, ' ')}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
