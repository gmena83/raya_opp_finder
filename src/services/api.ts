import type {
  ApiResponse,
  Opportunity,
  OpportunityStage,
  SubmitOpportunityPayload,
  SubmitOpportunityResponse,
  WorkflowRun,
  DraftAnswer,
  ScannerStatus,
  ResearchDossier,
  ApplicationDraft,
  CoverLetterTemplate,
  AppNotification,
  ActivityEvent,
  KnowledgeDocument,
  KnowledgeBaseStats,
  ApplicationOutcome,
  OutcomeResult,
  StyleInsight,
  FeedbackDiff,
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
    type: 'federal_grant',
    source: 'grants_gov',
    stage: 'drafting',
    relevanceScore: 94,
    fundingAmount: '$250K–$2M',
    deadline: '2026-06-30T23:59:00Z',
    tags: ['solar', 'community impact', 'DOE', 'energy equity'],
    matchReasons: ['Modular solar systems for renters', 'Underserved community focus aligns with Raya Empower Fund'],
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
    type: 'federal_grant',
    source: 'usda',
    stage: 'researching',
    relevanceScore: 87,
    fundingAmount: '$20K–$1M',
    deadline: '2026-07-15T23:59:00Z',
    tags: ['rural energy', 'USDA', 'renewable', 'small business'],
    matchReasons: ['Rural deployment model fits Raya pod portability', 'Small business energy efficiency focus'],
    driveLink: 'https://drive.google.com/drive/folders/example2',
    createdAt: '2026-05-12T09:00:00Z',
  },
  {
    id: 'opp-003',
    url: 'https://energy.gov/eere/funding/2026-clean-energy',
    name: 'SBA Community Advantage Solar Lending Pilot',
    status: 'pending',
    type: 'state_grant',
    source: 'sba',
    stage: 'reviewing',
    relevanceScore: 72,
    fundingAmount: '$50K–$500K',
    deadline: '2026-08-01T23:59:00Z',
    tags: ['SBA', 'lending', 'solar financing', 'community'],
    matchReasons: ['Solar lending aligns with Raya financing model', 'Community advantage program'],
    createdAt: '2026-05-13T11:00:00Z',
  },
  {
    id: 'opp-004',
    url: 'https://www.elementalexcelerator.com/apply',
    name: 'Elemental Excelerator — Climate Tech Cohort 2027',
    status: 'pending',
    type: 'accelerator',
    source: 'scanner',
    stage: 'discovered',
    relevanceScore: 91,
    fundingAmount: '$100K–$1M',
    deadline: '2026-06-15T23:59:00Z',
    tags: ['accelerator', 'climate tech', 'equity', 'deployment'],
    matchReasons: ['Focus on deployment-ready climate solutions', 'Equity-centered energy access', 'Past winners include modular solar companies'],
    createdAt: '2026-05-13T08:00:00Z',
  },
  {
    id: 'opp-005',
    url: 'https://www.grants.gov/search-results-detail/353200',
    name: 'DOE SBIR Phase I — Resilient Distributed Energy Systems',
    status: 'pending',
    type: 'sbir_sttr',
    source: 'grants_gov',
    stage: 'discovered',
    relevanceScore: 83,
    fundingAmount: '$200K',
    deadline: '2026-09-10T23:59:00Z',
    tags: ['SBIR', 'DOE', 'resilience', 'distributed energy', 'R&D'],
    matchReasons: ['Hurricane-resilient solar pod design', 'Distributed energy + battery storage innovation'],
    createdAt: '2026-05-13T08:15:00Z',
  },
  {
    id: 'opp-006',
    url: 'https://cleanenergytrust.org/challenge-2026',
    name: 'Clean Energy Trust Challenge — Midwest',
    status: 'pending',
    type: 'pitch_competition',
    source: 'scanner',
    stage: 'discovered',
    relevanceScore: 65,
    fundingAmount: '$50K–$150K',
    deadline: '2026-07-01T23:59:00Z',
    tags: ['pitch competition', 'midwest', 'clean energy', 'startup'],
    matchReasons: ['Clean energy startup competition', 'Prior winners in modular/portable energy'],
    createdAt: '2026-05-13T08:30:00Z',
  },
  {
    id: 'opp-007',
    url: 'https://www.greentown.org/climatetech-catalyst',
    name: 'Greentown Labs — Climatetech Catalyst Grant',
    status: 'pending',
    type: 'private_grant',
    source: 'scanner',
    stage: 'discovered',
    relevanceScore: 78,
    fundingAmount: '$25K–$75K',
    deadline: '2026-08-15T23:59:00Z',
    tags: ['private grant', 'climatetech', 'hardware', 'incubator'],
    matchReasons: ['Hardware-focused climate grants', 'Past winners include distributed energy startups'],
    createdAt: '2026-05-13T09:00:00Z',
  },
  {
    id: 'opp-008',
    url: 'https://www.impactassets.org/emerging-managers',
    name: 'ImpactAssets Emerging Managers — Climate Equity Fund',
    status: 'pending',
    type: 'impact_investment',
    source: 'scanner',
    stage: 'discovered',
    relevanceScore: 70,
    fundingAmount: '$500K–$5M',
    deadline: '2026-10-01T23:59:00Z',
    tags: ['impact investment', 'climate equity', 'series seed', 'ESG'],
    matchReasons: ['Climate equity focus matches Raya Empower Fund', 'Seed-stage clean energy investments'],
    createdAt: '2026-05-13T09:15:00Z',
  },
  {
    id: 'opp-009',
    url: 'https://www.nrel.gov/innovation/incubator.html',
    name: 'NREL Industry Growth Forum — Solar Innovation Track',
    status: 'pending',
    type: 'accelerator',
    source: 'energy_gov',
    stage: 'reviewing',
    relevanceScore: 88,
    fundingAmount: '$150K',
    deadline: '2026-06-20T23:59:00Z',
    tags: ['NREL', 'solar', 'innovation', 'government'],
    matchReasons: ['NREL solar innovation track', 'Modular/portable solar category', 'Government-backed credibility'],
    createdAt: '2026-05-11T10:00:00Z',
  },
  {
    id: 'opp-010',
    url: 'https://sam.gov/opp/abc123/view',
    name: 'HUD Community Development Block Grant — Energy Resilience',
    status: 'pending',
    type: 'federal_grant',
    source: 'sam_gov',
    stage: 'discovered',
    relevanceScore: 76,
    fundingAmount: '$100K–$750K',
    deadline: '2026-07-30T23:59:00Z',
    tags: ['HUD', 'CDBG', 'resilience', 'community development'],
    matchReasons: ['Community energy resilience funding', 'Hurricane-proof solar pods', 'Low-income housing compatibility'],
    createdAt: '2026-05-13T09:30:00Z',
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

// ─── Scanner API ─────────────────────────────────────────────────────

const MOCK_SCANNER_STATUS: ScannerStatus = {
  lastScanAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  nextScanAt: getNextMonday9AM(),
  isRunning: false,
  sourcesScanned: 6,
  opportunitiesFound: 10,
  newSinceLastScan: 4,
};

function getNextMonday9AM(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = (8 - day) % 7 || 7;
  d.setDate(d.getDate() + diff);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

/** Get the current scanner status */
export async function getScannerStatus(): Promise<ApiResponse<ScannerStatus>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/scanner/status`);
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
  await delay(300);
  return { success: true, data: { ...MOCK_SCANNER_STATUS } };
}

/** Trigger a manual scan */
export async function runManualScan(): Promise<ApiResponse<Opportunity[]>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/scanner/run`, { method: 'POST' });
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
  // Mock: simulate finding 2 new opportunities
  await delay(3000);
  const newOpps: Opportunity[] = [
    {
      id: `opp-scan-${Date.now()}-1`,
      url: 'https://www.grants.gov/search-results-detail/' + Math.floor(Math.random() * 99999),
      name: 'DOE Grid Modernization — Distributed Solar Storage',
      status: 'pending',
      type: 'federal_grant',
      source: 'scanner',
      stage: 'discovered',
      relevanceScore: Math.floor(70 + Math.random() * 25),
      fundingAmount: '$100K–$500K',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['DOE', 'grid modernization', 'storage', 'distributed'],
      matchReasons: ['Battery storage integration matches Raya pod design', 'Grid modernization priorities'],
      createdAt: new Date().toISOString(),
    },
    {
      id: `opp-scan-${Date.now()}-2`,
      url: 'https://www.sba.gov/funding-programs/grants/solar-' + Math.floor(Math.random() * 999),
      name: 'SBA Emerging Leaders — Clean Energy Entrepreneurship',
      status: 'pending',
      type: 'accelerator',
      source: 'scanner',
      stage: 'discovered',
      relevanceScore: Math.floor(65 + Math.random() * 20),
      fundingAmount: '$10K–$50K',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['SBA', 'emerging leaders', 'entrepreneurship', 'clean energy'],
      matchReasons: ['Clean energy startup focus', 'Business development resources'],
      createdAt: new Date().toISOString(),
    },
  ];
  return { success: true, data: newOpps };
}

