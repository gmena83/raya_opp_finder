// ─── Opportunity Types ───────────────────────────────────────────────

export type OpportunityStatus = 'pending' | 'processing' | 'done' | 'error';

export type OpportunityType =
  | 'federal_grant'
  | 'state_grant'
  | 'private_grant'
  | 'accelerator'
  | 'pitch_competition'
  | 'impact_investment'
  | 'sbir_sttr';

export type DiscoverySource =
  | 'grants_gov'
  | 'energy_gov'
  | 'usda'
  | 'sba'
  | 'sam_gov'
  | 'manual'
  | 'scanner';

export type OpportunityStage =
  | 'discovered'
  | 'reviewing'
  | 'researching'
  | 'drafting'
  | 'submitted'
  | 'awarded'
  | 'rejected'
  | 'archived';

export interface Opportunity {
  id: string;
  url: string;
  name: string;
  status: OpportunityStatus;
  type: OpportunityType;
  source: DiscoverySource;
  stage: OpportunityStage;
  relevanceScore: number;
  fundingAmount?: string;
  deadline?: string;
  eligibility?: string[];
  tags?: string[];
  matchReasons?: string[];
  assignedTo?: string;
  driveLink?: string;
  draftLink?: string;
  isArchived?: boolean;
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

// ─── Scanner Types ───────────────────────────────────────────────────

export interface ScannerStatus {
  lastScanAt: string | null;
  nextScanAt: string | null;
  isRunning: boolean;
  sourcesScanned: number;
  opportunitiesFound: number;
  newSinceLastScan: number;
}

// ─── Filter Types ────────────────────────────────────────────────────

export type SortField = 'relevance' | 'deadline' | 'date' | 'funding';
export type SortDir = 'asc' | 'desc';

export interface PipelineFilters {
  search: string;
  types: OpportunityType[];
  stages: OpportunityStage[];
  sources: DiscoverySource[];
  minScore: number;
  sortBy: SortField;
  sortDir: SortDir;
}

// ─── Pipeline Metrics ────────────────────────────────────────────────

export interface PipelineMetrics {
  totalOpportunities: number;
  totalFundingPursued: string;
  urgentDeadlines: number;
  awaitingReview: number;
  activeApplications: number;
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
