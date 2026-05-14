import { useState } from 'react';
import { Database, FileText, FileSpreadsheet, FlaskConical, FileCode, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import type { KnowledgeDocument, KnowledgeBaseStats } from '../types';

const categoryConfig = {
  completed_application: { label: 'Application', icon: FileText, color: '#7c3aed' },
  company_doc: { label: 'Company', icon: FileSpreadsheet, color: '#1d4ed8' },
  research: { label: 'Research', icon: FlaskConical, color: '#059669' },
  template: { label: 'Template', icon: FileCode, color: '#d97706' },
} as const;

const statusConfig = {
  ingested: { label: 'Ingested', icon: CheckCircle2, color: '#16a34a' },
  processing: { label: 'Processing', icon: Loader2, color: '#d97706' },
  error: { label: 'Error', icon: AlertCircle, color: '#dc2626' },
} as const;

type FilterCat = 'all' | 'completed_application' | 'company_doc' | 'research' | 'template';

function timeAgo(iso: string): string {
  const hours = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

interface Props {
  documents: KnowledgeDocument[];
  stats: KnowledgeBaseStats | null;
}

export const KnowledgeBase = ({ documents, stats }: Props) => {
  const [filter, setFilter] = useState<FilterCat>('all');

  const filtered = filter === 'all' ? documents : documents.filter(d => d.category === filter);

  return (
    <div className="kb">
      {/* Pinecone status */}
      {stats && (
        <div className="kb__pinecone">
          <div className="kb__pinecone-dot" />
          <span className="kb__pinecone-label">Pinecone Connected</span>
          <span className="kb__pinecone-detail">{stats.totalVectors.toLocaleString()} vectors · Last sync: {timeAgo(stats.lastIngestion)}</span>
        </div>
      )}

      {/* Category filters */}
      <div className="kb__filters">
        {(['all', 'completed_application', 'company_doc', 'research', 'template'] as FilterCat[]).map(cat => (
          <button
            key={cat}
            className={`kb__filter ${filter === cat ? 'kb__filter--active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? 'All' : categoryConfig[cat].label}
            <span className="kb__filter-count">
              {cat === 'all' ? documents.length : documents.filter(d => d.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* Document list */}
      <div className="kb__list">
        {filtered.map(doc => {
          const catCfg = categoryConfig[doc.category];
          const statusCfg = statusConfig[doc.status];
          const CatIcon = catCfg.icon;
          const StatusIcon = statusCfg.icon;
          return (
            <div key={doc.id} className="kb__doc">
              <div className="kb__doc-icon" style={{ backgroundColor: `${catCfg.color}12`, color: catCfg.color }}>
                <CatIcon size={14} />
              </div>
              <div className="kb__doc-body">
                <div className="kb__doc-name">{doc.filename}</div>
                <div className="kb__doc-meta">
                  <span className="kb__doc-cat" style={{ color: catCfg.color }}>{catCfg.label}</span>
                  {doc.opportunityName && <span className="kb__doc-opp">· {doc.opportunityName}</span>}
                  {doc.outcome && (
                    <span className={`kb__doc-outcome kb__doc-outcome--${doc.outcome}`}>
                      {doc.outcome === 'awarded' ? '✓ Won' : '✗ Lost'}
                    </span>
                  )}
                </div>
              </div>
              <div className="kb__doc-right">
                <div className="kb__doc-vectors">
                  {doc.status === 'processing' ? (
                    <><Loader2 size={10} className="spin" /> Processing</>
                  ) : (
                    <><Database size={10} /> {doc.vectorCount} vectors</>
                  )}
                </div>
                <div className="kb__doc-size">{doc.fileSize} · {timeAgo(doc.ingestedAt)}</div>
                <StatusIcon size={12} style={{ color: statusCfg.color }} className={doc.status === 'processing' ? 'spin' : ''} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
