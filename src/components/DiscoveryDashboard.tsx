import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List } from 'lucide-react';
import { useOpportunities } from '../hooks/useOpportunities';
import { useFilters } from '../hooks/useFilters';
import { PipelineMetrics } from './PipelineMetrics';
import { FilterBar } from './FilterBar';
import { DiscoveryCards } from './DiscoveryCards';
import { OpportunitiesTable } from './OpportunitiesTable';
import { ScannerStatus } from './ScannerStatus';

type ViewMode = 'cards' | 'table';

export const DiscoveryDashboard = () => {
  const { opportunities, isLoading, isScanning, scannerStatus, updateStage, triggerScan } = useOpportunities();
  const { filters, filtered, hasActiveFilters, typeCounts, stageCounts, setSearch, toggleType, toggleStage, setMinScore, setSortBy, clearFilters } = useFilters(opportunities);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  return (
    <section id="pipeline" className="section-padding" style={{ backgroundColor: 'var(--color-surface-launch)' }}>
      <div className="container-raya">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 32 }}>
          <div className="text-eyebrow" style={{ color: 'var(--color-ink-subtle)', marginBottom: 'var(--spacing-md)' }}>Grant Pipeline</div>
          <h2 className="text-display-md" style={{ color: 'var(--color-ink)', margin: 0 }}>Raya&apos;s Active Opportunities</h2>
        </motion.div>

        {/* Metrics Strip */}
        <PipelineMetrics opportunities={opportunities} />

        {/* Scanner Status */}
        <ScannerStatus status={scannerStatus} isScanning={isScanning} onRunScan={triggerScan} />

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          typeCounts={typeCounts}
          stageCounts={stageCounts}
          totalCount={opportunities.length}
          filteredCount={filtered.length}
          onSearch={setSearch}
          onToggleType={toggleType}
          onToggleStage={toggleStage}
          onSetMinScore={setMinScore}
          onSortBy={setSortBy}
          onClear={clearFilters}
        />

        {/* View Toggle */}
        <div className="view-toggle">
          <button
            className={`view-toggle__btn ${viewMode === 'cards' ? 'view-toggle__btn--active' : ''}`}
            onClick={() => setViewMode('cards')}
          >
            <LayoutGrid size={14} />
            Cards
          </button>
          <button
            className={`view-toggle__btn ${viewMode === 'table' ? 'view-toggle__btn--active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            <List size={14} />
            Table
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div style={{ padding: 64, textAlign: 'center', color: 'var(--color-ink-quaternary)', fontFamily: 'var(--font-ui)' }}>Loading pipeline...</div>
        ) : viewMode === 'cards' ? (
          <DiscoveryCards opportunities={filtered} onUpdateStage={updateStage} />
        ) : (
          <OpportunitiesTable opportunities={filtered} onUpdateStage={updateStage} />
        )}
      </div>
    </section>
  );
};
