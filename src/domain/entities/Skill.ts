/**
 * Entidade Skill - placeholder para implementacao do Squad A.
 */
export interface Skill {
  id: string;
  name: string;
  type: 'damage' | 'heal' | 'buff' | 'debuff';
  power: number;
  cooldown: number;
  description: string;
  cost?: number;
  accuracy: number;
  target: 'self' | 'enemy' | 'all';
}

export class SkillModel {
  private skill: Skill;

  constructor(skill: Skill) {
    this.skill = skill;
  }

  isReady(): boolean {
    return this.skill.cooldown <= 0;
  }

  getCooldownRemaining(): number {
    return Math.max(0, this.skill.cooldown);
  }

  isValid(): boolean {
    return (
      this.skill.name.trim().length > 0 &&
      this.skill.power > 0 &&
      this.skill.accuracy >= 0 &&
      this.skill.accuracy <= 100
    );
  }

  toJSON(): Skill {
    return { ...this.skill };
  }

  static fromJSON(json: Skill): SkillModel {
    return new SkillModel(json);
  }

  getName(): string {
    return this.skill.name;
  }

  getPower(): number {
    return this.skill.power;
  }

  getType(): string {
    return this.skill.type;
  }

  getCooldown(): number {
    return this.skill.cooldown;
  }

  getDescription(): string {
    return this.skill.description;
  }
}
