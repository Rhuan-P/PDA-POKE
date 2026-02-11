export interface DamageInput {
  attack: number;
  defense: number;
  power: number;
  effectiveness?: number;
  stab?: number;
  critical?: number;
}

export class DamageCalculator {
  static calculate(input: DamageInput): number {
    const effectiveness = input.effectiveness ?? 1;
    const stab = input.stab ?? 1;
    const critical = input.critical ?? 1;
    const base = (input.attack / Math.max(1, input.defense)) * input.power;
    return Math.max(1, Math.floor(base * effectiveness * stab * critical));
  }
}
