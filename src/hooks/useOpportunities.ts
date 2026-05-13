import { useState, useEffect, useCallback } from 'react';
import { getOpportunities, submitOpportunity } from '../services/api';
import type { Opportunity, SubmitOpportunityPayload } from '../types';

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    fetchOpportunities();

    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchOpportunities, 30000);
    return () => clearInterval(interval);
  }, [fetchOpportunities]);

  const submit = useCallback(
    async (payload: SubmitOpportunityPayload) => {
      setIsSubmitting(true);
      const result = await submitOpportunity(payload);
      setIsSubmitting(false);

      if (result.success && result.data) {
        // Add the new opportunity to the list optimistically
        const newOpp: Opportunity = {
          id: result.data.opportunityId,
          url: payload.url,
          name: result.data.name,
          status: result.data.status,
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

  return {
    opportunities,
    isLoading,
    error,
    isSubmitting,
    submit,
    refresh: fetchOpportunities,
  };
}
