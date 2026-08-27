'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    data_volume: '< 100 GB',
    bottleneck: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          company: '',
          data_volume: '< 100 GB',
          bottleneck: ''
        });
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Erro ao enviar. Tente novamente.');
      }
    } catch (err) {
      setErrorMsg('Falha na comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      
      {/* Top Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center font-mono font-bold text-cyan-400">
              ⚡
            </div>
            <span className="font-extrabold tracking-tight text-lg text-white">NexusData</span>
          </div>

          <nav className="flex items-center space-x-6 text-xs font-semibold">
            <Link href="/presell" className="text-slate-400 hover:text-cyan-300 transition">
              Metodologia Presell
            </Link>
            <Link href="/admin" className="text-slate-400 hover:text-white transition font-mono">
              Admin OS ↗
            </Link>
            <a
              href="#contato"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition"
            >
              Solicitar Diagnóstico
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Arquitetura de Dados & IA de Alta Precisão
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
            Engenharia de Dados Blindada e Decisões em Tempo Real
          </h1>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            Elimine gargalos analíticos, implemente segurança RLS nativa no PostgreSQL e conecte agentes autônomos à sua base.
          </p>
        </section>

        {/* Formulário de Captação */}
        <section id="contato" className="max-w-xl mx-auto bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl space-y-6 shadow-2xl shadow-cyan-950/40">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-white">Diagnóstico de Arquitetura</h2>
            <p className="text-xs text-slate-400">Preencha abaixo para receber um mapeamento técnico gratuito</p>
          </div>

          {success ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-fadeIn">
              <span className="text-3xl">🎉</span>
              <h3 className="font-bold text-emerald-300 text-sm">Diagnóstico Solicitado com Sucesso!</h3>
              <p className="text-xs text-slate-300">
                Nossos engenheiros receberam sua notificação instantânea e entrarão em contato em até 24h.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-semibold">E-mail Profissional</label>
                  <input
                    type="email"
                    required
                    placeholder="carlos@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 outline-none transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-semibold">Empresa</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome da empresa"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Volume Estimado de Dados</label>
                <select
                  value={formData.data_volume}
                  onChange={(e) => setFormData({ ...formData, data_volume: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 outline-none transition"
                >
                  <option value="< 100 GB">&lt; 100 GB</option>
                  <option value="100 GB - 1 TB">100 GB a 1 TB</option>
                  <option value="1 TB - 10 TB">1 TB a 10 TB (Escala Média)</option>
                  <option value="> 10 TB">&gt; 10 TB (Big Data / Alta Carga)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Maior Desafio / Gargalo Atual</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Queries analíticas lentas, falta de isolamento seguro ou unificação de silos..."
                  value={formData.bottleneck}
                  onChange={(e) => setFormData({ ...formData, bottleneck: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:border-cyan-500 outline-none transition"
                />
              </div>

              {errorMsg && <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-cyan-500/20 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? 'Enviando Diagnóstico...' : 'Solicitar Mapeamento Gratuito ➔'}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
