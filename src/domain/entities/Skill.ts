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
  // TODO: implementar metodos conforme docs/contracts/skill.md
}
