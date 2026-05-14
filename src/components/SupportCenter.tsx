import React from 'react';
import { PlayCircle, FileText, Mail, BookOpen } from 'lucide-react';

export const SupportCenter: React.FC = () => {
  return (
    <section id="support" className="support-section">
      <div className="section-header">
        <div className="section-eyebrow">
          <BookOpen size={14} className="eyebrow-icon" />
          TRAINING & SUPPORT
        </div>
        <h2 className="section-title">Master the Platform</h2>
        <p className="section-subtitle">
          Everything you need to onboard your team, maximize your win rate, and get help when you need it.
        </p>
      </div>

      <div className="support-grid">
        <div className="support-main">
          <h3 className="support-section-title">Video Walkthroughs</h3>
          <div className="video-grid">
            
            <div className="video-card">
              <div className="video-wrapper">
                <img src="/media/recording_01_phase1_discovery.webp" alt="Phase 1 Demo" className="video-preview" />
                <div className="video-play-overlay">
                  <PlayCircle size={48} />
                </div>
              </div>
              <div className="video-info">
                <span className="video-badge">Phase 1</span>
                <h4>Discovery Engine</h4>
                <p>Learn how to navigate the pipeline, filter opportunities, and use the automated scanner.</p>
              </div>
            </div>

            <div className="video-card">
              <div className="video-wrapper">
                <img src="/media/recording_02_phase2_3_research_drafting.webp" alt="Phase 2 & 3 Demo" className="video-preview" />
                <div className="video-play-overlay">
                  <PlayCircle size={48} />
                </div>
              </div>
              <div className="video-info">
                <span className="video-badge">Phase 2 & 3</span>
                <h4>Research & Drafting</h4>
                <p>Deep dive into document extraction, eligibility checks, and AI-assisted proposal writing.</p>
              </div>
            </div>

            <div className="video-card">
              <div className="video-wrapper">
                <img src="/media/recording_04_notifications.webp" alt="Phase 4 Demo" className="video-preview" />
                <div className="video-play-overlay">
                  <PlayCircle size={48} />
                </div>
              </div>
              <div className="video-info">
                <span className="video-badge">Phase 4</span>
                <h4>Proactive CRM</h4>
                <p>Master the notification center, deadline tracking, and team activity feeds.</p>
              </div>
            </div>

            <div className="video-card">
              <div className="video-wrapper">
                <img src="/media/recording_05_learning_loop.webp" alt="Phase 5 Demo" className="video-preview" />
                <div className="video-play-overlay">
                  <PlayCircle size={48} />
                </div>
              </div>
              <div className="video-info">
                <span className="video-badge">Phase 5</span>
                <h4>The Learning Loop</h4>
                <p>Track outcomes, extract winning styles, and watch the AI intelligence grow.</p>
              </div>
            </div>

          </div>
        </div>

        <div className="support-sidebar">
          <div className="support-card manual-card">
            <div className="support-card-icon">
              <FileText size={24} />
            </div>
            <h3>User Manual</h3>
            <p>Comprehensive written documentation covering all features, troubleshooting, and best practices for the Raya platform.</p>
            <button className="support-action-btn" disabled>
              Download PDF (Coming Soon)
            </button>
          </div>

          <div className="support-card menatech-card">
            <div className="menatech-branding">
              <img src="/media/menatech_logo.png" alt="Menatech" className="menatech-logo" />
              <div className="menatech-text">
                <span className="menatech-label">BUILT BY</span>
                <span className="menatech-name">Menatech</span>
              </div>
            </div>
            <p className="menatech-desc">
              We build intelligent systems that scale your impact. For technical support, feature requests, or platform training, reach out to your dedicated Menatech lead.
            </p>
            <a href="mailto:support@menatech.co" className="support-action-btn menatech-btn">
              <Mail size={16} /> Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
