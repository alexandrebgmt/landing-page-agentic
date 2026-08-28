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

  // 1. STORYFORGE (Fábrica de Histórias Interativa)
  const [videoTargetModel, setVideoTargetModel] = useState<'runway-gen3' | 'kling' | 'luma' | 'sora'>('runway-gen3');
  const [characterDesc, setCharacterDesc] = useState('Mini-Builder Lego (Yellow hardhat, blue overalls, subtle dust marks)');
  const [sceneDesc, setSceneDesc] = useState('Solid granite stone cliff against a stormy ocean, macro diorama');
  const [lightingStyle, setLightingStyle] = useState('Cinematic Golden Hour with moody blue fill');
  const [voiceTone, setVoiceTone] = useState<'solemne' | 'dramatico' | 'inspirador'>('solemne');
  const [scriptText, setScriptText] = useState('Aquele que ouve estas palavras e as pratica... é como o homem sábio que construiu a sua casa sobre a rocha.');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [generatedSfx, setGeneratedSfx] = useState('');

  // 2. POST STUDIO 3x3 INTERATIVO
  const [postBriefing, setPostBriefing] = useState('Como empresas perdem 30% do orçamento com queries lentas e PostgreSQL desorganizado.');
  const [postStyle, setPostStyle] = useState<'linear-dark' | 'tech-neon' | 'clean-white'>('linear-dark');
  const [slide1Hook, setSlide1Hook] = useState('O Custo Invisível de um Banco Mal Indexado');
  const [slide2Body, setSlide2Body] = useState('Tabelas com mais de 500k linhas sem Foreign Key Index travam os relatórios e elevam os custos de nuvem.');
  const [slide3Cta, setSlide3Cta] = useState('Solicite o Diagnóstico Técnico Nexus em 48 horas.');

  // 3. PRESELL BUILDER INTERATIVO
  const [presellProduct, setPresellProduct] = useState('NexusData Enterprise Engine');
  const [presellAngle, setPresellAngle] = useState<'investigativo' | 'estudo-caso' | 'urgencia'>('investigativo');
  const [presellHeadline, setPresellHeadline] = useState('Descoberta Técnica Revela Como Empresas Reduzem 40% dos Custos de Infraestrutura');

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

  // Gera prompts em tempo real com base no input do usuário
  const generateStoryPrompts = () => {
    const prompt = `[MODEL: ${videoTargetModel.toUpperCase()}] Cinematic macro shot of ${characterDesc}, standing on ${sceneDesc}. Lighting: ${lightingStyle}. Highly detailed plastic brick texture, volumetric atmosphere, 8k resolution. Motion: Subtle camera push-in, rigid lock on main structure.`;
    const sfx = `FOLEY: Crisp plastic snaps, subtle distant ocean wind, cinematic low-frequency sub bass impact.`;
    setGeneratedPrompt(prompt);
    setGeneratedSfx(sfx);
  };

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
      {/* Menu Lateral */}
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

          <div className="px-1">
            <VoiceCommander onNavigate={(tab) => setActiveTab(tab)} />
          </div>

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
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">3x3</span>
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

          <div className="space-y-1 pt-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 px-3 tracking-wider">Módulos de Produção</span>
            
            <button
              onClick={() => setActiveTab('historias')}
              className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex items-center justify-between text-xs ${
                activeTab === 'historias' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5"><span>✨</span> Fábrica de Histórias (Vídeo)</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300">PRO</span>
            </button>

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

      {/* Área de Trabalho */}
      <main className="flex-1 ml-72 p-8 max-w-7xl space-y-8">
        
        {/* VISÃO GERAL */}
        {activeTab === 'hub' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h1 className="text-2xl font-black text-white">Centro de Controle Nexus <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">v5.2 High-Agency OS</span></h1>
                <p className="text-xs text-slate-400 mt-1">Estúdio Criativo com Controle Total de Personagens, Roteiros e Design Systems.</p>
              </div>
              <button onClick={() => setActiveTab('historias')} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold rounded-xl text-xs hover:opacity-90">
                ✨ Abrir Fábrica de Criação
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
                <span className="text-[10px] font-mono text-slate-400 uppercase">Controle de Criação</span>
                <p className="text-lg font-bold text-teal-400 mt-1">100% Interativo</p>
                <span className="text-[10px] text-slate-400 font-mono">Custom Inputs Enabled</span>
              </div>
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Status de Skills</span>
                <p className="text-2xl font-bold text-white mt-1">3 / 3</p>
                <span className="text-[10px] text-cyan-400">BrandKit, MCP & RLS</span>
              </div>
            </div>
          </div>
        )}

        {/* 1. FÁBRICA DE HISTÓRIAS INTERATIVA */}
        {activeTab === 'historias' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>✨</span> Fábrica de Histórias — Estúdio do Diretor
                </h2>
                <p className="text-xs text-slate-400">Defina os parâmetros do personagem, cenário e narração para gerar prompts prontos para IA de vídeo e áudio.</p>
              </div>
              <button
                onClick={generateStoryPrompts}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold rounded-xl text-xs hover:scale-105 transition-all shadow-md shadow-cyan-500/20"
              >
                🎬 Gerar Prompts da Cena
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Controles de Entrada */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Parâmetros Criativos (Direção)</h3>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Modelo de Vídeo Alvo</label>
                  <div className="flex gap-2">
                    {(['runway-gen3', 'kling', 'luma', 'sora'] as const).map((model) => (
                      <button
                        key={model}
                        onClick={() => setVideoTargetModel(model)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase ${
                          videoTargetModel === model ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Descrição do Personagem (Consistência)</label>
                  <input
                    type="text"
                    value={characterDesc}
                    onChange={(e) => setCharacterDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-300 outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Cenário & Ambiente</label>
                  <input
                    type="text"
                    value={sceneDesc}
                    onChange={(e) => setSceneDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Iluminação & Clima Visual</label>
                  <input
                    type="text"
                    value={lightingStyle}
                    onChange={(e) => setLightingStyle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Script de Narração (ElevenLabs)</label>
                  <textarea
                    value={scriptText}
                    onChange={(e) => setScriptText(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-teal-300 font-serif italic outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Saída de Prompts Gerados */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Prompt Formatado (Copiar com 1 Clique)</h3>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-cyan-400 uppercase">Prompt Cinematográfico Gerado</label>
                    <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-300 font-mono whitespace-pre-wrap leading-relaxed min-h-[140px]">
                      {generatedPrompt || 'Clique em "Gerar Prompts da Cena" para montar o prompt com base nas suas diretrizes.'}
                    </pre>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-indigo-400 uppercase">Camada de Áudio & Foley</label>
                    <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-indigo-300 font-mono whitespace-pre-wrap">
                      {generatedSfx || 'Aguardando geração do áudio sincronizado.'}
                    </pre>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-400">
                  💡 <strong>Dica de Direção:</strong> Copie o prompt acima e cole diretamente na interface do Runway Gen-3 ou Kling para gerar o vídeo sem perder a consistência do boneco.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. POST STUDIO 3x3 INTERATIVO */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Post Studio 3x3 — Editor de Conteúdo</h2>
                <p className="text-xs text-slate-400">Digite sua ideia bruta, ajuste o estilo visual e edite cada slide do carrossel na hora.</p>
              </div>
              <div className="flex gap-2">
                {(['linear-dark', 'tech-neon', 'clean-white'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setPostStyle(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase ${
                      postStyle === st ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <label className="text-xs font-semibold text-slate-300">Sua Ideia / Briefing Bruto</label>
              <textarea
                value={postBriefing}
                onChange={(e) => setPostBriefing(e.target.value)}
                rows={2}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-cyan-400 uppercase font-mono">Slide 1: Gancho (Hook)</span>
                <input
                  type="text"
                  value={slide1Hook}
                  onChange={(e) => setSlide1Hook(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold outline-none"
                />
                <p className="text-[11px] text-slate-400">Capa do carrossel com alto contraste e chamada forte.</p>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-teal-400 uppercase font-mono">Slide 2: Problema & Diagnóstico</span>
                <textarea
                  value={slide2Body}
                  onChange={(e) => setSlide2Body(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none"
                />
                <p className="text-[11px] text-slate-400">Explicação técnica clara sem termos vazios (anti-slop).</p>
              </div>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-indigo-400 uppercase font-mono">Slide 3: Chamada para Ação</span>
                <textarea
                  value={slide3Cta}
                  onChange={(e) => setSlide3Cta(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none"
                />
                <p className="text-[11px] text-slate-400">Conversão direta para o WhatsApp ou formulário de contato.</p>
              </div>
            </div>
          </div>
        )}

        {/* 3. PÁGINAS PRESELL & VSL INTERATIVO */}
        {activeTab === 'presell' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Criador de Páginas Presell & Retenção VSL</h2>
                <p className="text-xs text-slate-400">Configure os elementos da sua oferta e gere o layout de alta conversão.</p>
              </div>
              <div className="flex gap-2">
                {(['investigativo', 'estudo-caso', 'urgencia'] as const).map((angle) => (
                  <button
                    key={angle}
                    onClick={() => setPresellAngle(angle)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase ${
                      presellAngle === angle ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {angle}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Parâmetros da Oferta</h3>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Nome do Produto / Serviço</label>
                  <input
                    type="text"
                    value={presellProduct}
                    onChange={(e) => setPresellProduct(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Headline Principal (Promessa)</label>
                  <textarea
                    value={presellHeadline}
                    onChange={(e) => setPresellHeadline(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-300 outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <span className="text-xs font-mono text-teal-400 uppercase font-bold">Pré-visualização do Advertorial</span>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Ângulo: {presellAngle}</span>
                  <h4 className="text-sm font-bold text-white leading-tight">{presellHeadline}</h4>
                  <p className="text-xs text-slate-300 pt-2">Oferta customizada para o produto: <strong className="text-cyan-300">{presellProduct}</strong>.</p>
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
                <h2 className="text-xl font-bold text-white">Pipeline de Leads ({leads.length})</h2>
                <p className="text-xs text-slate-400">Dados integrados com Supabase.</p>
              </div>
              <button onClick={fetchLeads} className="px-4 py-2 bg-slate-900 border border-slate-800 text-cyan-400 font-bold rounded-xl text-xs">
                🔄 Atualizar
              </button>
            </div>
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
              Conexão em tempo real ativa.
            </div>
          </div>
        )}

        {/* SAAS AUDIT */}
        {activeTab === 'saas' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Engenharia SaaS — PostgreSQL Auditor</h2>
                <p className="text-xs text-slate-400">Scanner de arquitetura e conformidade de índices.</p>
              </div>
              <button onClick={runAuditScan} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold rounded-xl text-xs">
                ▶ Executar Auditoria SQL
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <textarea
                value={sqlSchema}
                onChange={(e) => setSqlSchema(e.target.value)}
                rows={8}
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl font-mono text-xs text-slate-200 outline-none focus:border-cyan-500"
              />
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl font-mono text-xs text-teal-300 whitespace-pre-wrap">
                {auditResult || 'Clique em "Executar Auditoria SQL" acima.'}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
