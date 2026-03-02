import { Pokemon } from '../../domain/entities/Pokemon';

export interface IPokemonService {
  getPokemon(id: string): Promise<Pokemon>;
  getSkill(id: string): Promise<{ id: string; type: string; power: number }>;
}

export interface IDamageCalculator {
  calculate(attacker: Pokemon, defender: Pokemon, skill: { type: string; power: number }): number;
}

export interface IBattleStore {
  applyDamage(pokemonId: string, damage: number): void;
}

export class BattleUseCase {
  constructor(
    private pokemonService: IPokemonService,
    private damageCalculator: IDamageCalculator,
    private battleStore: IBattleStore
  ) {}

  async executeAttack(
    attackerId: string,
    defenderId: string,
    skillId: string
  ): Promise<{ damage: number; attacker: Pokemon; defender: Pokemon }> {
    const attacker = await this.pokemonService.getPokemon(attackerId);
    const defender = await this.pokemonService.getPokemon(defenderId);
    const skill = await this.pokemonService.getSkill(skillId);

    const damage = this.damageCalculator.calculate(attacker, defender, skill);
    this.battleStore.applyDamage(defenderId, damage);

    return { damage, attacker, defender };
  }
}