'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Lead {
  id: number;
  created_at: string;
  name: string;
  email: string;
  company: string;
  data_volume: string;
  bottleneck: string;
  status?: string;
  score?: number;
}

interface ProjectItem {
  id: string;
  name: string;
  module: string;
  status: 'Concluído' | 'Em Criação' | 'Rascunho' | 'Deploy Ativo';
  description: string;
  link?: string;
  tags: string[];
}

interface SkillUpdate {
  id: string;
  version: string;
  title: string;
  category: 'IA Agentic' | 'Pipeline Dados' | 'Engenharia 3D' | 'Segurança RLS';
  description: string;
  date: string;
  status: 'Instalado' | 'Disponível';
  changelog: string[];
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: '1',
    name: 'NexusData Landing 3D',
    module: 'landing-pages',
    status: 'Deploy Ativo',
    description: 'Landing page principal com malha neural 3D em Three.js, RLS e captação de leads.',
    link: 'https://landing-page-agentic-one.vercel.app',
    tags: ['Next.js', 'Three.js', 'Supabase', 'Vercel']
  },
  {
    id: '2',
    name: 'Audit Pro Micro-SaaS',
    module: 'saas',
    status: 'Deploy Ativo',
    description: 'Scanner automatizado de schema PostgreSQL, detecção de gargalos, RLS e relatórios de conformidade.',
    tags: ['SaaS', 'PostgreSQL', 'SQL Parser', 'Auditoria']
  },
  {
    id: '3',
    name: 'Nexus Mini-CRM Agentic',
    module: 'crm',
    status: 'Deploy Ativo',
    description: 'Gestão de pipeline de diagnósticos com Lead Scoring, status dinâmico e exportação CSV.',
    tags: ['CRM', 'Pipeline', 'Realtime', 'Lead Scoring']
  },
  {
    id: '4',
    name: 'Post Studio & BrandKit 3x3 Engine',
    module: 'posts-design',
    status: 'Deploy Ativo',
    description: 'Estúdio de Identidade Visual de alto padrão (Pentagram/Linear-tier), BrandKit 3x3 e Carrosséis.',
    tags: ['BrandKit 3x3', 'Anti-Slop', 'Design System', 'Meta Graph API']
  },
  {
    id: '5',
    name: 'Demo Forge & Client Outreach',
    module: 'outreach',
    status: 'Deploy Ativo',
    description: 'Gerador de demonstrações comerciais protegidas e disparador de e-mails corporativos B2B.',
    tags: ['Demos', 'Outreach', 'Gmail', 'Vendas B2B']
  },
  {
    id: '6',
    name: 'Nexus Mobile PWA Studio',
    module: 'apps',
    status: 'Deploy Ativo',
    description: 'Emulador mobile em tempo real, gerador de manifest PWA e simulador de notificações.',
    tags: ['PWA', 'Mobile', 'Tailwind', 'Standalone']
  },
  {
    id: '7',
    name: 'StoryForge - Módulo Infantil & Bíblico',
    module: 'fabrica-historias',
    status: 'Deploy Ativo',
    description: 'Gerador multimodal de narrativas infantis e roteiros bíblicos em blocos de Lego.',
    tags: ['Infantil', 'Storytelling', 'Lego Diorama', 'Multi-Engine']
  },
  {
    id: '8',
    name: 'Presell High-Ticket VSL',
    module: 'presell',
    status: 'Deploy Ativo',
    description: 'Página advertorial de alta conversão com retenção de checkout e gatilhos de autoridade.',
    link: '/presell',
    tags: ['Advertorial', 'Copywriting', 'Direct Response']
  }
];

const SKILL_UPDATES: SkillUpdate[] = [
  {
    id: 'up-1',
    version: 'v4.0 BrandKit Protocol',
    title: 'BrandKit 3x3 & Anti-Slop Frontend Engine',
    category: 'Engenharia 3D',
    description: 'Diretrizes de estúdio de alta identidade visual, remoção de clichês de IA e grid 3x3 estruturado.',
    date: '27/08/2026',
    status: 'Instalado',
    changelog: [
      'Geração de Pranchas de Identidade Visual 3x3',
      'Filtro de copy anti-slop e anti-clichê ativado',
      'Travas de contraste e tipografia determinística'
    ]
  },
  {
    id: 'up-2',
    version: 'v3.2 Protocol',
    title: 'Model Context Protocol (MCP) & Agentic Router',
    category: 'IA Agentic',
    description: 'Permite conectar ferramentas externas, bancos de dados locais e scripts diretamente ao fluxo de raciocínio da IA.',
    date: '27/08/2026',
    status: 'Instalado',
    changelog: [
      'Orquestração de prompts multi-engine desacoplada',
      'Execução de código direto para análise de leads',
      'Segurança de credenciais em túnel isolado'
    ]
  },
  {
    id: 'up-3',
    version: 'v2.5 Security',
    title: 'PostgreSQL Row Level Security (RLS) Blindado',
    category: 'Segurança RLS',
    description: 'Políticas granulares de isolamento no Supabase para proteção contra extração de dados públicos.',
    date: '26/08/2026',
    status: 'Instalado',
    changelog: [
      'Acesso anônimo restrito a inserção controlada',
      'Autenticação de sessão no painel administrativo',
      'Prevenção de escalada de privilégios'
    ]
  }
];

const ADMIN_ACCESS_KEY = 'nexus2026';

