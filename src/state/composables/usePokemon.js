import { useGameStore } from '../stores/gameStore.js';

export function usePokemon() {
  const store = useGameStore();
  return {
    player1: store.player1,
    player2: store.player2,
    setPlayerPokemon: store.setPlayerPokemon
  };
}