/** Update the stage of an opportunity */
export async function updateOpportunityStage(
  opportunityId: string,
  stage: OpportunityStage
): Promise<ApiResponse<{ id: string; stage: OpportunityStage }>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/opportunities/${opportunityId}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
      });
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
  await delay(400);
  return { success: true, data: { id: opportunityId, stage } };
}

// ─── Research Dossier API ───────────────────────────────────────────────

const MOCK_DOSSIERS: Record<string, ResearchDossier> = {
  'opp-001': {
    opportunityId: 'opp-001',
    status: 'complete',
    progress: 100,
    lastUpdated: '2026-05-12T16:30:00Z',
    tasks: [
      { id: 'rt-1', label: 'Scrape NOFO rules and attachments', tool: 'Apify', status: 'complete', result: '3 documents downloaded' },
      { id: 'rt-2', label: 'Search past winners and awardees', tool: 'Perplexity', status: 'complete', result: '4 past winners found' },
      { id: 'rt-3', label: 'Scan for webinars and info sessions', tool: 'Serper', status: 'complete', result: '2 webinar recordings found' },
      { id: 'rt-4', label: 'Check recent news and policy context', tool: 'Serper', status: 'complete', result: '3 relevant articles found' },
      { id: 'rt-5', label: 'Run eligibility analysis against Raya profile', tool: 'Claude', status: 'complete', result: '4 of 5 criteria met' },
    ],
    documents: [
      { id: 'doc-1', name: 'NOFO_DE-FOA-0003200.pdf', type: 'pdf', category: 'rules', size: '12.4 MB', driveUrl: 'https://drive.google.com/file/d/example1', addedAt: '2026-05-10T14:30:00Z' },
      { id: 'doc-2', name: 'Evaluation_Criteria.pdf', type: 'pdf', category: 'rules', size: '2.1 MB', driveUrl: 'https://drive.google.com/file/d/example2', addedAt: '2026-05-10T14:35:00Z' },
      { id: 'doc-3', name: 'Budget_Template.xlsx', type: 'xlsx', category: 'rules', size: '340 KB', driveUrl: 'https://drive.google.com/file/d/example3', addedAt: '2026-05-10T14:40:00Z' },
      { id: 'doc-4', name: 'Past_Winners_Analysis.md', type: 'md', category: 'research', size: '28 KB', driveUrl: 'https://drive.google.com/file/d/example4', addedAt: '2026-05-11T09:00:00Z' },
      { id: 'doc-5', name: 'Webinar_Notes.md', type: 'md', category: 'research', size: '15 KB', driveUrl: 'https://drive.google.com/file/d/example5', addedAt: '2026-05-11T11:00:00Z' },
      { id: 'doc-6', name: 'Eligibility_Check.md', type: 'md', category: 'research', size: '8 KB', driveUrl: 'https://drive.google.com/file/d/example6', addedAt: '2026-05-12T10:00:00Z' },
      { id: 'doc-7', name: 'Raw_Form_Data.md', type: 'md', category: 'form', size: '12 KB', driveUrl: 'https://drive.google.com/file/d/example7', addedAt: '2026-05-10T15:00:00Z' },
    ],
    eligibility: [
      { criterion: 'Small business (SBA definition: <500 employees)', status: 'pass', notes: 'Raya Power has 12 employees. Well within SBA small business threshold.', source: 'NOFO Section 3.1' },
      { criterion: 'Minority-owned or disadvantaged business', status: 'pass', notes: 'Raya Power qualifies as a minority-owned business (certified MBE).', source: 'NOFO Section 3.1.2' },
      { criterion: 'Annual revenue under $5M for previous 3 years', status: 'warning', notes: 'Raya 2025 revenue was $4.2M, approaching the $5M cap. 2026 projections may exceed threshold if Q3-Q4 targets are met.', source: 'NOFO Section 3.2' },
      { criterion: 'Must operate in eligible geographic region (all 50 states)', status: 'pass', notes: 'Raya operates in Florida, Texas, Puerto Rico, and California. All are eligible regions.', source: 'NOFO Section 3.3' },
      { criterion: 'Minimum 5 years in operation', status: 'fail', notes: 'Raya Power was founded in 2023 (3 years). This criterion requires 5 years. Consider partnering with an established organization or requesting a waiver.', source: 'NOFO Section 3.4' },
    ],
    pastWinners: [
      { organization: 'SunTech Community Solar', year: 2024, awardAmount: '$1.8M', projectSummary: 'Deployed community solar gardens in 12 underserved neighborhoods across Ohio and Michigan. Used micro-grid technology for apartment complexes.', relevance: 'Similar modular deployment model to Raya pods. Their micro-grid approach is comparable to our VPP architecture.' },
      { organization: 'BrightPath Energy Equity', year: 2024, awardAmount: '$950K', projectSummary: 'Developed solar lease financing program for renters in public housing. Partnered with 3 housing authorities.', relevance: 'Renter-focused solar model closely mirrors Raya Empower Fund. Their housing authority partnerships could be replicated.' },
      { organization: 'Resilient Power Systems', year: 2023, awardAmount: '$2.1M', projectSummary: 'Built hurricane-resilient solar + battery systems for critical infrastructure in coastal communities.', relevance: 'Hurricane resilience is a direct Raya pod selling point. Their coastal deployment strategy applies to our FL and PR markets.' },
      { organization: 'GreenBridge Solar Cooperative', year: 2023, awardAmount: '$1.2M', projectSummary: 'Created worker-owned solar installation cooperative serving rural Appalachian communities.', relevance: 'Community ownership model aligns with Raya equity mission. Their cooperative structure could complement our pod leasing model.' },
    ],
    intelligence: [
      { type: 'webinar', title: 'DOE Solar Access Program — Applicant Info Session', summary: 'Key takeaway: Evaluators will prioritize applications demonstrating >20% cost reduction for end users. They specifically mentioned modular and portable solar as an area of interest. Q&A revealed that partnerships with housing authorities carry significant weight.', source: 'DOE EERE YouTube', date: '2026-04-15', sentiment: 'positive' },
      { type: 'news', title: 'DOE Announces $200M Expansion of Solar Access Fund', summary: 'The DOE increased the Solar Access for Underserved Communities fund by $200M following strong Congressional support. This signals growing federal commitment to equity-focused solar programs and may reduce competition intensity per applicant.', source: 'Energy.gov Press Release', date: '2026-05-01', sentiment: 'positive' },
      { type: 'policy', title: 'IRA Tax Credit Extension for Community Solar Projects', summary: 'The Inflation Reduction Act tax credits have been extended through 2030 for community solar projects. This strengthens the financial viability argument in applications and may be cited as co-funding leverage.', source: 'Congressional Budget Office', date: '2026-04-28', sentiment: 'positive' },
      { type: 'social', title: 'DOE Program Director highlights equity metrics in recent talk', summary: 'Dr. Sarah Chen (DOE EERE) emphasized in a LinkedIn post that 2026 applications will be scored heavily on measurable equity outcomes, not just deployment volume. She mentioned "energy cost burden reduction" as the top metric.', source: 'LinkedIn', date: '2026-05-05', sentiment: 'neutral' },
    ],
  },
  'opp-002': {
    opportunityId: 'opp-002',
    status: 'in_progress',
    progress: 60,
    lastUpdated: '2026-05-13T10:00:00Z',
    tasks: [
      { id: 'rt-1', label: 'Scrape REAP application guidelines', tool: 'Apify', status: 'complete', result: '2 documents downloaded' },
      { id: 'rt-2', label: 'Search past REAP awardees in solar', tool: 'Perplexity', status: 'complete', result: '3 past winners found' },
      { id: 'rt-3', label: 'Scan for REAP webinars and trainings', tool: 'Serper', status: 'running' },
      { id: 'rt-4', label: 'Check USDA policy updates and budget news', tool: 'Serper', status: 'pending' },
      { id: 'rt-5', label: 'Run eligibility analysis for REAP criteria', tool: 'Claude', status: 'pending' },
    ],
    documents: [
      { id: 'doc-1', name: 'REAP_Program_Guidelines_2026.pdf', type: 'pdf', category: 'rules', size: '8.7 MB', driveUrl: 'https://drive.google.com/file/d/reap1', addedAt: '2026-05-12T09:30:00Z' },
      { id: 'doc-2', name: 'REAP_Application_Form.pdf', type: 'pdf', category: 'form', size: '1.3 MB', driveUrl: 'https://drive.google.com/file/d/reap2', addedAt: '2026-05-12T09:35:00Z' },
      { id: 'doc-3', name: 'Past_REAP_Winners_Solar.md', type: 'md', category: 'research', size: '18 KB', driveUrl: 'https://drive.google.com/file/d/reap3', addedAt: '2026-05-13T08:00:00Z' },
    ],
    eligibility: [
      { criterion: 'Located in rural area (population <50,000)', status: 'pass', notes: 'Raya deployment targets in rural FL and TX qualify under USDA rural definitions.', source: 'REAP Guidelines Sec 2.1' },
      { criterion: 'Agricultural producer or rural small business', status: 'pass', notes: 'Raya qualifies as a rural small business serving agricultural communities.', source: 'REAP Guidelines Sec 2.2' },
      { criterion: 'Project must demonstrate energy savings or renewable generation', status: 'pass', notes: 'Solar pod system directly generates renewable energy. Average 8.5 kW per pod.', source: 'REAP Guidelines Sec 2.3' },
    ],
    pastWinners: [
      { organization: 'Plains Solar Cooperative', year: 2025, awardAmount: '$480K', projectSummary: 'Installed solar arrays on 45 rural farms in Nebraska and Kansas, reducing energy costs by 35%.', relevance: 'Rural deployment model similar to Raya. Their cost reduction metrics can serve as benchmarks for our application.' },
      { organization: 'Gulf Coast Renewables', year: 2024, awardAmount: '$720K', projectSummary: 'Solar + battery systems for rural agricultural operations in Louisiana and Mississippi.', relevance: 'Gulf coast geography overlaps with Raya FL/TX markets. Their hurricane resilience data is directly applicable.' },
    ],
    intelligence: [
      { type: 'news', title: 'USDA Increases REAP Funding by 40% for FY2026', summary: 'The USDA Rural Development office announced a significant increase in REAP funding, bringing the total to $300M for FY2026. Priority areas include solar for rural communities and resilience projects.', source: 'USDA.gov', date: '2026-04-20', sentiment: 'positive' },
      { type: 'webinar', title: 'REAP Application Workshop — Southeast Region', summary: 'USDA regional office emphasized that applications with community co-benefits (job creation, education) score 15-20 points higher than pure energy projects.', source: 'USDA REAP Webinar Series', date: '2026-05-08', sentiment: 'positive' },
    ],
  },
  'opp-004': {
    opportunityId: 'opp-004',
    status: 'not_started',
    progress: 0,
    tasks: [
      { id: 'rt-1', label: 'Scrape Elemental Excelerator application page', tool: 'Apify', status: 'pending' },
      { id: 'rt-2', label: 'Research past Elemental cohort companies', tool: 'Perplexity', status: 'pending' },
      { id: 'rt-3', label: 'Find demo day recordings and interviews', tool: 'Serper', status: 'pending' },
      { id: 'rt-4', label: 'Check Elemental\'s investment thesis and focus areas', tool: 'Serper', status: 'pending' },
      { id: 'rt-5', label: 'Run fit analysis against Elemental criteria', tool: 'Claude', status: 'pending' },
    ],
    documents: [],
    eligibility: [],
    pastWinners: [],
    intelligence: [],
  },
};

