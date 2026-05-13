import { motion } from 'framer-motion';
import { Globe, Search, Database, PenTool } from 'lucide-react';

const steps = [
  { id: 1, title: 'The Scout', tool: 'Apify', description: "Scrapes the grant page, extracts application questions, and downloads PDF rules and eligibility criteria to Raya's Drive.", icon: Globe },
  { id: 2, title: 'The Researcher', tool: 'Perplexity', description: "Searches past winners in solar and clean energy, finds evaluation criteria, and identifies what DOE/USDA reviewers prioritize.", icon: Search },
  { id: 3, title: 'The Analyst', tool: 'Pinecone (RAG)', description: "Matches each question to Raya's knowledge base \u2014 solar pod specs, community impact data, financials, and previous winning answers.", icon: Database },
  { id: 4, title: 'The Writer', tool: 'Claude 3.5', description: "Drafts answers using Raya's voice, cites source documents, respects character limits, and flags any data gaps for the team to fill.", icon: PenTool },
];

export const HowItWorks = () => (
  <section id="how-it-works" className="section-padding" style={{ backgroundColor: 'var(--color-surface-1)' }}>
    <div className="container-raya">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
        <div className="text-eyebrow" style={{ color: 'var(--color-ink-subtle)', marginBottom: 'var(--spacing-md)' }}>How It Works</div>
        <h2 className="text-display-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>
          From opportunity URL to{' '}<span style={{ color: 'var(--color-ink-muted)' }}>draft-ready application.</span>
        </h2>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--spacing-lg)' }}>
        {steps.map((step, i) => (
          <motion.div key={step.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="card" style={{ backgroundColor: 'var(--color-background)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: 24, right: 24, fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700, color: 'var(--color-surface-1)', lineHeight: 1, userSelect: 'none' }}>{step.id}</div>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245,180,25,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-md)' }}>
              <step.icon size={22} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h3 className="text-headline" style={{ color: 'var(--color-ink)', margin: '0 0 4px' }}>{step.title}</h3>
            <span className="text-eyebrow" style={{ color: 'var(--color-primary)', fontSize: '0.65rem', marginBottom: 'var(--spacing-sm)' }}>{step.tool}</span>
            <p className="text-body" style={{ color: 'var(--color-ink-muted)', margin: 0, flex: 1, fontSize: '0.9rem', lineHeight: 1.6 }}>{step.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
        style={{ textAlign: 'center', marginTop: 'var(--spacing-xxl)', color: 'var(--color-ink-quaternary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
        Scout &rarr; Researcher &rarr; Analyst &rarr; Writer &rarr; <span style={{ color: 'var(--color-success)' }}>&check; Draft Ready for Team Review</span>
      </motion.div>
    </div>
  </section>
);
