export const Footer = () => (
  <footer style={{ backgroundColor: 'var(--color-canvas)', padding: 'var(--spacing-xxl) 0' }}>
    <div className="container-raya" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
      <img
        src="https://rayapower.com/cdn/shop/files/Raya_Power_Horizontal_Lockup_Light_mode.svg"
        alt="Raya Power"
        style={{ height: 28, opacity: 0.8 }}
      />
      <div style={{ display: 'flex', gap: 'var(--spacing-xl)', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: 'rayapower.com', href: 'https://rayapower.com' },
          { label: 'Grant Drive', href: '#' },
          { label: 'Master Sheet', href: '#' },
        ].map((link) => (
          <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-ink-quaternary)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-ink-inverse)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ink-quaternary)')}>
            {link.label}
          </a>
        ))}
      </div>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-ink-quaternary)', opacity: 0.6 }}>
        Internal tool · Raya Power © {new Date().getFullYear()}
      </div>
    </div>
  </footer>
);
