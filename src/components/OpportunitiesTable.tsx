import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useOpportunities } from '../hooks/useOpportunities';
import type { OpportunityStatus } from '../types';

const statusConfig: Record<OpportunityStatus, { label: string; className: string; dot?: boolean }> = {
  pending: { label: 'Pending', className: 'status-pill status-pill--pending' },
  processing: { label: 'Processing', className: 'status-pill status-pill--processing', dot: true },
  done: { label: 'Done', className: 'status-pill status-pill--done' },
  error: { label: 'Error', className: 'status-pill status-pill--error' },
};

export const OpportunitiesTable = () => {
  const { opportunities, isLoading } = useOpportunities();

  return (
    <section id="pipeline" className="section-padding" style={{ backgroundColor: 'var(--color-surface-launch)' }}>
      <div className="container-raya">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 48 }}>
          <div className="text-eyebrow" style={{ color: 'var(--color-ink-subtle)', marginBottom: 'var(--spacing-md)' }}>Grant Pipeline</div>
          <h2 className="text-display-md" style={{ color: 'var(--color-ink)', margin: 0 }}>Raya's Active Opportunities</h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-surface-1)' }}>

          {isLoading ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-ink-quaternary)', fontFamily: 'var(--font-ui)', fontSize: '0.85rem' }}>Loading opportunities...</div>
          ) : opportunities.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-ink-quaternary)', fontFamily: 'var(--font-ui)', fontSize: '0.85rem' }}>No opportunities in the pipeline yet. Use the analyzer above to start.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-ui)', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-surface-1)' }}>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Opportunity</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Links</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((opp) => {
                    const status = statusConfig[opp.status];
                    return (
                      <tr key={opp.id} style={{ borderBottom: '1px solid var(--color-surface-1)', transition: 'background-color 0.15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-launch)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                        <td style={tdStyle}>
                          <span className={status.className}>
                            {status.dot && <span className="animate-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'inline-block' }} />}
                            {status.label}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ color: 'var(--color-ink)', fontWeight: 500 }}>{opp.name}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-ink-quaternary)', marginTop: 2, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opp.url}</div>
                        </td>
                        <td style={{ ...tdStyle, color: 'var(--color-ink-muted)', whiteSpace: 'nowrap' }}>{new Date(opp.createdAt).toLocaleDateString()}</td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: 12 }}>
                            {opp.driveLink && <a href={opp.driveLink} target="_blank" rel="noopener noreferrer" style={linkStyle}>Drive <ExternalLink size={12} /></a>}
                            {opp.draftLink && <a href={opp.draftLink} target="_blank" rel="noopener noreferrer" style={linkStyle}>Draft <ExternalLink size={12} /></a>}
                            {!opp.driveLink && !opp.draftLink && <span style={{ color: 'var(--color-ink-quaternary)' }}>—</span>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '12px 20px', color: 'var(--color-ink-muted)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle: React.CSSProperties = { padding: '16px 20px' };
const linkStyle: React.CSSProperties = { color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' };
