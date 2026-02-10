# DTR Global - Jogo PVP

## Objetivo Técnico Global
Criar MVP funcional de jogo PVP por turnos com arquitetura limpa e modular, permitindo evolução sustentável sem refatoração massiva.

## Escopo Global do MVP
- Sistema de batalhas 1v1 por turnos
- Interface básica para seleção de ações
- Validação completa de regras de combate
- Estrutura arquitetural preparada para expansão
- Sistema de matchmaking básico

## Fora de Escopo Global
- Sistema de progressão/campanha
- Loja de itens ou economia
- Ranking global ou estatísticas
- Gráficos avançados ou animações complexas
- Sistema de guildas ou times

## Regras Arquiteturais Globais
- Clean Architecture com separação clara de camadas
- SOLID como princípio fundamental
- Injeção de dependência obrigatória
- Testabilidade em todas as camadas
- Nenhuma camada depende de implementações concretas de outras

## Garantias do Sistema
- Código testável e maintainable
- Evolução sem breaking changes
- Performance mínima aceitável (<200ms por ação)
- Segurança contra cheating básico
- Escalabilidade para 1000 partidas simultâneas

## Fonte Única da Verdade
- **Git**: Decisões técnicas oficiais versionadas
- **/docs**: Documentação canônica do projeto
- **Notion**: Painel de organização e leitura (não fonte primária)

## Processo de Validação
Toda alteração deve seguir:
1. DTR aprovado pelo Líder Técnico
2. DTI implementado pelo squad responsável
3. DTA verificado e documentado
4. Merge apenas após validação completa

## Critérios de Aceite Global
- Sistema funcional de batalhas 1v1
- Interface responsiva e funcional
- Código com cobertura de testes >80%
- Documentação completa e acessível
- Performance dentro dos limites estabelecidos