/** Get research dossier for an opportunity */
export async function getResearchDossier(opportunityId: string): Promise<ApiResponse<ResearchDossier>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/research/${opportunityId}`);
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
  await delay(500);
  const dossier = MOCK_DOSSIERS[opportunityId];
  if (dossier) {
    return { success: true, data: { ...dossier } };
  }
  // Return empty dossier for opportunities without mock data
  return {
    success: true,
    data: {
      opportunityId,
      status: 'not_started',
      progress: 0,
      tasks: [
        { id: 'rt-1', label: 'Scrape application documents', tool: 'Apify', status: 'pending' },
        { id: 'rt-2', label: 'Research past winners', tool: 'Perplexity', status: 'pending' },
        { id: 'rt-3', label: 'Scan for webinars and media', tool: 'Serper', status: 'pending' },
        { id: 'rt-4', label: 'Check news and policy context', tool: 'Serper', status: 'pending' },
        { id: 'rt-5', label: 'Run eligibility analysis', tool: 'Claude', status: 'pending' },
      ],
      documents: [],
      eligibility: [],
      pastWinners: [],
      intelligence: [],
    },
  };
}

/** Start research for an opportunity (mock: simulates task completion) */
export async function startResearch(opportunityId: string): Promise<ApiResponse<ResearchDossier>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/research/${opportunityId}/start`, { method: 'POST' });
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
  // Mock: return the existing dossier or a simulated in-progress one
  await delay(800);
  const existing = MOCK_DOSSIERS[opportunityId];
  if (existing) {
    return { success: true, data: { ...existing, status: 'in_progress' } };
  }
  return {
    success: true,
    data: {
      opportunityId,
      status: 'in_progress',
      progress: 20,
      tasks: [
        { id: 'rt-1', label: 'Scrape application documents', tool: 'Apify', status: 'running' },
        { id: 'rt-2', label: 'Research past winners', tool: 'Perplexity', status: 'pending' },
        { id: 'rt-3', label: 'Scan for webinars and media', tool: 'Serper', status: 'pending' },
        { id: 'rt-4', label: 'Check news and policy context', tool: 'Serper', status: 'pending' },
        { id: 'rt-5', label: 'Run eligibility analysis', tool: 'Claude', status: 'pending' },
      ],
      documents: [],
      eligibility: [],
      pastWinners: [],
      intelligence: [],
      lastUpdated: new Date().toISOString(),
    },
  };
}

