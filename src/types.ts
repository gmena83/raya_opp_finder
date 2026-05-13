// ─── Opportunity Types ───────────────────────────────────────────────

export type OpportunityStatus = 'pending' | 'processing' | 'done' | 'error';

export interface Opportunity {
  id: string;
  url: string;
  name: string;
  status: OpportunityStatus;
  driveLink?: string;
  draftLink?: string;
  createdAt: string;
  updatedAt?: string;
}

// ─── Workflow Types ──────────────────────────────────────────────────

export type PhaseStatus = 'pending' | 'running' | 'complete' | 'error';

export interface WorkflowPhase {
  id: string;
  title: string;
  tool: string;
  status: PhaseStatus;
  logs: string[];
  startedAt?: string;
  completedAt?: string;
}

export interface WorkflowRun {
  opportunityId: string;
  opportunityName: string;
  phases: WorkflowPhase[];
  currentPhaseIndex: number;
  isComplete: boolean;
}

// ─── Draft Answer Types ──────────────────────────────────────────────

export interface DraftAnswer {
  questionId: number;
  questionText: string;
  answer: string;
  source: string;
  charLimit?: number;
  charUsed?: number;
}

// ─── API Response ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── Submit Payload ──────────────────────────────────────────────────

export interface SubmitOpportunityPayload {
  url: string;
}

export interface SubmitOpportunityResponse {
  opportunityId: string;
  status: OpportunityStatus;
  name: string;
}
