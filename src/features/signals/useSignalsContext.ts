import { useContext } from 'react'
import { SignalsContext } from './signals-context'

export function useSignalsContext() {
  const ctx = useContext(SignalsContext)
  if (!ctx) {
    throw new Error('useSignalsContext debe usarse dentro de <SignalsProvider>')
  }
  return ctx
}
