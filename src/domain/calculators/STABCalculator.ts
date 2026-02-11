export class STABCalculator {
  static getMultiplier(attackerTypes: string[], skillType: string): number {
    return attackerTypes.includes(skillType) ? 1.5 : 1;
  }
}
