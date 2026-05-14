import { GitCompare, Plus, Minus, RefreshCw, Pencil } from 'lucide-react';
import type { FeedbackDiff } from '../types';

const changeConfig = {
  addition: { label: 'Content Added', icon: Plus, color: '#16a34a' },
  removal: { label: 'Content Removed', icon: Minus, color: '#dc2626' },
  rewrite: { label: 'Major Rewrite', icon: RefreshCw, color: '#7c3aed' },
  refinement: { label: 'Refined', icon: Pencil, color: '#1d4ed8' },
} as const;

function timeAgo(iso: string): string {
  const hours = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

interface Props {
  diffs: FeedbackDiff[];
}

export const FeedbackDiffViewer = ({ diffs }: Props) => {
  return (
    <div className="diff-viewer">
      <div className="diff-viewer__intro">
        <GitCompare size={14} style={{ color: 'var(--color-primary)' }} />
        <span>Showing {diffs.length} edits where the team modified AI-generated drafts before submission. These patterns are fed back into the writing model.</span>
      </div>

      <div className="diff-viewer__list">
        {diffs.map(diff => {
          const cfg = changeConfig[diff.changeType];
          const ChangeIcon = cfg.icon;

          return (
            <div key={diff.id} className="diff-card">
              <div className="diff-card__header">
                <div className="diff-card__change-type" style={{ backgroundColor: `${cfg.color}12`, color: cfg.color }}>
                  <ChangeIcon size={11} />
                  {cfg.label}
                </div>
                <div className="diff-card__meta">
                  <span className="diff-card__opp">{diff.opportunityName}</span>
                  <span className="diff-card__section">· {diff.questionSection}</span>
                </div>
                <div className="diff-card__stats">
                  <span className="diff-card__count">{diff.changeCount} changes</span>
                  <span className="diff-card__time">{timeAgo(diff.learnedAt)}</span>
                </div>
              </div>

              <div className="diff-card__comparison">
                <div className="diff-card__side diff-card__side--original">
                  <div className="diff-card__side-label">AI Draft</div>
                  <div className="diff-card__side-content">{diff.originalDraft}</div>
                </div>
                <div className="diff-card__arrow">→</div>
                <div className="diff-card__side diff-card__side--final">
                  <div className="diff-card__side-label">Final Submitted</div>
                  <div className="diff-card__side-content">{diff.finalSubmitted}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
