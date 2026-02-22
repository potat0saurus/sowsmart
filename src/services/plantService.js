import { supabase } from './supabase'

function mapPlant(row) {
  return {
    id: row.id,
    name: row.name,
    emoji: row.emoji,
    plantsPerSquare: row.plants_per_square,
    companions: row.companions ?? [],
    competitors: row.competitors ?? [],
    incompatible: row.incompatible ?? [],
    notes: row.notes,
    timing: row.timing,
  }
}

export async function getPlants() {
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
