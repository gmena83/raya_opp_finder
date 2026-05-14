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
