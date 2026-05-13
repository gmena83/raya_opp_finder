import type {
  ApiResponse,
  Opportunity,
  SubmitOpportunityPayload,
  SubmitOpportunityResponse,
  WorkflowRun,
  DraftAnswer,
} from '../types';

// ─── Configuration ───────────────────────────────────────────────────

const API_MODE = import.meta.env.VITE_API_MODE || 'mock';
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

const isLiveMode = API_MODE === 'live' && N8N_WEBHOOK_URL;

// ─── Mock Data ───────────────────────────────────────────────────────

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-001',
    url: 'https://www.grants.gov/search-results-detail/351879',
    name: 'DOE Solar Access for Underserved Communities (DE-FOA-0003200)',
    status: 'done',
    driveLink: 'https://drive.google.com/drive/folders/example1',
    draftLink: 'https://docs.google.com/spreadsheets/d/example1',
    createdAt: '2026-05-10T14:30:00Z',
    updatedAt: '2026-05-10T15:45:00Z',
  },
  {
    id: 'opp-002',
    url: 'https://www.grants.gov/search-results-detail/352100',
    name: 'USDA Rural Energy for America Program (REAP)',
    status: 'processing',
    driveLink: 'https://drive.google.com/drive/folders/example2',
    createdAt: '2026-05-12T09:00:00Z',
  },
  {
    id: 'opp-003',
    url: 'https://energy.gov/eere/funding/2026-clean-energy',
    name: 'SBA Community Advantage Solar Lending Pilot',
    status: 'pending',
    createdAt: '2026-05-13T11:00:00Z',
  },
];

const MOCK_DRAFT_ANSWERS: DraftAnswer[] = [
  {
    questionId: 1,
    questionText: 'Describe your organization\'s technical innovation.',
    answer: 'Raya Power has developed a proprietary modular solar pod system that reduces installation timelines by 60% compared to traditional rooftop solar. Our technology leverages pre-fabricated micro-inverter arrays [Tech File Pg 4] that achieve 22% greater energy yield in partial-shade conditions, directly addressing the fund\'s priority for efficiency gains >20%.',
    source: 'Tech_Roadmap_2026.pdf, Pg 4',
    charLimit: 2000,
    charUsed: 412,
  },
  {
    questionId: 2,
    questionText: 'What is the expected community impact of this project?',
    answer: 'Our deployment targets underserved rural communities across 5 states, projected to bring clean energy access to 12,000+ households within 18 months [Impact Study Pg 7]. Previous deployments in similar demographics achieved a 40% reduction in energy costs for participating families.',
    source: 'Impact_Study_2025.pdf, Pg 7',
    charLimit: 1500,
    charUsed: 334,
  },
  {
    questionId: 3,
    questionText: 'Provide a detailed budget justification.',
    answer: 'Total project budget: $2.4M. Hardware (45%): $1.08M for 200 solar pod units at $5,400/unit including micro-inverters. Labor (30%): $720K covering installation crews for 18-month deployment. R&D (15%): $360K for efficiency optimization research. Admin (10%): $240K for project management and compliance reporting. [[MISSING DATA: Please verify Q4 2025 unit pricing with procurement]]',
    source: 'Financials_Q4.xlsx, Budget_Model tab',
    charLimit: 3000,
    charUsed: 452,
  },
];

// ─── Mock Workflow Simulation ────────────────────────────────────────

function createMockWorkflowRun(opportunityId: string): WorkflowRun {
  return {
    opportunityId,
    opportunityName: 'Energy Efficiency Grants DE-FOA-0003200',
    currentPhaseIndex: 0,
    isComplete: false,
    phases: [
      {
        id: 'scout',
        title: 'The Scout',
        tool: 'Apify',
        status: 'pending',
        logs: [],
      },
      {
        id: 'researcher',
        title: 'The Researcher',
        tool: 'Perplexity',
        status: 'pending',
        logs: [],
      },
      {
        id: 'analyst',
        title: 'The Analyst',
        tool: 'Pinecone (RAG)',
        status: 'pending',
        logs: [],
      },
      {
        id: 'writer',
        title: 'The Writer',
        tool: 'Claude 3.5',
        status: 'pending',
        logs: [],
      },
    ],
  };
}

