import { useState } from 'react';
import { Copy, Check, Loader2, FileSignature } from 'lucide-react';
import { generateCoverLetter } from '../services/api';
import type { CoverLetter, CoverLetterTemplate } from '../types';

const templates: { id: CoverLetterTemplate; label: string; desc: string }[] = [
  { id: 'standard', label: 'Standard', desc: 'Formal cover letter with key highlights' },
  { id: 'narrative', label: 'Narrative', desc: 'Story-driven opening with founder journey' },
  { id: 'executive_summary', label: 'Executive Summary', desc: 'Data-driven overview with key metrics' },
];

interface Props {
  opportunityId: string;
  coverLetter?: CoverLetter;
  onUpdate: (coverLetter: CoverLetter) => void;
}

export const CoverLetterBuilder = ({ opportunityId, coverLetter, onUpdate }: Props) => {
  const [selectedTemplate, setSelectedTemplate] = useState<CoverLetterTemplate>(coverLetter?.template || 'standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const result = await generateCoverLetter(opportunityId, selectedTemplate);
    if (result.success && result.data) {
      onUpdate({
        content: result.data.content,
        charCount: result.data.charCount,
        template: selectedTemplate,
        isGenerated: true,
      });
    }
    setIsGenerating(false);
  };

  const handleCopy = async () => {
    if (!coverLetter?.content) return;
    await navigator.clipboard.writeText(coverLetter.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cover-letter">
      <div className="cover-letter__header">
        <FileSignature size={14} style={{ color: 'var(--color-primary)' }} />
        <span>Cover Letter / Proposal</span>
      </div>

      {/* Template selector */}
      <div className="cover-letter__templates">
        {templates.map((t) => (
          <button
            key={t.id}
            className={`cover-letter__template ${selectedTemplate === t.id ? 'cover-letter__template--active' : ''}`}
            onClick={() => setSelectedTemplate(t.id)}
          >
            <div className="cover-letter__template-label">{t.label}</div>
            <div className="cover-letter__template-desc">{t.desc}</div>
          </button>
        ))}
      </div>

      {/* Generate button */}
      <button
        className="cover-letter__generate-btn"
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <><Loader2 size={13} className="spin" /> Generating...</>
        ) : (
          <><FileSignature size={13} /> Generate {selectedTemplate === coverLetter?.template && coverLetter?.isGenerated ? '(Regenerate)' : ''}</>
        )}
      </button>

      {/* Preview */}
      {coverLetter?.content && (
        <div className="cover-letter__preview">
          <div className="cover-letter__preview-header">
            <span className="cover-letter__preview-chars">{coverLetter.charCount} characters</span>
            <button className="cover-letter__copy-btn" onClick={handleCopy}>
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="cover-letter__content">{coverLetter.content}</div>
        </div>
      )}
    </div>
  );
};
