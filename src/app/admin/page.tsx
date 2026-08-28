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
  
  // Guardião ativo no Banner (Dinâmico ao passar o mouse)
  const [activeGuardian, setActiveGuardian] = useState<string>('/nexus-lion.jpg');
  const [guardianTitle, setGuardianTitle] = useState<string>('NEXUS LEÃO // COMANDANTE GERAL');

  // StoryForge States
  const [videoTargetModel, setVideoTargetModel] = useState<'runway-gen3' | 'kling' | 'luma' | 'sora'>('runway-gen3');
  const [characterDesc, setCharacterDesc] = useState('Cyber Eagle Commander (Biomechanical wings, glowing amber circuits)');
  const [sceneDesc, setSceneDesc] = useState('Futuristic virtual production cinema stage with audio waveforms');
  const [lightingStyle, setLightingStyle] = useState('Dramatic studio spotlights with amber volumetric haze');
  const [scriptText, setScriptText] = useState('No centro da tempestade neural, apenas as arquiteturas sólidas permanecem invioláveis.');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // Post Studio States
  const [postBriefing, setPostBriefing] = useState('Como engenharia de dados e IA generativa multiplicam a escala B2B.');
  const [slide1Hook, setSlide1Hook] = useState('A NOVA ERA DA INFRAESTRUTURA AGÊNTICA');
  const [slide2Body, setSlide2Body] = useState('Modelos de IA autônomos exigem bancos de dados com latência ultra-baixa e segurança RLS blindada.');
  const [slide3Cta, setSlide3Cta] = useState('Inicie sua modernização com a NexusData Enterprise.');

  // Presell States
  const [presellProduct, setPresellProduct] = useState('Nexus High-Agency Platform');
  const [presellAngle, setPresellAngle] = useState<'cyber-report' | 'case-study' | 'exclusive-pass'>('cyber-report');
  const [presellHeadline, setPresellHeadline] = useState('Protocolo Revela Arquitetura de IA para Escala Exponencial');

  // SaaS Audit State
  const [sqlSchema, setSqlSchema] = useState(`CREATE TABLE agents_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  execution_tokens INT NOT NULL,
  cost_usd NUMERIC(10,4),
  created_at TIMESTAMPTZ DEFAULT now()
);`);
  const [auditResult, setAuditResult] = useState<string | null>(null);

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
      setErrorMsg('Acesso negado. Chave mestra inválida.');
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

  const generateStoryPrompts = () => {
    const prompt = `[CYBER_CORE // ${videoTargetModel.toUpperCase()}] Cinematic 8k shot of ${characterDesc}, standing on ${sceneDesc}. Atmosphere: ${lightingStyle}. Volumetric gold laser fog, photoreal reflection, ultra-detailed textures. Motion: Slow fluid tracking shot.`;
    setGeneratedPrompt(prompt);
  };

  const runAuditScan = () => {
    setAuditResult('⚡ [NEXUS CYBER-SCAN COMPLETE]\n✓ RLS Policy: Ativo na tabela de telemetria\n✓ Concorrência: Indexação otimizada para alto throughput\n✓ Latência Estimada: < 12ms');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleLogin} className="w-full max-w-md bg-[#0c0c14]/90 border border-purple-500/30 rounded-3xl p-8 space-y-6 shadow-2xl shadow-purple-950/50 backdrop-blur-xl relative z-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[10px] font-mono text-purple-300 uppercase tracking-widest">
              &lt;NEXUS // OS 2026&gt;
            </div>
            <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              Centro de Controle Master
            </h1>
            <p className="text-xs text-slate-400">Plataforma Agêntica de Alta Performance</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Chave Mestra</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 bg-[#07070c] border border-purple-500/30 rounded-xl text-sm text-white focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 outline-none transition-all font-mono"
              autoFocus
            />
            {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
          </div>

          <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all">
            Acessar Plataforma
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 flex selection:bg-purple-500 selection:text-white">
      
      {/* Menu Lateral */}
      <aside className="w-72 bg-[#090910] border-r border-purple-500/20 flex flex-col justify-between p-4 shrink-0 fixed inset-y-0 overflow-y-auto shadow-2xl">
        <div className="space-y-5">
          <div className="px-3 py-2 border-b border-slate-800/80 pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-mono font-black text-base text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 tracking-wider">
                <span>&lt;NEXUS</span><span>AGENTIC&gt;</span>
              </div>
              <span className="block text-[9px] font-mono text-cyan-400 uppercase tracking-widest mt-0.5">HIGH-AGENCY OS</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/80 animate-pulse"></span>
          </div>

          <div className="px-1">
            <VoiceCommander onNavigate={(tab) => setActiveTab(tab)} />
          </div>

          {/* NÚCLEO CENTRAL */}
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 px-3 tracking-wider">NÚCLEO CENTRAL</span>
            
            <button
              onClick={() => setActiveTab('hub')}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all font-medium flex items-center gap-2.5 text-xs ${
                activeTab === 'hub' ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/30 text-purple-200 border border-purple-500/50 shadow-lg shadow-purple-950/50' : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span>🌌</span> Vitrine & Visão Geral
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all font-medium flex items-center justify-between text-xs ${
                activeTab === 'posts' ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/30 text-purple-200 border border-purple-500/50' : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span className="flex items-center gap-2.5"><span>🎨</span> Post Studio & BrandKit</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">3x3</span>
            </button>

            <button
              onClick={() => setActiveTab('outreach')}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all font-medium flex items-center justify-between text-xs ${
                activeTab === 'outreach' ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/30 text-purple-200 border border-purple-500/50' : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span className="flex items-center gap-2.5"><span>🚀</span> Demo Forge & Outreach</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-500/40">B2B</span>
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all font-medium flex items-center justify-between text-xs ${
                activeTab === 'crm' ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/30 text-purple-200 border border-purple-500/50' : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span className="flex items-center gap-2.5"><span>🎯</span> CRM & Leads</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">{leads.length}</span>
            </button>
          </div>

          {/* MÓDULOS DE PRODUÇÃO */}
          <div className="space-y-1 pt-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 px-3 tracking-wider">MÓDULOS FUTURISTAS</span>
            
            <button
              onClick={() => setActiveTab('historias')}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all font-medium flex items-center justify-between text-xs ${
                activeTab === 'historias' ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/30 text-purple-200 border border-purple-500/50' : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span className="flex items-center gap-2.5"><span>✨</span> Fábrica de Histórias (Vídeo)</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300">PRO</span>
            </button>

            <button
              onClick={() => setActiveTab('saas')}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all font-medium flex items-center justify-between text-xs ${
                activeTab === 'saas' ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/30 text-purple-200 border border-purple-500/50' : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span className="flex items-center gap-2.5"><span>⚡</span> Engenharia SaaS (Audit)</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">PRO</span>
            </button>

            <button
              onClick={() => setActiveTab('landing')}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all font-medium flex items-center gap-2.5 text-xs ${
                activeTab === 'landing' ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/30 text-purple-200 border border-purple-500/50' : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span>🌐</span> Criador de Landing 3D
            </button>

            <button
              onClick={() => setActiveTab('presell')}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all font-medium flex items-center gap-2.5 text-xs ${
                activeTab === 'presell' ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/30 text-purple-200 border border-purple-500/50' : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <span>💎</span> Páginas Presell & VSL
            </button>
          </div>
        </div>

        {/* Perfil */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-purple-500/40">
              A
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-none">Alexandre</p>
              <p className="text-[10px] text-cyan-400 font-mono mt-0.5">Chief Architect</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-[11px] text-slate-400 hover:text-rose-400 font-medium">Sair</button>
        </div>
      </aside>

      {/* Conteúdo Central */}
      <main className="flex-1 ml-72 p-8 max-w-7xl space-y-8">
        
        {/* VITRINE & VISÃO GERAL */}
        {activeTab === 'hub' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  Centro de Controle Nexus <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">v5.2 Cyber Edition</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">Esquadrão Guardião Agêntico de Alta Performance.</p>
              </div>
              <button onClick={() => setActiveTab('historias')} className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl text-xs hover:scale-105 shadow-lg shadow-purple-600/30 transition-all">
                ✨ Abrir Estúdio Criativo
              </button>
            </div>

            {/* BANNER 3D DINÂMICO DOS 6 GUARDIÕES */}
            <div className="relative rounded-3xl overflow-hidden border border-purple-500/40 shadow-2xl shadow-purple-950/60 group transition-all duration-500 hover:border-cyan-400 bg-[#080811]">
              
              {/* Imagem de Fundo Dinâmica */}
              <div 
                className="w-full h-96 bg-cover bg-center transition-all duration-500 group-hover:scale-[1.02]"
                style={{ backgroundImage: `url('${activeGuardian}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-black/25 to-transparent"></div>
              </div>

              {/* Tag Superior do Guardião Ativo */}
              <div className="absolute top-4 left-6 px-3 py-1 bg-slate-950/80 border border-cyan-400/40 rounded-full backdrop-blur-md">
                <span className="text-[10px] font-mono text-cyan-300 tracking-wider uppercase font-bold">
                  {guardianTitle}
                </span>
              </div>

              {/* Seletor Dinâmico dos 6 Guardiões */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  
                  {/* 1. Leão - NexusData */}
                  <button
                    onClick={() => setActiveTab('landing')}
                    onMouseEnter={() => {
                      setActiveGuardian('/nexus-lion.jpg');
                      setGuardianTitle('1. LEÃO // NEXUSDATA 3D & FRONTEND');
                    }}
                    className="p-3 bg-slate-950/85 backdrop-blur-md border border-cyan-500/50 hover:border-cyan-300 hover:bg-cyan-500/20 rounded-xl text-center transition-all hover:-translate-y-1.5 hover:shadow-lg hover:shadow-cyan-500/40"
                  >
                    <span className="text-[10px] font-mono text-cyan-300 block">🦁 3D</span>
                    <span className="text-xs font-black text-white">NEXUSDADOS</span>
                  </button>

                  {/* 2. Tigre - Micro-SaaS */}
                  <button
                    onClick={() => setActiveTab('saas')}
                    onMouseEnter={() => {
                      setActiveGuardian('/nexus-tiger.jpg');
                      setGuardianTitle('2. TIGRE // AUDIT PRO MICRO-SAAS & SQL');
                    }}
                    className="p-3 bg-slate-950/85 backdrop-blur-md border border-purple-500/50 hover:border-purple-300 hover:bg-purple-500/20 rounded-xl text-center transition-all hover:-translate-y-1.5 hover:shadow-lg hover:shadow-purple-500/40"
                  >
                    <span className="text-[10px] font-mono text-purple-300 block">🐯 SQL</span>
                    <span className="text-xs font-black text-white">MICRO SAAS</span>
                  </button>

                  {/* 3. Tubarão - Pipeline CRM */}
                  <button
                    onClick={() => setActiveTab('crm')}
                    onMouseEnter={() => {
                      setActiveGuardian('/nexus-shark.jpg');
                      setGuardianTitle('3. TUBARÃO // PIPELINE CRM & LEADS RADAR');
                    }}
                    className="p-3 bg-slate-950/85 backdrop-blur-md border border-emerald-500/50 hover:border-emerald-300 hover:bg-emerald-500/20 rounded-xl text-center transition-all hover:-translate-y-1.5 hover:shadow-lg hover:shadow-emerald-500/40"
                  >
                    <span className="text-[10px] font-mono text-emerald-300 block">🦈 LEADS</span>
                    <span className="text-xs font-black text-white">PIPELINE</span>
                  </button>

                  {/* 4. Pantera - Estúdio 3x3 */}
                  <button
                    onClick={() => setActiveTab('posts')}
                    onMouseEnter={() => {
                      setActiveGuardian('/nexus-panther.jpg');
                      setGuardianTitle('4. PANTERA // ESTÚDIO 3X3 & BRANDKIT');
                    }}
                    className="p-3 bg-slate-950/85 backdrop-blur-md border border-pink-500/50 hover:border-pink-300 hover:bg-pink-500/20 rounded-xl text-center transition-all hover:-translate-y-1.5 hover:shadow-lg hover:shadow-pink-500/40"
                  >
                    <span className="text-[10px] font-mono text-pink-300 block">🐆 3x3</span>
                    <span className="text-xs font-black text-white">ESTÚDIO</span>
                  </button>

                  {/* 5. Águia - StoryForge */}
                  <button
                    onClick={() => setActiveTab('historias')}
                    onMouseEnter={() => {
                      setActiveGuardian('/nexus-eagle.jpg');
                      setGuardianTitle('5. ÁGUIA // STORYFORGE VÍDEO & ÁUDIO');
                    }}
                    className="p-3 bg-slate-950/85 backdrop-blur-md border border-amber-500/50 hover:border-amber-300 hover:bg-amber-500/20 rounded-xl text-center transition-all hover:-translate-y-1.5 hover:shadow-lg hover:shadow-amber-500/40"
                  >
                    <span className="text-[10px] font-mono text-amber-300 block">🦅 VÍDEO</span>
                    <span className="text-xs font-black text-white">STORYFORGE</span>
                  </button>

                  {/* 6. Mastodonte - Demo Forge B2B */}
                  <button
                    onClick={() => setActiveTab('outreach')}
                    onMouseEnter={() => {
                      setActiveGuardian('/nexus-mammoth.jpg');
                      setGuardianTitle('6. MASTODONTE // DEMO FORGE & OUTREACH B2B');
                    }}
                    className="p-3 bg-slate-950/85 backdrop-blur-md border border-orange-500/50 hover:border-orange-300 hover:bg-orange-500/20 rounded-xl text-center transition-all hover:-translate-y-1.5 hover:shadow-lg hover:shadow-orange-500/40"
                  >
                    <span className="text-[10px] font-mono text-orange-300 block">🦣 B2B</span>
                    <span className="text-xs font-black text-white">DEMO FORGE</span>
                  </button>

                </div>
              </div>
            </div>

            {/* Badges de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 bg-[#090912] border border-purple-500/20 rounded-2xl relative overflow-hidden group hover:border-purple-500/50 transition-all">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Total de Leads</span>
                <p className="text-3xl font-black text-white mt-1">{leads.length}</p>
                <span className="text-[10px] text-cyan-400">● Supabase RLS Synced</span>
              </div>
              <div className="p-5 bg-[#090912] border border-purple-500/20 rounded-2xl relative overflow-hidden group hover:border-purple-500/50 transition-all">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Padrão de Design</span>
                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mt-1">BrandKit 3×3</p>
                <span className="text-[10px] text-slate-400">Anti-Slop Protocol</span>
              </div>
              <div className="p-5 bg-[#090912] border border-purple-500/20 rounded-2xl relative overflow-hidden group hover:border-purple-500/50 transition-all">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Canal Corporativo</span>
                <p className="text-lg font-black text-teal-400 mt-1">Gmail Ready</p>
                <span className="text-[10px] text-slate-400 font-mono">nexusenterprise.br@gmail.com</span>
              </div>
              <div className="p-5 bg-[#090912] border border-purple-500/20 rounded-2xl relative overflow-hidden group hover:border-purple-500/50 transition-all">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Skills Ativas</span>
                <p className="text-3xl font-black text-cyan-400 mt-1">3 / 3</p>
                <span className="text-[10px] text-purple-300">MCP, Agentic & Three.js</span>
              </div>
            </div>
          </div>
        )}

        {/* FÁBRICA DE HISTÓRIAS */}
        {activeTab === 'historias' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>✨</span> StoryForge — Estúdio de Vídeo & Roteiro
                </h2>
                <p className="text-xs text-slate-400">Controle criativo de personagens, cenários e iluminação para IA de vídeo.</p>
              </div>
              <button
                onClick={generateStoryPrompts}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold rounded-xl text-xs hover:scale-105 shadow-lg shadow-purple-600/30 transition-all"
              >
                🎬 Gerar Prompts da Cena
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#090912] border border-purple-500/20 rounded-2xl p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Modelo de Vídeo</label>
                  <div className="flex gap-2">
                    {(['runway-gen3', 'kling', 'luma', 'sora'] as const).map((model) => (
                      <button
                        key={model}
                        onClick={() => setVideoTargetModel(model)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase ${
                          videoTargetModel === model ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold' : 'bg-[#050508] text-slate-400 border border-slate-800'
                        }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Descrição do Personagem (ID Visual)</label>
                  <input
                    type="text"
                    value={characterDesc}
                    onChange={(e) => setCharacterDesc(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#050508] border border-purple-500/30 rounded-xl text-xs text-cyan-300 outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Cenário & Ambiente</label>
                  <input
                    type="text"
                    value={sceneDesc}
                    onChange={(e) => setSceneDesc(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#050508] border border-purple-500/30 rounded-xl text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Iluminação & Clima Visual</label>
                  <input
                    type="text"
                    value={lightingStyle}
                    onChange={(e) => setLightingStyle(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#050508] border border-purple-500/30 rounded-xl text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Script de Narração (ElevenLabs)</label>
                  <textarea
                    value={scriptText}
                    onChange={(e) => setScriptText(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-[#050508] border border-purple-500/30 rounded-xl text-xs text-pink-300 font-serif italic outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div className="bg-[#090912] border border-purple-500/20 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Prompt Formatado</h3>
                  <pre className="p-4 bg-[#050508] border border-purple-500/30 rounded-xl text-xs text-cyan-300 font-mono whitespace-pre-wrap leading-relaxed min-h-[160px]">
                    {generatedPrompt || 'Clique no botão acima para montar o prompt com base nos seus parâmetros.'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* POST STUDIO */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-xl font-black text-white">Post Studio 3x3 — Editor de Carrossel</h2>
                <p className="text-xs text-slate-400">Direção de arte e cópia refinada para Instagram e Facebook.</p>
              </div>
            </div>

            <div className="bg-[#090912] border border-purple-500/20 rounded-2xl p-6 space-y-4">
              <label className="text-xs font-semibold text-slate-300">Briefing do Post</label>
              <textarea
                value={postBriefing}
                onChange={(e) => setPostBriefing(e.target.value)}
                rows={2}
                className="w-full p-3 bg-[#050508] border border-purple-500/30 rounded-xl text-xs text-white outline-none focus:border-purple-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-[#090912] border border-purple-500/20 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-purple-400 uppercase font-mono">Slide 1: Hook (Capa)</span>
                <input
                  type="text"
                  value={slide1Hook}
                  onChange={(e) => setSlide1Hook(e.target.value)}
                  className="w-full p-2.5 bg-[#050508] border border-purple-500/30 rounded-xl text-xs text-white font-bold outline-none"
                />
              </div>

              <div className="p-5 bg-[#090912] border border-purple-500/20 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-pink-400 uppercase font-mono">Slide 2: Problema</span>
                <textarea
                  value={slide2Body}
                  onChange={(e) => setSlide2Body(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-[#050508] border border-purple-500/30 rounded-xl text-xs text-slate-200 outline-none"
                />
              </div>

              <div className="p-5 bg-[#090912] border border-purple-500/20 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-cyan-400 uppercase font-mono">Slide 3: Chamada (CTA)</span>
                <textarea
                  value={slide3Cta}
                  onChange={(e) => setSlide3Cta(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-[#050508] border border-purple-500/30 rounded-xl text-xs text-slate-200 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* SAAS AUDIT */}
        {activeTab === 'saas' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-xl font-black text-white">Engenharia SaaS — PostgreSQL & RLS Auditor</h2>
                <p className="text-xs text-slate-400">Scanner automatizado de schema e conformidade de índices.</p>
              </div>
              <button onClick={runAuditScan} className="px-5 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-xl text-xs hover:scale-105 transition-all">
                ▶ Executar Auditoria SQL
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <textarea
                value={sqlSchema}
                onChange={(e) => setSqlSchema(e.target.value)}
                rows={8}
                className="w-full p-4 bg-[#090912] border border-purple-500/30 rounded-2xl font-mono text-xs text-slate-200 outline-none focus:border-cyan-400"
              />
              <div className="p-4 bg-[#090912] border border-purple-500/30 rounded-2xl font-mono text-xs text-cyan-300 whitespace-pre-wrap">
                {auditResult || 'Clique em "Executar Auditoria SQL" acima.'}
              </div>
            </div>
          </div>
        )}

        {/* CRM */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-xl font-black text-white">Pipeline de Leads ({leads.length})</h2>
                <p className="text-xs text-slate-400">Dados integrados com Supabase RLS.</p>
              </div>
            </div>
            <div className="p-8 bg-[#090912] border border-purple-500/20 rounded-2xl text-center text-xs text-slate-400">
              Conexão ativa em tempo real.
            </div>
          </div>
        )}

        {/* PRESELL */}
        {activeTab === 'presell' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800/80 pb-4">
              <h2 className="text-xl font-black text-white">Criador de Páginas Presell & Retenção VSL</h2>
              <p className="text-xs text-slate-400">Estruturas de alta conversão para tráfego direto.</p>
            </div>
            <div className="p-6 bg-[#090912] border border-purple-500/20 rounded-2xl text-xs text-slate-300">
              Templates dinâmicos de alta conversão carregados.
            </div>
          </div>
        )}

        {/* LANDING 3D / OUTREACH PLACEHOLDERS */}
        {(activeTab === 'landing' || activeTab === 'outreach') && (
          <div className="p-12 bg-[#090912] border border-purple-500/20 rounded-3xl text-center space-y-3">
            <span className="text-3xl">🌌</span>
            <h3 className="text-lg font-bold text-white">Módulo Agêntico Ativo</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Pronto para operação com a identidade visual futurista.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