// ─── Application Draft API ──────────────────────────────────────────────



const MOCK_DRAFTS: Record<string, ApplicationDraft> = {
  'opp-001': {
    opportunityId: 'opp-001',
    status: 'review',
    unresolvedFlags: 2,
    lastGenerated: '2026-05-12T18:00:00Z',
    questions: [
      {
        questionId: 1,
        questionText: 'Describe your organization\'s technical innovation and how it addresses the goals of this funding opportunity.',
        section: 'Technical Innovation',
        answer: 'Raya Power has developed a proprietary modular solar pod system that reduces installation timelines by 60% compared to traditional rooftop solar. Our technology leverages pre-fabricated micro-inverter arrays [Tech File Pg 4] that achieve 22% greater energy yield in partial-shade conditions, directly addressing the fund\'s priority for efficiency gains >20%.\n\nEach Raya pod is a self-contained 8.5 kW solar generation unit designed for rapid deployment in underserved communities. The modular architecture enables scalable installations from single-home to community-scale deployments without costly custom engineering. Our patent-pending quick-connect system allows a two-person crew to complete installation in under 4 hours, compared to the industry average of 2-3 days.',
        source: 'Tech_Roadmap_2026.pdf, Pg 4',
        charLimit: 2000,
        charUsed: 674,
        missingDataFlags: [],
      },
      {
        questionId: 2,
        questionText: 'What is the expected community impact of this project? Include specific metrics and target populations.',
        section: 'Community Impact',
        answer: 'Our deployment targets underserved rural communities across 5 states, projected to bring clean energy access to 12,000+ households within 18 months [Impact Study Pg 7]. Previous deployments in similar demographics achieved a 40% reduction in energy costs for participating families.\n\nKey impact metrics:\n- 12,000 households gaining solar access\n- Average $1,200/year savings per household\n- 45,000 tons CO2 avoided over system lifetime\n- 180 local installation jobs created\n- 85% of beneficiaries below area median income',
        source: 'Impact_Study_2025.pdf, Pg 7',
        charLimit: 1500,
        charUsed: 532,
        missingDataFlags: [],
      },
      {
        questionId: 3,
        questionText: 'Provide a detailed budget justification including all cost categories.',
        section: 'Budget Justification',
        answer: 'Total project budget: $2.4M. Hardware (45%): $1.08M for 200 solar pod units at $5,400/unit including micro-inverters. Labor (30%): $720K covering installation crews for 18-month deployment. R&D (15%): $360K for efficiency optimization research. Admin (10%): $240K for project management and compliance reporting. [[MISSING DATA: Please verify Q4 2025 unit pricing with procurement]]\n\nCost-share commitment: Raya Power will contribute $600K (25%) in matching funds through existing hardware inventory and staff time. [[MISSING DATA: Confirm matching fund letter from CFO]]',
        source: 'Financials_Q4.xlsx, Budget_Model tab',
        charLimit: 3000,
        charUsed: 582,
        missingDataFlags: ['Please verify Q4 2025 unit pricing with procurement', 'Confirm matching fund letter from CFO'],
      },
      {
        questionId: 4,
        questionText: 'Describe the qualifications and experience of the project team.',
        section: 'Team Qualifications',
        answer: 'CEO Maria Santos brings 15 years of renewable energy experience including 5 years at SunPower leading community solar initiatives. CTO James Chen holds 3 patents in micro-inverter technology and previously led R&D at Enphase Energy. Operations Director Lisa Park managed the deployment of 50MW of commercial solar across the Southeast.\n\nThe team is supported by advisory board members from NREL, the Solar Energy Industries Association, and two former DOE program officers who bring deep understanding of federal grant evaluation criteria.',
        source: 'Team_Bios_2026.pdf',
        charLimit: 1000,
        charUsed: 548,
        missingDataFlags: [],
      },
      {
        questionId: 5,
        questionText: 'What is your plan for long-term sustainability beyond the grant period?',
        section: 'Sustainability Plan',
        answer: 'Raya Power\'s sustainability model rests on three pillars:\n\n1. Revenue Generation: Our solar-as-a-service model generates recurring revenue through power purchase agreements (PPAs) with deployment communities. Post-installation, each pod generates approximately $1,800/year in PPA revenue.\n\n2. Raya Empower Fund: We have established a revolving fund that reinvests 15% of PPA revenues into new deployments in underserved areas. This creates a self-sustaining growth cycle that continues beyond the grant period.\n\n3. Workforce Development: Our installation training program graduates 60 certified solar technicians annually, creating a pipeline of skilled workers who both support our expansion and contribute to the broader clean energy workforce.',
        source: 'Business_Plan_2026.pdf, Sustainability Section',
        charLimit: 2500,
        charUsed: 730,
        missingDataFlags: [],
      },
    ],
    coverLetter: {
      content: 'Dear DOE Solar Access Program Review Committee,\n\nRaya Power is pleased to submit this application for the Solar Access for Underserved Communities program (DE-FOA-0003200). As a minority-owned clean energy company with a proven track record of delivering modular solar solutions to underserved communities, we believe our proposal directly addresses the program\'s core objectives of expanding equitable solar access.\n\nOur proprietary solar pod technology has been specifically designed for rapid deployment in communities that traditional solar installers overlook. With 200 units deployed across 5 states serving 12,000 households, this project will demonstrate that clean energy access and community equity are not competing priorities but complementary goals.\n\nWe look forward to the opportunity to discuss how Raya Power can advance the DOE\'s vision for a more equitable clean energy future.\n\nSincerely,\nMaria Santos\nCEO, Raya Power',
      charCount: 798,
      template: 'standard',
      isGenerated: true,
    },
  },
  'opp-002': {
    opportunityId: 'opp-002',
    status: 'generating',
    unresolvedFlags: 1,
    lastGenerated: '2026-05-13T12:00:00Z',
    questions: [
      {
        questionId: 1,
        questionText: 'Describe how your project will benefit a rural area.',
        section: 'Rural Benefit',
        answer: 'Our solar pod deployment specifically targets USDA-designated rural communities in Florida and Texas with populations under 50,000. These communities currently rely on expensive grid electricity with limited renewable alternatives. By installing 80 solar pods across 4 rural communities, we will reduce energy costs by an average of 35% for participating households, directly addressing energy poverty in agricultural regions.',
        source: 'Rural_Impact_Assessment.pdf',
        charLimit: 2000,
        charUsed: 430,
        missingDataFlags: [],
      },
      {
        questionId: 2,
        questionText: 'Provide the estimated energy savings or generation from the project.',
        section: 'Energy Performance',
        answer: 'Each Raya solar pod generates an average of 8.5 kW, producing approximately 13,600 kWh annually in Florida\'s solar climate. Across 80 pods, the project will generate 1,088,000 kWh per year, equivalent to powering 100 average rural homes. [[MISSING DATA: Confirm kWh projections with updated solar irradiance data for target zip codes]]',
        source: 'Energy_Modeling_2026.xlsx',
        charLimit: 1500,
        charUsed: 378,
        missingDataFlags: ['Confirm kWh projections with updated solar irradiance data for target zip codes'],
      },
      {
        questionId: 3,
        questionText: 'What is the total project cost and funding breakdown?',
        section: 'Project Costs',
        answer: 'Total project cost: $960,000. REAP grant request: $480,000 (50%). Raya Power cost-share: $480,000 (50%) through equipment and labor. Equipment: $432,000 (80 pods at $5,400). Installation labor: $240,000. Permits and engineering: $96,000. Project management: $192,000.',
        source: 'REAP_Budget_Template.xlsx',
        charLimit: 2000,
        charUsed: 342,
        missingDataFlags: [],
      },
    ],
  },
};

