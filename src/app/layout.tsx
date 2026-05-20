import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "SASISOPA IA", description: "Plataforma SASISOPA" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}
