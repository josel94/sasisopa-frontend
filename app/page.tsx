"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Building2, CalendarClock, FileText, Gauge, RefreshCw, ShieldCheck } from "lucide-react";
import { apiGet, apiPost, API_URL } from "@/lib/api";
import Sidebar from "./components/Sidebar";

type Station = { id?: string; Codigo?: string; Nombre?: string; CRE?: string; Municipio?: string; Estado?: string; Estatus?: string };
type Obligation = { id?: string; IDObligacion?: string; EstacionCodigo?: string; Modulo?: string; Nombre?: string; Responsable?: string; FechaProxima?: string; Estado?: string; EstadoCalculado?: string; Riesgo?: string };

function Card({ children }: { children: React.ReactNode }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">{children}</div>; }
function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) { return <button onClick={onClick} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">{children}</button>; }
function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  const style = tone === "good" ? "bg-emerald-100 text-emerald-700" : tone === "bad" ? "bg-red-100 text-red-700" : tone === "warn" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700";
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${style}`}>{children}</span>;
}
function statusTone(status?: string) { if (!status) return "neutral"; if (["Vigente", "Activa", "Cerrado"].includes(status)) return "good"; if (["Próximo", "Urgente", "En proceso"].includes(status)) return "warn"; if (["Vencido", "Abierto", "Pendiente"].includes(status)) return "bad"; return "neutral"; }

export default function HomePage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<"ok" | "error" | "checking">("checking");

  async function loadData() {
    setLoading(true);
    try {
      const health = await apiGet("/api/health");
      setApiStatus(health.ok ? "ok" : "error");
      const stationsRes = await apiGet("/api/stations");
      setStations(stationsRes.data || []);
      const obligationsRes = await apiGet("/api/obligations");
      setObligations(obligationsRes.data || []);
      const kpisRes = await apiGet("/api/kpis/summary");
      setKpis(kpisRes.data || null);
    } catch (err) { console.error(err); setApiStatus("error"); }
    finally { setLoading(false); }
  }

  async function checkDue() {
    setLoading(true);
    try { await apiPost("/api/obligations/check-due", {}); await loadData(); alert("Revisión de vencimientos ejecutada."); }
    catch (err) { console.error(err); alert("No se pudo revisar vencimientos. Revisa backend/API."); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadData(); }, []);
  const urgent = obligations.filter((o) => ["Vencido", "Urgente", "Próximo"].includes(o.EstadoCalculado || o.Estado || "")).length;
  const compliance = useMemo(() => kpis?.complianceRate ?? (obligations.length ? Math.round(((obligations.length - urgent) / obligations.length) * 100) : 0), [kpis, obligations.length, urgent]);

  return <div className="flex min-h-screen bg-slate-50">
  <Sidebar />

  <main className="flex-1 p-8">
    
    <div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><div className="mb-2 flex items-center gap-3"><div className="rounded-2xl bg-slate-900 p-3 text-white"><ShieldCheck className="h-6 w-6" /></div><div><h1 className="text-3xl font-bold tracking-tight text-slate-900">SASISOPA IA</h1><p className="text-sm text-slate-500">Plataforma de control normativo para estaciones de servicio</p></div></div><p className="text-xs text-slate-400">API conectada a: {API_URL}</p></div><div className="flex gap-2"><Button onClick={loadData}><RefreshCw className="h-4 w-4" />Actualizar</Button><Button onClick={checkDue}><CalendarClock className="h-4 w-4" />Revisar vencimientos</Button><a
    href="/evidence"
    className="bg-[#0B132B] text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition"
  >
    Subir evidencia
  </a></div></header>
    <Card><div className="flex flex-col justify-between gap-3 md:flex-row md:items-center"><div><h2 className="font-semibold text-slate-900">Estado de conexión</h2><p className="text-sm text-slate-500">Este panel consume datos reales del backend cuando está configurado.</p></div>{apiStatus === "ok" && <Pill tone="good">Backend conectado</Pill>}{apiStatus === "error" && <Pill tone="bad">Backend no conectado</Pill>}{apiStatus === "checking" && <Pill tone="warn">Verificando</Pill>}</div></Card>
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><Card><div className="flex justify-between"><div><p className="text-sm text-slate-500">Estaciones</p><p className="mt-2 text-3xl font-bold">{stations.length}</p></div><Building2 className="h-6 w-6 text-slate-500" /></div></Card><Card><div className="flex justify-between"><div><p className="text-sm text-slate-500">Obligaciones</p><p className="mt-2 text-3xl font-bold">{obligations.length}</p></div><FileText className="h-6 w-6 text-slate-500" /></div></Card><Card><div className="flex justify-between"><div><p className="text-sm text-slate-500">Alertas</p><p className="mt-2 text-3xl font-bold">{urgent}</p></div><AlertTriangle className="h-6 w-6 text-slate-500" /></div></Card><Card><div className="flex justify-between"><div><p className="text-sm text-slate-500">Cumplimiento</p><p className="mt-2 text-3xl font-bold">{compliance}%</p></div><Gauge className="h-6 w-6 text-slate-500" /></div></Card></section>
    <section className="grid gap-4 lg:grid-cols-2"><Card><h2 className="mb-4 text-lg font-semibold">Estaciones</h2><div className="space-y-3">{stations.length === 0 && <p className="text-sm text-slate-500">No hay estaciones cargadas todavía o falta conectar Airtable.</p>}{stations.map((s) => <div key={s.id || s.Codigo} className="rounded-2xl border p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{s.Nombre || "Sin nombre"}</p><p className="text-sm text-slate-500">{s.Codigo} · {s.CRE}</p><p className="text-xs text-slate-400">{s.Municipio}, {s.Estado}</p></div><Pill tone={statusTone(s.Estatus)}>{s.Estatus || "Sin estatus"}</Pill></div></div>)}</div></Card><Card><h2 className="mb-4 text-lg font-semibold">Vencimientos / obligaciones</h2><div className="space-y-3">{obligations.length === 0 && <p className="text-sm text-slate-500">No hay obligaciones cargadas todavía o falta conectar Airtable.</p>}{obligations.map((o) => <div key={o.id || o.IDObligacion} className="rounded-2xl border p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{o.Nombre}</p><p className="text-sm text-slate-500">{o.EstacionCodigo} · {o.Modulo} · Responsable: {o.Responsable}</p><p className="text-xs text-slate-400">Vence: {o.FechaProxima}</p></div><Pill tone={statusTone(o.EstadoCalculado || o.Estado)}>{o.EstadoCalculado || o.Estado || "Sin estatus"}</Pill></div></div>)}</div></Card></section>
    {loading && <div className="fixed bottom-4 right-4 rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">Cargando...</div>}
  </div></main></div>;
}
