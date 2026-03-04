/**
 * Entidade Pokemon - Versão JavaScript para Backend
 */

export class Pokemon {
  constructor(id, name, stats, types) {
    this.id = id;
    this.name = name;
    this.stats = stats || {
      hp: 100,
      attack: 50,
      defense: 50,
      speed: 50
    };
    this.types = types || ['normal'];
    this.currentHp = this.stats.hp;
    this.level = 50;
  }

  takeDamage(damage) {
    this.currentHp = Math.max(0, this.currentHp - damage);
    return this.currentHp;
  }

  heal(amount) {
    this.currentHp = Math.min(this.stats.hp, this.currentHp + amount);
    return this.currentHp;
  }

  isFainted() {
    return this.currentHp <= 0;
  }

  getHpPercentage() {
    return Math.round((this.currentHp / this.stats.hp) * 100);
  }
}
