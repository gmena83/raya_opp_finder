export interface MarketCompany {
  id: string;
  name: string;
  officialComplaints: number;
  socialSentiment: number; // 1-5
  reliabilityScore: number; // 1-100
  topPainPoint: string;
  marketShare: string;
}

export interface ComplaintData {
  id: string;
  companyName: string;
  source: 'DACO' | 'NEPR' | 'OIPC' | 'Tribunales' | 'Google Reviews' | 'Facebook' | 'Reddit';
  type: string;
  summary: string;
  date: string;
  urgency: 'High' | 'Medium' | 'Low';
}

export const mockCompanies: MarketCompany[] = [
  { id: 'c1', name: 'Windmar Home', officialComplaints: 142, socialSentiment: 3.2, reliabilityScore: 68, topPainPoint: 'Demoras extremas en interconexión (LUMA)', marketShare: '22%' },
  { id: 'c2', name: 'Sunnova', officialComplaints: 315, socialSentiment: 2.1, reliabilityScore: 45, topPainPoint: 'Prácticas de ventas predatorias y contratos confusos', marketShare: '28%' },
  { id: 'c3', name: 'Máximo Solar', officialComplaints: 89, socialSentiment: 3.8, reliabilityScore: 82, topPainPoint: 'Falta de respuesta del servicio técnico', marketShare: '15%' },
  { id: 'c4', name: 'Pura Energía', officialComplaints: 54, socialSentiment: 4.1, reliabilityScore: 88, topPainPoint: 'Problemas menores con la app de monitoreo', marketShare: '8%' },
  { id: 'c5', name: 'New Energy', officialComplaints: 76, socialSentiment: 3.5, reliabilityScore: 75, topPainPoint: 'Daños al techo durante la instalación', marketShare: '11%' }
];

export const mockComplaints: ComplaintData[] = [
  {
    id: 'comp1',
    companyName: 'Sunnova',
    source: 'DACO',
    type: 'Contrato',
    summary: 'Cliente reporta que el leasing de 25 años incluía escaladores anuales no explicados durante la venta.',
    date: '2026-05-10',
    urgency: 'High'
  },
  {
    id: 'comp2',
    companyName: 'Windmar Home',
    source: 'NEPR',
    type: 'Interconexión',
    summary: 'Sistema instalado hace 4 meses y aún no tiene certificación de LUMA. Baterías se están degradando.',
    date: '2026-05-12',
    urgency: 'High'
  },
  {
    id: 'comp3',
    companyName: 'Máximo Solar',
    source: 'Google Reviews',
    type: 'Soporte',
    summary: '"Llevo 3 semanas llamando porque el inversor parpadea en rojo y nadie contesta los tickets de soporte."',
    date: '2026-05-08',
    urgency: 'Medium'
  },
  {
    id: 'comp4',
    companyName: 'New Energy',
    source: 'DACO',
    type: 'Instalación',
    summary: 'Filtraciones masivas de agua en el techo tras la instalación de los anclajes de los paneles.',
    date: '2026-05-01',
    urgency: 'High'
  },
  {
    id: 'comp5',
    companyName: 'Sunnova',
    source: 'Reddit',
    type: 'Sentimiento',
    summary: 'Hilo en r/PuertoRico: "No confíen en Sunnova, me bloquearon la cuenta y me están cobrando doble este mes."',
    date: '2026-05-14',
    urgency: 'Medium'
  }
];

export const mockPainPoints = [
  { topic: 'LUMA Interconnection Delays', percentage: 42, severity: 'Critical' },
  { topic: 'Hidden Escalator Clauses (Leasing)', percentage: 28, severity: 'Critical' },
  { topic: 'Poor Post-Installation Support', percentage: 18, severity: 'High' },
  { topic: 'Roof Damage / Leaks', percentage: 7, severity: 'High' },
  { topic: 'Battery/Inverter Setup Issues', percentage: 5, severity: 'Medium' }
];
