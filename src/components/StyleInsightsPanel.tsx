import { Lightbulb, BarChart3, Type, FileText, BookOpen } from 'lucide-react';
import type { StyleInsight } from '../types';

const categoryConfig = {
  tone: { label: 'Tone', icon: Type, color: '#7c3aed' },
  structure: { label: 'Structure', icon: FileText, color: '#1d4ed8' },
  data_usage: { label: 'Data Usage', icon: BarChart3, color: '#059669' },
  vocabulary: { label: 'Vocabulary', icon: BookOpen, color: '#d97706' },
} as const;

const impactColors = { high: '#16a34a', medium: '#d97706', low: '#6b7280' };

interface Props {
  insights: StyleInsight[];
}

export const StyleInsightsPanel = ({ insights }: Props) => {
  return (
    <div className="style-insights">
      <div className="style-insights__intro">
        <Lightbulb size={14} style={{ color: 'var(--color-primary)' }} />
        <span>Patterns extracted from {insights.length} analyzed proposals. High-impact patterns are prioritized in AI draft generation.</span>
      </div>

      <div className="style-insights__grid">
        {insights.map(insight => {
          const catCfg = categoryConfig[insight.category];
          const CatIcon = catCfg.icon;

          return (
            <div key={insight.id} className="style-card">
              <div className="style-card__header">
                <div className="style-card__cat" style={{ backgroundColor: `${catCfg.color}12`, color: catCfg.color }}>
                  <CatIcon size={11} />
                  {catCfg.label}
                </div>
                <div className="style-card__impact" style={{ color: impactColors[insight.impact] }}>
                  {insight.impact} impact
                </div>
              </div>

              <div className="style-card__pattern">{insight.pattern}</div>

              <div className="style-card__freq">
                <div className="style-card__freq-bar">
                  <div className="style-card__freq-fill" style={{ width: `${insight.frequency}%`, backgroundColor: catCfg.color }} />
                </div>
                <span className="style-card__freq-label">{insight.frequency}% frequency</span>
              </div>

              <div className="style-card__source">Source: {insight.source}</div>

              {insight.examples.length > 0 && (
                <div className="style-card__examples">
                  {insight.examples.map((ex, i) => (
                    <div key={i} className="style-card__example">{ex}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