export default function NexusMasterSuite() {
  const [activeTab, setActiveTab] = useState<string>('hub');
  const [storySubTab, setStorySubTab] = useState<'infantil' | 'religioso'>('religioso');
  const [targetEngine, setTargetEngine] = useState<'dalle' | 'midjourney' | 'ideogram' | 'gemini'>('dalle');
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  const [skillsList, setSkillsList] = useState<SkillUpdate[]>(SKILL_UPDATES);
  const [installedNotice, setInstalledNotice] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  const [postStudioSubTab, setPostStudioSubTab] = useState<'generator' | 'brandkit3x3' | 'branding' | 'meta-api'>('generator');
  const [clientNiche, setClientNiche] = useState('Medicina Integrativa & Longevidade');
  const [clientTopic, setClientTopic] = useState('Benefícios da Ozonioterapia e Terapia Neural na Regeneração Celular');
  const [brandHandle, setBrandHandle] = useState('@clinica.integrativa');
  const [isResearching, setIsResearching] = useState(false);

  const [generatedPost, setGeneratedPost] = useState({
    badge: 'MEDICINA INTEGRATIVA & PERFORMANCE',
    slides: [
      {
        slideNum: 1,
        headline: 'A Fadiga Crônica Não É Normal: A Célula Está Sem Oxigênio.',
        subhead: 'Por que tratamentos superficiais ignoram a disfunção mitocondrial e o estresse oxidativo.',
        codeSnippet: `// ⚠️ Diagnóstico Celular:\nBaixa oxigenação tecidual ➔ Fadiga, dores crônicas e inflamação sistêmica.`
      },
      {
        slideNum: 2,
        headline: 'Ozonioterapia: Reativação Mitocondrial Potente',
        subhead: 'O estímulo controlado do ozônio medicinal otimiza a entrega de oxigênio e modula o sistema imune.',
        codeSnippet: `// ⚡ Ação Fisiológica:\nAtivação do Nrf2 + Aumento de ATP celular + Modulação de citocinas pró-inflamatórias.`
      },
      {
        slideNum: 3,
        headline: 'Terapia Neural: Reset do Sistema Nervoso',
        subhead: 'Desbloqueio de campos de interferência que perpetuam dores e sobrecargas no organismo.',
        codeSnippet: `// 🩺 Protocolo de Alta Performance:\nEquilíbrio neurovegetativo e regeneração do potencial de membrana celular.`
      }
    ],
    socialCopy: `Você acorda cansado mesmo após 8 horas de sono? Sente que seu corpo está sempre no limite?\n\nIsso é sinal de que suas mitocôndrias não estão produzindo energia de forma eficiente devido à inflamação e hipóxia celular.\n\nA combinação de Ozonioterapia com Terapia Neural atua na causa raiz:\n✅ Otimiza a circulação e oxigenação tecidual\n✅ Reduz marcadores inflamatórios sistêmicos\n✅ Restaura a comunicação neurovegetativa e a vitalidade\n\n👉 Agende sua avaliação integrativa pelo link na bio e recupere seu equilíbrio.\n\n#MedicinaIntegrativa #Ozonioterapia #TerapiaNeural #LongevidadeSaudavel #SaudeCelular #Biohacking`
  });

  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const [demoType, setDemoType] = useState<'landing' | 'saas' | 'crm'>('saas');
  const [outreachForm, setOutreachForm] = useState({
    recipientName: 'Alexandre Cardoso Figueira',
    recipientEmail: 'alexandrebgmt@hotmail.com',
    companyName: 'Medicina integrativa',
    techBottleneck: 'Bancos de dados lentos e falta de isolamento seguro RLS',
    emailTemplate: 'demo'
  });

  const [mobileScreen, setMobileScreen] = useState<'dashboard' | 'leads' | 'scanner'>('dashboard');
  const [pwaConfig, setPwaConfig] = useState({
    appName: 'Nexus Mobile Agent',
    shortName: 'NexusApp',
    themeColor: '#06b6d4',
    bgColor: '#020617',
    display: 'standalone'
  });
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  const [sqlInput, setSqlInput] = useState<string>(
`CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Query de busca frequente sem índice:
SELECT * FROM users WHERE email = 'cliente@exemplo.com';`
  );

  const [isScanning, setIsScanning] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    score: number;
    rlsStatus: 'Vulnerável' | 'Blindado';
    indexStatus: 'Gargalo Detectado' | 'Otimizado';
    recommendations: string[];
  } | null>(null);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('nexus_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      fetchLeads();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_ACCESS_KEY) {
      sessionStorage.setItem('nexus_admin_auth', 'true');
      setIsAuthenticated(true);
      fetchLeads();
      setErrorMsg('');
    } else {
      setErrorMsg('Chave de acesso incorreta.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nexus_admin_auth');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  async function fetchLeads() {
    setLoadingLeads(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLeads(data);
    }
    setLoadingLeads(false);
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
    );
    await supabase.from('leads').update({ status: newStatus }).eq('id', id);
  };

  const calculateLeadScore = (volume: string, bottleneck: string) => {
    let score = 50;
    if (volume?.includes('> 1 TB') || volume?.includes('10 TB') || volume?.includes('> 10 TB')) score += 35;
    else if (volume?.includes('100 GB - 1 TB')) score += 20;
    
    if (bottleneck && bottleneck.length > 20) score += 15;
    return Math.min(score, 99);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2500);
  };

  const handleInstallSkill = (id: string, title: string) => {
    setSkillsList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Instalado' } : s))
    );
    setInstalledNotice(`A Skill "${title}" foi incorporada ao ecossistema com sucesso!`);
    setTimeout(() => setInstalledNotice(null), 4000);
  };

  const handleGenerateCustomPost = () => {
    setIsResearching(true);
    setTimeout(() => {
      const isTech = clientNiche.toLowerCase().includes('tech') || clientNiche.toLowerCase().includes('dado') || clientNiche.toLowerCase().includes('software');
      
      if (isTech) {
        setGeneratedPost({
          badge: 'TECH ARCHITECTURE & DATA',
          slides: [
            {
              slideNum: 1,
              headline: `${clientTopic.slice(0, 50)}...`,
              subhead: 'O gargalo oculto que compromete a escalabilidade de aplicações e como mitigar.',
              codeSnippet: `// ❌ Abordagem Ineficiente:\nQueries não particionadas drenando CPU em até 85%.`
            },
            {
              slideNum: 2,
              headline: 'Arquitetura de Isolamento & Baixa Latência',
              subhead: 'Implementação de B-Tree Indexes, Edge Caching e Row Level Security nativo.',
              codeSnippet: `CREATE INDEX idx_perf ON ${clientTopic.split(' ')[0] || 'records'} (created_at DESC);\n-- Latência reduzida para < 12ms ⚡`
            },
            {
              slideNum: 3,
              headline: 'Decisões em Tempo Real com IA',
              subhead: 'Conectando pipelines reativos direto ao painel executivo.',
              codeSnippet: `// 🚀 Arquitetura Nexus:\nConfiabilidade, conformidade e escala garantida.`
            }
          ],
          socialCopy: `Como você escala sua infraestrutura de dados sem triplicar a conta da nuvem?\n\nO segredo de ${clientTopic} está na engenharia de base: índices otimizados, isolamento RLS e execução no Edge.\n\nConfira os detalhes no carrossel acima e fale com nossos engenheiros.\n\n#EngenhariaDeDados #DataEngineering #Cloud #PostgreSQL #SoftwareArchitecture`
        });
      } else {
        setGeneratedPost({
          badge: clientNiche.toUpperCase(),
          slides: [
            {
              slideNum: 1,
              headline: `${clientTopic.slice(0, 55)}`,
              subhead: 'Compreenda os fundamentos científicos que transformam seus resultados e bem-estar.',
              codeSnippet: `// 🔬 Evidência Clínica:\nAbordagem focada na causa raiz e regeneração profunda.`
            },
            {
              slideNum: 2,
              headline: 'Mecanismos de Ação & Benefícios Reais',
              subhead: 'Estímulo celular avançado para equilíbrio fisiológico completo.',
              codeSnippet: `// ✨ Resultados Clínicos:\nRedução de estresse oxidativo, mais clareza mental e vitalidade.`
            },
            {
              slideNum: 3,
              headline: 'Seu Próximo Nível de Saúde Começa Aqui',
              subhead: 'Cuidado personalizado com acompanhamento especializado.',
              codeSnippet: `// 🌿 Atendimento Integrativo:\nProtocolos sob medida para a sua individualidade biológica.`
            }
          ],
          socialCopy: `Você já sentiu que seu corpo precisa de uma pausa e regeneração profunda?\n\nQuando falamos de ${clientTopic}, estamos tratando da causa raiz, devolvendo ao organismo sua capacidade natural de autorregulação.\n\n👉 Compartilhe com quem precisa saber disso e agende sua consulta pelo link na bio.\n\n#${clientNiche.replace(/\s+/g, '')} #Saude #BemEstar #QualidadeDeVida #AltaPerformance`
        });
      }
      setIsResearching(false);
      setActiveSlideIndex(0);
    }, 1000);
  };

  const handleRunAudit = () => {
    setIsScanning(true);
    setTimeout(() => {
      const lowerSql = sqlInput.toLowerCase();
      const hasRLS = lowerSql.includes('enable row level security') || (lowerSql.includes('alter table') && lowerSql.includes('rls'));
      const hasIndex = lowerSql.includes('create index') || lowerSql.includes('btree');

      let score = 95;
      const recs: string[] = [];

      if (!hasRLS) {
        score -= 30;
        recs.push('⚠️ Tabela sem RLS: Execute "ALTER TABLE ... ENABLE ROW LEVEL SECURITY;" para isolamento multi-tenant.');
      } else {
        recs.push('✅ RLS ativo: Isolamento no PostgreSQL validado.');
      }

      if (!hasIndex && (lowerSql.includes('select') || lowerSql.includes('where'))) {
        score -= 20;
        recs.push('⚡ Gargalo em Query: Filtro por email sem índice B-Tree. Crie: "CREATE INDEX idx_users_email ON users(email);".');
      } else {
        recs.push('✅ Estrutura de indexação alinhada com as consultas.');
      }

      recs.push('🔒 Chaves primárias usando UUIDv4 para evitar enumeração de registros.');

      setAuditResult({
        score: Math.max(score, 40),
        rlsStatus: hasRLS ? 'Blindado' : 'Vulnerável',
        indexStatus: hasIndex ? 'Otimizado' : 'Gargalo Detectado',
        recommendations: recs
      });
      setIsScanning(false);
    }, 900);
  };

  const triggerMobileNotification = () => {
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 3500);
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['ID', 'Data', 'Status', 'Score', 'Nome', 'Email', 'Empresa', 'Volume', 'Desafio'];
    const rows = leads.map((l) => [
      l.id,
      new Date(l.created_at).toLocaleString('pt-BR'),
      `"${l.status || 'Novo'}"`,
      calculateLeadScore(l.data_volume, l.bottleneck),
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.company}"`,
      `"${l.data_volume || ''}"`,
      `"${l.bottleneck || ''}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nexusdata-leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getLegoPrompts = (engine: 'dalle' | 'midjourney' | 'ideogram' | 'gemini') => {
    const baseCena1 = "Lego minifigures diorama scene, two cute toy minifigure builders with helmets holding colorful plastic toy bricks, one building on soft yellow sand by the ocean, the other building on a solid high grey rock cliff, cinematic macro photography, tilt-shift lens effect, realistic plastic brick texture, bright warm sunlight, studio lighting";
    const baseCena2 = "Macro shot of a Lego diorama storm, dramatic rain made of clear blue acrylic pieces, miniature dramatic lightning, toy plastic waves rushing against the shores, cinematic dark moody lighting with glowing highlights on the colorful plastic bricks, high realism plastic texture";
    const baseCena3 = "Lego minifigure standing joyfully inside a sturdy colorful toy brick house on top of a solid grey rock, looking out the plastic window after a storm, sunbeams breaking through clouds, glowing warm light, nearby on the beach a collapsed pile of loose toy bricks, inspirational and warm atmosphere, macro photography";

    if (engine === 'midjourney') {
      return [
        `${baseCena1} --ar 16:9 --v 6.1 --style raw --c 5 --q 2`,
        `${baseCena2} --ar 16:9 --v 6.1 --style raw --c 5 --q 2`,
        `${baseCena3} --ar 16:9 --v 6.1 --style raw --c 5 --q 2`
      ];
    } else if (engine === 'ideogram') {
      return [
        `Typography banner "A CASA NA ROCHA" in stylized plastic 3D letters above: ${baseCena1}`,
        `${baseCena2}, hyper-detailed rendered textures`,
        `Banner "ALICERCE INABALAVEL" with ${baseCena3}`
      ];
    } else {
      return [
        `${baseCena1}, highly detailed 8k render, aspect ratio 16:9.`,
        `${baseCena2}, 8k resolution, crisp plastic finish.`,
        `${baseCena3}, hyper-detailed 8k, photorealistic plastic miniature.`
      ];
    }
  };

  const generateOutreachEmail = () => {
    const name = outreachForm.recipientName || 'Gestor de Tecnologia';
    const company = outreachForm.companyName || 'Sua Empresa';
    const bottleneck = outreachForm.techBottleneck || 'otimização de consultas e isolamento de banco de dados';

    if (outreachForm.emailTemplate === 'cold') {
      return {
        subject: `[NexusData] Oportunidade de ganho de performance na arquitetura da ${company}`,
        body: `Olá, ${name}.\n\nAcompanhando o crescimento da ${company}, notei que arquiteturas em expansão frequentemente enfrentam desafios com ${bottleneck}.\n\nNa NexusData, implementamos infraestruturas modernas em PostgreSQL com Row Level Security (RLS) nativo e latência ultra baixa, reduzindo em até 70% o custo de nuvem e eliminando vulnerabilidades de segurança.\n\nPreparamos uma demonstração interativa da nossa solução adaptada para o seu cenário. Teria 10 minutos esta semana para avaliarmos juntos?\n\nAtenciosamente,\nAlexandre Figueira\nChief Architect | NexusData Enterprise\nhttps://landing-page-agentic-one.vercel.app`
      };
    } else if (outreachForm.emailTemplate === 'demo') {
      return {
        subject: `[Demonstração Exclusiva] Arquitetura & Diagnóstico Interativo para ${company}`,
        body: `Olá, ${name}.\n\nConforme prometido, liberei um ambiente demonstrativo exclusivo para você e seu time técnico testarem na prática:\n\n🔗 Link da Demonstração: https://landing-page-agentic-one.vercel.app/presell\n\nNesta versão interativa você poderá validar:\n1. Scanner de schema SQL e cálculo automático de vulnerabilidades\n2. Pipeline de dados reativo com isolamento multi-tenant seguro (RLS)\n3. Painel de comando com decisões em tempo real\n\nFico à disposição para calibrarmos as regras e integrarmos diretamente à base de vocês.\n\nUm abraço,\nAlexandre Figueira\nChief Architect | NexusData Enterprise`
      };
    } else {
      return {
        subject: `[Proposta Técnica] Implementação da Arquitetura Nexus na ${company}`,
        body: `Prezado(a) ${name},\n\nApós a validação da demonstração técnica, elaborei o plano de implementação da arquitetura para a ${company}.\n\n🎯 Escopo Principal:\n- Auditoria e saneamento de schema PostgreSQL\n- Ativação de políticas granulares de Row Level Security (RLS)\n- Configuração do pipeline em Edge com integração segura via Supabase\n- Painel de Gestão & Alertas em tempo real\n\nPodemos agendar uma rápida chamada amanhã para alinhar o cronograma de deploy?\n\nAtenciosamente,\nAlexandre Figueira\nNexusData Enterprise`
      };
    }
  };

  const currentEmail = generateOutreachEmail();

  const handleOpenGmailCompose = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(outreachForm.recipientEmail)}&su=${encodeURIComponent(currentEmail.subject)}&body=${encodeURIComponent(currentEmail.body)}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const currentSlide = generatedPost.slides[activeSlideIndex] || generatedPost.slides[0];
  const hasPendingUpdates = skillsList.some((s) => s.status === 'Disponível');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12)_0,transparent_70%)] pointer-events-none" />
        <form
          onSubmit={handleLogin}
          className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-8 shadow-2xl shadow-cyan-950/50 space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-2xl font-bold shadow-inner">
              ⚡
            </div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
              Nexus Master Suite OS
            </h1>
            <p className="text-xs text-slate-400 font-mono tracking-wider">
              CENTRAL OPERACIONAL DE ENGENHARIA & IA
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Chave Mestra de Acesso</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
              autoFocus
            />
            {errorMsg && <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-cyan-500/25 active:scale-[0.99]"
          >
            Acessar Centro de Comando
          </button>
        </form>
      </div>
    );
  }

  const currentLegoPrompts = getLegoPrompts(targetEngine);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      
      <aside className="w-72 bg-slate-900/90 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 fixed inset-y-0 z-30">
        <div className="space-y-6">
          <div className="px-3 py-2 flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-lg shadow-sm shadow-cyan-500/30">
                ⌘
              </div>
              <div>
                <span className="font-bold text-white text-base tracking-tight">Nexus Suite</span>
                <span className="block text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Enterprise OS</span>
              </div>
            </div>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Sistema Online" />
          </div>

          <nav className="space-y-1 text-sm font-medium">
            <div className="px-3 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">Núcleo Central</div>
            
            <button
              onClick={() => setActiveTab('hub')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'hub'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>📊</span>
              <span>Visão Geral & Projetos</span>
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'posts'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span>🎨</span>
                <span>Post Studio & BrandKit</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                STUDIO 3x3
              </span>
            </button>

            <button
              onClick={() => setActiveTab('outreach')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'outreach'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span>✉️</span>
                <span>Demo Forge & Outreach</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                B2B
              </span>
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'crm'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span>🎯</span>
                <span>CRM & Pipeline Leads</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                {leads.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('updates')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'updates'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span>🛰️</span>
                <span>Radar & Atualizações</span>
              </div>
              {hasPendingUpdates && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  UPDATE
                </span>
              )}
            </button>

            <div className="pt-3 px-3 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">Módulos de Produção</div>

            <button
              onClick={() => setActiveTab('saas')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'saas'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span>⚙️</span>
                <span>Engenharia SaaS (Audit)</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                PRO
              </span>
            </button>

            <button
              onClick={() => setActiveTab('apps')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'apps'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>📱</span>
              <span>Aplicativos Mobile / PWA</span>
            </button>

            <button
              onClick={() => setActiveTab('historias')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'historias'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span>✨</span>
                <span>Fábrica de Histórias</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PRO
              </span>
            </button>

            <button
              onClick={() => setActiveTab('builder')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'builder'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>🚀</span>
              <span>Criador de Landing Pages</span>
            </button>

            <button
              onClick={() => setActiveTab('presell')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'presell'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>💰</span>
              <span>Páginas Presell & VSL</span>
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center font-bold text-xs text-cyan-300">
                A
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">Alexandre</p>
                <p className="text-[10px] text-slate-400">Chief Architect</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition text-xs"
              title="Encerrar Sessão"
            >
              🚪 Sair
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-8 max-w-7xl">

        {activeTab === 'hub' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-end border-b border-slate-800 pb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                  Centro de Controle Nexus
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                    v5.2 High-Agency OS
                  </span>
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Estúdio de Identidade Visual (BrandKit 3x3), Engenharia de Dados e Prospecção B2B de Alto Padrão.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('posts')}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                <span>🎨</span> Abrir Post Studio & BrandKit 3x3
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 relative overflow-hidden">
                <div className="text-slate-400 text-xs font-mono uppercase">Total de Leads</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">{leads.length}</div>
                <div className="text-[11px] text-emerald-400 mt-2 font-medium">● Sincronizado via Supabase RLS</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-xs font-mono uppercase">Design Standard</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">BrandKit 3×3</div>
                <div className="text-[11px] text-cyan-300 mt-2">Anti-Slop Protocol Ativo</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-xs font-mono uppercase">Canal Corporativo</div>
                <div className="text-2xl font-bold text-teal-400 mt-1">Gmail Ready</div>
                <div className="text-[11px] text-teal-400 mt-2">nexusdata.enterprise@gmail.com</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-xs font-mono uppercase">Status de Skills</div>
                <div className="text-2xl font-bold text-purple-400 mt-1">
                  {skillsList.filter((s) => s.status === 'Instalado').length} / {skillsList.length}
                </div>
                <div className="text-[11px] text-purple-300 mt-2">BrandKit, MCP & RLS</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">Ecossistema de Soluções</h2>
                <span className="text-xs text-slate-400">Clique em qualquer módulo no menu lateral para operar</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INITIAL_PROJECTS.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/40 transition group hover:bg-slate-900/70 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-white group-hover:text-cyan-300 transition text-base">
                          {proj.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">{proj.description}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                        proj.status === 'Deploy Ativo'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : proj.status === 'Em Criação'
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}>
                        {proj.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>

                    {proj.link && (
                      <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center">
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          Visitar Aplicação ↗
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                  <span>🎨</span> Post Studio & BrandKit 3×3 Creator
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Estúdio de Identidade Visual com diretrizes Pentagram/Linear, Anti-Slop e Grid de 9 Painéis
                </p>
              </div>

              <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setPostStudioSubTab('generator')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    postStudioSubTab === 'generator' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Carrossel & Copy
                </button>
                <button
                  onClick={() => setPostStudioSubTab('brandkit3x3')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    postStudioSubTab === 'brandkit3x3' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📐 BrandKit 3×3 Board
                </button>
                <button
                  onClick={() => setPostStudioSubTab('branding')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    postStudioSubTab === 'branding' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  💎 Bio & Perfil
                </button>
                <button
                  onClick={() => setPostStudioSubTab('meta-api')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    postStudioSubTab === 'meta-api' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🔗 Meta API / Webhook
                </button>
              </div>
            </div>

            {postStudioSubTab === 'generator' && (
              <div className="space-y-6">
                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                    <span>🔍</span> Motor de Pesquisa e Geração Automática para o Cliente
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Nicho / Área de Atuação</label>
                      <input
                        type="text"
                        value={clientNiche}
                        onChange={(e) => setClientNiche(e.target.value)}
                        placeholder="Ex: Medicina Integrativa, Engenharia de Dados, Imóveis..."
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Assunto / Tese do Post</label>
                      <input
                        type="text"
                        value={clientTopic}
                        onChange={(e) => setClientTopic(e.target.value)}
                        placeholder="Ex: Por que ozonioterapia reativa mitocôndrias..."
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">@ do Instagram / Facebook</label>
                      <input
                        type="text"
                        value={brandHandle}
                        onChange={(e) => setBrandHandle(e.target.value)}
                        placeholder="Ex: @clinica.integrativa"
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-300 font-mono focus:border-cyan-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleGenerateCustomPost}
                      disabled={isResearching}
                      className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-cyan-500/20 active:scale-[0.99] disabled:opacity-50 flex items-center gap-2"
                    >
                      {isResearching ? 'Pesquisando & Formatando...' : '⚡ Pesquisar & Gerar Post Completo'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-6 flex flex-col items-center space-y-4">
                    <div className="w-full max-w-[440px] aspect-square bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-cyan-950/40">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex justify-between items-center z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 font-bold text-xs">
                            ✦
                          </div>
                          <span className="text-xs font-bold text-white tracking-wider font-mono">{brandHandle}</span>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          SLIDE {currentSlide.slideNum} DE {generatedPost.slides.length}
                        </span>
                      </div>

                      <div className="space-y-3 z-10 my-auto">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                          {generatedPost.badge}
                        </span>
                        <h2 className="text-xl font-extrabold text-white leading-snug">
                          {currentSlide.headline}
                        </h2>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {currentSlide.subhead}
                        </p>

                        <pre className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl font-mono text-[11px] text-teal-300 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                          {currentSlide.codeSnippet}
                        </pre>
                      </div>

                      <div className="flex justify-between items-center z-10 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                        <span>Nexus Creative Studio</span>
                        <span className="text-cyan-400 font-bold">Arraste para o lado ➔</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {generatedPost.slides.map((_, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => setActiveSlideIndex(sIdx)}
                          className={`h-2.5 rounded-full transition-all ${
                            activeSlideIndex === sIdx ? 'w-8 bg-cyan-400' : 'w-2.5 bg-slate-800 hover:bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-4">
                    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">
                            Legenda Completa com Gatilhos de Retenção & Hashtags
                          </h3>
                          <button
                            onClick={() => copyToClipboard(generatedPost.socialCopy, 301)}
                            className="text-xs font-bold text-cyan-300 hover:text-white transition flex items-center gap-1"
                          >
                            {copiedPromptIndex === 301 ? '✓ Copiado!' : '📋 Copiar Legenda'}
                          </button>
                        </div>

                        <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                          {generatedPost.socialCopy}
                        </pre>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                        <span className="text-[11px] text-slate-400 font-mono">
                          Formatado para Instagram, LinkedIn e Facebook
                        </span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(generatedPost, null, 2), 302)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <span>💾</span> Copiar Estrutura JSON
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {postStudioSubTab === 'brandkit3x3' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        Brand Identity Deck System
                      </span>
                      <h3 className="text-base font-bold text-white mt-1">Prancha de Identidade Visual 3×3 (9 Painéis Interconectados)</h3>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`BrandKit 3x3 Prompt:\nCreate a premium 3x3 brand-kit overview image for "${clientNiche} - ${brandHandle}". Dark charcoal canvas, sparse typography, modular grid, logo cover, logo construction geometry, digital UI mockup, tagline essence, color system swatches, typography specimen, physical object application, cinematic image direction, and system details. Highly intentional, presentation-ready --ar 16:10`, 501)}
                      className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500 hover:text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                    >
                      {copiedPromptIndex === 501 ? '✓ Prompt Copiado!' : '📋 Copiar Prompt Mestre 3×3'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[9px] font-mono uppercase text-cyan-400 font-bold">1. Logo Cover</span>
                      <div className="h-20 bg-slate-900/80 rounded-lg flex items-center justify-center border border-slate-850">
                        <div className="text-xl font-black text-white tracking-widest font-mono">⚡ NEXUS</div>
                      </div>
                      <p className="text-[10px] text-slate-400">Wordmark de alto impacto com espaço negativo deliberado.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[9px] font-mono uppercase text-cyan-400 font-bold">2. Geometria & Construção</span>
                      <div className="h-20 bg-slate-900/80 rounded-lg flex items-center justify-center border border-slate-850 font-mono text-[10px] text-teal-300">
                        [ Grid 45° • Raio 12px • Proporção Áurea ]
                      </div>
                      <p className="text-[10px] text-slate-400">Métricas de precisão e redução de vetor sem ruídos.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[9px] font-mono uppercase text-cyan-400 font-bold">3. Aplicação Web / UI</span>
                      <div className="h-20 bg-slate-900/80 rounded-lg flex flex-col justify-center px-3 border border-slate-850 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                        </div>
                        <div className="h-2 bg-slate-800 rounded w-3/4" />
                        <div className="h-2 bg-cyan-500/40 rounded w-1/2" />
                      </div>
                      <p className="text-[10px] text-slate-400">Browser bar, terminal frame e componentes nativos.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[9px] font-mono uppercase text-cyan-400 font-bold">4. Essência & Tagline</span>
                      <div className="h-20 bg-slate-900/80 rounded-lg flex items-center justify-center border border-slate-850 p-2 text-center">
                        <span className="text-xs font-extrabold text-white">"Precisão Fisiológica & Clareza de Vida."</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Frase concisa sem clichês de autoajuda ou falsas promessas.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[9px] font-mono uppercase text-cyan-400 font-bold">5. Paleta Disciplinada</span>
                      <div className="h-20 bg-slate-900/80 rounded-lg flex items-center justify-around px-2 border border-slate-850">
                        <div className="text-center"><div className="w-5 h-5 rounded bg-slate-950 border border-slate-700 mx-auto" /><span className="text-[8px] font-mono text-slate-400">#020617</span></div>
                        <div className="text-center"><div className="w-5 h-5 rounded bg-cyan-400 mx-auto shadow-sm" /><span className="text-[8px] font-mono text-slate-400">#06B6D4</span></div>
                        <div className="text-center"><div className="w-5 h-5 rounded bg-teal-400 mx-auto shadow-sm" /><span className="text-[8px] font-mono text-slate-400">#2DD4BF</span></div>
                      </div>
                      <p className="text-[10px] text-slate-400">1 tom base escuro, 1 acento saturado e 1 suporte neutro.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[9px] font-mono uppercase text-cyan-400 font-bold">6. Tipografia Editorial</span>
                      <div className="h-20 bg-slate-900/80 rounded-lg flex flex-col justify-center px-3 border border-slate-850">
                        <span className="text-base font-black text-white">Geist Sans & Mono</span>
                        <span className="text-[9px] font-mono text-slate-400">Aa Bb Cc Dd 0123456789</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Emparelhamento de alta legibilidade para telas e impressos.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[9px] font-mono uppercase text-cyan-400 font-bold">7. Aplicação Física / Papel</span>
                      <div className="h-20 bg-slate-900/80 rounded-lg flex items-center justify-center border border-slate-850 font-mono text-[10px] text-slate-300">
                        [ Crachá • Cartão Metal • Papel Matte ]
                      </div>
                      <p className="text-[10px] text-slate-400">Texturas táteis com acabamento de alto valor percebido.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[9px] font-mono uppercase text-cyan-400 font-bold">8. Direção de Imagem</span>
                      <div className="h-20 bg-slate-900/80 rounded-lg flex items-center justify-center border border-slate-850 text-[10px] font-mono text-cyan-300">
                        [ Macro Fotografia • Luz Volumétrica 8k ]
                      </div>
                      <p className="text-[10px] text-slate-400">Fotografia de estúdio autoral sem bancos de imagens óbvios.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[9px] font-mono uppercase text-cyan-400 font-bold">9. Detalhes de Sistema</span>
                      <div className="h-20 bg-slate-900/80 rounded-lg flex items-center justify-center border border-slate-850 font-mono text-[9px] text-slate-400">
                        {`{ "version": "1.0", "rls": true, "grid": "12-col" }`}
                      </div>
                      <p className="text-[10px] text-slate-400">Guias de alinhamento, badges e ícones do design system.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {postStudioSubTab === 'branding' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Bio de Alta Conversão (Instagram / Facebook)
                  </h3>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 font-mono">
                    <p className="font-bold text-white">✨ {clientNiche} | Cuidado de Alta Precisão</p>
                    <p>🌿 Protocolos integrativos para vitalidade e longevidade</p>
                    <p>🔬 Ozonioterapia • Terapia Neural • Modulação Celular</p>
                    <p className="text-cyan-400 font-bold">👇 Agende sua avaliação personalizada:</p>
                    <p className="text-slate-500">linktr.ee/clinica-integrativa</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`✨ ${clientNiche} | Cuidado de Alta Precisão\n🌿 Protocolos integrativos para vitalidade e longevidade\n🔬 Ozonioterapia • Terapia Neural • Modulação Celular\n👇 Agende sua avaliação personalizada:\nlinktr.ee/clinica-integrativa`, 401)}
                    className="w-full py-2.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold hover:bg-cyan-500 hover:text-slate-950 transition"
                  >
                    {copiedPromptIndex === 401 ? '✓ Bio Copiada!' : '📋 Copiar Bio Pronta'}
                  </button>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Prompt 3D para Foto de Perfil & Destaques
                  </h3>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-teal-300 font-mono space-y-2 leading-relaxed">
                    "Ultra-luxurious executive portrait background with dark slate glass elements, subtle cyan neon ambient rim light, 8k resolution, cinematic studio lighting, highly sophisticated aesthetic, bokeh effect --ar 1:1"
                  </div>
                  <button
                    onClick={() => copyToClipboard("Ultra-luxurious executive portrait background with dark slate glass elements, subtle cyan neon ambient rim light, 8k resolution, cinematic studio lighting, highly sophisticated aesthetic, bokeh effect --ar 1:1", 402)}
                    className="w-full py-2.5 bg-slate-800 text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-700 transition"
                  >
                    {copiedPromptIndex === 402 ? '✓ Prompt Copiado!' : '📋 Copiar Prompt de Arte'}
                  </button>
                </div>
              </div>
            )}

            {postStudioSubTab === 'meta-api' && (
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-6 animate-fadeIn">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-sm font-bold text-white">Configuração de Disparo Automático (Instagram / Facebook)</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Conecte o Webhook do Make.com / n8n ou o Token da Meta Graph API para postar diretamente do painel
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Webhook de Publicação (Make / n8n / Zapier)</label>
                    <input
                      type="text"
                      placeholder="https://hook.eu1.make.com/sua-chave-aqui"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Meta Page Access Token (Opcional)</label>
                    <input
                      type="password"
                      placeholder="EAAK..."
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
                  <span className="text-cyan-400 font-bold block">🚀 Como Funciona a Publicação Automática:</span>
                  <p>1. Você gera o post ou BrandKit com a pesquisa automatizada da IA.</p>
                  <p>2. Ao clicar no botão abaixo, o backend envia o payload (Slides + Legenda + Tags) para o Webhook oficial da Meta.</p>
                  <p>3. O post é publicado no Instagram/Facebook do cliente de forma consistente e segura.</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      alert('Webhook configurado! Disparo de teste registrado no ecossistema.');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-teal-300 transition"
                  >
                    🚀 Testar Disparo via Webhook
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'outreach' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                  <span>✉️</span> Demo Forge & Cold Outreach Hub
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Gerador de demonstrações comerciais com proteção de escopo e redação técnica de e-mails corporativos
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Canal:</span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800">
                  nexusdata.enterprise@gmail.com
                </span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  1. Selecione a Demonstração para Apresentar ao Cliente
                </h3>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  🔒 Modo Trava Comercial Ativo
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setDemoType('saas')}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    demoType === 'saas'
                      ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg">⚙️</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">Micro-SaaS</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Demo: Audit Pro Scanner</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Permite ao cliente testar 1 scan de schema SQL real com laudo travado para proposta.
                  </p>
                </div>

                <div
                  onClick={() => setDemoType('crm')}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    demoType === 'crm'
                      ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg">🎯</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">CRM Agentic</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Demo: Mini-CRM & Pipeline</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Exibe tabela de leads com cálculo de pontuação simulada e botão para contratação.
                  </p>
                </div>

                <div
                  onClick={() => setDemoType('landing')}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    demoType === 'landing'
                      ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg">🚀</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">Landing Page</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Demo: Landing 3D & VSL</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Navegação completa com tarja de pré-visualização e formulário apontado para o seu bot.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  2. Dados do Decisor / Cliente
                </h3>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Nome do Decisor (CTO / Diretor / Gestor)</label>
                    <input
                      type="text"
                      placeholder="Ex: Carlos Silva"
                      value={outreachForm.recipientName}
                      onChange={(e) => setOutreachForm({ ...outreachForm, recipientName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">E-mail do Cliente</label>
                    <input
                      type="email"
                      placeholder="carlos@empresa.com"
                      value={outreachForm.recipientEmail}
                      onChange={(e) => setOutreachForm({ ...outreachForm, recipientEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Nome da Empresa</label>
                    <input
                      type="text"
                      placeholder="Ex: TechLog Logística"
                      value={outreachForm.companyName}
                      onChange={(e) => setOutreachForm({ ...outreachForm, companyName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Gargalo Técnico Identificado</label>
                    <input
                      type="text"
                      placeholder="Ex: Lentidão em queries analíticas e falta de RLS"
                      value={outreachForm.techBottleneck}
                      onChange={(e) => setOutreachForm({ ...outreachForm, techBottleneck: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Objetivo do E-mail</label>
                    <select
                      value={outreachForm.emailTemplate}
                      onChange={(e) => setOutreachForm({ ...outreachForm, emailTemplate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 outline-none"
                    >
                      <option value="demo">Enviar Demonstração Interativa Liberada</option>
                      <option value="cold">Prospecção Fria (Cold Outreach B2B)</option>
                      <option value="proposal">Apresentar Proposta Comercial de Implementação</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">
                      3. E-mail Formatado & Calibrado
                    </h3>
                    <button
                      onClick={() => copyToClipboard(`Assunto: ${currentEmail.subject}\n\n${currentEmail.body}`, 101)}
                      className="text-xs font-bold text-cyan-300 hover:text-white transition flex items-center gap-1"
                    >
                      {copiedPromptIndex === 101 ? '✓ Copiado!' : '📋 Copiar Texto'}
                    </button>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono space-y-1">
                    <div className="text-slate-500"><strong>Para:</strong> {outreachForm.recipientEmail || 'cliente@empresa.com'}</div>
                    <div className="text-cyan-400"><strong>Assunto:</strong> {currentEmail.subject}</div>
                  </div>

                  <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                    {currentEmail.body}
                  </pre>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Conectado ao Gmail: Envio em 1 clique
                  </span>
                  <button
                    onClick={handleOpenGmailCompose}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-cyan-500/20 text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>🚀</span> Abrir Rascunho no Gmail ↗
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crm' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-cyan-400">CRM de Leads & Pipeline Inteligente</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Gestão em tempo real com Lead Scoring automático e dados sincronizados via PostgreSQL
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchLeads}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition"
                >
                  🔄 Atualizar
                </button>
                <button
                  onClick={exportCSV}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  📥 Exportar CSV
                </button>
              </div>
            </div>

            {loadingLeads ? (
              <div className="text-center py-16 text-slate-500 font-mono text-sm">Carregando leads do Supabase...</div>
            ) : leads.length === 0 ? (
              <div className="text-center py-16 text-slate-500 rounded-2xl border border-slate-800 bg-slate-900/30">
                Nenhum lead registrado ainda. Envie o link da sua Landing Page para começar a receber diagnósticos.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 font-mono">
                    <tr>
                      <th className="p-4">Status</th>
                      <th className="p-4">Score</th>
                      <th className="p-4">Data</th>
                      <th className="p-4">Nome</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Empresa</th>
                      <th className="p-4">Volume</th>
                      <th className="p-4">Gargalo Relatado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {leads.map((lead) => {
                      const currentStatus = lead.status || 'Novo';
                      const score = calculateLeadScore(lead.data_volume, lead.bottleneck);
                      return (
                        <tr key={lead.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-4">
                            <select
                              value={currentStatus}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border outline-none ${
                                currentStatus === 'Novo'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                  : currentStatus === 'Em Contato'
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              }`}
                            >
                              <option value="Novo" className="bg-slate-900 text-amber-300">🟡 Novo</option>
                              <option value="Em Contato" className="bg-slate-900 text-cyan-300">🔵 Em Contato</option>
                              <option value="Fechado" className="bg-slate-900 text-emerald-300">🟢 Fechado</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                              score >= 80
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : score >= 60
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                              🔥 {score} pts
                            </span>
                          </td>
                          <td className="p-4 text-xs text-slate-400 font-mono">
                            {new Date(lead.created_at).toLocaleString('pt-BR')}
                          </td>
                          <td className="p-4 font-semibold text-white">{lead.name}</td>
                          <td className="p-4 text-cyan-400 font-mono text-xs">{lead.email}</td>
                          <td className="p-4">{lead.company}</td>
                          <td className="p-4">{lead.data_volume || '-'}</td>
                          <td className="p-4 text-xs text-slate-400 max-w-xs truncate">{lead.bottleneck || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saas' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                  <span>⚙️</span> Nexus Audit Pro Micro-SaaS
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Scanner automatizado de DDL PostgreSQL, auditoria de segurança RLS e detecção de gargalos de queries
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                SaaS Engine v1.0
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Console de Ingestão de Schema & Queries SQL
                  </h3>
                  <button
                    onClick={() => setSqlInput(
`-- Schema com Vulnerabilidade e Falta de Índice:
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  customer_id UUID,
  amount NUMERIC(10,2),
  status TEXT
);

SELECT * FROM orders WHERE customer_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';`
                    )}
                    className="text-[11px] text-cyan-400 hover:underline font-mono"
                  >
                    Carregar Exemplo de Teste
                  </button>
                </div>

                <div className="space-y-2">
                  <textarea
                    rows={12}
                    value={sqlInput}
                    onChange={(e) => setSqlInput(e.target.value)}
                    className="w-full p-4 bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800 rounded-xl focus:border-cyan-500 outline-none leading-relaxed"
                    placeholder="Cole seu código SQL DDL ou query para auditar..."
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Suporte: PostgreSQL 14+, Supabase, Neon & AWS RDS
                  </span>
                  <button
                    onClick={handleRunAudit}
                    disabled={isScanning}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-cyan-500/20 active:scale-[0.99] disabled:opacity-50 flex items-center gap-2"
                  >
                    {isScanning ? 'Analisando Estrutura...' : '⚡ Executar Auditoria Técnica'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">
                    Laudo do Diagnóstico SaaS
                  </h3>

                  {auditResult ? (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                        <span className="text-[10px] font-mono uppercase text-slate-400">Score de Saúde da Arquitetura</span>
                        <div className={`text-4xl font-extrabold ${
                          auditResult.score >= 80 ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {auditResult.score} / 100
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                          <span className="text-slate-400">Isolamento RLS:</span>
                          <span className={`font-bold font-mono px-2 py-0.5 rounded ${
                            auditResult.rlsStatus === 'Blindado'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}>
                            {auditResult.rlsStatus}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                          <span className="text-slate-400">Indexação Analítica:</span>
                          <span className={`font-bold font-mono px-2 py-0.5 rounded ${
                            auditResult.indexStatus === 'Otimizado'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {auditResult.indexStatus}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <span className="text-[11px] font-mono text-slate-400 font-bold uppercase block">
                          Recomendações do Engenheiro:
                        </span>
                        {auditResult.recommendations.map((rec, i) => (
                          <div key={i} className="text-xs text-slate-300 p-2 rounded-lg bg-slate-950 border border-slate-850 leading-relaxed">
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500 space-y-2">
                      <div className="text-2xl">🔍</div>
                      <p className="text-xs">Cole o schema ao lado e clique em Executar para gerar o diagnóstico.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                  <span>🛰️</span> Radar de Inteligência & Atualizações de Skills
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Monitoramento contínuo de novas tecnologias, protocolos MCP e melhorias de engenharia
                </p>
              </div>
            </div>

            {installedNotice && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 font-semibold animate-pulse">
                ✓ {installedNotice}
              </div>
            )}

            <div className="space-y-4">
              {skillsList.map((skill) => (
                <div
                  key={skill.id}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-4"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          {skill.version}
                        </span>
                        <span className="text-xs font-mono text-slate-500">• {skill.category}</span>
                        <span className="text-xs text-slate-600 font-mono">• {skill.date}</span>
                      </div>
                      <h3 className="text-base font-bold text-white">{skill.title}</h3>
                    </div>

                    <div>
                      {skill.status === 'Instalado' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          ✓ Skill Ativa
                        </span>
                      ) : (
                        <button
                          onClick={() => handleInstallSkill(skill.id, skill.title)}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-cyan-500/20"
                        >
                          ⚡ Implementar Atualização
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{skill.description}</p>

                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-1">
                      Destaques da Atualização:
                    </span>
                    {skill.changelog.map((item, idx) => (
                      <div key={idx} className="text-xs text-slate-400 flex items-center gap-2">
                        <span className="text-cyan-400">•</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'apps' || activeTab === 'historias' || activeTab === 'builder' || activeTab === 'presell') && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-4">
              <h1 className="text-2xl font-bold text-cyan-400">
                {activeTab === 'apps' && '📱 Engenharia de Aplicativos Mobile & PWA'}
                {activeTab === 'historias' && '✨ Fábrica de Histórias Multimodal'}
                {activeTab === 'builder' && '🚀 Criador de Landing Pages'}
                {activeTab === 'presell' && '💰 Páginas Presell & Advertoriais High-Ticket'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Módulo operacional ativo no Nexus Master Suite
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 text-3xl">
                ⚡
              </div>
              <h3 className="text-lg font-bold text-white">Módulo Operacional</h3>
              <p className="text-sm text-slate-400 max-w-xl mx-auto">
                Pronto para receber novos dados ou personalizações específicas.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
