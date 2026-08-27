import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexusData | Engenharia de Dados & IA de Alta Precisão",
  description:
    "Auditoria de arquitetura de dados, modelagem analítica e pipelines com segurança militar (RLS) e observabilidade completa.",
  openGraph: {
    title: "NexusData | Engenharia de Dados & IA",
    description:
      "Auditoria de arquitetura de dados, modelagem analítica e pipelines de alta performance.",
    url: "https://landing-page-agentic-one.vercel.app",
    siteName: "NexusData",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexusData | Engenharia de Dados",
    description: "Diagnóstico de arquitetura e pipelines analíticos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
