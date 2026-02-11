import { BattleUseCase } from '../../src/application/use-cases/BattleUseCase';

const createMocks = () => {
  const pokemonService = {
    getPokemon: jest.fn(async (id) => ({ id, name: `p-${id}`, level: 1, types: ['normal'], stats: { hp: 10, maxHp: 10, attack: 5, defense: 5, speed: 5 } })),
    getSkill: jest.fn(async (id) => ({ id, type: 'normal', power: 10 }))
  };

  const damageCalculator = {
    calculate: jest.fn(() => 7)
  };

  const battleStore = {
    applyDamage: jest.fn()
  };

  return { pokemonService, damageCalculator, battleStore };
};

describe('BattleUseCase', () => {
  it('executes attack using injected dependencies', async () => {
    const { pokemonService, damageCalculator, battleStore } = createMocks();
    const useCase = new BattleUseCase(pokemonService, damageCalculator, battleStore);

    const result = await useCase.executeAttack('1', '2', 'tackle');

    expect(pokemonService.getPokemon).toHaveBeenCalledWith('1');
    expect(pokemonService.getPokemon).toHaveBeenCalledWith('2');
    expect(pokemonService.getSkill).toHaveBeenCalledWith('tackle');
    expect(damageCalculator.calculate).toHaveBeenCalled();
    expect(battleStore.applyDamage).toHaveBeenCalledWith('2', 7);
    expect(result.damage).toBe(7);
  });
});
