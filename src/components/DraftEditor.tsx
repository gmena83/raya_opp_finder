import { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertTriangle, CheckCircle2, Clock, PenLine } from 'lucide-react';
import { getApplicationDraft, regenerateAnswer } from '../services/api';
import { DraftQuestionCard } from './DraftQuestionCard';
import { CoverLetterBuilder } from './CoverLetterBuilder';
import type { ApplicationDraft, DraftStatus, CoverLetter } from '../types';

const statusConfig: Record<DraftStatus, { label: string; color: string; icon: typeof Clock }> = {
  not_started:  { label: 'Not Started', color: '#6b7280', icon: Clock },
  generating:   { label: 'Generating...', color: 'var(--color-primary)', icon: Loader2 },
  review:       { label: 'In Review', color: '#d97706', icon: PenLine },
  finalized:    { label: 'Finalized', color: '#16a34a', icon: CheckCircle2 },
};

interface Props {
  opportunityId: string;
}

export const DraftEditor = ({ opportunityId }: Props) => {
  const [draft, setDraft] = useState<ApplicationDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);

  const fetchDraft = useCallback(async () => {
    setIsLoading(true);
    const result = await getApplicationDraft(opportunityId);
    if (result.success && result.data) {
      setDraft(result.data);
    }
    setIsLoading(false);
  }, [opportunityId]);

  useEffect(() => {
    fetchDraft();
  }, [fetchDraft]);

  const handleRegenerate = async (questionId: number) => {
    setRegeneratingId(questionId);
    const result = await regenerateAnswer(opportunityId, questionId);
    if (result.success && result.data && draft) {
      setDraft({
        ...draft,
        questions: draft.questions.map((q) =>
          q.questionId === questionId ? { ...result.data! } : q
        ),
      });
    }
    setRegeneratingId(null);
  };

  const handleUpdateAnswer = (questionId: number, answer: string) => {
    if (!draft) return;
    setDraft({
      ...draft,
      questions: draft.questions.map((q) =>
        q.questionId === questionId ? { ...q, answer, charUsed: answer.length, isEdited: true } : q
      ),
    });
  };

  const handleUpdateCoverLetter = (coverLetter: CoverLetter) => {
    if (!draft) return;
    setDraft({ ...draft, coverLetter });
  };

  if (isLoading) {
    return <div className="draft-editor__loading">Loading application draft...</div>;
  }

  if (!draft) {
    return <div className="draft-editor__loading">No draft data available.</div>;
  }

  if (draft.status === 'not_started' && draft.questions.length === 0) {
    return (
      <div className="draft-editor__empty">
        <PenLine size={24} style={{ color: 'var(--color-ink-quaternary)', marginBottom: 12 }} />
        <div className="draft-editor__empty-title">No Draft Yet</div>
        <div className="draft-editor__empty-text">
          Complete the research phase first, then the AI will extract form questions and generate draft answers for this opportunity.
        </div>
      </div>
    );
  }

  const cfg = statusConfig[draft.status];
  const StatusIcon = cfg.icon;
  const unresolvedCount = draft.questions.reduce(
    (sum, q) => sum + (q.missingDataFlags?.length || 0), 0
  );

  return (
    <div className="draft-editor">
      {/* Status bar */}
      <div className="draft-editor__status-bar">
        <div className="draft-editor__status">
          <StatusIcon
            size={14}
            style={{ color: cfg.color }}
            className={draft.status === 'generating' ? 'spin' : ''}
          />
          <span style={{ color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
          <span className="draft-editor__question-count">{draft.questions.length} questions</span>
        </div>
        <div className="draft-editor__status-right">
          {unresolvedCount > 0 && (
            <span className="draft-editor__flag-count">
              <AlertTriangle size={12} />
              {unresolvedCount} flag{unresolvedCount > 1 ? 's' : ''}
            </span>
          )}
          {draft.lastGenerated && (
            <span className="draft-editor__last-gen">
              Generated: {new Date(draft.lastGenerated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Question cards */}
      <div className="draft-editor__questions">
        {draft.questions.map((q, i) => (
          <DraftQuestionCard
            key={q.questionId}
            question={q}
            index={i}
            onRegenerate={handleRegenerate}
            onUpdateAnswer={handleUpdateAnswer}
            isRegenerating={regeneratingId === q.questionId}
          />
        ))}
      </div>

      {/* Cover Letter */}
      <CoverLetterBuilder
        opportunityId={opportunityId}
        coverLetter={draft.coverLetter}
        onUpdate={handleUpdateCoverLetter}
      />
    </div>
  );
};
