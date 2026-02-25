export function normalizePokemon(apiData) {
  const stats = apiData.stats ?? [];

  const findStat = (name) =>
    stats.find((s) => s.stat.name === name)?.base_stat ?? 10;

  return {
    id: String(apiData.id),
    name: apiData.name,
    level: 50,
    types: (apiData.types ?? []).map((t) => t.type?.name ?? t),
    stats: {
      hp: findStat('hp'),
      maxHp: findStat('hp'),
      attack: findStat('attack'),
      defense: findStat('defense'),
      speed: findStat('speed'),
    },
    sprite: apiData.sprites?.front_default ?? null,
  };
}

export function normalizePokemonList(rawList) {
  return {
    count: rawList.count,
    results: (rawList.results ?? []).map((r) => ({
      name: r.name,
      url: r.url,
    })),
  };
}