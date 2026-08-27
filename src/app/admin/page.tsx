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

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: '1',
    name: 'NexusData Landing 3D',
    module: 'landing-pages',
    status: 'Deploy Ativo',
    description: 'Landing page principal com malha neural 3D em Three.js, RLS e captação.',
    link: 'https://landing-page-agentic-one.vercel.app',
    tags: ['Next.js', 'Three.js', 'Supabase', 'Vercel']
  },
  {
    id: '2',
    name: 'Audit Pro Micro-SaaS',
    module: 'saas',
    status: 'Em Criação',
    description: 'Scanner automatizado de schema PostgreSQL, detecção de gargalos e geração de relatórios de conformidade.',
    tags: ['SaaS', 'PostgreSQL', 'SQL Parser']
  },
  {
    id: '3',
    name: 'Nexus Mini-CRM',
    module: 'crm',
    status: 'Deploy Ativo',
    description: 'Gestão de pipeline de diagnósticos com status dinâmico e exportação CSV.',
    tags: ['CRM', 'Pipeline', 'Realtime']
  },
  {
    id: '4',
    name: 'StoryForge - Módulo Infantil (Trolili)',
    module: 'fabrica-historias',
    status: 'Em Criação',
    description: 'Gerador multimodal de narrativas infantis e roteiros com Biscoito, Mimi, Pip e a turma.',
    tags: ['Infantil', 'Storytelling', 'Personagens 3D']
  },
  {
    id: '5',
    name: 'StoryForge - Módulo Reflexivo & Devocional',
    module: 'fabrica-historias',
    status: 'Em Criação',
    description: 'Gerador de estudos, histórias reflexivas e parábolas com exegese bíblica e aplicação prática.',
    tags: ['Religioso', 'Reflexivo', 'Parábolas']
  },
  {
    id: '6',
    name: 'Presell High-Ticket VSL',
    module: 'presell',
    status: 'Rascunho',
    description: 'Página advertorial de alta conversão com retenção de checkout e gatilhos de autoridade.',
    tags: ['Advertorial', 'Copywriting', 'Direct Response']
  },
  {
    id: '7',
    name: 'Gerador de Carrosséis & Banners',
    module: 'posts-design',
    status: 'Em Criação',
    description: 'Templates estruturados para Instagram e LinkedIn com tipografia sci-fi e paleta slate/cyan.',
    tags: ['Social Media', 'Design System', 'Canva/Figma']
  },
  {
    id: '8',
    name: 'Nexus Mobile Agent App',
    module: 'apps',
    status: 'Rascunho',
    description: 'PWA / App mobile para acompanhamento de métricas e alertas de leads em tempo real.',
    tags: ['PWA', 'Mobile', 'React Native / Tailwind']
  }
];

const ADMIN_ACCESS_KEY = 'nexus2026';