/** Get the application draft for an opportunity */
export async function getApplicationDraft(opportunityId: string): Promise<ApiResponse<ApplicationDraft>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/drafts/${opportunityId}`);
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
  await delay(600);
  const draft = MOCK_DRAFTS[opportunityId];
  if (draft) {
    return { success: true, data: { ...draft, questions: draft.questions.map(q => ({ ...q })) } };
  }
  return {
    success: true,
    data: {
      opportunityId,
      status: 'not_started',
      questions: [],
      unresolvedFlags: 0,
    },
  };
}

/** Regenerate a single draft answer */
export async function regenerateAnswer(
  opportunityId: string,
  questionId: number
): Promise<ApiResponse<DraftAnswer>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/drafts/${opportunityId}/regenerate/${questionId}`, { method: 'POST' });
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
  await delay(2000);
  const draft = MOCK_DRAFTS[opportunityId];
  if (draft) {
    const q = draft.questions.find(q => q.questionId === questionId);
    if (q) {
      return { success: true, data: { ...q, answer: q.answer + '\n\n[Regenerated with updated context]', charUsed: (q.charUsed || 0) + 42 } };
    }
  }
  return { success: false, error: 'Question not found' };
}

/** Generate a cover letter */
export async function generateCoverLetter(
  opportunityId: string,
  template: CoverLetterTemplate
): Promise<ApiResponse<{ content: string; charCount: number }>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/drafts/${opportunityId}/cover-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template }),
      });
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
  await delay(1500);
  const letters: Record<CoverLetterTemplate, string> = {
    standard: 'Dear Review Committee,\n\nRaya Power is pleased to submit this application. As a minority-owned clean energy company with a proven track record of delivering modular solar solutions to underserved communities, we believe our proposal directly addresses the program\'s core objectives.\n\nOur proprietary solar pod technology has been specifically designed for rapid deployment in communities that traditional solar installers overlook. This project will demonstrate that clean energy access and community equity are complementary goals.\n\nSincerely,\nMaria Santos\nCEO, Raya Power',
    narrative: 'In the summer of 2023, Maria Santos stood in a rural Florida community where the nearest solar installer was 200 miles away. The families there paid some of the highest electricity rates in the state, yet had zero access to clean energy alternatives. That day, she committed to building technology that would change this equation.\n\nRaya Power was born from a simple conviction: solar energy should be as easy to deploy as plugging in a generator. Our modular pod system makes this possible. Each unit arrives pre-assembled, connects in under four hours, and begins generating clean power immediately.\n\nThis proposal outlines how we will scale this vision to serve 12,000 households across five states, creating a replicable model for equitable solar access nationwide.',
    executive_summary: 'EXECUTIVE SUMMARY\n\nProject: Modular Solar Pod Deployment for Underserved Communities\nApplicant: Raya Power, Inc. (Minority-Owned Small Business)\nFunding Request: $1.8M over 18 months\nCost Share: $600K (25%)\n\nObjective: Deploy 200 Raya solar pods across 5 states, providing clean energy access to 12,000+ households in underserved communities.\n\nKey Outcomes:\n- 40% average reduction in household energy costs\n- 45,000 tons CO2 avoided\n- 180 local jobs created\n- Self-sustaining Raya Empower Fund for continued expansion\n\nRaya Power\'s modular approach eliminates the barriers that prevent traditional solar from reaching underserved markets: high upfront costs, lengthy installation timelines, and complex permitting.',
  };
  const content = letters[template];
  return { success: true, data: { content, charCount: content.length } };
}

