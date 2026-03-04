/**
 * Store Pinia para gerenciar estado da batalha
 * Comunicação com backend via pokeApiService
 */

import { defineStore } from 'pinia';
import { pokeApiService } from '../services/pokeApiService.js';

export const useBattleStore = defineStore('battle', {
  state: () => ({
    battle: null,
    selectedPokemons: {
      player1: null,
      player2: null
    },
    loading: false,
    error: null,
    battleLog: [],
    showResultModal: false,
    justFaintedPlayer1: false,
    justFaintedPlayer2: false,
    pokemonList: []
  }),

  getters: {
    isBattleActive: (state) => state.battle?.status === 'active',
    isBattleReady: (state) => state.battle?.status === 'ready',
    isBattleWaiting: (state) => state.battle?.status === 'waiting',
    currentTurn: (state) => state.battle?.currentTurn,
    battleWinner: (state) => state.battle?.winner,
    showResultModal: (state) => state.showResultModal,
    justFaintedPlayer1: (state) => state.justFaintedPlayer1,
    justFaintedPlayer2: (state) => state.justFaintedPlayer2
  },

  actions: {
    async loadPokemonList() {
      this.loading = true;
      this.error = null;

      console.log('🔍 DEBUG: Iniciando loadPokemonList...');

      try {
        console.log('🔍 DEBUG: Chamando pokeApiService.getPokemonList...');
        const response = await pokeApiService.getPokemonList();
        console.log('🔍 DEBUG: Response recebida:', response);
        console.log('🔍 DEBUG: response.data.results:', response?.data?.results);

        this.pokemonList = response.results || [];
        console.log('🔍 DEBUG: pokemonList definido:', this.pokemonList.length, 'itens');
      } catch (error) {
        console.error('❌ DEBUG: Erro em loadPokemonList:', error);
        this.error = error.message;

        // Definir lista vazia como fallback
        this.pokemonList = [];
        console.log('🔍 DEBUG: pokemonList fallback definido como vazio');
      } finally {
        this.loading = false;
        console.log('🔍 DEBUG: loadPokemonList finalizado');
      }
    },

    async createBattle() {
      this.loading = true;
      this.error = null;

      try {
        const response = await pokeApiService.createBattle();
        this.battle = {
          id: response.data.battleId,
          status: response.data.status,
          players: {
            1: { pokemon: null, ready: false },
            2: { pokemon: null, ready: false }
          },
          currentTurn: null,
          winner: null,
          createdAt: new Date().toISOString()
        };
        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to create battle:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async selectPokemon(playerId, pokemonName) {
      if (!this.battle) {
        throw new Error('No active battle');
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await pokeApiService.selectPokemon(
          this.battle.id,
          playerId,
          pokemonName
        );

        // Atualizar estado local
        this.selectedPokemons[`player${playerId}`] = pokemonName;

        if (this.battle.players) {
          this.battle.players[playerId] = {
            pokemon: pokemonName,
            ready: true
          };
        }

        // Atualizar status da batalha se ambos estiverem prontos
        if (this.battle.players[1].ready && this.battle.players[2].ready) {
          this.battle.status = 'ready';
        }

        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to select Pokemon:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async startBattle() {
      if (!this.battle) {
        throw new Error('No active battle');
      }

      this.loading = true;
      this.error = null;

      console.log('🔍 DEBUG: Iniciando startBattle...');
      console.log('🔍 DEBUG: Estado battle antes:', this.battle);
      console.log('🔍 DEBUG: selectedPokemons:', this.selectedPokemons);

      try {
        const response = await pokeApiService.startBattle(this.battle.id);
        console.log('🔍 DEBUG: Response do startBattle:', response);

        this.battle.status = response.data.status;
        this.battle.currentTurn = response.data.currentTurn;

        // Adicionar dados completos dos Pokémon ao battle
        if (response.data.player1 && response.data.player2) {
          this.battle.player1Data = response.data.player1;
          this.battle.player2Data = response.data.player2;
          console.log('🔍 DEBUG: player1Data atualizado:', this.battle.player1Data);
          console.log('🔍 DEBUG: player2Data atualizado:', this.battle.player2Data);
        }

        console.log('🔍 DEBUG: Batalha iniciada com status:', this.battle.status);
        console.log('🔍 DEBUG: Turno atual:', this.battle.currentTurn);
        return response.data;
      } catch (error) {
        console.error('❌ DEBUG: Erro em startBattle:', error);
        this.error = error.message;
        console.log('🔍 DEBUG: Estado após erro:', this.battle);
        throw error;
      } finally {
        this.loading = false;
        console.log('🔍 DEBUG: startBattle finalizado');
      }
    },

    async fetchBattleStatus() {
      if (!this.battle?.id) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await pokeApiService.getBattleStatus(this.battle.id);
        this.battle = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch battle status:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async executeTurn(playerId, action) {
      if (!this.battle) {
        throw new Error('No active battle');
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await pokeApiService.executeTurn(
          this.battle.id,
          playerId,
          action
        );

        console.log('🔍 DEBUG: Response do executeTurn:', response);
        console.log('🔍 DEBUG: response.data.attackerHp:', response.data.attackerHp);
        console.log('🔍 DEBUG: response.data.defenderHp:', response.data.defenderHp);
        console.log('🔍 DEBUG: response.data.battleEnded:', response.data.battleEnded);

        // Atualizar estado local com o resultado
        if (response.data) {
          this.battle.currentTurn = response.data.nextTurn;

          // Atualizar dados dos Pokémon (HP) após o ataque
          // Usar playerId para identificar corretamente quem atacou
          if (playerId === 1) {
            // Player 1 atacou: player1 é attacker, player2 é defender
            if (this.battle.player1Data) {
              console.log('🔍 DEBUG: Atualizando player1Data.currentHp DE', this.battle.player1Data.currentHp, 'PARA', response.data.attackerHp);
              this.battle.player1Data.currentHp = response.data.attackerHp || this.battle.player1Data.currentHp;
              console.log('🔍 DEBUG: Atualizado player1Data.currentHp PARA', this.battle.player1Data.currentHp);
            }
            if (this.battle.player2Data) {
              console.log('🔍 DEBUG: Atualizando player2Data.currentHp DE', this.battle.player2Data.currentHp, 'PARA', response.data.defenderHp);
              this.battle.player2Data.currentHp = response.data.defenderHp || this.battle.player2Data.currentHp;
              console.log('🔍 DEBUG: Atualizado player2Data.currentHp PARA', this.battle.player2Data.currentHp);
            }
          } else {
            // Player 2 atacou: player2 é attacker, player1 é defender
            if (this.battle.player2Data) {
              console.log('🔍 DEBUG: Atualizando player2Data.currentHp DE', this.battle.player2Data.currentHp, 'PARA', response.data.attackerHp);
              this.battle.player2Data.currentHp = response.data.attackerHp || this.battle.player2Data.currentHp;
              console.log('🔍 DEBUG: Atualizado player2Data.currentHp PARA', this.battle.player2Data.currentHp);
            }
            if (this.battle.player1Data) {
              console.log('🔍 DEBUG: Atualizando player1Data.currentHp DE', this.battle.player1Data.currentHp, 'PARA', response.data.defenderHp);
              this.battle.player1Data.currentHp = response.data.defenderHp || this.battle.player1Data.currentHp;
              console.log('🔍 DEBUG: Atualizado player1Data.currentHp PARA', this.battle.player1Data.currentHp);
            }
          }

          console.log('🔍 DEBUG: HP atualizado após ataque:', {
            player1Hp: this.battle.player1Data?.currentHp,
            player2Hp: this.battle.player2Data?.currentHp,
            playerId: playerId,
            attacker: response.data.attacker,
            defender: response.data.defender
          });

          // Adicionar log detalhado do ataque
          let logMessage = '';
          if (response.data.attackName) {
            logMessage = `Jogador ${playerId}: ${response.data.attacker} usou ${response.data.attackName}! Causou ${response.data.damage} de dano em ${response.data.defender}.`;
          } else {
            logMessage = `Jogador ${playerId}: ${response.data.attacker} atacou ${response.data.defender}! Causou ${response.data.damage} de dano.`;
          }

          this.battleLog.push(logMessage);

          if (response.data.battleEnded) {
            this.battle.winner = response.data.winner;
            this.battle.status = 'finished';
            this.showResultModal = true;

            // Adicionar log de fim de batalha
            this.battleLog.push(`🏆 ${response.data.winner} venceu a batalha!`);

            // Verificar se algum Pokémon desmaiou (HP <= 0) - DEPOIS da verificação de battleEnded
            if (this.battle.player1Data && this.battle.player1Data.currentHp <= 0) {
              this.justFaintedPlayer1 = true;
              console.log('🔍 DEBUG: Player 1 desmaiou!');
            }

            if (this.battle.player2Data && this.battle.player2Data.currentHp <= 0) {
              this.justFaintedPlayer2 = true;
              console.log('🔍 DEBUG: Player 2 desmaiou!');
            }
          }
        }

        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to execute turn:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    resetBattle() {
      this.battle = null;
      this.selectedPokemons = { player1: null, player2: null };
      this.battleLog = [];
      this.showResultModal = false;
      this.justFaintedPlayer1 = false;
      this.justFaintedPlayer2 = false;
      console.log('🔍 DEBUG: Batalha resetada');
    },

    clearError() {
      this.error = null;
    },

    hideResultModal() {
      this.showResultModal = false;
    }
  }
});
