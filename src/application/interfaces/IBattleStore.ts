export interface IBattleStore {
  applyDamage(pokemonId: string, damage: number): void;
  getCurrentHp(pokemonId: string): number;
}