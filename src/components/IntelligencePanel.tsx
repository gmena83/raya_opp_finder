import { Trophy, Video, Newspaper, Globe, MessageCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { PastWinner, IntelligenceItem, IntelligenceType, Sentiment } from '../types';

const typeIcons: Record<IntelligenceType, typeof Video> = {
  webinar: Video,
  news: Newspaper,
  policy: Globe,
  social: MessageCircle,
};

const typeLabels: Record<IntelligenceType, string> = {
  webinar: 'Webinar',
  news: 'News',
  policy: 'Policy',
  social: 'Social',
};

const sentimentConfig: Record<Sentiment, { icon: typeof TrendingUp; color: string; label: string }> = {
  positive: { icon: TrendingUp, color: '#16a34a', label: 'Positive' },
  neutral:  { icon: Minus, color: '#6b7280', label: 'Neutral' },
  negative: { icon: TrendingDown, color: '#dc2626', label: 'Negative' },
};

interface Props {
  pastWinners: PastWinner[];
  intelligence: IntelligenceItem[];
}

export const IntelligencePanel = ({ pastWinners, intelligence }: Props) => {
  const isEmpty = pastWinners.length === 0 && intelligence.length === 0;

  if (isEmpty) {
    return (
      <div className="intelligence-empty">
        No intelligence gathered yet. Start research to discover past winners, webinars, and news context.
      </div>
    );
  }

  return (
    <div className="intelligence-panel">
      {/* Past Winners */}
      {pastWinners.length > 0 && (
        <div className="intelligence-panel__section">
          <div className="intelligence-panel__section-header">
            <Trophy size={14} style={{ color: 'var(--color-primary)' }} />
            <span>Past Winners ({pastWinners.length})</span>
          </div>
          <div className="intelligence-panel__winners">
            {pastWinners.map((winner, i) => (
              <div key={i} className="intelligence-panel__winner-card">
                <div className="intelligence-panel__winner-header">
                  <div>
                    <div className="intelligence-panel__winner-org">{winner.organization}</div>
                    <div className="intelligence-panel__winner-meta">{winner.year} &middot; {winner.awardAmount}</div>
                  </div>
                </div>
                <div className="intelligence-panel__winner-summary">{winner.projectSummary}</div>
                <div className="intelligence-panel__winner-relevance">
                  <span className="intelligence-panel__relevance-label">Raya relevance:</span> {winner.relevance}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Intelligence Feed */}
      {intelligence.length > 0 && (
        <div className="intelligence-panel__section">
          <div className="intelligence-panel__section-header">
            <Globe size={14} style={{ color: 'var(--color-primary)' }} />
            <span>News &amp; Media ({intelligence.length})</span>
          </div>
          <div className="intelligence-panel__feed">
            {intelligence.map((item, i) => {
              const TypeIcon = typeIcons[item.type];
              const sentiment = item.sentiment ? sentimentConfig[item.sentiment] : null;
              const SentimentIcon = sentiment?.icon;

              return (
                <div key={i} className="intelligence-panel__feed-item">
                  <div className="intelligence-panel__feed-icon">
                    <TypeIcon size={14} />
                  </div>
                  <div className="intelligence-panel__feed-body">
                    <div className="intelligence-panel__feed-header">
                      <span className="intelligence-panel__feed-type">{typeLabels[item.type]}</span>
                      <span className="intelligence-panel__feed-date">
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {sentiment && SentimentIcon && (
                        <span className="intelligence-panel__sentiment" style={{ color: sentiment.color }}>
                          <SentimentIcon size={11} />
                          {sentiment.label}
                        </span>
                      )}
                    </div>
                    <div className="intelligence-panel__feed-title">{item.title}</div>
                    <div className="intelligence-panel__feed-summary">{item.summary}</div>
                    <div className="intelligence-panel__feed-source">{item.source}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
