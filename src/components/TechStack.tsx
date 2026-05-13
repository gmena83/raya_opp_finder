import { motion } from 'framer-motion';
import { Workflow, Globe, Bot, FileSpreadsheet, Database, Search } from 'lucide-react';

const tools = [
  { name: 'n8n', role: 'Orchestrator', description: "Coordinates the entire pipeline \u2014 triggers on new URLs, manages the scraping \u2192 research \u2192 drafting sequence, and pushes results to Sheets.", icon: Workflow },
  { name: 'Apify', role: 'Web Scraper', description: "Handles JavaScript-heavy grant portals (Typeform, grants.gov). Renders pages, bypasses CAPTCHAs, and extracts clean Markdown.", icon: Globe },
  { name: 'Claude 3.5 Sonnet', role: 'Grant Writer', description: "Reads Raya's 50-page rulebooks without hallucinating. Drafts answers in our voice, citing specific pages and data sources.", icon: Bot },
  { name: 'Google Workspace', role: 'Team Interface', description: "Sheets track the opportunity pipeline. Drive stores downloaded rules, raw data, and final drafts for team review.", icon: FileSpreadsheet },
  { name: 'Pinecone', role: 'Company Memory', description: "Stores Raya's pitch decks, technical specs, financials, impact studies, and past winning applications as searchable vectors.", icon: Database },
  { name: 'Perplexity / Serper', role: 'Market Intel', description: "Searches for who won similar grants, what reviewers prioritize in solar/clean energy, and relevant industry news.", icon: Search },
];

export const TechStack = () => (
  <section id="tech-stack" className="section-padding" style={{ backgroundColor: 'var(--color-background)' }}>
    <div className="container-raya">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
        <div className="text-eyebrow" style={{ color: 'var(--color-ink-subtle)', marginBottom: 'var(--spacing-md)' }}>Under the Hood</div>
        <h2 className="text-display-lg" style={{ color: 'var(--color-ink)', margin: 0 }}>
          The tools powering <span style={{ color: 'var(--color-ink-muted)' }}>Raya's grant engine.</span>
        </h2>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
        {tools.map((tool, i) => (
          <motion.div key={tool.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="card" style={{ backgroundColor: 'var(--color-surface-1)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245,180,25,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-md)' }}>
              <tool.icon size={22} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.15rem', color: 'var(--color-ink)', margin: '0 0 4px' }}>{tool.name}</h3>
            <span className="text-eyebrow" style={{ fontSize: '0.6rem', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)', display: 'inline-block' }}>{tool.role}</span>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.6 }}>{tool.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
