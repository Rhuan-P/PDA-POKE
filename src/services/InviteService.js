/**
 * InviteService - Sistema de convites de batalha
 * DevOps Squad - Webhook Battle System
 * 
 * Responsável por gerenciar convites de batalha multiplayer
 * com códigos únicos e expiração automática.
 */

const { v4: uuidv4 } = require('uuid');

class InviteService {
  // Armazenamento em memória (MVP)
  static invites = new Map();

  /**
   * Criar um novo convite de batalha
   * @param {string} playerId - ID do jogador que cria o convite
   * @param {string} pokemonId - ID do Pokémon selecionado
   * @returns {Promise<string>} - Código do convite gerado
   */
  static async createInvite(playerId, pokemonId) {
    if (!playerId || !pokemonId) {
      throw new Error('Player ID e Pokémon ID são obrigatórios');
    }

    const inviteCode = this.generateInviteCode();
    const invite = {
      id: uuidv4(),
      code: inviteCode,
      hostPlayer: { 
        id: playerId, 
        pokemonId,
        joinedAt: new Date()
      },
      guestPlayer: null,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
      status: 'waiting', // waiting, ready, expired, cancelled
      maxPlayers: 2
    };
    
    this.invites.set(inviteCode, invite);
    
    // Agendar expiração automática
    this.scheduleExpiration(inviteCode);
    
    console.log(`🎮 Convite criado: ${inviteCode} por jogador ${playerId}`);
    return inviteCode;
  }

  /**
   * Gerar código de convite único
   * @returns {string} - Código no formato XXXX-XXXX
   */
  static generateInviteCode() {
    const uuid = uuidv4().replace(/-/g, '').substring(0, 8);
    const code = `${uuid.substring(0, 4)}-${uuid.substring(4, 8)}`.toUpperCase();
    
    // Verificar se já existe
    if (this.invites.has(code)) {
      return this.generateInviteCode(); // Recursivo se colidir
    }
    
    return code;
  }

  /**
   * Obter informações de um convite
   * @param {string} inviteCode - Código do convite
   * @returns {Promise<Object>} - Dados do convite
   */
  static async getInvite(inviteCode) {
    const invite = this.invites.get(inviteCode);
    
    if (!invite) {
      throw new Error('Convite não encontrado');
    }
    
    if (invite.expiresAt < new Date()) {
      this.invites.delete(inviteCode);
      throw new Error('Convite expirado');
    }
    
    if (invite.status === 'cancelled') {
      throw new Error('Convite cancelado');
    }
    
    return invite;
  }

  /**
   * Adicionar jogador ao convite
   * @param {string} inviteCode - Código do convite
   * @param {string} playerId - ID do jogador entrando
   * @param {string} pokemonId - ID do Pokémon selecionado
   * @returns {Promise<Object>} - Convite atualizado
   */
  static async addPlayerToInvite(inviteCode, playerId, pokemonId) {
    const invite = await this.getInvite(inviteCode);
    
    // Verificar se já está cheio
    if (invite.guestPlayer) {
      throw new Error('Batalha já está cheia');
    }
    
    // Verificar se o host não está tentando entrar novamente
    if (invite.hostPlayer.id === playerId) {
      throw new Error('Host não pode entrar como convidado');
    }
    
    // Adicionar convidado
    invite.guestPlayer = {
      id: playerId,
      pokemonId,
      joinedAt: new Date()
    };
    
    invite.status = 'ready';
    
    console.log(`👤 Jogador ${playerId} entrou no convite ${inviteCode}`);
    return invite;
  }

  /**
   * Cancelar um convite
   * @param {string} inviteCode - Código do convite
   * @param {string} playerId - ID do jogador (apenas host pode cancelar)
   * @returns {Promise<Object>} - Convite cancelado
   */
  static async cancelInvite(inviteCode, playerId) {
    const invite = await this.getInvite(inviteCode);
    
    if (invite.hostPlayer.id !== playerId) {
      throw new Error('Apenas o host pode cancelar o convite');
    }
    
    invite.status = 'cancelled';
    console.log(`❌ Convite ${inviteCode} cancelado por ${playerId}`);
    
    return invite;
  }

  /**
   * Listar convites ativos
   * @returns {Array} - Lista de convites ativos
   */
  static getActiveInvites() {
    const now = new Date();
    const active = [];
    
    for (const [code, invite] of this.invites) {
      if (invite.expiresAt > now && invite.status === 'waiting') {
        active.push({
          code,
          hostPlayer: invite.hostPlayer.id,
          createdAt: invite.createdAt,
          expiresAt: invite.expiresAt
        });
      }
    }
    
    return active;
  }

  /**
   * Limpar convites expirados
   */
  static cleanupExpiredInvites() {
    const now = new Date();
    let cleaned = 0;
    
    for (const [code, invite] of this.invites) {
      if (invite.expiresAt < now || invite.status === 'cancelled') {
        this.invites.delete(code);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Limpados ${cleaned} convites expirados`);
    }
    
    return cleaned;
  }

  /**
   * Agendar expiração automática de um convite
   * @param {string} inviteCode - Código do convite
   */
  static scheduleExpiration(inviteCode) {
    const invite = this.invites.get(inviteCode);
    if (!invite) return;
    
    const timeout = invite.expiresAt.getTime() - Date.now();
    
    setTimeout(() => {
      const currentInvite = this.invites.get(inviteCode);
      if (currentInvite && currentInvite.status === 'waiting') {
        currentInvite.status = 'expired';
        console.log(`⏰ Convite ${inviteCode} expirou automaticamente`);
      }
    }, timeout);
  }

  /**
   * Obter estatísticas dos convites
   * @returns {Object} - Estatísticas
   */
  static getStats() {
    const now = new Date();
    const stats = {
      total: this.invites.size,
      waiting: 0,
      ready: 0,
      expired: 0,
      cancelled: 0
    };
    
    for (const invite of this.invites.values()) {
      if (invite.expiresAt < now && invite.status !== 'cancelled') {
        stats.expired++;
      } else {
        stats[invite.status]++;
      }
    }
    
    return stats;
  }
}

// Limpeza automática a cada 5 minutos
setInterval(() => {
  InviteService.cleanupExpiredInvites();
}, 5 * 60 * 1000);

module.exports = InviteService;
