// Indicador de carga accesible. La animación respeta prefers-reduced-motion
// gracias al variante `motion-safe:` de Tailwind.
export function Spinner({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3 text-slate-300">
      <span
        aria-hidden="true"
        className="size-5 rounded-full border-2 border-slate-600 border-t-emerald-400 motion-safe:animate-spin"
      />
      <span className="text-sm">{label}</span>
    </div>
  )
}
