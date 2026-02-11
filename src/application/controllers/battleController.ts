/**
 * Controller de Batalha - OrquestraÃ§Ã£o do fluxo
 * Time UX + Time Game Logic: Implementar aqui a orquestraÃ§Ã£o
 * 
 * O que implementar:
 * - CoordenaÃ§Ã£o entre UI, Services e State
 * - Fluxo de seleÃ§Ã£o de PokÃ©mon
 * - InÃ­cio e controle de batalha
 * - ComunicaÃ§Ã£o com APIs externas
 */

import { Pokemon } from '../../domain/entities/Pokemon';
import { BattleService, BattleResult } from '../../domain/services/battleService';

export interface BattleController {
  // TODO: Definir interface do controller
  selectPokemon(playerId: 1 | 2, pokemonName: string): Promise<void>;
  startBattle(): void;
  executeTurn(action: 'attack'): void;
  resetBattle(): void;
}

export class BattleControllerImpl implements BattleController {
  // TODO: Time UX + Game Logic - Implementar orquestraÃ§Ã£o
  private player1Pokemon: Pokemon | null = null;
  private player2Pokemon: Pokemon | null = null;

  /**
   * TODO: Implementar seleÃ§Ã£o de PokÃ©mon
   * Deve chamar serviÃ§o externo e converter para modelo
   */
  async selectPokemon(playerId: 1 | 2, pokemonName: string): Promise<void> {
    throw new Error('MÃ©todo a ser implementado pelos times');
  }

  /**
   * TODO: Implementar inÃ­cio de batalha
   * Deve validar se ambos jogadores estÃ£o prontos
   */
  startBattle(): void {
    throw new Error('MÃ©todo a ser implementado pelos times');
  }

  /**
   * TODO: Implementar execuÃ§Ã£o de turno
   * Deve orquestrar ataque e atualizar estado
   */
  executeTurn(action: 'attack'): void {
    throw new Error('MÃ©todo a ser implementado pelos times');
  }

  /**
   * TODO: Implementar reset da batalha
   * Deve limpar estado e reiniciar
   */
  resetBattle(): void {
    throw new Error('MÃ©todo a ser implementado pelos times');
  }
}

// Export singleton para uso na aplicaÃ§Ã£o
export const battleController = new BattleControllerImpl();

