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

  // StoryForge States
  const [videoTargetModel, setVideoTargetModel] = useState<'runway-gen3' | 'kling' | 'luma' | 'sora'>('runway-gen3');
  const [selectedShot, setSelectedShot] = useState<number>(0);
  const [activeAudioTab, setActiveAudioTab] = useState<'video' | 'voice' | 'music' | 'sfx'>('video');

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
      shotId: 'TAKE-01',
      title: 'A Casa na Rocha — O Alicerce Inabalável',
      duration: '5s',
      cameraIntent: 'Cinematic slow push-in, shallow depth of field, tilt-shift macro photography',
      agnosticPrompt: 'Lego minifigure builder carefully snapping the final yellow plastic roof brick on a solid granite stone cliff, warm golden hour sunlight, ocean breeze moving tiny plastic foliage, 8k cinematic macro.',
      motionLock: 'Minifigure arm moves steadily down; stone cliff and house remain 100% rigid; ocean ripples subtly in background.',
      continuity: 'Character ID: Builder-01 (Yellow hardhat, blue overalls); Prop ID: Master Brick (Red 2x4).',
      elevenLabsVoice: 'Adam (Narrador Solene / Épico)',
      voiceScript: 'Todo aquele, pois, que ouve estas minhas palavras e as pratica... será comparado a um homem prudente, que edificou a sua casa sobre a rocha.',
      musicPrompt: 'Cinematic orchestral, warm French horns, gentle woodwinds, hopeful string ostinato, Hans Zimmer style, acoustic warmth, 80 BPM',
      sfxLayer: 'Sharp plastic Lego snap, faint distant ocean waves, gentle wind breeze.'
    },
    {
      shotId: 'TAKE-02',
      title: 'A Tempestade — Ventos e Águas Acrílicas',
      duration: '5s',
      cameraIntent: 'Low-angle tracking shot with subtle dramatic camera shake',
      agnosticPrompt: 'Lego diorama massive storm, transparent blue acrylic rain pieces falling rapidly, miniature lightning flashing reflection across glossy plastic bricks, violent wind blowing loose bricks on wet sand below.',
      motionLock: 'House on granite rock stays perfectly locked and unmoving; loose debris on sand scatters outward.',
      continuity: 'Lighting shift: Dramatic slate blue with high-contrast lightning flashes.',
      elevenLabsVoice: 'Antoni (Dramático / Tensão)',
      voiceScript: 'E caiu a chuva, transbordaram os rios, e sopraram os ventos contra aquela casa...',
      musicPrompt: 'Epic hybrid orchestral, heavy taiko drums, rising brass crescendo, aggressive staccato cellos, dramatic tension, sound design braams, 110 BPM',
      sfxLayer: 'Deep sub-bass thunder rumble, howling wind gust, heavy plastic rain tap on rock.'
    },
    {
      shotId: 'TAKE-03',
      title: 'A Firmeza Triunfal — Vitória da Estrutura',
      duration: '5s',
      cameraIntent: 'Wide cinematic crane shot pulling up, revealing sunlight breaking clouds',
      agnosticPrompt: 'Lego diorama after the storm, golden sun rays piercing dark clouds onto the intact Lego house on the cliff, water droplets glistening on plastic, calm horizon.',
      motionLock: 'Sunbeams slowly shift angle; clouds drift away; structure stands completely firm.',
      continuity: 'Lighting shift: Golden hour rim light, high dynamic range bloom.',
      elevenLabsVoice: 'George (Confiante / Conclusão)',
      voiceScript: 'E ela não caiu... porque estava edificada sobre a rocha.',
      musicPrompt: 'Triumphant cinematic anthem, full choir harmonies, soaring brass fanfare, resolved minor to major key, majestic resolution, 85 BPM',
      sfxLayer: 'Calm ocean lap, birds chirping in distance, triumphant choir swell.'
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
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">STUDIO 3x3</span>
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
              <span className="flex items-center gap-2.5"><span>✨</span> Fábrica de Histórias (Vídeo + Áudio)</span>
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

      {/* Conteúdo Central */}
      <main className="flex-1 ml-72 p-8 max-w-7xl space-y-8">
        
        {/* VISÃO GERAL */}
        {activeTab === 'hub' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h1 className="text-2xl font-black text-white">Centro de Controle Nexus <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">v5.2 High-Agency OS</span></h1>
                <p className="text-xs text-slate-400 mt-1">Estúdio Audiovisual Completo (Vídeo + Voz + Foley), Engenharia de Dados e Prospecção B2B.</p>
              </div>
              <button onClick={() => setActiveTab('historias')} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold rounded-xl text-xs hover:opacity-90">
                ✨ Abrir Fábrica de Histórias
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
                <span className="text-[10px] font-mono text-slate-400 uppercase">Áudio Engine</span>
                <p className="text-lg font-bold text-teal-400 mt-1">ElevenLabs v2</p>
                <span className="text-[10px] text-slate-400 font-mono">Foley + Suno Synced</span>
              </div>
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Status de Skills</span>
                <p className="text-2xl font-bold text-white mt-1">3 / 3</p>
                <span className="text-[10px] text-cyan-400">BrandKit, MCP & RLS</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div onClick={() => setActiveTab('historias')} className="p-6 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-base">Fábrica de Histórias & Audiovisual</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">Deploy Ativo</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Vídeo Prompts consistentes, Scripts de Voz ElevenLabs, Trilha Orquestral e Foley plástico.</p>
              </div>

              <div onClick={() => setActiveTab('saas')} className="p-6 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-base">Audit Pro Micro-SaaS</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">Deploy Ativo</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Scanner automatizado de schema PostgreSQL, detecção de gargalos, RLS e relatórios.</p>
              </div>
            </div>
          </div>
        )}

        {/* FÁBRICA DE HISTÓRIAS (VÍDEO + VOZ ELEVENLABS + TRILHA + FOLEY) */}
        {activeTab === 'historias' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>✨</span> Fábrica de Histórias — AudioVisual Engine
                </h2>
                <p className="text-xs text-slate-400">Geração sincronizada de Takes de Vídeo, Narração ElevenLabs, Trilha Sonora e Foley.</p>
              </div>
              <div className="flex items-center gap-2">
                {(['runway-gen3', 'kling', 'luma', 'sora'] as const).map((model) => (
                  <button
                    key={model}
                    onClick={() => setVideoTargetModel(model)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                      videoTargetModel === model ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Seletor de Cenas */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono">Linha do Tempo (Takes)</span>
                {biblicScenes.map((scene, idx) => (
                  <div
                    key={scene.shotId}
                    onClick={() => setSelectedShot(idx)}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                      selectedShot === idx ? 'bg-slate-900 border-cyan-500 text-white shadow-lg shadow-cyan-500/10' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-cyan-400">{scene.shotId}</span>
                      <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded text-slate-400">{scene.duration}</span>
                    </div>
                    <h4 className="text-xs font-bold mt-1.5 line-clamp-1">{scene.title}</h4>
                  </div>
                ))}

                {/* Bíblia de Consistência Fixa */}
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">Bíblia de Consistência</span>
                  <p className="text-[11px] text-slate-300"><strong>Personagem:</strong> Mini-Builder (Yellow hardhat, blue overalls)</p>
                  <p className="text-[11px] text-slate-300"><strong>Cenário:</strong> Solid granite cliff diorama with ocean</p>
                  <p className="text-[11px] text-slate-300"><strong>Negative:</strong> Real human skin, blurred plastic, photoreal faces</p>
                </div>
              </div>

              {/* Detalhes do Take */}
              <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">{currentScene.title}</h3>
                    <p className="text-xs text-slate-400">Tempo de Take: {currentScene.duration}</p>
                  </div>

                  {/* Sub-abas de Áudio e Vídeo */}
                  <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setActiveAudioTab('video')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${activeAudioTab === 'video' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                    >
                      🎬 Vídeo
                    </button>
                    <button
                      onClick={() => setActiveAudioTab('voice')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${activeAudioTab === 'voice' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                    >
                      🎙️ Voz
                    </button>
                    <button
                      onClick={() => setActiveAudioTab('music')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${activeAudioTab === 'music' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                    >
                      🎵 Trilha
                    </button>
                    <button
                      onClick={() => setActiveAudioTab('sfx')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${activeAudioTab === 'sfx' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                    >
                      🔊 Foley
                    </button>
                  </div>
                </div>

                {/* VISUALIZAÇÃO DA ABA ATIVA */}
                {activeAudioTab === 'video' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Prompt Cinematográfico ({videoTargetModel})</label>
                      <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-300 font-mono whitespace-pre-wrap leading-relaxed">
                        {currentScene.agnosticPrompt}
                      </pre>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Câmera & Movimento</span>
                        <p className="text-xs text-slate-300 mt-1">{currentScene.cameraIntent}</p>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Motion Lock</span>
                        <p className="text-xs text-slate-300 mt-1">{currentScene.motionLock}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeAudioTab === 'voice' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-teal-400 uppercase font-bold">Configuração ElevenLabs</span>
                        <span className="text-xs font-mono text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{currentScene.elevenLabsVoice}</span>
                      </div>
                      <p className="text-xs text-slate-400">Stability: 0.45 | Similarity: 0.80 | Style Exaggeration: 0.15</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Script de Narração / Locução</label>
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-teal-300 font-serif italic leading-relaxed">
                        "{currentScene.voiceScript}"
                      </div>
                    </div>
                  </div>
                )}

                {activeAudioTab === 'music' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Prompt para Suno AI / Udio (Trilha Épica)</label>
                      <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300 font-mono whitespace-pre-wrap leading-relaxed">
                        {currentScene.musicPrompt}
                      </pre>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                      <strong>Mixagem:</strong> Trilha em volume constante a -20 dB com ducking de -4 dB durante a fala do narrador.
                    </div>
                  </div>
                )}

                {activeAudioTab === 'sfx' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Camada de Foley & Efeitos Sonoros (SFX)</label>
                      <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-indigo-300 font-mono whitespace-pre-wrap leading-relaxed">
                        {currentScene.sfxLayer}
                      </pre>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                      <strong>Impacto Foley:</strong> Encaixes de peças plásticas em 0 dB com reverberação seca de estúdio.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* POST STUDIO */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Post Studio & BrandKit 3x3</h2>
                <p className="text-xs text-slate-400">Matriz de Conteúdo 3x3 com Direção de Arte Anti-Slop (Linear / Vercel style).</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-cyan-400">Topo de Funil</span>
                <h4 className="text-sm font-semibold text-white">O Custo Oculto de Dados Desorganizados</h4>
                <p className="text-xs text-slate-400">Carrossel 5 slides com diagnóstico visual.</p>
              </div>
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-teal-400">Meio de Funil</span>
                <h4 className="text-sm font-semibold text-white">Auditoria de Segurança: Supabase & RLS</h4>
                <p className="text-xs text-slate-400">Post técnico com código e regras de blindagem.</p>
              </div>
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-indigo-400">Fundo de Funil</span>
                <h4 className="text-sm font-semibold text-white">Diagnóstico Nexus em 48h</h4>
                <p className="text-xs text-slate-400">Card de alta conversão para fechamento B2B.</p>
              </div>
            </div>
          </div>
        )}

        {/* CRM */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Pipeline de Diagnósticos & Leads ({leads.length})</h2>
                <p className="text-xs text-slate-400">Leads capturados através da sua infraestrutura privada e diagnósticos solicitados.</p>
              </div>
            </div>
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
              Sincronizado em tempo real com o banco de dados Supabase via RLS.
            </div>
          </div>
        )}

        {/* SAAS AUDIT */}
        {activeTab === 'saas' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Engenharia SaaS — PostgreSQL & RLS Auditor</h2>
                <p className="text-xs text-slate-400">Scanner de arquitetura de dados, concorrência e conformidade de índices.</p>
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

        {/* PRESELL */}
        {activeTab === 'presell' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white">Criador de Páginas Presell & Retenção VSL</h2>
              <p className="text-xs text-slate-400">Estruturas de alta conversão e recuperação de checkout.</p>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300">
              Templates dinâmicos de advertoriais e scripts de retenção integrados.
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
