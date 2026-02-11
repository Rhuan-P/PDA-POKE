/**
 * Utilitario de efetividade de tipos.
 * Placeholder para a squad completar a matriz oficial.
 */
export type TypeEffectiveness = Record<string, Record<string, number>>;

export const typeEffectiveness: TypeEffectiveness = {
  // TODO: preencher com a matriz oficial
};

export function getEffectiveness(attackerType: string, defenderType: string): number {
  return typeEffectiveness[attackerType]?.[defenderType] ?? 1;
}
