"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

interface Lead {
  id: number;
  created_at: string;
  name: string;
  email: string;
  company: string;
  data_volume: string;
  bottleneck: string;
}

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setLeads(data);
      }
      setLoading(false);
    }
    fetchLeads();
  }, []);

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      "ID",
      "Data",
      "Nome",
      "Email",
      "Empresa",
      "Volume",
      "Desafio",
    ];
    const rows = leads.map((l) => [
      l.id,
      new Date(l.created_at).toLocaleString("pt-BR"),
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">
              Painel de Leads NexusData
            </h1>
            <p className="text-sm text-slate-400">
              Acompanhamento e exportação em tempo real
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg text-sm transition"
          >
            Exportar CSV
          </button>
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
                  <th className="p-4">Data</th>
                  <th className="p-4">Nome</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Empresa</th>
                  <th className="p-4">Volume</th>
                  <th className="p-4">Desafio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-800/40 transition"
                  >
                    <td className="p-4 text-xs text-slate-400">
                      {new Date(lead.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="p-4 font-medium text-white">{lead.name}</td>
                    <td className="p-4 text-cyan-400">{lead.email}</td>
                    <td className="p-4">{lead.company}</td>
                    <td className="p-4">{lead.data_volume || "-"}</td>
                    <td className="p-4 text-xs text-slate-400 max-w-xs truncate">
                      {lead.bottleneck || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
