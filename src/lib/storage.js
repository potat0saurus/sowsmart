/**
 * localStorage abstraction.
 * On React Native, swap the implementation for AsyncStorage — the API surface stays the same.
 */

const STORAGE_KEY = 'sowsmart_beds'
const VERSION = 1

function getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { version: VERSION, beds: {} }
    const parsed = JSON.parse(raw)
    if (parsed.version !== VERSION) return { version: VERSION, beds: {} }
    return parsed
  } catch {
    return { version: VERSION, beds: {} }
  }
}

function setStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // Storage full or unavailable — silently ignore for MVP
  }
}

export function loadBeds() {
  return getStore().beds
}

export function saveBed(bed) {
  const store = getStore()
  store.beds[bed.id] = {
    ...bed,
    updatedAt: new Date().toISOString(),
  }
  setStore(store)
}

export function deleteBed(bedId) {
  const store = getStore()
  delete store.beds[bedId]
  setStore(store)
}

export function loadBed(bedId) {
  return getStore().beds[bedId] ?? null
}
