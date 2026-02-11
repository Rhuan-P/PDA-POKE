import { DamageCalculator } from '../../src/domain/calculators/DamageCalculator';

describe('DamageCalculator', () => {
  it('calculates a positive damage value', () => {
    const damage = DamageCalculator.calculate({
      attack: 10,
      defense: 5,
      power: 10,
      effectiveness: 1
    });

    expect(damage).toBeGreaterThan(0);
  });
});
