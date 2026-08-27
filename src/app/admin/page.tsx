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
    status: 'Em Criação',
    description: 'Scanner automatizado de schema PostgreSQL, detecção de gargalos e relatórios de conformidade.',
    tags: ['SaaS', 'PostgreSQL', 'SQL Parser']
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
    name: 'StoryForge - Módulo Infantil (Trolili)',
    module: 'fabrica-historias',
    status: 'Deploy Ativo',
    description: 'Gerador multimodal de narrativas infantis e roteiros 3D com Biscoito, Mimi, Pip e Quack.',
    tags: ['Infantil', 'Storytelling', 'Personagens 3D', 'Multi-Engine']
  },
  {
    id: '5',
    name: 'StoryForge - Módulo Bíblico em Blocos (Lego)',
    module: 'fabrica-historias',
    status: 'Deploy Ativo',
    description: 'Narrativas bíblicas e estudos em dioramas de blocos para crianças e adultos com rigor teológico.',
    tags: ['Religioso', 'Lego Diorama', 'Parábolas', 'Exegese']
  },
  {
    id: '6',
    name: 'Presell High-Ticket VSL',
    module: 'presell',
    status: 'Em Criação',
    description: 'Página advertorial de alta conversão com retenção de checkout e gatilhos de autoridade.',
    tags: ['Advertorial', 'Copywriting', 'Direct Response']
  },
  {
    id: '7',
    name: 'Post Studio & Social Multiplier',
    module: 'posts-design',
    status: 'Em Criação',
    description: 'Templates e carrosséis para Instagram e LinkedIn com visual sci-fi slate/cyan.',
    tags: ['Social Media', 'Design System', 'Canva/Figma']
  },
  {
    id: '8',
    name: 'Nexus Mobile Agent App',
    module: 'apps',
    status: 'Rascunho',
    description: 'PWA / App mobile para acompanhamento de métricas e alertas de leads em tempo real.',
    tags: ['PWA', 'Mobile', 'Tailwind']
  }
];

