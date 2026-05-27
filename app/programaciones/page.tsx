"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ProgramacionesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    try {
      const res = await fetch(`${API_URL}/api/programaciones`);
      const json = await res.json();

      setItems(json.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function generarProgramaciones() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/programaciones/generar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estacionCodigo: "PL0001",
          }),
        }
      );

      const result = await response.json();

      if (result.ok) {
        alert(`Se generaron ${result.count} programaciones`);
        loadData();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error generando programaciones");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Programaciones
            </h1>

            <p className="text-slate-500">
              Control automático de obligaciones
            </p>
          </div>

          <button
            onClick={generarProgramaciones}
            disabled={loading}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-white"
          >
            {loading
              ? "Generando..."
              : "Generar programaciones"}
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow">
          <table className="min-w-full">
            <thead className="bg-slate-100 text-slate-900">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-slate-900">
                  Estación
                </th>

                <th className="px-6 py-4 text-left font-bold text-slate-900">
                  Obligación
                </th>

                <th className="px-6 py-4 text-left font-bold text-slate-900">
                  Frecuencia
                </th>

                <th className="px-6 py-4 text-left font-bold text-slate-900">
                  Responsable
                </th>

                <th className="px-6 py-4 text-left font-bold text-slate-900">
                  Vencimiento
                </th>

                <th className="px-6 py-4 text-left font-bold text-slate-900">
                  Estado
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-t border-slate-100 text-slate-800"
                >
                  <td className="px-6 py-4 text-slate-800">
                    {item.EstacionCodigo}
                  </td>

                  <td className="px-6 py-4 text-slate-800">
                    {item.Obligacion}
                  </td>

                  <td className="px-6 py-4 text-slate-800">
                    {item.Frecuencia}
                  </td>

                  <td className="px-6 py-4 text-slate-800">
                    {item.Responsable}
                  </td>

                  <td className="px-6 py-4 text-slate-800">
                    {item.FechaVencimiento}
                  </td>

                  <td className="px-6 py-4 text-slate-800">
                    <span className="rounded-full bg-yellow-200 px-3 py-1 text-xs font-bold text-yellow-900">
                      {item.Estado}
                    </span>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No hay programaciones generadas
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