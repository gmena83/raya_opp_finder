import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

interface HeroProps {
  onOpenDemo: () => void;
}

export const Hero = ({ onOpenDemo }: HeroProps) => {
  return (
    <section
      id="hero"
      style={{
        backgroundColor: 'var(--color-background)',
        paddingTop: 160,
        paddingBottom: 'var(--spacing-section)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle amber glow */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          right: -100,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 180, 25, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-raya" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ maxWidth: 800 }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-eyebrow"
            style={{
              color: 'var(--color-ink-muted)',
              marginBottom: 'var(--spacing-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Zap size={14} style={{ color: 'var(--color-primary)' }} />
            Raya Power — Internal Grant Tool
          </motion.div>

          {/* Headline */}
          <h1
            className="text-display-xl"
            style={{
              color: 'var(--color-ink)',
              marginBottom: 'var(--spacing-lg)',
              margin: 0,
              paddingBottom: 'var(--spacing-lg)',
            }}
          >
            Find funding.{' '}
            <span style={{ color: 'var(--color-primary)' }}>Win grants.</span>{' '}
            <span style={{ color: 'var(--color-ink-muted)', fontWeight: 400 }}>
              Scale solar access.
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-body-lg"
            style={{
              color: 'var(--color-ink-muted)',
              marginBottom: 'var(--spacing-xxl)',
              maxWidth: 640,
              lineHeight: 1.6,
            }}
          >
            Paste a grant opportunity URL and let AI scrape the rules, research past winners
            in clean energy, match Raya's company knowledge, and draft
            application answers tailored to our solar pod technology and community impact mission.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary"
              onClick={onOpenDemo}
            >
              Analyze an Opportunity
              <ArrowRight size={18} />
            </motion.button>

            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-secondary"
            >
              How It Works
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{
            marginTop: 80,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 'var(--spacing-lg)',
            maxWidth: 640,
          }}
        >
          {[
            { value: '~9 hrs', label: 'Saved per application' },
            { value: '$0.52', label: 'AI cost vs $270 manual' },
            { value: '3', label: 'Grants in pipeline' },
          ].map((stat, i) => (
            <div key={i} style={{ borderLeft: '2px solid var(--color-primary)', paddingLeft: 'var(--spacing-md)' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: 'var(--color-ink)',
                  lineHeight: 1.2,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.8rem',
                  color: 'var(--color-ink-muted)',
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
