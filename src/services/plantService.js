import { supabase } from './supabase'
import { plants as staticPlants, plantsById as staticPlantsById } from '../data/plants.js'

function mapPlant(row) {
  return {
    id: row.id,
    name: row.name,
    emoji: row.emoji,
    icon: staticPlantsById[row.id]?.icon,
    plantsPerSquare: row.plants_per_square,
    companions: row.companions ?? [],
    competitors: row.competitors ?? [],
    incompatible: row.incompatible ?? [],
    notes: row.notes,
    timing: row.timing,
  }
}

export async function getPlants() {
  // Fall back to static data when Supabase is not configured
  if (!import.meta.env.VITE_SUPABASE_URL) {
    return { plants: staticPlants, plantsById: staticPlantsById }
  }

  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .order('name')

  if (error) throw error

  const plants = data.map(mapPlant)
  const plantsById = Object.fromEntries(plants.map(p => [p.id, p]))
  return { plants, plantsById }
}

export async function getPlantById(id) {
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return mapPlant(data)
}
