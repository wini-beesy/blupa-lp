import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function LegalDocumentLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-svh bg-white text-[#04000B]">
      <header className="border-b border-[#E5E0EB] px-4 py-4 sm:px-8">
        <Link
          to="/"
          className="font-sans text-sm font-medium text-[#1D3B6E] underline underline-offset-2 transition-opacity hover:opacity-80"
        >
          ← Voltar ao site
        </Link>
      </header>
      <main className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 lg:py-14">
        <h1 className="mb-2 font-sans text-[clamp(1.5rem,4vw,2rem)] font-bold leading-tight text-[#1A141F]">
          {title}
        </h1>
        <p className="mb-10 font-sans text-sm font-light text-[#878680]">
          Última atualização: fevereiro de 2026
        </p>
        <article className="space-y-6 font-sans text-[15px] font-light leading-[160%] text-[#04000B] [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
          {children}
        </article>
      </main>
    </div>
  );
}
