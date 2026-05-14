import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Database, Trophy, Lightbulb, GitCompare, Brain, Loader2 } from 'lucide-react';
import { getKnowledgeBase, getApplicationOutcomes, getStyleInsights, getFeedbackDiffs } from '../services/api';
import { KnowledgeBase } from './KnowledgeBase';
import { OutcomeTracker } from './OutcomeTracker';
import { StyleInsightsPanel } from './StyleInsightsPanel';
import { FeedbackDiffViewer } from './FeedbackDiffViewer';
import type { KnowledgeDocument, KnowledgeBaseStats, ApplicationOutcome, StyleInsight, FeedbackDiff } from '../types';

type LearningTab = 'knowledge' | 'outcomes' | 'style' | 'feedback';

const tabs: { id: LearningTab; label: string; icon: typeof Database }[] = [
  { id: 'knowledge', label: 'Knowledge Base', icon: Database },
  { id: 'outcomes', label: 'Outcomes', icon: Trophy },
  { id: 'style', label: 'Style Insights', icon: Lightbulb },
  { id: 'feedback', label: 'Feedback Loop', icon: GitCompare },
];

export const LearningHub = () => {
  const [activeTab, setActiveTab] = useState<LearningTab>('knowledge');
  const [isLoading, setIsLoading] = useState(true);

  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [kbStats, setKbStats] = useState<KnowledgeBaseStats | null>(null);
  const [outcomes, setOutcomes] = useState<ApplicationOutcome[]>([]);
  const [insights, setInsights] = useState<StyleInsight[]>([]);
  const [diffs, setDiffs] = useState<FeedbackDiff[]>([]);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    const [kbResult, outResult, styleResult, diffResult] = await Promise.all([
      getKnowledgeBase(),
      getApplicationOutcomes(),
      getStyleInsights(),
      getFeedbackDiffs(),
    ]);
    if (kbResult.success && kbResult.data) {
      setDocuments(kbResult.data.documents);
      setKbStats(kbResult.data.stats);
    }
    if (outResult.success && outResult.data) setOutcomes(outResult.data);
    if (styleResult.success && styleResult.data) setInsights(styleResult.data);
    if (diffResult.success && diffResult.data) setDiffs(diffResult.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const winCount = outcomes.filter(o => o.result === 'awarded').length;
  const totalSubmitted = outcomes.filter(o => o.result !== 'pending').length;

  return (
    <section id="learning" className="section-padding" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container-raya">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 32 }}>
          <div className="text-eyebrow" style={{ color: 'var(--color-ink-subtle)', marginBottom: 'var(--spacing-md)' }}>
            <Brain size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
            Learning Loop
          </div>
          <h2 className="text-display-md" style={{ color: 'var(--color-ink)', margin: 0 }}>Intelligence That Grows With You</h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: 'var(--color-ink-muted)', marginTop: 8, maxWidth: 600 }}>
            Every submitted application makes the next draft smarter. Track outcomes, learn winning patterns, and refine your approach over time.
          </p>
        </motion.div>

        {/* Stats strip */}
        {kbStats && (
          <div className="learning-stats">
            <div className="learning-stats__item">
              <div className="learning-stats__value">{kbStats.totalDocuments}</div>
              <div className="learning-stats__label">Documents Ingested</div>
            </div>
            <div className="learning-stats__item">
              <div className="learning-stats__value">{kbStats.totalVectors.toLocaleString()}</div>
              <div className="learning-stats__label">Vectors in Pinecone</div>
            </div>
            <div className="learning-stats__item">
              <div className="learning-stats__value">{winCount}/{totalSubmitted}</div>
              <div className="learning-stats__label">Applications Won</div>
            </div>
            <div className="learning-stats__item">
              <div className="learning-stats__value">{kbStats.winRate}%</div>
              <div className="learning-stats__label">Win Rate</div>
            </div>
            <div className="learning-stats__item">
              <div className="learning-stats__value">{insights.length}</div>
              <div className="learning-stats__label">Style Patterns</div>
            </div>
            <div className="learning-stats__item">
              <div className="learning-stats__value">{diffs.length}</div>
              <div className="learning-stats__label">Feedback Diffs</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="learning-tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`learning-tab ${activeTab === tab.id ? 'learning-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="learning-loading">
            <Loader2 size={20} className="spin" />
            Loading learning data...
          </div>
        ) : (
          <div className="learning-content">
            {activeTab === 'knowledge' && <KnowledgeBase documents={documents} stats={kbStats} />}
            {activeTab === 'outcomes' && <OutcomeTracker outcomes={outcomes} />}
            {activeTab === 'style' && <StyleInsightsPanel insights={insights} />}
            {activeTab === 'feedback' && <FeedbackDiffViewer diffs={diffs} />}
          </div>
        )}
      </div>
    </section>
  );
};