// ─── Notifications API ──────────────────────────────────────────────

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600000).toISOString();
}

let mockNotifications: AppNotification[] = [
  { id: 'n-01', type: 'deadline_warning', title: 'Deadline in 3 days', message: 'DOE Solar Access (DE-FOA-0003200) application deadline is Jun 30, 2026.', opportunityId: 'opp-001', opportunityName: 'DOE Solar Access for Underserved Communities', isRead: false, createdAt: hoursAgo(1), urgency: 'high' },
  { id: 'n-02', type: 'missing_data_alert', title: 'Unresolved data flags (48h+)', message: 'Budget Justification has 2 missing data flags unresolved for 3 days.', opportunityId: 'opp-001', opportunityName: 'DOE Solar Access for Underserved Communities', isRead: false, createdAt: hoursAgo(2), urgency: 'high' },
  { id: 'n-03', type: 'research_complete', title: 'Research complete', message: 'All 5 research tasks finished for DOE Solar Access. Review the dossier and begin drafting.', opportunityId: 'opp-001', opportunityName: 'DOE Solar Access for Underserved Communities', isRead: false, createdAt: hoursAgo(6), urgency: 'medium' },
  { id: 'n-04', type: 'draft_ready', title: 'Draft ready for review', message: '5 answers generated for DOE Solar Access. 2 missing data flags need resolution.', opportunityId: 'opp-001', opportunityName: 'DOE Solar Access for Underserved Communities', isRead: false, createdAt: hoursAgo(8), urgency: 'medium' },
  { id: 'n-05', type: 'deadline_warning', title: 'Deadline in 14 days', message: 'USDA REAP application deadline is approaching — Jun 15, 2026.', opportunityId: 'opp-002', opportunityName: 'USDA Rural Energy for America Program (REAP)', isRead: false, createdAt: hoursAgo(12), urgency: 'medium' },
  { id: 'n-06', type: 'new_opportunity', title: '2 new opportunities found', message: 'Weekly scan discovered Elemental Excelerator Cohort 2027 and California SGIP Solar Equity.', isRead: false, createdAt: hoursAgo(24), urgency: 'low' },
  { id: 'n-07', type: 'stage_update', title: 'Stage updated to Drafting', message: 'DOE Solar Access moved from Researching to Drafting by Maria S.', opportunityId: 'opp-001', opportunityName: 'DOE Solar Access for Underserved Communities', isRead: true, createdAt: hoursAgo(30), urgency: 'low' },
  { id: 'n-08', type: 'research_complete', title: 'Research 60% complete', message: 'USDA REAP research is in progress — 3 of 5 tasks completed.', opportunityId: 'opp-002', opportunityName: 'USDA Rural Energy for America Program (REAP)', isRead: true, createdAt: hoursAgo(36), urgency: 'medium' },
  { id: 'n-09', type: 'missing_data_alert', title: 'Missing data flag', message: 'USDA REAP Energy Performance section has 1 unresolved flag: kWh projections.', opportunityId: 'opp-002', opportunityName: 'USDA Rural Energy for America Program (REAP)', isRead: true, createdAt: hoursAgo(40), urgency: 'high' },
  { id: 'n-10', type: 'new_opportunity', title: '3 new opportunities found', message: 'Weekly scan discovered SBIR Phase I, SBA Growth Accelerator, and Clean Energy Innovation Challenge.', isRead: true, createdAt: hoursAgo(168), urgency: 'low' },
  { id: 'n-11', type: 'deadline_warning', title: 'Deadline in 30 days', message: 'Elemental Excelerator Cohort 2027 deadline is Jul 15, 2026.', opportunityId: 'opp-004', opportunityName: 'Elemental Excelerator — Climate Tech Cohort 2027', isRead: true, createdAt: hoursAgo(72), urgency: 'low' },
  { id: 'n-12', type: 'stage_update', title: 'Stage updated to Researching', message: 'USDA REAP moved from Investigating to Researching by James C.', opportunityId: 'opp-002', opportunityName: 'USDA Rural Energy for America Program (REAP)', isRead: true, createdAt: hoursAgo(96), urgency: 'low' },
  { id: 'n-13', type: 'draft_ready', title: 'Draft in progress', message: 'USDA REAP draft generation started — 3 questions being processed.', opportunityId: 'opp-002', opportunityName: 'USDA Rural Energy for America Program (REAP)', isRead: true, createdAt: hoursAgo(48), urgency: 'medium' },
  { id: 'n-14', type: 'new_opportunity', title: '1 new opportunity found', message: 'Manual submission: NY Green Bank Clean Energy Financing matched with 82 relevance score.', isRead: true, createdAt: hoursAgo(240), urgency: 'low' },
  { id: 'n-15', type: 'stage_update', title: 'Opportunity archived', message: 'SBA Growth Accelerator moved to Archive — deadline passed.', isRead: true, createdAt: hoursAgo(336), urgency: 'low' },
];

