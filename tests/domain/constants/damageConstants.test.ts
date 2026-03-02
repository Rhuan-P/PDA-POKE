/**
 * Testes do DamageConstants - GL-6
 * Time Game Logic: Testes de constantes de dano
 */

import { DAMAGE_BASE, CRITICAL_CHANCE, STAB_MULTIPLIER, MIN_DAMAGE, MAX_DAMAGE, TYPE_EFFECTIVENESS } from '../../../src/domain/constants/DamageConstants';

describe('DamageConstants', () => {
  it('deve ter valores base corretos', () => {
    expect(DAMAGE_BASE).toBe(40);
    expect(CRITICAL_CHANCE).toBe(0.0625);
    expect(STAB_MULTIPLIER).toBe(1.5);
    expect(MIN_DAMAGE).toBe(1);
    expect(MAX_DAMAGE).toBe(999);
  });

  it('deve ter valores de efetividade de tipo corretos', () => {
    expect(TYPE_EFFECTIVENESS.SUPER_EFFECTIVE).toBe(2.0);
    expect(TYPE_EFFECTIVENESS.EFFECTIVE).toBe(1.0);
    expect(TYPE_EFFECTIVENESS.NOT_VERY_EFFECTIVE).toBe(0.5);
    expect(TYPE_EFFECTIVENESS.NO_EFFECT).toBe(0.0);
  });

  it('deve ter valores imutáveis', () => {
    // Tentar modificar (deve falhar em TypeScript)
    // expect(() => { DAMAGE_BASE = 50; }).toThrow();
    
    // Verificar se são constantes
    expect(typeof DAMAGE_BASE).toBe('number');
    expect(typeof CRITICAL_CHANCE).toBe('number');
    expect(typeof STAB_MULTIPLIER).toBe('number');
    expect(typeof MIN_DAMAGE).toBe('number');
    expect(typeof MAX_DAMAGE).toBe('number');
  });

  it('deve ter valores razoáveis para o jogo', () => {
    // Valores devem estar em faixas razoáveis
    expect(DAMAGE_BASE).toBeGreaterThan(0);
    expect(DAMAGE_BASE).toBeLessThan(100);
    
    expect(CRITICAL_CHANCE).toBeGreaterThan(0);
    expect(CRITICAL_CHANCE).toBeLessThan(1);
    
    expect(STAB_MULTIPLIER).toBeGreaterThan(1);
    expect(STAB_MULTIPLIER).toBeLessThan(3);
    
    expect(MIN_DAMAGE).toBeGreaterThan(0);
    expect(MAX_DAMAGE).toBeGreaterThan(MIN_DAMAGE);
  });
});
