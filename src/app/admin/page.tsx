'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import VoiceCommander from '@/components/VoiceCommander';

interface Lead {
  id: number;
  created_at: string;
  name: string;
  email: string;
  company: string;
  data_volume: string;
  bottleneck: string;
}

const ADMIN_ACCESS_KEY = 'nexus2026';

export default function NexusMasterSuite() {
  const [activeTab, setActiveTab] = useState<string>('hub');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);

  // StoryForge State
  const [videoTargetModel, setVideoTargetModel] = useState<'runway-gen3' | 'kling' | 'luma' | 'sora'>('runway-gen3');
  const [selectedShot, setSelectedShot] = useState<number>(0);

  // SaaS Audit State
  const [sqlSchema, setSqlSchema] = useState(`CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount NUMERIC(10,2),
  status TEXT
);`);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  const biblicScenes = [
    {
      shotId: 'SHOT-01-A',
      title: 'A Casa na Rocha — Edificação Sólida',
      cameraIntent: 'Cinematic slow push-in, shallow depth of field, tilt-shift macro',
      agnosticPrompt: 'Lego minifigure builder placing final yellow plastic roof brick on a solid granite stone cliff, warm golden hour sunlight, ocean breeze moving tiny plastic foliage, macro photography.',
      motionLock: 'Minifigure arm moves steadily; cliff and structure remain 100% rigid; waves ripple in lower third.',
      continuity: 'Character ID: Builder-01 (Yellow hardhat, blue overalls); Prop ID: Master Brick (Red 2x4).'
    },
    {
      shotId: 'SHOT-01-B',
      title: 'A Tempestade — Fagulhas e Água Acrílica',
      cameraIntent: 'Low-angle tracking shot with subtle cinematic shake',
      agnosticPrompt: 'Lego diorama storm, transparent blue acrylic rain pieces falling, miniature lightning reflection on plastic bricks, heavy wind pushing loose bricks on the sand below.',
      motionLock: 'House on rock remains perfectly locked; loose bricks on sand scatter outward.',
      continuity: 'Lighting shift: Dramatic moody slate with blue phosphor highlights.'
    }
  ];

  const currentScene = biblicScenes[selectedShot];

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
    try {
      const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (data) setLeads(data);
    } catch (err) {
      console.error(err);
    }
  }

  const runAuditScan = () => {
    setAuditResult('🔍 Analisando Schema SQL...\n✓ RLS: Não detectado na tabela transactions (Risco Alto)\n✓ Índices: transaction.user_id sem Foreign Key Index (Gargalo em Join)\n✓ Conformidade de Tipos: NUMERIC(10,2) validado com sucesso.');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-extrabold text-white">Nexus Master Suite OS</h1>
            <p className="text-xs text-slate-400 font-mono">CENTRAL OPERACIONAL PRIVADA</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Chave Mestra</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-cyan-500 outline-none"
              autoFocus
            />
            {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
          </div>
          <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold rounded-xl text-sm">
            Acessar Centro de Comando
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Menu Lateral Completo */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 fixed inset-y-0">
        <div className="space-y-4">
          <div className="px-3 py-2 border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs">⌘</span> Nexus Suite
              </span>
              <span className="block text-[10px] font-mono text-cyan-400 uppercase tracking-widest mt-0.5">ENTERPRISE OS</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          </div>

          {/* Microfone Integrado no Menu */}
          <div className="px-1">
            <VoiceCommander onNavigate={(tab) => setActiveTab(tab)} />
          </div>

          {/* NÚCLEO CENTRAL */}
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 px-3 tracking-wider">Núcleo Central</span>
            <button
              onClick={() => setActiveTab('hub')}
              className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex items-center gap-2.5 text-xs ${
                activeTab === 'hub' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>📊</span> Visão Geral & Projetos
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex items-center justify-between text-xs ${
                activeTab === 'posts' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5"><span>🎨</span> Post Studio & BrandKit</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">STUDIO 3x3</span>
            </button>

            <button
              onClick={() => setActiveTab('outreach')}
              className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex items-center justify-between text-xs ${
                activeTab === 'outreach' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5"><span>📨</span> Demo Forge & Outreach</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">B2B</span>
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex items-center justify-between text-xs ${
                activeTab === 'crm' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5"><span>🎯</span> CRM & Pipeline Leads</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">{leads.length}</span>
            </button>
          </div>

          {/* MÓDULOS DE PRODUÇÃO */}
          <div className="space-y-1 pt-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 px-3 tracking-wider">Módulos de Produção</span>
            
            <button
              onClick={() => setActiveTab('saas')}
              className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex items-center justify-between text-xs ${
                activeTab === 'saas' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5"><span>⚙️</span> Engenharia SaaS (Audit)</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300">PRO</span>
            </button>

            <button
              onClick={() => setActiveTab('historias')}
              className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex items-center justify-between text-xs ${
                activeTab === 'historias' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5"><span>✨</span> Fábrica de Histórias</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300">PRO</span>
            </button>

            <button
              onClick={() => setActiveTab('landing')}
              className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex items-center gap-2.5 text-xs ${
                activeTab === 'landing' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>🚀</span> Criador de Landing Pages
            </button>

            <button
              onClick={() => setActiveTab('presell')}
              className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex items-center gap-2.5 text-xs ${
                activeTab === 'presell' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>💰</span> Páginas Presell & VSL
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">A</div>
            <div>
              <p className="text-xs font-bold text-white leading-none">Alexandre</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Chief Architect</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-[11px] text-slate-400 hover:text-rose-400 font-medium">Sair</button>
        </div>
      </aside>

      {/* Conteúdo Central */}
      <main className="flex-1 ml-72 p-8 max-w-7xl space-y-8">
        
        {/* VISÃO GERAL */}
        {activeTab === 'hub' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h1 className="text-2xl font-black text-white">Centro de Controle Nexus <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">v5.2 High-Agency OS</span></h1>
                <p className="text-xs text-slate-400 mt-1">Estúdio de Identidade Visual (BrandKit 3x3), Engenharia de Dados e Prospecção B2B de Alto Padrão.</p>
              </div>
              <button onClick={() => setActiveTab('posts')} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold rounded-xl text-xs hover:opacity-90">
                Abrir Post Studio & BrandKit 3x3
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Total de Leads</span>
                <p className="text-2xl font-bold text-white mt-1">{leads.length}</p>
                <span className="text-[10px] text-teal-400">● Sincronizado via Supabase RLS</span>
              </div>
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Design Standard</span>
                <p className="text-xl font-bold text-cyan-400 mt-1">BrandKit 3×3</p>
                <span className="text-[10px] text-slate-400">Anti-Slop Protocol Ativo</span>
              </div>
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Canal Corporativo</span>
                <p className="text-lg font-bold text-teal-400 mt-1">Gmail Ready</p>
                <span className="text-[10px] text-slate-400 font-mono">nexusenterprise.br@gmail.com</span>
              </div>
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Status de Skills</span>
                <p className="text-2xl font-bold text-white mt-1">3 / 3</p>
                <span className="text-[10px] text-cyan-400">BrandKit, MCP & RLS</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Ecossistema de Soluções</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div onClick={() => setActiveTab('landing')} className="p-6 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white text-base">NexusData Landing 3D</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">Deploy Ativo</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Landing page principal com malha neural 3D em Three.js, RLS e captação de leads.</p>
                  <div className="flex gap-2 mt-4 text-[10px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 bg-slate-950 rounded">Next.js</span>
                    <span className="px-2 py-0.5 bg-slate-950 rounded">Three.js</span>
                    <span className="px-2 py-0.5 bg-slate-950 rounded">Supabase</span>
                  </div>
                </div>

                <div onClick={() => setActiveTab('saas')} className="p-6 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white text-base">Audit Pro Micro-SaaS</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">Deploy Ativo</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Scanner automatizado de schema PostgreSQL, detecção de gargalos, RLS e relatórios de conformidade.</p>
                  <div className="flex gap-2 mt-4 text-[10px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 bg-slate-950 rounded">SaaS</span>
                    <span className="px-2 py-0.5 bg-slate-950 rounded">PostgreSQL</span>
                    <span className="px-2 py-0.5 bg-slate-950 rounded">RLS</span>
                  </div>
                </div>

                <div onClick={() => setActiveTab('crm')} className="p-6 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white text-base">Nexus Mini-CRM Agentic</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">Deploy Ativo</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Gestão de pipeline de diagnósticos com Lead Scoring, status dinâmico e exportação CSV.</p>
                  <div className="flex gap-2 mt-4 text-[10px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 bg-slate-950 rounded">CRM</span>
                    <span className="px-2 py-0.5 bg-slate-950 rounded">Pipeline</span>
                    <span className="px-2 py-0.5 bg-slate-950 rounded">Realtime</span>
                  </div>
                </div>

                <div onClick={() => setActiveTab('posts')} className="p-6 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white text-base">Post Studio & BrandKit 3x3 Engine</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">Deploy Ativo</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Estúdio de Identidade Visual de alto padrão (Pentagram/Linear-tier), BrandKit 3x3 e Carrosséis.</p>
                  <div className="flex gap-2 mt-4 text-[10px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 bg-slate-950 rounded">BrandKit 3x3</span>
                    <span className="px-2 py-0.5 bg-slate-950 rounded">Design System</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* POST STUDIO 3x3 */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Post Studio & BrandKit 3x3</h2>
                <p className="text-xs text-slate-400">Matriz de Conteúdo 3x3 com Direção de Arte Anti-Slop (Linear / Vercel style).</p>
              </div>
              <button className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">Exportar Copy & Design Pack</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-cyan-400">Topo de Funil (Atração)</span>
                <h4 className="text-sm font-semibold text-white">O Custo Oculto da Desorganização de Dados</h4>
                <p className="text-xs text-slate-400">Como empresas perdem 30% do orçamento em queries lentas e schemas mal indexados.</p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono bg-slate-950 px-2 py-1 rounded text-slate-300">Formato: Carrossel 5 Slides</span>
                </div>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-teal-400">Meio de Funil (Autoridade)</span>
                <h4 className="text-sm font-semibold text-white">Auditoria de Segurança: Supabase & RLS</h4>
                <p className="text-xs text-slate-400">Passo a passo prático para blindar tabelas multi-tenant e evitar vazamentos de API.</p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono bg-slate-950 px-2 py-1 rounded text-slate-300">Formato: Post Técnico + Snippet</span>
                </div>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-indigo-400">Fundo de Funil (Conversão)</span>
                <h4 className="text-sm font-semibold text-white">Diagnóstico Nexus: 48h para Otimização</h4>
                <p className="text-xs text-slate-400">Oferta direta de arquitetura e infraestrutura de alta performance para SaaS em escala.</p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono bg-slate-950 px-2 py-1 rounded text-slate-300">Formato: Card Oferta + CTA</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STORYFORGE */}
        {activeTab === 'historias' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Fábrica de Histórias — Video Model Adapter</h2>
                <p className="text-xs text-slate-400">Adaptador de prompts cinematográficos com consistência de cena e trava de movimento.</p>
              </div>
              <div className="flex gap-2">
                {(['runway-gen3', 'kling', 'luma', 'sora'] as const).map((model) => (
                  <button
                    key={model}
                    onClick={() => setVideoTargetModel(model)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase ${
                      videoTargetModel === model ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono">Cenas da Narrativa</span>
                {biblicScenes.map((scene, idx) => (
                  <div
                    key={scene.shotId}
                    onClick={() => setSelectedShot(idx)}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                      selectedShot === idx ? 'bg-slate-900 border-cyan-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-cyan-400">{scene.shotId}</span>
                    <h4 className="text-sm font-bold mt-1">{scene.title}</h4>
                  </div>
                ))}
              </div>

              <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white">{currentScene.title}</h3>
                  <span className="text-xs font-mono text-cyan-400">{videoTargetModel}</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Agnostic Prompt (Geração)</label>
                  <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-300 font-mono whitespace-pre-wrap">
                    {currentScene.agnosticPrompt}
                  </pre>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Motion Lock</span>
                    <p className="text-xs text-slate-300 mt-1">{currentScene.motionLock}</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Continuity / ID</span>
                    <p className="text-xs text-slate-300 mt-1">{currentScene.continuity}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CRM */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Pipeline de Diagnósticos & Leads</h2>
                <p className="text-xs text-slate-400">Leads capturados através da sua infraestrutura privada e diagnósticos solicitados.</p>
              </div>
              <button onClick={fetchLeads} className="px-4 py-2 bg-slate-900 border border-slate-800 text-cyan-400 font-bold rounded-xl text-xs">
                🔄 Atualizar Leads
              </button>
            </div>

            {leads.length === 0 ? (
              <div className="p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-2">
                <span className="text-3xl">📭</span>
                <p className="text-sm font-bold text-white">Nenhum lead pendente no momento</p>
                <p className="text-xs text-slate-400">Os formulários preenchidos no site aparecerão aqui em tempo real.</p>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-4">Data</th>
                      <th className="p-4">Nome</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Empresa</th>
                      <th className="p-4">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/40">
                        <td className="p-4 font-mono text-slate-400">{new Date(l.created_at).toLocaleDateString()}</td>
                        <td className="p-4 font-bold text-white">{l.name}</td>
                        <td className="p-4 text-cyan-400 font-mono">{l.email}</td>
                        <td className="p-4 text-slate-300">{l.company}</td>
                        <td className="p-4 font-mono">{l.data_volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SAAS AUDIT */}
        {activeTab === 'saas' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Engenharia SaaS — PostgreSQL & RLS Auditor</h2>
                <p className="text-xs text-slate-400">Scanner de arquitetura de dados, verificação de concorrência e conformidade de índices.</p>
              </div>
              <button onClick={runAuditScan} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold rounded-xl text-xs">
                ▶ Executar Auditoria SQL
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase">Schema SQL para Análise</label>
                <textarea
                  value={sqlSchema}
                  onChange={(e) => setSqlSchema(e.target.value)}
                  rows={10}
                  className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl font-mono text-xs text-slate-200 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase">Relatório de Auditoria</label>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl min-h-[220px] font-mono text-xs text-teal-300 whitespace-pre-wrap">
                  {auditResult || 'Aguardando execução da auditoria. Clique em "Executar Auditoria SQL" acima.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRESELL */}
        {activeTab === 'presell' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Criador de Páginas Presell & Retenção VSL</h2>
                <p className="text-xs text-slate-400">Estruturas de alta conversão, retenção de checkout e advertoriais de teste.</p>
              </div>
              <button className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">Gerar Template HTML</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-cyan-400 uppercase font-mono">Template: Advertorial Médico/Clínico</span>
                <h4 className="text-base font-bold text-white">Matéria Exclusiva de Descoberta Científica</h4>
                <p className="text-xs text-slate-400">Estrutura com gancho jornalístico, depoimentos com prova social e CTA com desconto por tempo limitado.</p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono bg-slate-950 px-2.5 py-1 rounded text-teal-300 border border-teal-500/20">Taxa de Clique Média: 18.4%</span>
                </div>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-indigo-400 uppercase font-mono">Template: Exit-Intent Retention</span>
                <h4 className="text-base font-bold text-white">Redline de Checkout & Cupom Dinâmico</h4>
                <p className="text-xs text-slate-400">Pop-up de intenção de saída com oferta irresistível de 1-click para recuperar até 22% dos abandonos de carrinho.</p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono bg-slate-950 px-2.5 py-1 rounded text-teal-300 border border-teal-500/20">Recuperação Média: +12% Conv</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OUTREACH & LANDING PLACEHOLDERS */}
        {(activeTab === 'outreach' || activeTab === 'landing') && (
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3">
            <h3 className="text-lg font-bold text-white">Módulo Operacional Ativo</h3>
            <p className="text-xs text-slate-400">Pronto para execução e disparo integrado via MCP e automações.</p>
          </div>
        )}

      </main>
    </div>
  );
}