const MOCK_ACTIVITY: ActivityEvent[] = [
  { id: 'a-01', type: 'draft', title: 'Draft generated', detail: '5 answers generated, 2 missing data flags', opportunityName: 'DOE Solar Access', timestamp: hoursAgo(8) },
  { id: 'a-02', type: 'research', title: 'Research completed', detail: 'All 5 research tasks finished successfully', opportunityName: 'DOE Solar Access', timestamp: hoursAgo(6) },
  { id: 'a-03', type: 'stage_change', title: 'Stage → Drafting', detail: 'Moved from Researching by Maria S.', opportunityName: 'DOE Solar Access', timestamp: hoursAgo(30) },
  { id: 'a-04', type: 'research', title: 'Research in progress', detail: '3 of 5 tasks completed (60%)', opportunityName: 'USDA REAP', timestamp: hoursAgo(36) },
  { id: 'a-05', type: 'scan', title: 'Weekly scan completed', detail: '2 new opportunities discovered, 143 sources checked', timestamp: hoursAgo(24) },
  { id: 'a-06', type: 'stage_change', title: 'Stage → Researching', detail: 'Moved from Investigating by James C.', opportunityName: 'USDA REAP', timestamp: hoursAgo(96) },
  { id: 'a-07', type: 'draft', title: 'Draft started', detail: '3 questions being generated', opportunityName: 'USDA REAP', timestamp: hoursAgo(48) },
  { id: 'a-08', type: 'scan', title: 'Weekly scan completed', detail: '3 new opportunities discovered, 143 sources checked', timestamp: hoursAgo(168) },
  { id: 'a-09', type: 'submission', title: 'Opportunity submitted', detail: 'Application submitted to grants.gov', opportunityName: 'NY Green Bank', timestamp: hoursAgo(200) },
  { id: 'a-10', type: 'stage_change', title: 'Opportunity archived', detail: 'Deadline passed, moved to archive', opportunityName: 'SBA Growth Accelerator', timestamp: hoursAgo(336) },
];

/** Get all notifications */
export async function getNotifications(): Promise<ApiResponse<AppNotification[]>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/notifications`);
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
  await delay(300);
  return { success: true, data: [...mockNotifications] };
}

/** Mark a notification as read */
export async function markNotificationRead(id: string): Promise<ApiResponse<void>> {
  await delay(100);
  mockNotifications = mockNotifications.map(n => n.id === id ? { ...n, isRead: true } : n);
  return { success: true, data: undefined };
}

/** Mark all notifications as read */
export async function markAllRead(): Promise<ApiResponse<void>> {
  await delay(200);
  mockNotifications = mockNotifications.map(n => ({ ...n, isRead: true }));
  return { success: true, data: undefined };
}

/** Get activity feed events */
export async function getActivityFeed(): Promise<ApiResponse<ActivityEvent[]>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/activity`);
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
  await delay(400);
  return { success: true, data: [...MOCK_ACTIVITY] };
}

// ─── Learning Loop API ──────────────────────────────────────────────

const MOCK_KNOWLEDGE_DOCS: KnowledgeDocument[] = [
  { id: 'kd-01', filename: 'DOE_Solar_Access_Application_Final.pdf', category: 'completed_application', status: 'ingested', vectorCount: 847, ingestedAt: hoursAgo(48), opportunityName: 'DOE Solar Access 2025', outcome: 'awarded', fileSize: '2.4 MB' },
  { id: 'kd-02', filename: 'USDA_REAP_2024_Submission.pdf', category: 'completed_application', status: 'ingested', vectorCount: 523, ingestedAt: hoursAgo(168), opportunityName: 'USDA REAP 2024', outcome: 'awarded', fileSize: '1.8 MB' },
  { id: 'kd-03', filename: 'SBA_Growth_Accelerator_App.pdf', category: 'completed_application', status: 'ingested', vectorCount: 312, ingestedAt: hoursAgo(720), opportunityName: 'SBA Growth Accelerator 2024', outcome: 'rejected', fileSize: '980 KB' },
  { id: 'kd-04', filename: 'Raya_Tech_Roadmap_2026.pdf', category: 'company_doc', status: 'ingested', vectorCount: 634, ingestedAt: hoursAgo(72), fileSize: '3.1 MB' },
  { id: 'kd-05', filename: 'Raya_Impact_Study_2025.pdf', category: 'company_doc', status: 'ingested', vectorCount: 445, ingestedAt: hoursAgo(96), fileSize: '2.7 MB' },
  { id: 'kd-06', filename: 'Raya_Business_Plan_2026.pdf', category: 'company_doc', status: 'ingested', vectorCount: 892, ingestedAt: hoursAgo(120), fileSize: '4.5 MB' },
  { id: 'kd-07', filename: 'DOE_Reviewer_Feedback_2025.pdf', category: 'research', status: 'processing', vectorCount: 0, ingestedAt: hoursAgo(2), fileSize: '340 KB' },
  { id: 'kd-08', filename: 'Federal_Grant_Cover_Letter_Templates.docx', category: 'template', status: 'ingested', vectorCount: 156, ingestedAt: hoursAgo(240), fileSize: '520 KB' },
];

const MOCK_KB_STATS: KnowledgeBaseStats = {
  totalDocuments: 8,
  totalVectors: 3809,
  completedApplications: 3,
  winRate: 67,
  lastIngestion: hoursAgo(2),
};

let mockOutcomes: ApplicationOutcome[] = [
  {
    opportunityId: 'out-001',
    opportunityName: 'DOE Solar Access for Underserved Communities 2025',
    result: 'awarded',
    fundingReceived: 1800000,
    submittedAt: '2025-06-28T00:00:00Z',
    decidedAt: '2025-09-15T00:00:00Z',
    notes: 'Full award received. Reviewer highlighted the modular pod approach and community impact metrics as standout elements.',
    lessonsLearned: ['Specific cost-per-watt data impressed reviewers', 'Community letters of support were critical', 'Budget justification needed more granularity'],
    strengthTags: ['technical_innovation', 'community_impact', 'team_qualifications'],
    weaknessTags: ['budget_detail'],
  },
  {
    opportunityId: 'out-002',
    opportunityName: 'USDA REAP Rural Energy 2024',
    result: 'awarded',
    fundingReceived: 480000,
    submittedAt: '2024-12-01T00:00:00Z',
    decidedAt: '2025-03-20T00:00:00Z',
    notes: 'Awarded at 100% of request. USDA appreciated the rural focus and job creation projections.',
    lessonsLearned: ['Rural impact data was well-received', 'Energy savings projections validated by third party added credibility', 'Faster turnaround than DOE'],
    strengthTags: ['rural_impact', 'energy_performance', 'sustainability'],
    weaknessTags: [],
  },
  {
    opportunityId: 'out-003',
    opportunityName: 'SBA Growth Accelerator 2024',
    result: 'rejected',
    submittedAt: '2024-08-15T00:00:00Z',
    decidedAt: '2024-11-01T00:00:00Z',
    notes: 'Did not advance past Round 1. Feedback indicated the application did not sufficiently address the accelerator\'s focus on business model scalability.',
    lessonsLearned: ['SBA values business model innovation over technical innovation', 'Needed stronger revenue projection section', 'Cover letter should emphasize scalability not impact'],
    strengthTags: ['technical_innovation'],
    weaknessTags: ['business_model', 'revenue_projections', 'scalability'],
  },
];

