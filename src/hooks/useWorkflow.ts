import { useState, useCallback, useRef } from 'react';
import { createMockWorkflowRun, getMockPhaseLogs } from '../services/api';
import type { WorkflowRun, PhaseStatus } from '../types';

export function useWorkflow() {
  const [workflowRun, setWorkflowRun] = useState<WorkflowRun | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [allLogs, setAllLogs] = useState<string[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cleanup = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const startWorkflow = useCallback(
    (url: string) => {
      cleanup();
      setIsRunning(true);
      setIsComplete(false);
      setAllLogs([]);

      const run = createMockWorkflowRun(`sim-${Date.now()}`);
      run.opportunityName = extractDomain(url);
      setWorkflowRun({ ...run });

      // Simulate phases sequentially
      const phaseIds = ['scout', 'researcher', 'analyst', 'writer'];
      let cumulativeDelay = 0;

      phaseIds.forEach((phaseId, phaseIndex) => {
        const logs = getMockPhaseLogs(phaseId);
        const phaseStartDelay = cumulativeDelay;

        // Set phase to running
        const t1 = setTimeout(() => {
          setWorkflowRun((prev) => {
            if (!prev) return prev;
            const phases = [...prev.phases];
            phases[phaseIndex] = {
              ...phases[phaseIndex],
              status: 'running' as PhaseStatus,
              startedAt: new Date().toISOString(),
            };
            return { ...prev, phases, currentPhaseIndex: phaseIndex };
          });
        }, phaseStartDelay);
        timeoutsRef.current.push(t1);

        // Stream logs
        logs.forEach((log, logIndex) => {
          const logDelay = phaseStartDelay + (logIndex + 1) * 600;
          const t2 = setTimeout(() => {
            const timestamp = new Date().toLocaleTimeString();
            const formattedLog = `[${timestamp}] [${phaseId.toUpperCase()}] ${log}`;
            setAllLogs((prev) => [...prev, formattedLog]);

            // Update phase logs
            setWorkflowRun((prev) => {
              if (!prev) return prev;
              const phases = [...prev.phases];
              phases[phaseIndex] = {
                ...phases[phaseIndex],
                logs: [...phases[phaseIndex].logs, log],
              };
              return { ...prev, phases };
            });
          }, logDelay);
          timeoutsRef.current.push(t2);
        });

        const phaseEndDelay = phaseStartDelay + (logs.length + 1) * 600;

        // Complete phase
        const t3 = setTimeout(() => {
          setWorkflowRun((prev) => {
            if (!prev) return prev;
            const phases = [...prev.phases];
            phases[phaseIndex] = {
              ...phases[phaseIndex],
              status: 'complete' as PhaseStatus,
              completedAt: new Date().toISOString(),
            };
            return { ...prev, phases };
          });
        }, phaseEndDelay);
        timeoutsRef.current.push(t3);

        cumulativeDelay = phaseEndDelay + 400;
      });

      // All done
      const t4 = setTimeout(() => {
        setIsRunning(false);
        setIsComplete(true);
        setWorkflowRun((prev) =>
          prev ? { ...prev, isComplete: true } : prev
        );
      }, cumulativeDelay + 500);
      timeoutsRef.current.push(t4);
    },
    [cleanup]
  );

  const resetWorkflow = useCallback(() => {
    cleanup();
    setWorkflowRun(null);
    setIsRunning(false);
    setIsComplete(false);
    setAllLogs([]);
  }, [cleanup]);

  return {
    workflowRun,
    isRunning,
    isComplete,
    allLogs,
    startWorkflow,
    resetWorkflow,
  };
}

function extractDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace('www.', '');
  } catch {
    return url.slice(0, 40);
  }
}
