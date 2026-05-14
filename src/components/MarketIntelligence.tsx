import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Download, ShieldAlert, BarChart3, AlertCircle, Building2, MessageSquareWarning } from 'lucide-react';
import { mockCompanies, mockComplaints, mockPainPoints } from '../services/marketMockData';

type AppState = 'form' | 'loading' | 'dashboard';

export const MarketIntelligence = () => {
  const [appState, setAppState] = useState<AppState>('form');
  const [loadingPhase, setLoadingPhase] = useState(0);

  // Form states
  const [market, setMarket] = useState('Puerto Rico');
  const [sector, setSector] = useState('Residential Solar');
  const [goal, setGoal] = useState('Competitor Complaints & Customer Pain Points');

  const startAnalysis = () => {
    setAppState('loading');
    setLoadingPhase(1);
  };

  useEffect(() => {
    if (appState === 'loading') {
      const timers = [
        setTimeout(() => setLoadingPhase(2), 2000), // Fase 2
        setTimeout(() => setLoadingPhase(3), 4500), // Fase 3
        setTimeout(() => setLoadingPhase(4), 7000), // Fase 4
        setTimeout(() => setAppState('dashboard'), 8500) // Done
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [appState]);

  return (
    <section id="market-intel" className="section-padding" style={{ backgroundColor: 'var(--color-surface-1)' }}>
      <div className="container-raya">
        
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div className="text-eyebrow" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }}>
            <BarChart3 size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
            Market Intelligence Engine
          </div>
          <h2 className="text-display-md" style={{ color: 'var(--color-ink)', margin: 0 }}>Discover Market Pain Points</h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: 'var(--color-ink-muted)', marginTop: 8, maxWidth: 600 }}>
            Automate deep research across official registries (DACO, NEPR) and social media to find gaps in competitor offerings.
          </p>
        </div>

        {/* State 1: Form */}
        {appState === 'form' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="market-card" style={{ maxWidth: 600 }}>
            <h3 className="market-card-title">Configure Analysis</h3>
            
            <div className="market-form-group">
              <label>Target Region</label>
              <input type="text" value={market} onChange={(e) => setMarket(e.target.value)} className="market-input" />
            </div>

            <div className="market-form-group">
              <label>Sector Focus</label>
              <select value={sector} onChange={(e) => setSector(e.target.value)} className="market-input">
                <option>Residential Solar</option>
                <option>Commercial & Industrial (C&I)</option>
                <option>Utility Scale</option>
                <option>Energy Storage</option>
              </select>
            </div>

            <div className="market-form-group">
              <label>Primary Intelligence Goal</label>
              <select value={goal} onChange={(e) => setGoal(e.target.value)} className="market-input">
                <option>Competitor Complaints & Customer Pain Points</option>
                <option>Pricing Models & Market Share</option>
                <option>Regulatory Violations</option>
              </select>
            </div>

            <button onClick={startAnalysis} className="btn-primary" style={{ width: '100%', marginTop: 20 }}>
              <Search size={16} /> Run Activepieces Analysis
            </button>
          </motion.div>
        )}

        {/* State 2: Loading Simulation */}
        {appState === 'loading' && (
          <div className="market-loading-container">
            <Loader2 size={48} className="spin" style={{ color: 'var(--color-primary)', marginBottom: 24 }} />
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Running Orchestration...</h3>
            
            <div className="loading-phases">
              <div className={`phase-item ${loadingPhase >= 1 ? 'active' : ''} ${loadingPhase > 1 ? 'done' : ''}`}>
                <div className="phase-indicator"></div>
                <span><strong>Fase 1:</strong> Construyendo universo de empresas solares en PR...</span>
              </div>
              <div className={`phase-item ${loadingPhase >= 2 ? 'active' : ''} ${loadingPhase > 2 ? 'done' : ''}`}>
                <div className="phase-indicator"></div>
                <span><strong>Fase 2:</strong> Extrayendo querellas oficiales (DACO, NEPR, SUMAC)...</span>
              </div>
              <div className={`phase-item ${loadingPhase >= 3 ? 'active' : ''} ${loadingPhase > 3 ? 'done' : ''}`}>
                <div className="phase-indicator"></div>
                <span><strong>Fase 3:</strong> Analizando sentimiento en Google Reviews y Reddit...</span>
              </div>
              <div className={`phase-item ${loadingPhase >= 4 ? 'active' : ''} ${loadingPhase > 4 ? 'done' : ''}`}>
                <div className="phase-indicator"></div>
                <span><strong>Fase 4:</strong> Sintetizando reporte de confiabilidad y pain points...</span>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Dashboard */}
        {appState === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="market-dashboard">
            
            {/* Top Stats */}
            <div className="market-stats-grid">
              <div className="market-stat-card">
                <Building2 size={20} className="stat-icon" />
                <div className="stat-value">34</div>
                <div className="stat-label">Empresas Analizadas</div>
              </div>
              <div className="market-stat-card">
                <ShieldAlert size={20} className="stat-icon" style={{ color: '#dc2626' }} />
                <div className="stat-value">678</div>
                <div className="stat-label">Querellas Oficiales (DACO/NEPR)</div>
              </div>
              <div className="market-stat-card">
                <MessageSquareWarning size={20} className="stat-icon" style={{ color: '#d97706' }} />
                <div className="stat-value">1,204</div>
                <div className="stat-label">Menciones Negativas (Redes)</div>
              </div>
            </div>

            <div className="market-grid-main">
              {/* Left Column */}
              <div className="market-column-left">
                
                {/* Executive Summary */}
                <div className="market-card">
                  <h3 className="market-card-title">Resumen Ejecutivo</h3>
                  <div className="exec-summary-content">
                    <p><strong>Mercado:</strong> {market} | <strong>Sector:</strong> {sector}</p>
                    <p>La principal área de oportunidad para <strong>Raya Power</strong> radica en la insatisfacción post-venta. El 42% de las quejas formales en el NEPR se deben a demoras en la certificación de LUMA. Sunnova lidera en volumen de instalaciones, pero presenta un severo problema de relaciones públicas por prácticas de leasing.</p>
                    <p><strong>Recomendación Raya:</strong> Enfatizar transparencia en contratos y garantizar soporte técnico local post-instalación en las propuestas comerciales.</p>
                  </div>
                </div>

                {/* Reliability Leaderboard */}
                <div className="market-card">
                  <h3 className="market-card-title">Ranking de Confiabilidad (Top 5)</h3>
                  <table className="market-table">
                    <thead>
                      <tr>
                        <th>Empresa</th>
                        <th>Score (1-100)</th>
                        <th>Querellas</th>
                        <th>Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockCompanies.sort((a,b) => b.reliabilityScore - a.reliabilityScore).map(company => (
                        <tr key={company.id}>
                          <td style={{ fontWeight: 600 }}>{company.name}</td>
                          <td>
                            <div className={`score-badge ${company.reliabilityScore > 80 ? 'good' : company.reliabilityScore > 60 ? 'warn' : 'bad'}`}>
                              {company.reliabilityScore}
                            </div>
                          </td>
                          <td>{company.officialComplaints}</td>
                          <td>{company.marketShare}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Right Column */}
              <div className="market-column-right">
                
                {/* Top Pain Points */}
                <div className="market-card">
                  <h3 className="market-card-title">Top Pain Points del Cliente</h3>
                  <div className="pain-points-list">
                    {mockPainPoints.map((pp, idx) => (
                      <div key={idx} className="pain-point-item">
                        <div className="pain-point-header">
                          <span className="pain-point-topic">{pp.topic}</span>
                          <span className="pain-point-pct">{pp.percentage}%</span>
                        </div>
                        <div className="pain-point-bar-bg">
                          <div 
                            className="pain-point-bar-fill" 
                            style={{ 
                              width: `${pp.percentage}%`,
                              backgroundColor: pp.severity === 'Critical' ? '#dc2626' : pp.severity === 'High' ? '#ea580c' : '#f5b419'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Complaint Feed */}
                <div className="market-card">
                  <h3 className="market-card-title">Querellas Recientes Extraídas</h3>
                  <div className="complaint-feed">
                    {mockComplaints.map(comp => (
                      <div key={comp.id} className="complaint-card">
                        <div className="complaint-header">
                          <span className="complaint-company">{comp.companyName}</span>
                          <span className="complaint-source">{comp.source}</span>
                        </div>
                        <p className="complaint-summary">"{comp.summary}"</p>
                        <div className="complaint-footer">
                          <span className="complaint-date">{comp.date}</span>
                          <span className={`complaint-type ${comp.urgency.toLowerCase()}`}>
                            <AlertCircle size={10} style={{ display: 'inline', marginRight: 4 }} />
                            {comp.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Export Actions */}
            <div className="market-actions">
              <button className="btn-secondary" onClick={() => alert('Mockup: Downloading solar_companies_pr.csv')}>
                <Download size={14} /> solar_companies_pr.csv
              </button>
              <button className="btn-secondary" onClick={() => alert('Mockup: Downloading complaints_official.csv')}>
                <Download size={14} /> complaints_official.csv
              </button>
              <button className="btn-secondary" onClick={() => alert('Mockup: Downloading sentiment_social.csv')}>
                <Download size={14} /> sentiment_social.csv
              </button>
              <button className="btn-secondary" onClick={() => setAppState('form')} style={{ marginLeft: 'auto' }}>
                <Search size={14} /> New Research
              </button>
            </div>

          </motion.div>
        )}
      </div>
    </section>
  );
};
