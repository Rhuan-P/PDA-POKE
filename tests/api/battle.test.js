/**
 * Testes da API de Batalha
 * DevOps Squad - Webhook Battle System
 * 
 * Testes automatizados para endpoints RESTful do sistema
 * de batalhas multiplayer.
 */

const request = require('supertest');
const BattleServer = require('../../src/server');

describe('Battle API', () => {
  let server;
  let app;

  beforeAll(async () => {
    // Iniciar servidor de teste
    server = new BattleServer();
    app = server.app;
    
    // Aguardar inicialização
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    // Limpar recursos
    if (server) {
      server.server.close();
    }
  });

  describe('Health Check', () => {
    test('GET /health - deve retornar status healthy', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Battle Server is healthy');
      expect(response.body.uptime).toBeDefined();
      expect(response.body.memory).toBeDefined();
    });
  });

  describe('API Info', () => {
    test('GET /api - deve retornar informações da API', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('PDA-POKE Battle API');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.endpoints).toBeDefined();
      expect(response.body.websocket).toBeDefined();
    });
  });

  describe('Invite Creation', () => {
    test('POST /api/battle/invite - deve criar convite com sucesso', async () => {
      const response = await request(app)
        .post('/api/battle/invite')
        .send({
          playerId: 'player1',
          pokemonId: '25'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.inviteCode).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/);
      expect(response.body.data.inviteLink).toContain(response.body.data.inviteCode);
      expect(response.body.data.hostPlayer.id).toBe('player1');
      expect(response.body.data.hostPlayer.pokemonName).toBe('Pikachu');
      expect(response.body.data.expiresAt).toBeDefined();
    });

    test('POST /api/battle/invite - deve rejeitar dados inválidos', async () => {
      const response = await request(app)
        .post('/api/battle/invite')
        .send({
          playerId: 'player1'
          // pokemonId faltando
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('obrigatórios');
    });

    test('POST /api/battle/invite - deve rejeitar Pokémon inexistente', async () => {
      const response = await request(app)
        .post('/api/battle/invite')
        .send({
          playerId: 'player1',
          pokemonId: '999'
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('não encontrado');
    });
  });

  describe('Join Battle', () => {
    let inviteCode;

    beforeEach(async () => {
      // Criar convite para testes
      const inviteResponse = await request(app)
        .post('/api/battle/invite')
        .send({
          playerId: 'player1',
          pokemonId: '25'
        });
      
      inviteCode = inviteResponse.body.data.inviteCode;
    });

    test('POST /api/battle/join - deve entrar na batalha com sucesso', async () => {
      const response = await request(app)
        .post('/api/battle/join')
        .send({
          inviteCode,
          playerId: 'player2',
          pokemonId: '6'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.lobbyId).toBeDefined();
      expect(response.body.data.players).toHaveLength(2);
      expect(response.body.data.turnOrder).toHaveLength(2);
      expect(response.body.data.status).toBe('ready');
    });

    test('POST /api/battle/join - deve rejeitar entrada duplicada', async () => {
      // Tentar entrar novamente com mesmo playerId
      const response = await request(app)
        .post('/api/battle/join')
        .send({
          inviteCode,
          playerId: 'player1',
          pokemonId: '6'
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Host não pode entrar');
    });

    test('POST /api/battle/join - deve rejeitar sala cheia', async () => {
      // Primeiro jogador entra
      await request(app)
        .post('/api/battle/join')
        .send({
          inviteCode,
          playerId: 'player2',
          pokemonId: '6'
        });

      // Segundo jogador tentando entrar
      const response = await request(app)
        .post('/api/battle/join')
        .send({
          inviteCode,
          playerId: 'player3',
          pokemonId: '1'
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('cheia');
    });

    test('POST /api/battle/join - deve rejeitar convite inexistente', async () => {
      const response = await request(app)
        .post('/api/battle/join')
        .send({
          inviteCode: 'INVALID-CODE',
          playerId: 'player2',
          pokemonId: '6'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('não encontrado');
    });
  });

  describe('Battle Start', () => {
    let lobbyId;

    beforeEach(async () => {
      // Criar sala completa
      const inviteResponse = await request(app)
        .post('/api/battle/invite')
        .send({
          playerId: 'player1',
          pokemonId: '25'
        });

      const joinResponse = await request(app)
        .post('/api/battle/join')
        .send({
          inviteCode: inviteResponse.body.data.inviteCode,
          playerId: 'player2',
          pokemonId: '6'
        });

      lobbyId = joinResponse.body.data.lobbyId;
    });

    test('POST /api/battle/start - deve iniciar batalha com sucesso', async () => {
      const response = await request(app)
        .post('/api/battle/start')
        .send({
          lobbyId
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('fighting');
      expect(response.body.data.currentTurn).toBeDefined();
      expect(response.body.data.startedAt).toBeDefined();
      expect(response.body.data.battleLog).toContain('⚔️ Batalha iniciada!');
    });

    test('POST /api/battle/start - deve rejeitar sala inexistente', async () => {
      const response = await request(app)
        .post('/api/battle/start')
        .send({
          lobbyId: 'invalid-lobby-id'
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('não encontrada');
    });

    test('POST /api/battle/start - deve rejeitar sala não pronta', async () => {
      // Criar convite sem segundo jogador
      const inviteResponse = await request(app)
        .post('/api/battle/invite')
        .send({
          playerId: 'player1',
          pokemonId: '25'
        });

      const response = await request(app)
        .post('/api/battle/start')
        .send({
          lobbyId: inviteResponse.body.data.inviteCode // Usar inviteCode como lobbyId mock
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('não está pronta');
    });
  });

  describe('Battle Turn', () => {
    let lobbyId;

    beforeEach(async () => {
      // Criar e iniciar batalha
      const inviteResponse = await request(app)
        .post('/api/battle/invite')
        .send({
          playerId: 'player1',
          pokemonId: '25'
        });

      const joinResponse = await request(app)
        .post('/api/battle/join')
        .send({
          inviteCode: inviteResponse.body.data.inviteCode,
          playerId: 'player2',
          pokemonId: '6'
        });

      lobbyId = joinResponse.body.data.lobbyId;

      await request(app)
        .post('/api/battle/start')
        .send({ lobbyId });
    });

    test('POST /api/battle/turn - deve executar turno com sucesso', async () => {
      const response = await request(app)
        .post('/api/battle/turn')
        .send({
          lobbyId,
          playerId: 'player1',
          skillId: 'tackle'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.turnResult).toBeDefined();
      expect(response.body.data.turnResult.damage).toBeGreaterThan(0);
      expect(response.body.data.nextTurn).toBeDefined();
      expect(response.body.data.battleStatus).toBe('fighting');
    });

    test('POST /api/battle/turn - deve rejeitar turno errado', async () => {
      const response = await request(app)
        .post('/api/battle/turn')
        .send({
          lobbyId,
          playerId: 'player2', // Não é o turno do player2
          skillId: 'tackle'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('não é o turno');
    });

    test('POST /api/battle/turn - deve rejeitar habilidade inexistente', async () => {
      const response = await request(app)
        .post('/api/battle/turn')
        .send({
          lobbyId,
          playerId: 'player1',
          skillId: 'invalid-skill'
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('não encontrada');
    });
  });

  describe('Pokemon Data', () => {
    test('GET /api/battle/pokemon - deve listar Pokémons disponíveis', async () => {
      const response = await request(app)
        .get('/api/battle/pokemon')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pokemon).toHaveLength(8); // Mock data tem 8 Pokémons
      expect(response.body.data.total).toBe(8);
      
      // Verificar estrutura dos dados
      const pokemon = response.body.data.pokemon[0];
      expect(pokemon.id).toBeDefined();
      expect(pokemon.name).toBeDefined();
      expect(pokemon.types).toBeDefined();
      expect(pokemon.sprite).toBeDefined();
    });

    test('GET /api/battle/pokemon/:id - deve obter detalhes do Pokémon', async () => {
      const response = await request(app)
        .get('/api/battle/pokemon/25')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('25');
      expect(response.body.data.name).toBe('Pikachu');
      expect(response.body.data.stats).toBeDefined();
      expect(response.body.data.skills).toBeDefined();
      expect(response.body.data.currentHp).toBe(response.body.data.stats.maxHp);
    });

    test('GET /api/battle/pokemon/:id - deve rejeitar Pokémon inexistente', async () => {
      const response = await request(app)
        .get('/api/battle/pokemon/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('não encontrado');
    });
  });

  describe('Skills Data', () => {
    test('GET /api/battle/skills - deve listar habilidades disponíveis', async () => {
      const response = await request(app)
        .get('/api/battle/skills')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.skills.length).toBeGreaterThan(0);
      expect(response.body.data.total).toBeGreaterThan(0);
      
      // Verificar estrutura das habilidades
      const skill = response.body.data.skills[0];
      expect(skill.id).toBeDefined();
      expect(skill.name).toBeDefined();
      expect(skill.type).toBeDefined();
      expect(skill.power).toBeDefined();
      expect(skill.pp).toBeDefined();
    });
  });

  describe('Lobby Management', () => {
    test('GET /api/battle/lobby/:id - deve obter dados da sala', async () => {
      // Criar sala
      const inviteResponse = await request(app)
        .post('/api/battle/invite')
        .send({
          playerId: 'player1',
          pokemonId: '25'
        });

      const joinResponse = await request(app)
        .post('/api/battle/join')
        .send({
          inviteCode: inviteResponse.body.data.inviteCode,
          playerId: 'player2',
          pokemonId: '6'
        });

      const lobbyId = joinResponse.body.data.lobbyId;

      const response = await request(app)
        .get(`/api/battle/lobby/${lobbyId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.lobbyId).toBe(lobbyId);
      expect(response.body.data.players).toHaveLength(2);
      expect(response.body.data.status).toBe('ready');
      expect(response.body.data.turnOrder).toHaveLength(2);
    });

    test('GET /api/battle/lobby/:id - deve rejeitar sala inexistente', async () => {
      const response = await request(app)
        .get('/api/battle/lobby/invalid-lobby-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('não encontrada');
    });

    test('GET /api/battle/lobbies - deve listar salas ativas', async () => {
      // Criar algumas salas
      await request(app)
        .post('/api/battle/invite')
        .send({ playerId: 'player1', pokemonId: '25' });

      await request(app)
        .post('/api/battle/invite')
        .send({ playerId: 'player3', pokemonId: '1' });

      const response = await request(app)
        .get('/api/battle/lobbies')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.lobbies.length).toBeGreaterThan(0);
      expect(response.body.data.total).toBeGreaterThan(0);
    });
  });

  describe('System Stats', () => {
    test('GET /api/battle/stats - deve retornar estatísticas do sistema', async () => {
      const response = await request(app)
        .get('/api/battle/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.invites).toBeDefined();
      expect(response.body.data.lobbies).toBeDefined();
      expect(response.body.data.mockData).toBeDefined();
      expect(response.body.data.system).toBeDefined();
      expect(response.body.data.system.uptime).toBeDefined();
      expect(response.body.data.system.memory).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('GET /api/nonexistent - deve retornar 404', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    test('POST /api/battle/invite - deve lidar com JSON inválido', async () => {
      const response = await request(app)
        .post('/api/battle/invite')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Invite Management', () => {
    let inviteCode;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/battle/invite')
        .send({
          playerId: 'player1',
          pokemonId: '25'
        });
      
      inviteCode = response.body.data.inviteCode;
    });

    test('GET /api/battle/invite/:code - deve obter informações do convite', async () => {
      const response = await request(app)
        .get(`/api/battle/invite/${inviteCode}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.inviteCode).toBe(inviteCode);
      expect(response.body.data.status).toBe('waiting');
      expect(response.body.data.players).toHaveLength(1);
      expect(response.body.data.players[0].isHost).toBe(true);
    });

    test('DELETE /api/battle/invite/:code - host pode cancelar convite', async () => {
      const response = await request(app)
        .delete(`/api/battle/invite/${inviteCode}`)
        .send({
          playerId: 'player1' // Host
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('cancelled');
    });

    test('DELETE /api/battle/invite/:code - não host não pode cancelar', async () => {
      const response = await request(app)
        .delete(`/api/battle/invite/${inviteCode}`)
        .send({
          playerId: 'player2' // Não é host
        })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Apenas o host');
    });
  });
});
