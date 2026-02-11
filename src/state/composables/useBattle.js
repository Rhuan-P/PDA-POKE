import { useGameStore } from '../stores/gameStore.js';

export function useBattle() {
  const store = useGameStore();
  return {
    battleStatus: store.battleStatus,
    currentTurn: store.currentTurn,
    startBattle: store.startBattle,
    executeTurn: store.executeTurn
  };
}
