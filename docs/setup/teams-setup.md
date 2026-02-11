# 👥 Criando GitHub Teams - PDA-POKE

## 🎯 Objetivo
Criar 3 times na organização Rhuan-P para o desenvolvimento do MVP.

## 📋 Times a Criar

### 1. Game Logic Squad
- **Nome**: `game-logic`
- **Descrição**: Entidades, regras e cálculos de batalha Pokémon
- **Responsabilidades**: 
  - Entidades Pokemon e Skill
  - Calculadoras de stats e dano
  - Sistema de batalha
  - Constantes e regras de domínio

### 2. User Experience Squad
- **Nome**: `user-experience`
- **Descrição**: Interface, serviços e experiência do usuário
- **Responsabilidades**:
  - Interface com Vue.js
  - Serviços de API (PokeAPI)
  - Estado global com Pinia
  - Casos de uso e controllers
  - Componentes reutilizáveis

### 3. DevOps Squad
- **Nome**: `devops`
- **Descrição**: Infraestrutura, CI/CD e qualidade
- **Responsabilidades**:
  - Pipeline de CI/CD
  - Configuração de ambiente
  - Monitoramento e logging
  - Segurança e dependências
  - Documentação e release

## 🚀 Passos para Criação

### 1. Via Interface GitHub
1. **Acessar**: https://github.com/Rhuan-P
2. **Settings**: Organizations → Rhuan-P → Teams
3. **Create team**: Para cada um dos 3 times


### 2. Configurar Cada Time
```bash
# Game Logic Team:
- Name: game-logic
- Description: Entidades, regras e cálculos de batalha Pokémon
- Visibility: Visible
- Parent: Rhuan-P

# User Experience Team:
- Name: user-experience
- Description: Interface, serviços e experiência do usuário
- Visibility: Visible
- Parent: Rhuan-P

# DevOps Team:
- Name: devops
- Description: Infraestrutura, CI/CD e qualidade
- Visibility: Visible
- Parent: Rhuan-P
```

### 3. Configurar Permissões
```bash
# Para o repositório PDA-POKE:

# Game Logic Squad:
- Repository: Read/Write
- Issues: Read/Write
- Pull Requests: Read/Write

# User Experience Squad:
- Repository: Read/Write
- Issues: Read/Write
- Pull Requests: Read/Write

# DevOps Squad:
- Repository: Admin (acesso total)
- Issues: Admin
- Pull Requests: Admin
- Settings: Admin
```

### 4. Adicionar Repositório
- Adicionar repositório `PDA-POKE` aos 3 times
- Configurar permissões conforme acima

### 5. Convidar Membros
- Adicionar membros aos times correspondentes
- Enviar link de onboarding: https://github.com/Rhuan-P/PDA-POKE/blob/main/docs/setup/onboarding.md

## 📋 Checklist Final

### ✅ Times Criados
- [ ] game-logic team existe
- [ ] user-experience team existe
- [ ] devops team existe

### ✅ Permissões Configuradas
- [ ] PDA-POKE adicionado aos times
- [ ] Permissões corretas para cada squad

### ✅ Membros Convidados
- [ ] Game Logic members adicionados
- [ ] User Experience members adicionados
- [ ] DevOps members adicionados

### ✅ Links Úteis
- [ ] Teams: https://github.com/Rhuan-P/teams
- [ ] Issues: https://github.com/Rhuan-P/PDA-POKE/issues
- [ ] Project: https://github.com/Rhuan-P/PDA-POKE/projects

## 🎯 Após Criação

1. **Criar labels** seguindo issue #27
2. **Configurar GitHub Project** com as 19 issues
3. **Começar desenvolvimento** seguindo DTF

---

**Times criados com sucesso!** 🎉