const MOCK_PHASE_LOGS: Record<string, string[]> = {
  scout: [
    'Initializing Apify Website Content Crawler...',
    'Target URL validated. Rendering grants.gov page...',
    'Bypassing CAPTCHA protection...',
    'Extracting HTML content → Markdown conversion...',
    'Found attachment: DE-FOA-0003200_Full.pdf (12MB)',
    'Downloading rules PDF to Raya Grant Drive...',
    'Parsing form structure: 8 questions identified',
    '✔ Scrape complete. Files uploaded to /02_Active_Applications.',
  ],
  researcher: [
    'Perplexity Search: "DOE solar access underserved communities past winners"',
    'Result: SunTech Solutions won 2024 with micro-grid rural electrification project',
    'Perplexity Search: "DOE evaluation criteria solar + community impact 2026"',
    'Result: Priority: >20% efficiency gain, social equity, modular deployment',
    'Perplexity Search: "solar pod portable solar financing trends 2026"',
    'Result: $50M DOE fund, emphasis on rapid-deploy systems for underserved areas',
    '✔ External context aligned to Raya\'s solar pod positioning.',
  ],
  analyst: [
    'Converting form questions to vector embeddings...',
    'Querying Pinecone: "Raya solar pod technical specifications"',
    'Match: Raya_Tech_Roadmap_2026.pdf (Pod specs) — 94% relevance',
    'Match: Raya_CTO_Bio.pdf (Team credentials) — 92% relevance',
    'Querying Pinecone: "Raya community impact deployment data"',
    'Match: Raya_Impact_Study_2025.pdf — 95% relevance',
    'Querying Pinecone: "Raya financials unit economics"',
    'Match: Raya_Financials_Q4.xlsx — 90% relevance',
    '✔ Raya knowledge packet assembled.',
  ],
  writer: [
    'Assembling context: {Grant Rules} + {Market Intel} + {Raya Knowledge}',
    'Input tokens: 14,200 | Max output: 4,096',
    'Claude 3.5: Drafting Q1 — Solar Pod Technical Innovation...',
    'Claude 3.5: Drafting Q2 — Community Impact & Social Equity...',
    'Claude 3.5: Drafting Q3 — Budget Justification (200 pods)...',
    'Flagged: [[MISSING DATA]] in Q3 — need Q1 2026 unit pricing from procurement',
    'Formatting cells and applying character limits...',
    'Exporting to Raya Grant Sheets...',
    '✔ Draft complete. 3 questions answered, 1 flag for team.',
  ],
};

// ─── Helper: Delay ───────────────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── API Functions ───────────────────────────────────────────────────

/** Fetch all tracked opportunities */
export async function getOpportunities(): Promise<ApiResponse<Opportunity[]>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/opportunities`);
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  // Mock mode
  await delay(600);
  return { success: true, data: MOCK_OPPORTUNITIES };
}

/** Submit a new opportunity URL for processing */
export async function submitOpportunity(
  payload: SubmitOpportunityPayload
): Promise<ApiResponse<SubmitOpportunityResponse>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  // Mock mode
  await delay(1200);
  const newOpp: SubmitOpportunityResponse = {
    opportunityId: `opp-${Date.now()}`,
    status: 'processing',
    name: 'New Opportunity (Processing...)',
  };
  return { success: true, data: newOpp };
}

/** Get the status of a specific opportunity's workflow run */
export async function getWorkflowStatus(
  opportunityId: string
): Promise<ApiResponse<WorkflowRun>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/status/${opportunityId}`);
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  // Mock mode — returns a static snapshot
  await delay(400);
  return { success: true, data: createMockWorkflowRun(opportunityId) };
}

/** Get draft answers for a completed opportunity */
export async function getDraftAnswers(
  opportunityId: string
): Promise<ApiResponse<DraftAnswer[]>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/drafts/${opportunityId}`);
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  // Mock mode
  await delay(800);
  return { success: true, data: MOCK_DRAFT_ANSWERS };
}

/** Get mock phase logs for simulation — returns log lines with delays */
export function getMockPhaseLogs(phaseId: string): string[] {
  return MOCK_PHASE_LOGS[phaseId] || [];
}

/** Create a fresh mock workflow run */
export { createMockWorkflowRun };