export default function NexusCommandCenter() {
  const [activeTab, setActiveTab] = useState<string>('hub');
  const [storySubTab, setStorySubTab] = useState<'infantil' | 'religioso'>('infantil');
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

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['ID', 'Data', 'Status', 'Nome', 'Email', 'Empresa', 'Volume', 'Desafio'];
    const rows = leads.map((l) => [
      l.id,
      new Date(l.created_at).toLocaleString('pt-BR'),
      `"${l.status || 'Novo'}"`,
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0,transparent_70%)] pointer-events-none" />
        <form
          onSubmit={handleLogin}
          className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 shadow-2xl shadow-cyan-950/40 space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-2xl font-bold">
              ⚡
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
              Nexus Master Suite OS
            </h1>
            <p className="text-xs text-slate-400 font-mono tracking-wide">
              AUTENTICAÇÃO CENTRAL DE ENGENHARIA & IA
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Chave Mestra de Acesso</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
              autoFocus
            />
            {errorMsg && <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-cyan-500/20 active:scale-[0.99]"
          >
            Acessar Centro de Comando
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      
      {/* SIDEBAR MASTER */}
      <aside className="w-72 bg-slate-900/80 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 fixed inset-y-0 z-30">
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
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>📊</span>
              <span>Visão Geral & Projetos</span>
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'crm'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span>🎯</span>
                <span>CRM & Pipeline Leads</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                {leads.length}
              </span>
            </button>

            <div className="pt-3 px-3 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">Módulos de Produção</div>

            <button
              onClick={() => setActiveTab('builder')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'builder'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
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
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
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
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
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
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>💰</span>
              <span>Páginas Presell & VSL</span>
            </button>

            <button
              onClick={() => setActiveTab('historias')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'historias'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>✨</span>
              <span>Fábrica de Histórias</span>
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'posts'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
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
                <p className="text-[10px] text-slate-400">Chief Engineer</p>
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
                    v2.5 Architecture
                  </span>
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Orquestrador de engenharia de software, pipelines de dados, geração de histórias e campanhas.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('builder')}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-cyan-500/20"
              >
                + Iniciar Novo Projeto
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
                <div className="text-2xl font-bold text-white mt-1">7 Módulos</div>
                <div className="text-[11px] text-slate-400 mt-2">Landing, SaaS, CRM, Histórias...</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-xs font-mono uppercase">Infraestrutura</div>
                <div className="text-2xl font-bold text-teal-400 mt-1">Edge 100%</div>
                <div className="text-[11px] text-teal-400 mt-2">Next.js 15 + Vercel + PG</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-xs font-mono uppercase">Ambiente de IA</div>
                <div className="text-2xl font-bold text-purple-400 mt-1">PhD Multi-Agent</div>
                <div className="text-[11px] text-purple-400 mt-2">Copiloto Ativo & Calibrado</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">Ecossistema de Soluções</h2>
                <span className="text-xs text-slate-400">Clique em qualquer módulo no menu lateral para editar</span>
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

        {activeTab === 'crm' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-cyan-400">CRM de Leads & Diagnósticos</h1>
                <p className="text-xs text-slate-400 mt-1">Gerencie contatos capturados, altere status e exporte relatórios</p>
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
                Nenhum lead registrado ainda. Envie o link da sua Landing Page para começar a receber contatos.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 font-mono">
                    <tr>
                      <th className="p-4">Status</th>
                      <th className="p-4">Data</th>
                      <th className="p-4">Nome</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Empresa</th>
                      <th className="p-4">Volume</th>
                      <th className="p-4">Gargalo / Desafio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {leads.map((lead) => {
                      const currentStatus = lead.status || 'Novo';
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

        {activeTab === 'historias' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-cyan-400">Fábrica de Histórias Multimodal</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Gerador inteligente de narrativas, roteiros, livros ilustrados e estudos bíblicos
                </p>
              </div>

              <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
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
                <button
                  onClick={() => setStorySubTab('religioso')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    storySubTab === 'religioso'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📖 Módulo Religioso & Parábolas
                </button>
              </div>
            </div>

            {storySubTab === 'infantil' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-white text-sm uppercase font-mono">Gerador de Roteiros e Livros Infantis</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400">Personagem Principal</label>
                      <input
                        type="text"
                        defaultValue="Biscoito (o cãozinho curioso)"
                        className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Faixa Etária</label>
                      <select className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                        <option>3 a 5 anos (Lúdico & Canções)</option>
                        <option>6 a 8 anos (Aventura & Valores)</option>
                        <option>9 a 12 anos (Mistério & Criatividade)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Moral da História / Tema Central</label>
                    <input
                      type="text"
                      defaultValue="A importância de compartilhar os brinquedos e a amizade na floresta encantada"
                      className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                    <p className="font-semibold text-cyan-400">✨ Estrutura Pronta de Produção:</p>
                    <p>• <strong>Cena 1:</strong> Apresentação de Biscoito e Mimi em 3D brilhante.</p>
                    <p>• <strong>Cena 2:</strong> O pequeno desafio com Pip e Quack na ponte mágica.</p>
                    <p>• <strong>Cena 3:</strong> Solução com lição prática e canção de encerramento.</p>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <h3 className="font-bold text-cyan-400 text-xs uppercase font-mono">Personagens Cadastrados</h3>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                      <span className="font-semibold text-white">🐶 Biscoito</span>
                      <span className="text-[10px] text-cyan-400">3D Lead</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                      <span className="font-semibold text-white">🐱 Mimi</span>
                      <span className="text-[10px] text-cyan-400">3D Sidekick</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                      <span className="font-semibold text-white">🐦 Pip & 🦆 Quack</span>
                      <span className="text-[10px] text-cyan-400">Duo Musical</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {storySubTab === 'religioso' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-white text-sm uppercase font-mono">Gerador de Histórias Bíblicas & Devocionais</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400">Passagem / Tema Bíblico</label>
                      <input
                        type="text"
                        defaultValue="Parábola do Filho Pródigo (Lucas 15)"
                        className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Tom da Mensagem</label>
                      <select className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                        <option>Devocional Inspiracional</option>
                        <option>Estudo Exegético & Histórico</option>
                        <option>História Ilustrada para Família</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Aplicação Prática / Vida Diária</label>
                    <input
                      type="text"
                      defaultValue="Restauração familiar, perdão incondicional e acolhimento"
                      className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                    <p className="font-semibold text-cyan-400">📜 Estrutura Teológica:</p>
                    <p>• <strong>Contexto Histórico:</strong> A cultura oriental da época e o significado da herança.</p>
                    <p>• <strong>O Coração do Pai:</strong> Graça abundante em vez de julgamento.</p>
                    <p>• <strong>Oração Final:</strong> Oração guiada para reflexão pessoal.</p>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <h3 className="font-bold text-cyan-400 text-xs uppercase font-mono">Recursos Teológicos</h3>
                  <p className="text-xs text-slate-400">
                    A IA aplica rigor exegético e referências cruzadas para gerar mensagens profundas e respeitosas.
                  </p>
                  <div className="p-3 bg-cyan-950/30 border border-cyan-800/50 rounded-xl text-xs text-cyan-300">
                    Pronto para exportar em formato de post, carrossel de 10 lâminas ou e-book devocional.
                  </div>
                </div>
              </div>
            )}
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
