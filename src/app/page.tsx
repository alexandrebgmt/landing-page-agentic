"use client";

import { useState } from "react";
import { Database, ShieldCheck, Cpu, ArrowRight, CheckCircle2, Server, BarChart3, Lock, Sparkles } from "lucide-react";
import { LeadFormData } from "@/lib/schema";
import DataSphere3D from "@/components/DataSphere3D";

export default function Home() {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    email: "",
    company: "",
    dataVolume: "< 100 GB",
    pipelineChallenge: "",
    honeypot: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Erro ao enviar dados. Verifique os campos.");
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Erro inesperado.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-cyan-400" />
            <span className="font-semibold text-lg tracking-tight">
              NexusData <span className="text-cyan-400 text-xs font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">AGENTIC 3D</span>
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#arquitetura" className="hover:text-slate-200 transition">Arquitetura</a>
            <a href="#seguranca" className="hover:text-slate-200 transition">Segurança</a>
            <a href="#contato" className="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition">Solicitar Diagnóstico</a>
          </nav>
        </div>
      </header>

      {/* Hero Section com Canvas 3D */}
      <main className="max-w-6xl mx-auto px-6 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" /> Arquitetura de Dados & Inteligência 3D
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Transforme dados brutos em <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">decisões de alta precisão</span>.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Auditoria de arquitetura de dados, modelagem analítica e pipelines com segurança militar (RLS) e observabilidade completa.
            </p>

            {/* Espaço 3D Interativo */}
            <div className="relative rounded-2xl bg-slate-900/40 border border-slate-800/80 p-2 overflow-hidden shadow-inner">
              <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                Visualização Neural de Dados • Mova o cursor
              </div>
              <DataSphere3D />
            </div>
          </div>

          {/* Form Card */}
          <div id="contato" className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur relative">
            <h3 className="text-xl font-semibold text-slate-200 mb-1">Diagnóstico de Arquitetura</h3>
            <p className="text-xs text-slate-400 mb-6">Receba uma análise estrutural do seu pipeline de dados.</p>

            {status === "success" ? (
              <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-6 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <h4 className="font-semibold text-emerald-300">Solicitação Registrada</h4>
                <p className="text-xs text-slate-300 leading-relaxed">Nossa equipe técnica analisará a volumetria informada e entrará em contato com o blueprint arquitetural.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                />

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Nome Completo</label>
                  <input
                    required
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">E-mail Corporativo</label>
                  <input
                    required
                    type="email"
                    placeholder="nome@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Empresa</label>
                    <input
                      required
                      type="text"
                      placeholder="Empresa"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Volume de Dados</label>
                    <select
                      value={formData.dataVolume}
                      onChange={(e) => setFormData({ ...formData, dataVolume: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 transition"
                    >
                      <option value="< 100 GB">&lt; 100 GB</option>
                      <option value="100 GB - 1 TB">100 GB - 1 TB</option>
                      <option value="1 TB - 10 TB">1 TB - 10 TB</option>
                      <option value="> 10 TB">&gt; 10 TB</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Gargalo Principal</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Ex: Lentidão nas queries analíticas, falhas de sincronização no ETL..."
                    value={formData.pipelineChallenge}
                    onChange={(e) => setFormData({ ...formData, pipelineChallenge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 transition resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded border border-rose-900">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {status === "loading" ? "Validando Schema..." : "Solicitar Análise Técnica"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