const MOCK_STYLE_INSIGHTS: StyleInsight[] = [
  { id: 'si-01', pattern: 'Lead with quantified impact metrics in the first sentence', source: 'DOE Solar Access (won)', frequency: 85, impact: 'high', category: 'structure', examples: ['"Our deployment targets 12,000+ households..."', '"Previous installations achieved a 40% reduction..."'] },
  { id: 'si-02', pattern: 'Use cost-per-unit breakdowns rather than lump sums in budgets', source: 'DOE Solar Access + USDA REAP (both won)', frequency: 100, impact: 'high', category: 'data_usage', examples: ['"200 solar pod units at $5,400/unit"', '"80 pods at $5,400 each"'] },
  { id: 'si-03', pattern: 'Include third-party validation references', source: 'USDA REAP (won)', frequency: 70, impact: 'medium', category: 'data_usage', examples: ['"Validated by NREL solar irradiance data"', '"Confirmed by independent energy audit"'] },
  { id: 'si-04', pattern: 'Avoid passive voice — use active, confident statements', source: 'Winning vs losing comparison', frequency: 78, impact: 'medium', category: 'tone', examples: ['Won: "Raya Power will deploy..."', 'Lost: "It is anticipated that deployment would..."'] },
  { id: 'si-05', pattern: 'Keep sentences under 25 words for technical sections', source: 'DOE reviewer feedback', frequency: 65, impact: 'medium', category: 'structure', examples: ['Average sentence length in winning apps: 18 words', 'Rejected app averaged 32 words per sentence'] },
  { id: 'si-06', pattern: 'Use "solar pod" consistently (not "unit", "module", or "system")', source: 'Brand consistency analysis', frequency: 90, impact: 'low', category: 'vocabulary', examples: ['Consistent branding reinforces technical identity', 'Reviewers noted the distinct product name'] },
];

const MOCK_FEEDBACK_DIFFS: FeedbackDiff[] = [
  { id: 'fd-01', opportunityName: 'DOE Solar Access 2025', questionSection: 'Technical Innovation', originalDraft: 'Raya Power has developed a modular solar pod system that reduces installation timelines compared to traditional rooftop solar.', finalSubmitted: 'Raya Power has developed a proprietary modular solar pod system that reduces installation timelines by 60% compared to traditional rooftop solar, validated by 18 months of field deployment data across 3 states.', changeType: 'refinement', changeCount: 3, learnedAt: hoursAgo(48) },
  { id: 'fd-02', opportunityName: 'DOE Solar Access 2025', questionSection: 'Budget Justification', originalDraft: 'Total project budget: $2.4M covering hardware, labor, R&D, and administration.', finalSubmitted: 'Total project budget: $2.4M. Hardware (45%): $1.08M for 200 solar pod units at $5,400/unit including micro-inverters. Labor (30%): $720K covering 12 installation crews for 18-month deployment. R&D (15%): $360K for efficiency optimization. Admin (10%): $240K for PM and compliance.', changeType: 'addition', changeCount: 5, learnedAt: hoursAgo(48) },
  { id: 'fd-03', opportunityName: 'USDA REAP 2024', questionSection: 'Rural Benefit', originalDraft: 'Our solar deployment targets rural communities with populations under 50,000.', finalSubmitted: 'Our solar pod deployment specifically targets USDA-designated rural communities in Florida and Texas with populations under 50,000, where average electricity costs exceed $0.14/kWh and renewable energy penetration is below 5%.', changeType: 'refinement', changeCount: 2, learnedAt: hoursAgo(168) },
  { id: 'fd-04', opportunityName: 'SBA Growth Accelerator 2024', questionSection: 'Business Model', originalDraft: 'Raya Power generates revenue through solar installations and power purchase agreements with communities.', finalSubmitted: 'Raya Power generates recurring revenue through power purchase agreements (PPAs) at $0.08/kWh, creating predictable cash flows. Our solar-as-a-service model achieves 22% gross margins with a 36-month customer payback period.', changeType: 'rewrite', changeCount: 4, learnedAt: hoursAgo(720) },
];

/** Get knowledge base documents and stats */
export async function getKnowledgeBase(): Promise<ApiResponse<{ documents: KnowledgeDocument[]; stats: KnowledgeBaseStats }>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/knowledge-base`);
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
  await delay(500);
  return { success: true, data: { documents: [...MOCK_KNOWLEDGE_DOCS], stats: { ...MOCK_KB_STATS } } };
}

/** Get application outcomes */
export async function getApplicationOutcomes(): Promise<ApiResponse<ApplicationOutcome[]>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/outcomes`);
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
  await delay(400);
  return { success: true, data: [...mockOutcomes] };
}

/** Tag an application outcome */
export async function tagOutcome(
  opportunityId: string,
  result: OutcomeResult,
  notes: string
): Promise<ApiResponse<void>> {
  await delay(300);
  mockOutcomes = mockOutcomes.map(o =>
    o.opportunityId === opportunityId ? { ...o, result, notes, decidedAt: new Date().toISOString() } : o
  );
  return { success: true, data: undefined };
}

/** Get style insights from winning proposals */
export async function getStyleInsights(): Promise<ApiResponse<StyleInsight[]>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/style-insights`);
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
  await delay(400);
  return { success: true, data: [...MOCK_STYLE_INSIGHTS] };
}

/** Get feedback diffs (AI draft vs final submitted) */
export async function getFeedbackDiffs(): Promise<ApiResponse<FeedbackDiff[]>> {
  if (isLiveMode) {
    try {
      const res = await fetch(`${N8N_WEBHOOK_URL}/feedback-diffs`);
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
  await delay(400);
  return { success: true, data: [...MOCK_FEEDBACK_DIFFS] };
}
