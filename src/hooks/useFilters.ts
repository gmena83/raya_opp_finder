import { useState, useMemo, useCallback } from 'react';
import type { Opportunity, PipelineFilters, OpportunityType, OpportunityStage } from '../types';

const DEFAULT_FILTERS: PipelineFilters = {
  search: '',
  types: [],
  stages: [],
  sources: [],
  minScore: 0,
  sortBy: 'relevance',
  sortDir: 'desc',
};

export function useFilters(opportunities: Opportunity[]) {
  const [filters, setFilters] = useState<PipelineFilters>(DEFAULT_FILTERS);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const toggleType = useCallback((type: OpportunityType) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  }, []);

  const toggleStage = useCallback((stage: OpportunityStage) => {
    setFilters((prev) => ({
      ...prev,
      stages: prev.stages.includes(stage)
        ? prev.stages.filter((s) => s !== stage)
        : [...prev.stages, stage],
    }));
  }, []);

  const setMinScore = useCallback((minScore: number) => {
    setFilters((prev) => ({ ...prev, minScore }));
  }, []);

  const setSortBy = useCallback((sortBy: PipelineFilters['sortBy']) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortDir: prev.sortBy === sortBy ? (prev.sortDir === 'asc' ? 'desc' : 'asc') : 'desc',
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters = filters.search !== '' || filters.types.length > 0 || filters.stages.length > 0 || filters.minScore > 0;

  const filtered = useMemo(() => {
    let result = [...opportunities];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.url.toLowerCase().includes(q) ||
          (o.tags && o.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Type filter
    if (filters.types.length > 0) {
      result = result.filter((o) => filters.types.includes(o.type));
    }

    // Stage filter
    if (filters.stages.length > 0) {
      result = result.filter((o) => filters.stages.includes(o.stage));
    }

    // Min score
    if (filters.minScore > 0) {
      result = result.filter((o) => o.relevanceScore >= filters.minScore);
    }

    // Sort
    result.sort((a, b) => {
      const dir = filters.sortDir === 'asc' ? 1 : -1;
      switch (filters.sortBy) {
        case 'relevance':
          return (b.relevanceScore - a.relevanceScore) * dir;
        case 'deadline': {
          const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
          const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
          return (da - db) * dir;
        }
        case 'date':
          return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) * dir;
        case 'funding':
          return (b.relevanceScore - a.relevanceScore) * dir; // Approximate since funding is text
        default:
          return 0;
      }
    });

    return result;
  }, [opportunities, filters]);

  // Count per type/stage for filter pills
  const typeCounts = useMemo(() => {
    const counts: Partial<Record<OpportunityType, number>> = {};
    opportunities.forEach((o) => {
      counts[o.type] = (counts[o.type] || 0) + 1;
    });
    return counts;
  }, [opportunities]);

  const stageCounts = useMemo(() => {
    const counts: Partial<Record<OpportunityStage, number>> = {};
    opportunities.forEach((o) => {
      counts[o.stage] = (counts[o.stage] || 0) + 1;
    });
    return counts;
  }, [opportunities]);

  return {
    filters,
    filtered,
    hasActiveFilters,
    typeCounts,
    stageCounts,
    setSearch,
    toggleType,
    toggleStage,
    setMinScore,
    setSortBy,
    clearFilters,
  };
}
