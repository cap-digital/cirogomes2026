import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-6 text-center">
      <div>
        <p className="text-gradient-violet text-6xl font-semibold tracking-tight">404</p>
        <h1 className="mt-3 text-xl font-semibold">Página não encontrada</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-3">
          O endereço que você tentou abrir não existe neste painel.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--violet-deep)] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Voltar à visão geral
        </Link>
      </div>
    </div>
  );
}
