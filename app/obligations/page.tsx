"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ObligationsPage() {
  const [obligations, setObligations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadObligations() {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/obligations`);
      const json = await res.json();

      setObligations(json.data || []);
    } catch (error) {
      console.error(error);
      alert("Error cargando obligaciones");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadObligations();
  }, []);

  function statusColor(status: string) {
    if (status === "Vencido") return "bg-red-100 text-red-700";
    if (status === "Urgente") return "bg-orange-100 text-orange-700";
    if (status === "Próximo") return "bg-yellow-100 text-yellow-700";
    if (status === "Vigente") return "bg-green-100 text-green-700";
    return "bg-slate-100 text-slate-700";
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 text-slate-900">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Obligaciones SASISOPA</h1>
            <p className="mt-1 text-slate-500">
              Control de vencimientos, responsables y cumplimiento documental.
            </p>
          </div>

          <button
            onClick={loadObligations}
            className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white"
          >
            {loading ? "Cargando..." : "Actualizar"}
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-4">Estación</th>
                <th className="p-4">Módulo</th>
                <th className="p-4">Obligación</th>
                <th className="p-4">Responsable</th>
                <th className="p-4">Vencimiento</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Acción</th>
              </tr>
            </thead>

            <tbody>
              {obligations.map((o) => {
                const status = o.EstadoCalculado || o.Estado || "Sin fecha";

                return (
                  <tr key={o.id} className="border-t">
                    <td className="p-4 font-medium">
                      {o.EstacionCodigo || "-"}
                    </td>

                    <td className="p-4">
                      {o.Modulo || "-"}
                    </td>

                    <td className="p-4">
                      {o.Nombre || "-"}
                    </td>

                    <td className="p-4">
                      {o.Responsable || "-"}
                    </td>

                    <td className="p-4">
                      {o.FechaProxima || "-"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="p-4">
                      <Link
                        href={`/evidence?obligacion=${encodeURIComponent(
                          o.Nombre || ""
                        )}&estacion=${encodeURIComponent(
                          o.EstacionCodigo || ""
                        )}`}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                      >
                        Subir evidencia
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {obligations.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No hay obligaciones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}