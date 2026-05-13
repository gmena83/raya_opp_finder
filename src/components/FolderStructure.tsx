import { Folder, FileText, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';

const FileItem = ({ name, icon: Icon, color }: { name: string; icon: React.ElementType; color: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', marginLeft: 24, cursor: 'default' }}>
    <Icon size={14} style={{ color, flexShrink: 0 }} />
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-ink-inverse)', opacity: 0.8 }}>{name}</span>
  </div>
);

const FolderItem = ({ name, children }: { name: string; children?: React.ReactNode }) => (
  <div style={{ marginLeft: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer' }}>
      <Folder size={14} style={{ color: 'var(--color-primary)' }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-ink-inverse)', fontWeight: 500 }}>{name}</span>
    </div>
    {children && <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', marginLeft: 7, paddingLeft: 4 }}>{children}</div>}
  </div>
);

export const FolderStructure = () => (
  <section className="section-padding" style={{ backgroundColor: 'var(--color-canvas)' }}>
    <div className="container-raya folder-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xxl)', alignItems: 'start' }}>
      {/* Tree */}
      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        style={{ backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-lg)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)', paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-eyebrow" style={{ fontSize: '0.6rem', color: 'var(--color-ink-quaternary)' }}>Google Drive Structure</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#eab308' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e' }} />
          </div>
        </div>
        <FolderItem name="Rayapower_Grant_Bot">
          <FolderItem name="01_Inputs">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-ink-quaternary)', marginLeft: 32, fontStyle: 'italic' }}>// New URLs land here</span>
          </FolderItem>
          <FolderItem name="02_Active_Applications">
            <FolderItem name="2026-05-14_Solar_Innovation_Fund">
              <FolderItem name="Context_Rules">
                <FileItem name="2026_Guidelines.pdf" icon={FileText} color="#ef4444" />
                <FileItem name="Evaluation_Criteria.docx" icon={FileText} color="#3b82f6" />
              </FolderItem>
              <FileItem name="Raw_Form_Data.md" icon={FileText} color="var(--color-ink-quaternary)" />
              <FileItem name="Application_Draft.gsheet" icon={FileSpreadsheet} color="var(--color-success)" />
            </FolderItem>
          </FolderItem>
          <FolderItem name="03_Knowledge_Base">
            <FolderItem name="Company_Docs">
              <FileItem name="Pitch_Deck_2025.pdf" icon={FileText} color="#ef4444" />
              <FileItem name="Financials_Q4.xlsx" icon={FileSpreadsheet} color="var(--color-success)" />
            </FolderItem>
            <FolderItem name="Completed_Applications">
              <FileItem name="Previous_Win_Example.pdf" icon={FileText} color="#ef4444" />
            </FolderItem>
          </FolderItem>
        </FolderItem>
      </motion.div>

      {/* Text */}
      <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
        <div className="text-eyebrow" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }}>File Management</div>
        <h2 className="text-display-md" style={{ color: 'var(--color-ink-inverse)', margin: '0 0 var(--spacing-lg)' }}>Raya's Grant Drive</h2>
        <p className="text-body-lg" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 'var(--spacing-xl)' }}>
          Every opportunity is automatically organized in Raya's shared Google Drive. Downloaded rules, scraped form data, and AI-drafted applications are filed for team review and editing.
        </p>

        {/* Status table */}
        <div style={{ backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-lg)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--spacing-md)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245,180,25,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileSpreadsheet size={20} style={{ color: 'var(--color-primary)' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-ink-inverse)', fontSize: '0.95rem' }}>Master Status Sheet</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-ink-quaternary)' }}>Real-time workflow tracking</div>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-ui)', fontSize: '0.8rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-ink-quaternary)', fontWeight: 500, fontSize: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-ink-quaternary)', fontWeight: 500, fontSize: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Opportunity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px 12px' }}><span className="status-pill status-pill--processing"><span className="animate-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'inline-block' }} />Processing</span></td>
                <td style={{ padding: '10px 12px', color: 'var(--color-ink-inverse)' }}>Solar Innovation Fund</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 12px' }}><span className="status-pill status-pill--done">Done</span></td>
                <td style={{ padding: '10px 12px', color: 'var(--color-ink-inverse)' }}>Agri-Tech Grant</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>

    <style>{`
      @media (max-width: 768px) {
        .folder-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  </section>
);
