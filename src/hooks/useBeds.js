import { useState, useCallback } from 'react'
import { loadBeds, saveBed, deleteBed } from '../lib/storage.js'

/**
 * CRUD hook for the saved beds list.
 * Reads from localStorage on mount; all mutations stay in sync.
 */
export function useBeds() {
  const [beds, setBeds] = useState(() => {
    const stored = loadBeds()
    return Object.values(stored)
  })

  const addBed = useCallback((bed) => {
    saveBed(bed)
    setBeds(prev => {
      const existing = prev.find(b => b.id === bed.id)
      if (existing) return prev.map(b => b.id === bed.id ? bed : b)
      return [...prev, bed]
    })
  }, [])

  const updateBed = useCallback((bed) => {
    saveBed(bed)
    setBeds(prev => prev.map(b => b.id === bed.id ? bed : b))
  }, [])

  const removeBed = useCallback((bedId) => {
    deleteBed(bedId)
    setBeds(prev => prev.filter(b => b.id !== bedId))
  }, [])

  return { beds, addBed, updateBed, removeBed }
}
