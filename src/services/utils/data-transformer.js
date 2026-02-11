export function normalizePokemon(apiData) {
  return {
    id: apiData.id?.toString?.() ?? String(apiData.id),
    name: apiData.name,
    level: 50,
    types: (apiData.types || []).map((t) => t.type?.name ?? t),
    stats: {
      hp: apiData.stats?.[0]?.base_stat ?? 10,
      maxHp: apiData.stats?.[0]?.base_stat ?? 10,
      attack: apiData.stats?.[1]?.base_stat ?? 10,
      defense: apiData.stats?.[2]?.base_stat ?? 10,
      speed: apiData.stats?.[5]?.base_stat ?? 10
    },
    sprite: apiData.sprites?.front_default
  };
}
