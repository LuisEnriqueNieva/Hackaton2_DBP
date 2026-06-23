import { useEffect, useRef, useState } from 'react'

// Selector controlado con opción "todas".
export function FilterSelect({
  label,
  value,
  options,
  onChange,
  allLabel = 'Todos',
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  allLabel?: string
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="font-medium text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-sm text-slate-100 focus-visible:border-emerald-400 focus-visible:outline-none"
      >
        <option value="">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}

// Búsqueda con debounce: el padre solo recibe el valor "comprometido".
export function SearchInput({
  label,
  value,
  onCommit,
  placeholder,
  delay = 350,
}: {
  label: string
  value: string
  onCommit: (value: string) => void
  placeholder?: string
  delay?: number
}) {
  const [local, setLocal] = useState(value)
  const committedRef = useRef(value)

  // Sincroniza si el valor externo cambió (ej. reset o navegación por URL).
  useEffect(() => {
    committedRef.current = value
    setLocal(value)
  }, [value])

  // Debounce: emite onCommit solo cuando el texto deja de cambiar.
  useEffect(() => {
    if (local === committedRef.current) return
    const id = setTimeout(() => {
      committedRef.current = local
      onCommit(local)
    }, delay)
    return () => clearTimeout(id)
  }, [local, delay, onCommit])

  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="font-medium text-slate-400">{label}</span>
      <input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        maxLength={80}
        className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus-visible:border-emerald-400 focus-visible:outline-none"
      />
    </label>
  )
}
