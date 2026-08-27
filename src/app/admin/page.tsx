"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

const ADMIN_ACCESS_KEY = "nexus2026";

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("nexus_admin_auth");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
      fetchLeads();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_ACCESS_KEY) {
      sessionStorage.setItem("nexus_admin_auth", "true");
      setIsAuthenticated(true);
      fetchLeads();
      setErrorMsg("");
    } else {
      setErrorMsg("Chave de acesso incorreta.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("nexus_admin_auth");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLeads(data);
    }
    setLoading(false);
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, status: newStatus } : lead,
      ),
    );

    await supabase.from("leads").update({ status: newStatus }).eq("id", id);
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      "ID",
      "Data",
      "Status",
      "Nome",
      "Email",
      "Empresa",
      "Volume",
      "Desafio",
    ];
    const rows = leads.map((l) => [
      l.id,
      new Date(l.created_at).toLocaleString("pt-BR"),
      `"${l.status || "Novo"}"`,
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.company}"`,
      `"${l.data_volume || ""}"`,
      `"${l.bottleneck || ""}"`,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `nexusdata-leads-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
        >
          <div className="text-center">
            <h1 className="text-xl font-bold text-cyan-400">Acesso Restrito</h1>
            <p className="text-xs text-slate-400 mt-1">
              Informe a chave mestra para ver os leads
            </p>
          </div>

          <div>
            <input
              type="password"
              placeholder="Digite a chave de acesso"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 transition"
              autoFocus
            />
            {errorMsg && (
              <p className="text-xs text-rose-400 mt-2">{errorMsg}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg text-sm transition"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">
              Pipeline de Leads NexusData
            </h1>
            <p className="text-sm text-slate-400">
              CRM de acompanhamento e gestão de diagnósticos
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg text-sm transition"
            >
              Exportar CSV
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition"
            >
              Sair
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">
            Carregando dados...
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Nenhum lead registrado ainda.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-4">Status</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Nome</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Empresa</th>
                  <th className="p-4">Volume</th>
                  <th className="p-4">Desafio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {leads.map((lead) => {
                  const currentStatus = lead.status || "Novo";
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-800/40 transition"
                    >
                      <td className="p-4">
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            handleStatusChange(lead.id, e.target.value)
                          }
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer border outline-none ${
                            currentStatus === "Novo"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                              : currentStatus === "Em Contato"
                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          }`}
                        >
                          <option
                            value="Novo"
                            className="bg-slate-900 text-amber-300"
                          >
                            🟡 Novo
                          </option>
                          <option
                            value="Em Contato"
                            className="bg-slate-900 text-cyan-300"
                          >
                            🔵 Em Contato
                          </option>
                          <option
                            value="Fechado"
                            className="bg-slate-900 text-emerald-300"
                          >
                            🟢 Fechado
                          </option>
                        </select>
                      </td>
                      <td className="p-4 text-xs text-slate-400">
                        {new Date(lead.created_at).toLocaleString("pt-BR")}
                      </td>
                      <td className="p-4 font-medium text-white">
                        {lead.name}
                      </td>
                      <td className="p-4 text-cyan-400">{lead.email}</td>
                      <td className="p-4">{lead.company}</td>
                      <td className="p-4">{lead.data_volume || "-"}</td>
                      <td className="p-4 text-xs text-slate-400 max-w-xs truncate">
                        {lead.bottleneck || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
