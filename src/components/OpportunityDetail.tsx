import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, FileText, ShieldCheck, Brain, BarChart3, ExternalLink, File, FileSpreadsheet, FileCode } from 'lucide-react';
import { getResearchDossier, startResearch } from '../services/api';
import { ResearchProgress } from './ResearchProgress';
import { EligibilityChecklist } from './EligibilityChecklist';
import { IntelligencePanel } from './IntelligencePanel';
import type { Opportunity, OpportunityType, ResearchDossier, DocType } from '../types';

const typeConfig: Record<OpportunityType, { label: string; color: string; bg: string }> = {
  federal_grant:    { label: 'Federal Grant',    color: '#1d4ed8', bg: 'rgba(29,78,216,0.08)' },
  state_grant:      { label: 'State Grant',      color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  private_grant:    { label: 'Private Grant',     color: '#059669', bg: 'rgba(5,150,105,0.08)' },
  accelerator:      { label: 'Accelerator',       color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
  pitch_competition:{ label: 'Pitch Competition', color: '#db2777', bg: 'rgba(219,39,119,0.08)' },
  impact_investment:{ label: 'Impact Investment', color: '#0891b2', bg: 'rgba(8,145,178,0.08)' },
  sbir_sttr:        { label: 'SBIR/STTR',         color: '#4f46e5', bg: 'rgba(79,70,229,0.08)' },
};

const docIcons: Record<DocType, typeof File> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  md: FileCode,
  gsheet: FileSpreadsheet,
  doc: FileText,
};

const categoryLabels: Record<string, { label: string; color: string }> = {
  rules:    { label: 'Rules', color: '#1d4ed8' },
  research: { label: 'Research', color: '#7c3aed' },
  form:     { label: 'Form', color: '#d97706' },
  draft:    { label: 'Draft', color: '#059669' },
};

type TabId = 'overview' | 'documents' | 'eligibility' | 'intelligence';

interface Props {
  opportunity: Opportunity;
  onClose: () => void;
}

export const OpportunityDetail = ({ opportunity, onClose }: Props) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [dossier, setDossier] = useState<ResearchDossier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  const fetchDossier = useCallback(async () => {
    setIsLoading(true);
    const result = await getResearchDossier(opportunity.id);
    if (result.success && result.data) {
      setDossier(result.data);
    }
    setIsLoading(false);
  }, [opportunity.id]);

  useEffect(() => {
    fetchDossier();
  }, [fetchDossier]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleStartResearch = async () => {
    setIsStarting(true);
    const result = await startResearch(opportunity.id);
    if (result.success && result.data) {
      setDossier(result.data);
    }
    setIsStarting(false);
  };

  const typeInfo = typeConfig[opportunity.type];

  const tabs: { id: TabId; label: string; icon: typeof BarChart3; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'documents', label: 'Documents', icon: FileText, count: dossier?.documents.length },
    { id: 'eligibility', label: 'Eligibility', icon: ShieldCheck, count: dossier?.eligibility.length },
    { id: 'intelligence', label: 'Intelligence', icon: Brain, count: (dossier?.pastWinners.length || 0) + (dossier?.intelligence.length || 0) },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="detail-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="detail-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="detail-panel__header">
            <div className="detail-panel__header-top">
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span className="detail-panel__badge" style={{ backgroundColor: typeInfo.bg, color: typeInfo.color }}>{typeInfo.label}</span>
                  <span className="detail-panel__score">Score: {opportunity.relevanceScore}</span>
                </div>
                <h2 className="detail-panel__title">{opportunity.name}</h2>
                <a href={opportunity.url} target="_blank" rel="noopener noreferrer" className="detail-panel__url">
                  {opportunity.url} <ExternalLink size={10} />
                </a>
              </div>
              <button onClick={onClose} className="detail-panel__close"><X size={18} /></button>
            </div>

            {/* Meta row */}
            <div className="detail-panel__meta">
              {opportunity.fundingAmount && <span>Funding: <strong>{opportunity.fundingAmount}</strong></span>}
              {opportunity.deadline && (
                <span>Deadline: <strong>{new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
              )}
              {dossier && dossier.status !== 'complete' && dossier.status !== 'in_progress' && (
                <button
                  className="detail-panel__start-btn"
                  onClick={handleStartResearch}
                  disabled={isStarting}
                >
                  <Play size={12} />
                  {isStarting ? 'Starting...' : 'Start Research'}
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="detail-panel__tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`detail-panel__tab ${activeTab === tab.id ? 'detail-panel__tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={13} />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="detail-panel__tab-count">{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="detail-panel__content">
            {isLoading ? (
              <div className="detail-panel__loading">Loading research dossier...</div>
            ) : !dossier ? (
              <div className="detail-panel__loading">No dossier data available.</div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <ResearchProgress
                    status={dossier.status}
                    progress={dossier.progress}
                    tasks={dossier.tasks}
                    lastUpdated={dossier.lastUpdated}
                  />
                )}

                {activeTab === 'documents' && (
                  <div className="doc-list">
                    {dossier.documents.length === 0 ? (
                      <div className="doc-list__empty">No documents yet. Start research to scrape application files.</div>
                    ) : (
                      <>
                        {['rules', 'research', 'form', 'draft'].map((cat) => {
                          const docs = dossier.documents.filter((d) => d.category === cat);
                          if (docs.length === 0) return null;
                          const catInfo = categoryLabels[cat];
                          return (
                            <div key={cat} className="doc-list__category">
                              <div className="doc-list__category-header" style={{ color: catInfo.color }}>{catInfo.label}</div>
                              {docs.map((doc) => {
                                const Icon = docIcons[doc.type] || File;
                                return (
                                  <a
                                    key={doc.id}
                                    href={doc.driveUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="doc-list__item"
                                  >
                                    <Icon size={16} style={{ color: catInfo.color, flexShrink: 0 }} />
                                    <div className="doc-list__item-info">
                                      <div className="doc-list__item-name">{doc.name}</div>
                                      <div className="doc-list__item-meta">
                                        {doc.size} &middot; {new Date(doc.addedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                      </div>
                                    </div>
                                    <ExternalLink size={12} style={{ color: 'var(--color-ink-quaternary)', flexShrink: 0 }} />
                                  </a>
                                );
                              })}
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'eligibility' && (
                  <EligibilityChecklist checks={dossier.eligibility} />
                )}

                {activeTab === 'intelligence' && (
                  <IntelligencePanel pastWinners={dossier.pastWinners} intelligence={dossier.intelligence} />
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
