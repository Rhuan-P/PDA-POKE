/**
 * Utilitario de efetividade de tipos.
 * Placeholder para a squad completar a matriz oficial.
 */
export type TypeEffectiveness = Record<string, Record<string, number>>;

export const typeEffectiveness: TypeEffectiveness = {
  fire: {
    grass: 2,
    water: 0.5,
    ice: 2,
    bug: 0.5,
    rock: 0.5,
    dragon: 0.5,
    fire: 1,
    electric: 1,
    normal: 1,
  },
  water: {
    fire: 2,
    grass: 0.5,
    ice: 0.5,
    rock: 2,
    dragon: 0.5,
    water: 1,
    electric: 1,
    normal: 1,
  },
  grass: {
    fire: 0.5,
    water: 2,
    ice: 0.5,
    bug: 2,
    rock: 2,
    dragon: 0.5,
    grass: 1,
    electric: 1,
    normal: 1,
  },
  electric: {
    water: 2,
    grass: 0.5,
    ice: 0.5,
    bug: 0.5,
    rock: 0.5,
    dragon: 0.5,
    fire: 1,
    electric: 1,
    normal: 1,
  },
  normal: {
    fire: 1,
    water: 1,
    grass: 1,
    ice: 1,
    bug: 1,
    rock: 0.5,
    dragon: 1,
    electric: 1,
    normal: 1,
  },
};

export function getEffectiveness(attackerType: string, defenderType: string): number {
  return typeEffectiveness[attackerType]?.[defenderType] ?? 1;
}
