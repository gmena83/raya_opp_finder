import { useState, useEffect, useCallback } from 'react';
import { getOpportunities, submitOpportunity, updateOpportunityStage, runManualScan, getScannerStatus } from '../services/api';
import type { Opportunity, SubmitOpportunityPayload, OpportunityStage, ScannerStatus } from '../types';

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannerStatus, setScannerStatus] = useState<ScannerStatus | null>(null);

  const fetchOpportunities = useCallback(async () => {
    const result = await getOpportunities();
    if (result.success && result.data) {
      setOpportunities(result.data);
      setError(null);
    } else {
      setError(result.error || 'Failed to fetch opportunities');
    }
    setIsLoading(false);
  }, []);

  const fetchScannerStatus = useCallback(async () => {
    const result = await getScannerStatus();
    if (result.success && result.data) {
      setScannerStatus(result.data);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
    fetchScannerStatus();
    const interval = setInterval(fetchOpportunities, 30000);
    return () => clearInterval(interval);
  }, [fetchOpportunities, fetchScannerStatus]);

  const submit = useCallback(
    async (payload: SubmitOpportunityPayload) => {
      setIsSubmitting(true);
      const result = await submitOpportunity(payload);
      setIsSubmitting(false);

      if (result.success && result.data) {
        const newOpp: Opportunity = {
          id: result.data.opportunityId,
          url: payload.url,
          name: result.data.name,
          status: result.data.status,
          type: 'federal_grant',
          source: 'manual',
          stage: 'discovered',
          relevanceScore: 0,
          tags: [],
          createdAt: new Date().toISOString(),
        };
        setOpportunities((prev) => [newOpp, ...prev]);
        return result.data;
      } else {
        setError(result.error || 'Failed to submit opportunity');
        return null;
      }
    },
    []
  );

  const updateStage = useCallback(
    async (opportunityId: string, stage: OpportunityStage) => {
      // Optimistic update
      setOpportunities((prev) =>
        prev.map((opp) =>
          opp.id === opportunityId ? { ...opp, stage, updatedAt: new Date().toISOString() } : opp
        )
      );
      const result = await updateOpportunityStage(opportunityId, stage);
      if (!result.success) {
        // Revert on failure
        fetchOpportunities();
        setError(result.error || 'Failed to update stage');
      }
    },
    [fetchOpportunities]
  );

  const triggerScan = useCallback(async () => {
    setIsScanning(true);
    if (scannerStatus) {
      setScannerStatus({ ...scannerStatus, isRunning: true });
    }
    const result = await runManualScan();
    setIsScanning(false);
    if (result.success && result.data) {
      setOpportunities((prev) => [...result.data!, ...prev]);
      if (scannerStatus) {
        setScannerStatus({
          ...scannerStatus,
          isRunning: false,
          lastScanAt: new Date().toISOString(),
          newSinceLastScan: result.data.length,
          opportunitiesFound: (scannerStatus.opportunitiesFound || 0) + result.data.length,
        });
      }
    }
    return result;
  }, [scannerStatus]);

  return {
    opportunities,
    isLoading,
    error,
    isSubmitting,
    isScanning,
    scannerStatus,
    submit,
    updateStage,
    triggerScan,
    refresh: fetchOpportunities,
  };
}
