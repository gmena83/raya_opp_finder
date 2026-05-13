import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle, AlertTriangle, Globe, Search, Database, PenTool, ArrowRight, RotateCcw } from 'lucide-react';
import { useWorkflow } from '../hooks/useWorkflow';
import { getDraftAnswers } from '../services/api';
import type { DraftAnswer } from '../types';

const phaseIcons = [Globe, Search, Database, PenTool];

export const LiveWorkflow = () => {
  const [url, setUrl] = useState('https://www.grants.gov/search-results-detail/351879');
  const { workflowRun, isRunning, isComplete, allLogs, startWorkflow, resetWorkflow } = useWorkflow();
  const [draftAnswers, setDraftAnswers] = useState<DraftAnswer[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [allLogs]);

  useEffect(() => {
    if (isComplete && workflowRun) {
      getDraftAnswers(workflowRun.opportunityId).then((res) => {
        if (res.success && res.data) setDraftAnswers(res.data);
      });
    }
  }, [isComplete, workflowRun]);

  const handleSubmit = () => {
    if (!url.trim() || isRunning) return;
    setShowDrafts(false);
    setDraftAnswers([]);
    startWorkflow(url.trim());
  };

  const handleReset = () => {
    resetWorkflow();
    setShowDrafts(false);
    setDraftAnswers([]);
  };

  return (
    <section id="dashboard" className="section-padding" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container-raya">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="text-eyebrow" style={{ color: 'var(--color-ink-subtle)', marginBottom: 'var(--spacing-md)' }}>Grant Analyzer</div>
          <h2 className="text-display-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>
            Paste a grant URL. <span style={{ color: 'var(--color-primary)' }}>Get a draft.</span>
          </h2>
        </div>

        {/* URL Input */}
        <div style={{ maxWidth: 720, margin: '0 auto', marginBottom: 48 }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'stretch' }}>
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a grant opportunity URL..."
              disabled={isRunning}
              style={{
                flex: 1, padding: '14px 20px', borderRadius: 'var(--radius-pill)', border: '1.5px solid var(--color-surface-1)',
                fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: 'var(--color-ink)', outline: 'none',
                backgroundColor: 'var(--color-surface-launch)', transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-surface-1)')}
            />
            {isComplete ? (
              <button className="btn-secondary" onClick={handleReset} style={{ padding: '14px 24px' }}>
                <RotateCcw size={16} /> Reset
              </button>
            ) : (
              <button className="btn-primary" onClick={handleSubmit} disabled={isRunning || !url.trim()} style={{ opacity: isRunning ? 0.7 : 1 }}>
                {isRunning ? 'Analyzing...' : 'Analyze'} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Workflow Display */}
        {(isRunning || isComplete) && workflowRun && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }} className="workflow-grid">
            {/* Left: Phase Cards + Logs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {/* Phase indicators */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
                {workflowRun.phases.map((phase, idx) => {
                  const Icon = phaseIcons[idx];
                  const isActive = phase.status === 'running';
                  const isDone = phase.status === 'complete';
                  return (
                    <div key={phase.id} style={{
                      padding: 'var(--spacing-md)', borderRadius: 'var(--radius-xl)',
                      backgroundColor: isActive ? 'var(--color-surface-compare)' : isDone ? 'var(--color-surface-1)' : 'var(--color-surface-launch)',
                      border: isActive ? '1.5px solid var(--color-primary)' : '1.5px solid transparent', position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        {isDone ? <CheckCircle size={16} style={{ color: 'var(--color-success)' }} /> : <Icon size={16} style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-ink-quaternary)' }} />}
                        <span className="text-card-title" style={{ fontSize: '0.8rem', color: isActive ? 'var(--color-ink)' : isDone ? 'var(--color-ink-muted)' : 'var(--color-ink-quaternary)' }}>{phase.title}</span>
                      </div>
                      <span className="text-eyebrow" style={{ fontSize: '0.55rem', color: 'var(--color-ink-quaternary)' }}>{phase.tool}</span>
                      {isActive && <motion.div style={{ position: 'absolute', bottom: 0, left: 0, height: 2, backgroundColor: 'var(--color-primary)' }} initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: phase.logs.length * 0.6 + 2, ease: 'linear' }} />}
                    </div>
                  );
                })}
              </div>

              {/* Log terminal */}
              <div className="log-terminal custom-scrollbar" style={{ height: 280, overflowY: 'auto' }}>
                {allLogs.length === 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-ink-quaternary)' }}>
                    <Play size={20} style={{ marginRight: 8, opacity: 0.5 }} /> Initializing...
                  </div>
                )}
                {allLogs.map((log, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="log-line">
                    {log}
                  </motion.div>
                ))}
                {isComplete && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#fff', fontWeight: 700, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12, marginTop: 12 }}>
                    ✔ WORKFLOW COMPLETE. DRAFT GENERATED.
                  </motion.div>
                )}
                <div ref={logEndRef} />
              </div>
            </div>

            {/* Right: Results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {/* Cost comparison */}
              <div className="card" style={{ backgroundColor: 'var(--color-surface-1)' }}>
                <div className="text-eyebrow" style={{ fontSize: '0.65rem', color: 'var(--color-ink-subtle)', marginBottom: 'var(--spacing-md)' }}>Efficiency Impact</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-ink-muted)', marginBottom: 4 }}>Manual Cost</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'var(--color-ink)' }}>$270</div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--color-ink-quaternary)' }}>~9 hours @ $30/hr</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-success)', marginBottom: 4 }}>AI Cost</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'var(--color-success)' }}>$0.52</div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--color-ink-quaternary)' }}>GPU + API tokens</div>
                  </div>
                </div>
              </div>

              {/* Completion / Drafts */}
              <AnimatePresence mode="wait">
                {isComplete ? (
                  <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ backgroundColor: 'var(--color-surface-raya)', textAlign: 'center' }}>
                    <CheckCircle size={32} style={{ color: 'var(--color-success)', margin: '0 auto 12px' }} />
                    <h3 className="text-headline" style={{ margin: '0 0 4px', color: 'var(--color-ink)' }}>Draft Ready</h3>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--color-ink-muted)', margin: '0 0 16px' }}>3 questions answered · 1 flag raised</p>
                    <button className="btn-primary" onClick={() => setShowDrafts(true)} style={{ width: '100%' }}>View Draft Answers</button>
                  </motion.div>
                ) : isRunning ? (
                  <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ backgroundColor: 'var(--color-surface-compare)', textAlign: 'center' }}>
                    <div className="animate-pulse-dot" style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--color-primary)', margin: '0 auto 12px' }} />
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--color-ink-muted)', margin: 0 }}>Processing in real-time...</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Draft Answers Modal */}
        <AnimatePresence>
          {showDrafts && draftAnswers.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 60, backgroundColor: 'var(--color-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
              onClick={() => setShowDrafts(false)}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-xl)', maxWidth: 800, width: '100%', maxHeight: '80vh', overflow: 'auto', padding: 'var(--spacing-xl)' }}
                className="custom-scrollbar">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                  <h3 className="text-display-md" style={{ margin: 0, color: 'var(--color-ink)' }}>Draft Answers</h3>
                  <button onClick={() => setShowDrafts(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', color: 'var(--color-ink-muted)', fontSize: '0.85rem' }}>Close ✕</button>
                </div>
                {draftAnswers.map((answer) => (
                  <div key={answer.questionId} style={{ marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-surface-1)', borderRadius: 'var(--radius-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span className="text-card-title" style={{ color: 'var(--color-ink)' }}>Q{answer.questionId}: {answer.questionText}</span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-ink-muted)', lineHeight: 1.7, margin: '0 0 12px' }}>{answer.answer}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="text-eyebrow" style={{ fontSize: '0.6rem', color: 'var(--color-ink-quaternary)' }}>Source: {answer.source}</span>
                      {answer.charLimit && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: answer.charUsed && answer.charUsed > answer.charLimit ? '#dc2626' : 'var(--color-success)' }}>
                          {answer.charUsed}/{answer.charLimit} chars
                        </span>
                      )}
                    </div>
                    {answer.answer.includes('[[MISSING DATA') && (
                      <div style={{ marginTop: 8, padding: '8px 12px', backgroundColor: 'rgba(245,180,25,0.08)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AlertTriangle size={14} style={{ color: 'var(--color-primary)' }} />
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#b8860b' }}>Contains missing data flags — needs manual review</span>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Responsive */}
        <style>{`
          @media (max-width: 768px) {
            .workflow-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
};
