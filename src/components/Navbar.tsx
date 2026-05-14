import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NotificationBell } from './NotificationBell';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  onSubmitClick: () => void;
}

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Analyzer', href: '#dashboard' },
  { label: 'Pipeline', href: '#pipeline' },
  { label: 'Learning', href: '#learning' },
  { label: 'Support', href: '#support' },
  { label: 'Tech Stack', href: '#tech-stack' },
];

export const Navbar = ({ onSubmitClick }: NavbarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCenterOpen, setIsCenterOpen] = useState(false);

  return (
    <nav
      id="navbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-surface-1)',
      }}
    >
      <div className="container-raya" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src="https://rayapower.com/cdn/shop/files/Raya_Power_Horizontal_Lockup_7462482f-67e9-46bc-8f30-ce90c35e005b.svg"
            alt="Raya Power"
            style={{ height: 32 }}
          />
        </a>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)' }} className="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--color-ink-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-ink)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ink-muted)')}
            >
              {link.label}
            </a>
          ))}
          <NotificationBell onOpenCenter={() => setIsCenterOpen(true)} />
          <button className="btn-primary" onClick={onSubmitClick} style={{ padding: '10px 24px', fontSize: '0.875rem' }} id="nav-submit-btn">
            Submit Opportunity
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            color: 'var(--color-ink)',
          }}
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              overflow: 'hidden',
              backgroundColor: 'var(--color-background)',
              borderTop: '1px solid var(--color-surface-1)',
            }}
            className="mobile-menu"
          >
            <div style={{ padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: 'var(--color-ink)',
                    textDecoration: 'none',
                    padding: '12px 0',
                    borderBottom: '1px solid var(--color-surface-1)',
                  }}
                >
                  {link.label}
                </a>
              ))}
              <button
                className="btn-primary"
                onClick={() => {
                  setIsMobileOpen(false);
                  onSubmitClick();
                }}
                style={{ marginTop: 'var(--spacing-xs)' }}
              >
                Submit Opportunity
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive styles inline */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>

      <NotificationCenter isOpen={isCenterOpen} onClose={() => setIsCenterOpen(false)} />
    </nav>
  );
};
