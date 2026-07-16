export default function LoadingScreen({ label = "Carregando dados da campanha" }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-6">
      <div className="flex flex-col items-center gap-7 text-center">
        {/* Pulsing orbit mark */}
        <div className="relative h-24 w-24">
          <span className="absolute inset-0 rounded-full border border-line-2" />
          <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--violet)] border-r-[var(--cyan)] animate-spin [animation-duration:1.1s]" />
          <span className="absolute inset-3 rounded-full border-2 border-transparent border-b-[var(--violet-bright)] animate-spin [animation-duration:1.7s] [animation-direction:reverse]" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--violet-bright)] shadow-[0_0_24px_6px_rgba(181,166,255,0.6)] animate-pulse" />
          </span>
        </div>

        <div className="space-y-2">
          <p className="kicker">Dashboard · Mídia digital</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Ciro Gomes <span className="text-gradient-violet">2026</span>
          </h1>
          <p className="text-sm text-ink-3">{label}…</p>
        </div>

        <div className="h-1 w-48 overflow-hidden rounded-full bg-wash-2">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] [animation:loadingbar_1.3s_ease-in-out_infinite]" />
        </div>
      </div>

      <style>{`
        @keyframes loadingbar {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(320%); }
        }
      `}</style>
    </div>
  );
}
