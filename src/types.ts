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

// ─── Research Dossier Types ──────────────────────────────────────────

export type ResearchStatus = 'not_started' | 'in_progress' | 'complete';

export interface ResearchDossier {
  opportunityId: string;
  status: ResearchStatus;
  progress: number;
  tasks: ResearchTask[];
  documents: ResearchDocument[];
  eligibility: EligibilityCheck[];
  pastWinners: PastWinner[];
  intelligence: IntelligenceItem[];
  lastUpdated?: string;
}

export interface ResearchTask {
  id: string;
  label: string;
  tool: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  result?: string;
}

export type DocType = 'pdf' | 'xlsx' | 'md' | 'gsheet' | 'doc';
export type DocCategory = 'rules' | 'research' | 'form' | 'draft';

export interface ResearchDocument {
  id: string;
  name: string;
  type: DocType;
  category: DocCategory;
  driveUrl?: string;
  size?: string;
  addedAt: string;
}

export type EligibilityStatus = 'pass' | 'warning' | 'fail' | 'unknown';

export interface EligibilityCheck {
  criterion: string;
  status: EligibilityStatus;
  notes: string;
  source?: string;
}

export interface PastWinner {
  organization: string;
  year: number;
  awardAmount: string;
  projectSummary: string;
  relevance: string;
}

export type IntelligenceType = 'webinar' | 'news' | 'social' | 'policy';
export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface IntelligenceItem {
  type: IntelligenceType;
  title: string;
  summary: string;
  source: string;
  date: string;
  sentiment?: Sentiment;
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
