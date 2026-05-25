"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../components/Sidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function EvidenceContent() {
  const searchParams = useSearchParams();

  const estacionURL = searchParams.get("estacion") || "";
  const obligacionURL = searchParams.get("obligacion") || "";

  const [stations, setStations] = useState<any[]>([]);
  const [obligations, setObligations] = useState<any[]>([]);

  const [station, setStation] = useState(estacionURL);
  const [obligation, setObligation] = useState(obligacionURL);
  const [comments, setComments] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStation(estacionURL);
    setObligation(obligacionURL);
    loadData();
  }, [estacionURL, obligacionURL]);

  async function loadData() {
    const stationsRes = await fetch(`${API_URL}/api/stations`);
    const stationsJson = await stationsRes.json();

    const obligationsRes = await fetch(`${API_URL}/api/obligations`);
    const obligationsJson = await obligationsRes.json();

    setStations(stationsJson.data || []);
    setObligations(obligationsJson.data || []);
  }

  async function handleUpload() {
    if (!station) return alert("Falta estación");
    if (!obligation) return alert("Falta obligación");
    if (!file) return alert("Selecciona archivo");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("estacion", station);
    formData.append("obligacion", obligation);
    formData.append("comentarios", comments);

    try {
      const response = await fetch(`${API_URL}/api/upload-evidence`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.ok) {
        alert("Archivo subido correctamente");
        setComments("");
        setFile(null);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error subiendo archivo");
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow">
          <h1 className="mb-6 text-3xl font-bold text-slate-900">
            Subir evidencia
          </h1>

          <div className="space-y-5">
            {estacionURL ? (
              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-sm text-slate-500">Estación</p>
                <p className="font-semibold">{estacionURL}</p>
              </div>
            ) : (
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Estación
                </label>

                <select
                  value={station}
                  onChange={(e) => setStation(e.target.value)}
                  className="w-full rounded-xl border p-3"
                >
                  <option value="">Selecciona estación</option>

                  {stations.map((s: any) => (
                    <option key={s.id} value={s.Codigo}>
                      {s.Nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {obligacionURL ? (
              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-sm text-slate-500">Obligación</p>
                <p className="font-semibold">{obligacionURL}</p>
              </div>
            ) : (
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Obligación
                </label>

                <select
                  value={obligation}
                  onChange={(e) => setObligation(e.target.value)}
                  className="w-full rounded-xl border p-3"
                >
                  <option value="">Selecciona obligación</option>

                  {obligations.map((o: any) => (
                    <option key={o.id} value={o.Nombre}>
                      {o.Nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Comentarios
              </label>

              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full rounded-xl border p-3"
                rows={4}
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Archivo
              </label>

              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <label
                htmlFor="file-upload"
                className="inline-block cursor-pointer rounded-2xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-900 hover:bg-slate-100"
              >
                Seleccionar archivo
              </label>

              {file && (
                <p className="mt-2 text-sm text-slate-600">
                  Archivo seleccionado: {file.name}
                </p>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="rounded-2xl bg-slate-900 px-6 py-3 text-white"
            >
              {loading ? "Subiendo..." : "Subir evidencia"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Cargando...</div>}>
      <EvidenceContent />
    </Suspense>
  );
}