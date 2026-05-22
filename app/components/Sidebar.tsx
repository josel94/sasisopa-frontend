import Link from "next/link";

export default function Sidebar() {
  const items = [
    { name: "Dashboard", href: "/" },
    { name: "Evidencias", href: "/evidence" },
    { name: "Obligaciones", href: "/obligations" },
    { name: "Programaciones", href: "/schedule" },
    { name: "Auditorías", href: "/audits" },
    { name: "Hallazgos", href: "/findings" },
    { name: "KPIs", href: "/kpis" },
    { name: "Configuración", href: "/settings" },
  ];

  return (
    <aside className="min-h-screen w-64 bg-slate-900 p-6 text-white">
      <h1 className="mb-8 text-2xl font-bold">SASISOPA IA</h1>

      <nav className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-slate-700"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
