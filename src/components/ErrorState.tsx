// Estado de error reutilizable con acción de reintento opcional.
export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200"
    >
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-red-500/20 px-3 py-1.5 font-medium text-red-100 transition-colors hover:bg-red-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-300"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
