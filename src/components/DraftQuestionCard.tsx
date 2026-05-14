import { useState } from 'react';
import { Copy, Check, RefreshCw, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import type { DraftAnswer } from '../types';

interface Props {
  question: DraftAnswer;
  index: number;
  onRegenerate: (questionId: number) => void;
  onUpdateAnswer: (questionId: number, answer: string) => void;
  isRegenerating: boolean;
}

export const DraftQuestionCard = ({ question, index, onRegenerate, onUpdateAnswer, isRegenerating }: Props) => {
  const [copied, setCopied] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const charUsed = question.answer.length;
  const charLimit = question.charLimit || 0;
  const charPercent = charLimit > 0 ? (charUsed / charLimit) * 100 : 0;
  const charColor = charPercent > 90 ? '#dc2626' : charPercent > 70 ? '#d97706' : '#16a34a';
  const isOverLimit = charPercent > 100;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(question.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const flags = question.missingDataFlags || [];

  return (
    <div className={`draft-card ${flags.length > 0 ? 'draft-card--has-flags' : ''}`}>
      {/* Header */}
      <div className="draft-card__header">
        <div className="draft-card__number">Q{index + 1}</div>
        <div className="draft-card__header-text">
          {question.section && <div className="draft-card__section">{question.section}</div>}
          <div className="draft-card__question">{question.questionText}</div>
        </div>
      </div>

      {/* Character limit bar */}
      {charLimit > 0 && (
        <div className="draft-card__char-bar">
          <div className="draft-card__char-track">
            <div
              className="draft-card__char-fill"
              style={{ width: `${Math.min(charPercent, 100)}%`, backgroundColor: charColor }}
            />
          </div>
          <span className="draft-card__char-label" style={{ color: charColor }}>
            {charUsed.toLocaleString()} / {charLimit.toLocaleString()} chars
            {isOverLimit && <span className="draft-card__char-over"> — over limit!</span>}
          </span>
        </div>
      )}

      {/* Answer textarea */}
      <textarea
        className="draft-card__answer"
        value={question.answer}
        onChange={(e) => onUpdateAnswer(question.questionId, e.target.value)}
        rows={Math.max(4, Math.ceil(question.answer.length / 90))}
      />

      {/* Missing data flags */}
      {flags.length > 0 && (
        <div className="draft-card__flags">
          <div className="draft-card__flags-header">
            <AlertTriangle size={13} style={{ color: '#d97706' }} />
            <span>{flags.length} missing data flag{flags.length > 1 ? 's' : ''}</span>
          </div>
          {flags.map((flag, i) => (
            <div key={i} className="draft-card__flag">
              <div className="draft-card__flag-text">{flag}</div>
            </div>
          ))}
        </div>
      )}

      {/* Source + Actions */}
      <div className="draft-card__footer">
        <button className="draft-card__source-toggle" onClick={() => setShowSource(!showSource)}>
          {showSource ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          Source
        </button>
        <div className="draft-card__actions">
          <button
            className="draft-card__action-btn"
            onClick={() => onRegenerate(question.questionId)}
            disabled={isRegenerating}
          >
            <RefreshCw size={12} className={isRegenerating ? 'spin' : ''} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
          <button className="draft-card__action-btn draft-card__action-btn--copy" onClick={handleCopy}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {showSource && (
        <div className="draft-card__source-content">{question.source}</div>
      )}
    </div>
  );
};
