'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PresellPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Para quem é indicado este diagnóstico de infraestrutura?",
      a: "Para empresas, CTOs e líderes técnicos que operam com bancos de dados relacionais (PostgreSQL/MySQL), pipelines analíticos ou aplicações críticas que não podem sofrer com lentidão e vazamento de dados."
    },
    {
      q: "Quanto tempo leva para receber o plano de ação?",
      a: "Após o envio dos dados da sua arquitetura, nosso motor analítico processa o mapeamento e você recebe uma resposta estruturada em até 24 horas úteis."
    },
    {
      q: "Preciso conceder acesso root ao meu banco de dados?",
      a: "Não. A auditoria inicial é focada em modelagem lógica, volumetria, gargalos de queries e políticas de segurança RLS."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Banner de Alerta / Urgência */}
      <div className="bg-gradient-to-r from-cyan-600 via-teal-500 to-cyan-600 text-slate-950 py-2 px-4 text-center text-xs font-bold tracking-wide">
        ⚡ PROTOCOLO EXCLUSIVO: Como blindar pipelines e reduzir em até 70% o custo de infraestrutura em 2026
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        {/* Header / Headline Principal */}
        <header className="text-center space-y-4">
          <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Relatório de Engenharia & Arquitetura
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
            O Método Definitivo para Escalar Bancos de Dados com RLS e Latência Zero
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Descubra como empresas de tecnologia estão substituindo estruturas legadas por pipelines reativos e inteligência analítica de alta precisão.
          </p>
        </header>

        {/* Video / VSL Container Mockup */}
        <div className="relative rounded-3xl p-1 bg-gradient-to-b from-cyan-500/40 via-slate-800 to-slate-900 shadow-2xl shadow-cyan-950/60">
          <div className="bg-slate-900 rounded-[22px] overflow-hidden p-4 md:p-8 space-y-6 text-center">
            
            {/* Simulador de Player de Vídeo */}
            <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0,transparent_70%)]" />
              
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 text-2xl md:text-3xl pl-1 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition duration-300">
                ▶
              </div>

              <span className="mt-4 text-xs md:text-sm font-mono text-slate-400">
                Assista: Apresentação Técnica da Arquitetura Nexus (8 min)
              </span>

              {/* Barra de Progresso Simulada */}
              <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-800">
                <div className="h-full w-2/3 bg-gradient-to-r from-cyan-500 to-teal-400" />
              </div>
            </div>

            {/* Chamada para Ação (CTA) */}
            <div className="space-y-3 pt-2">
              <Link
                href="/#contato"
                className="inline-block w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold text-base md:text-lg rounded-2xl shadow-xl shadow-cyan-500/25 transition transform active:scale-95"
              >
                QUERO UM DIAGNÓSTICO GRATUITO DA MINHA INFRAESTRUTURA ➔
              </Link>
              <p className="text-[11px] text-slate-500 font-mono">
                🔒 Vagas limitadas para análise de arquitetura este mês. Sem compromisso comercial.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Pilares de Autoridade / Benefícios */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-2xl">🛡️</span>
            <h3 className="font-bold text-white text-sm">Segurança Nativa (RLS)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Isolamento no PostgreSQL a nível de linha. Seus dados protegidos contra qualquer vazamento no frontend.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-2xl">⚡</span>
            <h3 className="font-bold text-white text-sm">Execução em Edge & Realtime</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Respostas analíticas em milissegundos com renderização otimizada e sincronização automática.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-2xl">🤖</span>
            <h3 className="font-bold text-white text-sm">Agentes de IA Prontos</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Estrutura preparada para plugar LLMs, copilotos e pipelines multimodais com total confiabilidade.
            </p>
          </div>
        </section>

        {/* FAQ - Sanfona */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-white">Dúvidas Frequentes</h2>
            <p className="text-xs text-slate-400">Respostas diretas sobre o diagnóstico técnico</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 text-xs md:text-sm font-semibold text-white flex justify-between items-center hover:text-cyan-300 transition"
                >
                  <span>{faq.q}</span>
                  <span className="text-cyan-400 font-mono text-base ml-2">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-400 border-t border-slate-900 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer Minimalista */}
        <footer className="text-center text-xs text-slate-600 font-mono pt-6 border-t border-slate-900">
          NexusData Enterprise © 2026 • Engenharia de Dados & IA de Alta Precisão
        </footer>

      </div>
    </div>
  );
}
