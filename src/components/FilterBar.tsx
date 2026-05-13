import { useEffect, useRef } from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import type { PipelineFilters, OpportunityType, OpportunityStage } from '../types';

const TYPE_OPTIONS: { value: OpportunityType; label: string; color: string }[] = [
  { value: 'federal_grant', label: 'Federal', color: '#1d4ed8' },
  { value: 'state_grant', label: 'State', color: '#7c3aed' },
  { value: 'private_grant', label: 'Private', color: '#059669' },
  { value: 'accelerator', label: 'Accelerator', color: '#d97706' },
  { value: 'pitch_competition', label: 'Pitch Comp', color: '#db2777' },
  { value: 'impact_investment', label: 'Investment', color: '#0891b2' },
  { value: 'sbir_sttr', label: 'SBIR', color: '#4f46e5' },
];

const STAGE_OPTIONS: { value: OpportunityStage; label: string; color: string }[] = [
  { value: 'discovered', label: 'Discovered', color: '#6b7280' },
  { value: 'reviewing', label: 'Reviewing', color: '#d97706' },
  { value: 'researching', label: 'Researching', color: '#2563eb' },
  { value: 'drafting', label: 'Drafting', color: '#7c3aed' },
  { value: 'submitted', label: 'Submitted', color: '#059669' },
  { value: 'awarded', label: 'Awarded', color: '#16a34a' },
];

const SORT_OPTIONS: { value: PipelineFilters['sortBy']; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'date', label: 'Date Added' },
  { value: 'funding', label: 'Funding' },
];

interface Props {
  filters: PipelineFilters;
  hasActiveFilters: boolean;
  typeCounts: Partial<Record<OpportunityType, number>>;
  stageCounts: Partial<Record<OpportunityStage, number>>;
  totalCount: number;
  filteredCount: number;
  onSearch: (q: string) => void;
  onToggleType: (t: OpportunityType) => void;
  onToggleStage: (s: OpportunityStage) => void;
  onSetMinScore: (n: number) => void;
  onSortBy: (s: PipelineFilters['sortBy']) => void;
  onClear: () => void;
}

export const FilterBar = ({
  filters, hasActiveFilters, typeCounts, stageCounts,
  totalCount, filteredCount,
  onSearch, onToggleType, onToggleStage, onSetMinScore, onSortBy, onClear,
}: Props) => {
  const searchRef = useRef<HTMLInputElement>(null);

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="filter-bar">
      {/* Search */}
      <div className="filter-bar__search">
        <Search size={14} style={{ color: 'var(--color-ink-quaternary)', flexShrink: 0 }} />
        <input
          ref={searchRef}
          type="text"
          placeholder="Search opportunities... (Ctrl+K)"
          value={filters.search}
          onChange={(e) => onSearch(e.target.value)}
          className="filter-bar__search-input"
        />
        {filters.search && (
          <button onClick={() => onSearch('')} className="filter-bar__clear-btn">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Type pills */}
      <div className="filter-bar__group">
        <span className="filter-bar__label">Type</span>
        <div className="filter-bar__pills">
          {TYPE_OPTIONS.map((t) => (
            <button
              key={t.value}
              onClick={() => onToggleType(t.value)}
              className={`filter-pill ${filters.types.includes(t.value) ? 'filter-pill--active' : ''}`}
              style={filters.types.includes(t.value) ? { borderColor: t.color, color: t.color, backgroundColor: `${t.color}10` } : {}}
            >
              {t.label}
              {(typeCounts[t.value] || 0) > 0 && (
                <span className="filter-pill__count">{typeCounts[t.value]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stage pills */}
      <div className="filter-bar__group">
        <span className="filter-bar__label">Stage</span>
        <div className="filter-bar__pills">
          {STAGE_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => onToggleStage(s.value)}
              className={`filter-pill ${filters.stages.includes(s.value) ? 'filter-pill--active' : ''}`}
              style={filters.stages.includes(s.value) ? { borderColor: s.color, color: s.color, backgroundColor: `${s.color}10` } : {}}
            >
              {s.label}
              {(stageCounts[s.value] || 0) > 0 && (
                <span className="filter-pill__count">{stageCounts[s.value]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Min score */}
      <div className="filter-bar__group filter-bar__group--compact">
        <span className="filter-bar__label">Min Score</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={filters.minScore}
            onChange={(e) => onSetMinScore(Number(e.target.value))}
            className="filter-bar__slider"
          />
          <span className="filter-bar__score-value">{filters.minScore > 0 ? `${filters.minScore}+` : 'Any'}</span>
        </div>
      </div>

      {/* Sort + Meta */}
      <div className="filter-bar__right">
        <div className="filter-bar__sort">
          <ArrowUpDown size={12} />
          <select
            value={filters.sortBy}
            onChange={(e) => onSortBy(e.target.value as PipelineFilters['sortBy'])}
            className="filter-bar__select"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <span className="filter-bar__count">
          {filteredCount === totalCount ? `${totalCount} opportunities` : `${filteredCount} of ${totalCount}`}
        </span>

        {hasActiveFilters && (
          <button onClick={onClear} className="filter-bar__clear-all">Clear all</button>
        )}
      </div>
    </div>
  );
};