const SKILL_UPDATES: SkillUpdate[] = [
  {
    id: 'up-1',
    version: 'v3.2 Protocol',
    title: 'Model Context Protocol (MCP) & Agentic Router',
    category: 'IA Agentic',
    description: 'Permite conectar ferramentas externas, bancos de dados locais e scripts diretamente ao fluxo de raciocínio da IA.',
    date: '27/08/2026',
    status: 'Disponível',
    changelog: [
      'Orquestração de prompts multi-engine desacoplada',
      'Execução de código direto para análise de leads',
      'Segurança de credenciais em túnel isolado'
    ]
  },
  {
    id: 'up-2',
    version: 'v2.8 Engine',
    title: 'Multi-Engine Visual Calibrator (DALL-E 3, MJ 6.1, Ideogram)',
    category: 'Engenharia 3D',
    description: 'Formatador dinâmico de tags de iluminação volumétrica, aspecto de imagem e dioramas plásticos.',
    date: '27/08/2026',
    status: 'Instalado',
    changelog: [
      'Geração de dioramas Lego e animação 3D infantil',
      'Suporte a cópia de prompts com um clique',
      'Presets de render 8k e lentes tilt-shift'
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

  const [pageConcept, setPageConcept] = useState({
    title: '',
    type: 'Landing Page Comercial 3D',
    palette: 'Dark Sci-Fi (Cyan/Slate)',
    elements: '',
    copyObjective: ''
  });

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
      
      {/* SIDEBAR MASTER */}
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

            <div className="pt-3 px-3 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">Módulos de Produção</div>

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
              onClick={() => setActiveTab('saas')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'saas'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>⚙️</span>
              <span>Engenharia SaaS</span>
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

            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'posts'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>🎨</span>
              <span>Post Studio & Design</span>
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-72 p-8 max-w-7xl">

        {activeTab === 'hub' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-end border-b border-slate-800 pb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                  Centro de Controle Nexus
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                    v3.2 Architecture
                  </span>
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Orquestrador de engenharia de dados, geração multimodal de histórias e esteira de automações.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('updates')}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                <span>🛰️</span> Ver Radar de Skills & Updates
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 relative overflow-hidden">
                <div className="text-slate-400 text-xs font-mono uppercase">Total de Leads</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">{leads.length}</div>
                <div className="text-[11px] text-emerald-400 mt-2 font-medium">● Sincronizado via Supabase RLS</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-xs font-mono uppercase">Módulos Ativos</div>
                <div className="text-2xl font-bold text-white mt-1">8 Módulos</div>
                <div className="text-[11px] text-slate-400 mt-2">Landing, SaaS, CRM, Histórias...</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-xs font-mono uppercase">Infraestrutura</div>
                <div className="text-2xl font-bold text-teal-400 mt-1">Edge 100%</div>
                <div className="text-[11px] text-teal-400 mt-2">Next.js 15 + Vercel + PG</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-xs font-mono uppercase">Status de Skills</div>
                <div className="text-2xl font-bold text-purple-400 mt-1">
                  {skillsList.filter((s) => s.status === 'Instalado').length} / {skillsList.length}
                </div>
                <div className="text-[11px] text-purple-300 mt-2">MCP Router & Calibradores</div>
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

        {activeTab === 'historias' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-cyan-400">Fábrica de Histórias Multimodal (StoryForge)</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Geração estruturada com orquestrador de prompts calibrados para cada motor de IA
                </p>
              </div>

              <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setStorySubTab('religioso')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    storySubTab === 'religioso'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🧱 Módulo Bíblico (Lego Dioramas)
                </button>
                <button
                  onClick={() => setStorySubTab('infantil')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    storySubTab === 'infantil'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🧸 Módulo Infantil (Trolili & Kids)
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Motor de Destino:</span>
                <span className="text-xs text-slate-500">Adapta os prompts com os parâmetros específicos</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTargetEngine('dalle')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                    targetEngine === 'dalle'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>🟢</span> DALL-E 3 (Bing Grátis)
                </button>

                <button
                  onClick={() => setTargetEngine('midjourney')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                    targetEngine === 'midjourney'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>🟣</span> Midjourney (v6.1 RAW)
                </button>

                <button
                  onClick={() => setTargetEngine('ideogram')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                    targetEngine === 'ideogram'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>🟡</span> Ideogram (Tipografia 3D)
                </button>

                <button
                  onClick={() => setTargetEngine('gemini')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                    targetEngine === 'gemini'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>⚡</span> Gemini (Nano Banana Pro)
                </button>
              </div>
            </div>

            {storySubTab === 'religioso' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          Série Parábolas em Blocos
                        </span>
                        <h2 className="text-xl font-bold text-white mt-1">A Parábola da Casa na Rocha (Mateus 7:24-27)</h2>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
                      <p className="font-semibold text-cyan-300">📖 Conceito e Rigor Exegético:</p>
                      <p>
                        Apresenta o contraste entre construir na areia (*decisões convenientes e superficiais*) e na rocha (*princípios inegociáveis de Deus*), utilizando dioramas de miniaturas plásticas que encantam crianças e tocam profundamente adultos.
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-white font-mono">CENA 1: Os Dois Construtores no Vale</h4>
                          <button
                            onClick={() => copyToClipboard(currentLegoPrompts[0], 0)}
                            className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 text-xs font-bold transition flex items-center gap-1"
                          >
                            {copiedPromptIndex === 0 ? '✓ Copiado!' : '📋 Copiar Prompt'}
                          </button>
                        </div>
                        <p className="text-xs text-slate-400">
                          Dois pequenos bonecos recebem o mesmo mapa e começam a construir: um na areia macia e outro na colina de rocha cinzenta.
                        </p>
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-300 break-words">
                          {currentLegoPrompts[0]}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-white font-mono">CENA 2: A Tempestade e as Ondas de Acrílico</h4>
                          <button
                            onClick={() => copyToClipboard(currentLegoPrompts[1], 1)}
                            className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 text-xs font-bold transition flex items-center gap-1"
                          >
                            {copiedPromptIndex === 1 ? '✓ Copiado!' : '📋 Copiar Prompt'}
                          </button>
                        </div>
                        <p className="text-xs text-slate-400">
                          As nuvens escuras e a chuva de peças azuis transbordam os rios. O teste dos alicerces começa para ambas as estruturas.
                        </p>
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-300 break-words">
                          {currentLegoPrompts[1]}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-white font-mono">CENA 3: A Casa Inabalável na Rocha</h4>
                          <button
                            onClick={() => copyToClipboard(currentLegoPrompts[2], 2)}
                            className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 text-xs font-bold transition flex items-center gap-1"
                          >
                            {copiedPromptIndex === 2 ? '✓ Copiado!' : '📋 Copiar Prompt'}
                          </button>
                        </div>
                        <p className="text-xs text-slate-400">
                          A casa da areia se desfaz em peças soltas, enquanto a casa na rocha resiste firme aos ventos e à tempestade.
                        </p>
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-300 break-words">
                          {currentLegoPrompts[2]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="font-bold text-cyan-400 text-xs uppercase font-mono tracking-wider">
                      Instruções de Produção
                    </h3>
                    <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <strong className="text-white block mb-1">1. DALL-E 3 (Bing / Copilot):</strong>
                        Gere gratuitamente no <em>bing.com/images/create</em>. Excelente para diorama de Lego fiel.
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <strong className="text-white block mb-1">2. Midjourney (v6.1):</strong>
                        Gera a melhor iluminação de estúdio macro. O prompt já inclui as tags <code className="text-purple-300">--v 6.1 --style raw</code>.
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <strong className="text-white block mb-1">3. Refinamento:</strong>
                        Mande a imagem aqui no chat caso queira calibrar qualquer ângulo sem alterar a identidade.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {storySubTab === 'infantil' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        Universo Trolili 3D
                      </span>
                      <h2 className="text-xl font-bold text-white mt-1">Biscoito e a Ponte das Frutas Luminosas</h2>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                    <p className="font-semibold text-cyan-300">🐾 Personagens Protagonistas:</p>
                    <p>• <strong>Biscoito:</strong> Cãozinho Beagle curioso com mochila ciano.</p>
                    <p>• <strong>Mimi:</strong> Gatinha persa branca com laço brilhante.</p>
                    <p>• <strong>Pip & Quack:</strong> O passarinho azul e o patinho de óculos de aviador.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-white font-mono">PROMPT 3D DISNEY/PIXAR RENDER</h4>
                      <button
                        onClick={() => copyToClipboard("Full 3D Disney Pixar style render, a cheerful little Beagle puppy named Biscoito wearing a small teal backpack, holding a glowing golden star-fruit, beside a fluffy cute white kitten named Mimi with a cyan ribbon, sunbeams filtering through magical enchanted forest trees, cinematic soft lighting, volumetric atmosphere, ultra-detailed fur, 8k resolution, vibrant pastel palette --ar 16:9", 10)}
                        className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 text-xs font-bold transition flex items-center gap-1"
                      >
                        {copiedPromptIndex === 10 ? '✓ Copiado!' : '📋 Copiar Prompt'}
                      </button>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-300 break-words">
                      Full 3D Disney Pixar style render, a cheerful little Beagle puppy named Biscoito wearing a small teal backpack, holding a glowing golden star-fruit, beside a fluffy cute white kitten named Mimi with a cyan ribbon, sunbeams filtering through magical enchanted forest trees, cinematic soft lighting, volumetric atmosphere, ultra-detailed fur, 8k resolution, vibrant pastel palette --ar 16:9
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-cyan-400 text-xs uppercase font-mono">Música Educativa</h3>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 italic space-y-2">
                    <p>"Um pedaço para você, um pedaço para mim!"</p>
                    <p>"Dividir com os amigos é gostoso assim!"</p>
                    <p>"Se a ponte balançar, dou a mão pra te ajudar!" 🎶</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'builder' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-4">
              <h1 className="text-2xl font-bold text-cyan-400">Criador Guiado de Landing Pages</h1>
              <p className="text-xs text-slate-400 mt-1">
                Defina os parâmetros visuais, envie as referências e monte sua página com suporte da IA
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  1. Especificações da Nova Página
                </h3>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Nome do Projeto / Título da Página</label>
                  <input
                    type="text"
                    placeholder="Ex: Landing Page Imersão IA ou Presell Produto X"
                    value={pageConcept.title}
                    onChange={(e) => setPageConcept({ ...pageConcept, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-cyan-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Modelo / Categoria</label>
                    <select
                      value={pageConcept.type}
                      onChange={(e) => setPageConcept({ ...pageConcept, type: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-cyan-500 outline-none"
                    >
                      <option value="Landing Page Comercial 3D">Landing Page 3D Futurista</option>
                      <option value="Página de Captura Minimalista">Página de Captura Minimalista</option>
                      <option value="Presell Advertorial de Alta Conversão">Presell Advertorial / VSL</option>
                      <option value="Portal Institucional & Serviços">Portal Institucional & Serviços</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Paleta Visual & Tema</label>
                    <select
                      value={pageConcept.palette}
                      onChange={(e) => setPageConcept({ ...pageConcept, palette: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-cyan-500 outline-none"
                    >
                      <option value="Dark Sci-Fi (Cyan/Slate)">Dark Sci-Fi (Slate 950 + Ciano Neon)</option>
                      <option value="Emerald Cyber (Green/Dark)">Emerald Cyber (Verde Esmeralda + Dark)</option>
                      <option value="Clean Tech White">Clean Tech (Branco Puro + Azul Marinho)</option>
                      <option value="Luxury Gold & Black">Luxury (Dourado + Preto Fosco)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Objetivo da Copy & Público-Alvo</label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Atrair gestores de TI e empresas que precisam blindar seus bancos de dados e acelerar queries analíticas..."
                    value={pageConcept.copyObjective}
                    onChange={(e) => setPageConcept({ ...pageConcept, copyObjective: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-cyan-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Elementos & Seções Desejadas</label>
                  <input
                    type="text"
                    placeholder="Ex: Hero com malha 3D, Comparativo de Planos, Depoimentos, Formulário Supabase..."
                    value={pageConcept.elements}
                    onChange={(e) => setPageConcept({ ...pageConcept, elements: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-cyan-400 uppercase font-mono tracking-wider">
                    2. Fluxo Guiado com a IA
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ao definir os campos ao lado, você pode mandar prints, referências e solicitar ajustes finos aqui mesmo.
                  </p>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-cyan-400 font-bold">Passo 1:</span> Estruturação do Wireframe & Copy
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-cyan-400 font-bold">Passo 2:</span> Modelagem 3D / Componentes Visuais
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-cyan-400 font-bold">Passo 3:</span> Conexão Supabase + Deploy Vercel
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-xl text-xs text-cyan-300">
                  💡 <strong>Dica Pro:</strong> Basta enviar a foto/print da referência no chat que a IA transforma em código Next.js na hora.
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'saas' || activeTab === 'apps' || activeTab === 'presell' || activeTab === 'posts') && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-4">
              <h1 className="text-2xl font-bold text-cyan-400">
                {activeTab === 'saas' && '⚙️ Engenharia SaaS & Micro-SaaS'}
                {activeTab === 'apps' && '📱 Engenharia de Aplicativos Mobile & PWA'}
                {activeTab === 'presell' && '💰 Páginas Presell & Advertoriais High-Ticket'}
                {activeTab === 'posts' && '🎨 Post Studio & Design System'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Ambiente integrado de prototipagem rápida e desenvolvimento modular com IA
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 text-3xl">
                ⚡
              </div>
              <h3 className="text-lg font-bold text-white">Módulo Pronto para Construção Guiada</h3>
              <p className="text-sm text-slate-400 max-w-xl mx-auto">
                Basta me enviar referências visuais, prints ou diretrizes aqui no chat para desenvolvermos a solução completa.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
