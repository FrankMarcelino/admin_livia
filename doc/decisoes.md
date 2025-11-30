# Decisões do Projeto

## Decisões Arquiteturais

### DR-001: Escolha do shadcn/ui ao invés de biblioteca de componentes fechada
**Data:** 2025-11-27  
**Status:** ✅ Aprovado  
**Contexto:** Precisávamos de componentes UI premium e acessíveis.  
**Decisão:** Usar shadcn/ui (baseado em Radix UI + Tailwind)  
**Razões:**
- Componentes copiados para o projeto (controle total)
- Acessibilidade nativa (Radix UI)
- Resolve problema de "Modais dentro de Modals" com gerenciamento de z-index
- Customização total via Tailwind

**Alternativas Consideradas:**
- Material UI: Muito opinativo, difícil customizar
- Chakra UI: Bom, mas menos controle sobre o código

---

### DR-002: Zustand para State Management
**Data:** 2025-11-27  
**Status:** ✅ Aprovado  
**Contexto:** Precisamos gerenciar estado global (mock data, filtros, etc)  
**Decisão:** Usar Zustand  
**Razões:**
- Simples e leve (MVP mindset)
- Sem boilerplate (vs Redux)
- TypeScript-first
- Suficiente para mock data e estado de UI

**Alternativas Consideradas:**
- Redux Toolkit: Over-engineering para um MVP
- Context API: Suficiente, mas Zustand é mais ergonômico

---

### DR-003: Tailwind CSS v3.4 ao invés de v4
**Data:** 2025-11-27  
**Status:** ✅ Aprovado  
**Contexto:** Build quebrou com Tailwind v4 (PostCSS incompatível)  
**Decisão:** Downgrade para v3.4.17  
**Razões:**
- shadcn/ui ainda usa v3
- v4 mudou arquitetura do PostCSS plugin
- Estabilidade > Features novas

---

### DR-004: React Router DOM v7
**Data:** 2025-11-27  
**Status:** ✅ Aprovado  
**Contexto:** Precisamos de roteamento client-side  
**Decisão:** React Router DOM v7  
**Razões:**
- Padrão da indústria
- Suporte a layouts aninhados (perfeito para Sidebar)
- TypeScript support

---

## Decisões de UX/UI

### DR-005: Confirmação por digitação para ações destrutivas
**Data:** 2025-11-27  
**Status:** ✅ Aprovado (Requisito do Cliente)  
**Contexto:** Ações como "Inativar Empresa" são irreversíveis  
**Decisão:** Exigir digitação de frase específica (ex: "confirmo inativar empresa")  
**Razões:**
- Previne cliques acidentais
- Padrão em ferramentas de admin (GitHub, AWS Console)

**Implementação:**
- Modal de confirmação com Input
- Botão "Confirmar" desabilitado até digitação correta

---

### DR-006: Modais dentro de Modais (Nested Modals)
**Data:** 2025-11-27  
**Status:** ✅ Aprovado (Requisito do Cliente)  
**Contexto:** Fluxo "Gerenciar Empresas → Modal Usuários → Sheet Editar Usuário"  
**Decisão:** Usar Dialog (Modal) + Sheet (Drawer lateral)  
**Razões:**
- shadcn/ui gerencia z-index automaticamente
- Sheet é visualmente distinto de Dialog (evita confusão)

---

## Decisões de Dados

### DR-007: Mock Data Local (sem backend)
**Data:** 2025-11-27  
**Status:** ✅ Aprovado  
**Contexto:** MVP sem backend real  
**Decisão:** Zustand store com dados mockados + localStorage para persistência  
**Razões:**
- Desenvolvimento rápido
- Demonstração funcional
- Fácil migração futura para API real

---

## Template para Novas Decisões

```markdown
### DR-XXX: [Título da Decisão]
**Data:** YYYY-MM-DD  
**Status:** 🟡 Proposto | ✅ Aprovado | ❌ Rejeitado  
**Contexto:** [Por que essa decisão é necessária?]  
**Decisão:** [O que foi decidido?]  
**Razões:**
- Razão 1
- Razão 2

**Alternativas Consideradas:**
- Alternativa 1: [Por que não?]
- Alternativa 2: [Por que não?]

**Consequências:**
- Positivas: [...]
- Negativas: [...]
```
