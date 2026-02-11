export class CriticalHitCalculator {
  static isCritical(random: number): boolean {
    return random < 0.0625;
  }

  static getMultiplier(isCritical: boolean): number {
    return isCritical ? 2 : 1;
  }
}
