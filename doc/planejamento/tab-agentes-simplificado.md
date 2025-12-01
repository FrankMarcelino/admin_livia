# Tab Agentes - Planejamento Simplificado (Versão Atualizada)

**Data:** 30/11/2025
**Versão:** 2.0 - Após Reestruturação do Banco
**Status:** 📋 Planejamento

---

## ⚠️ MUDANÇAS NO BANCO DE DADOS

### Tabela `agents` - Antes e Depois:

**❌ ANTES (17 colunas):**
```typescript
interface Agent {
  id: string
  name: string
  type: 'reactive' | 'proactive'
  function: string  // 'support', 'sales', etc
  gender: string | null
  persona: string | null
  personality_tone: string | null
  communication_medium: string | null
  objective: string | null
  is_intent_agent: boolean
  associated_neurocores: string[]  // Array de UUIDs
  instructions: string  // JSON
  limitations: string  // JSON
  conversation_roteiro: string  // JSON
  other_instructions: string  // JSON
  created_at: string
  updated_at: string
}
```

**✅ AGORA (7 colunas):**
```typescript
interface Agent {
  id: string
  name: string
  type: string  // Agora: 'intention' ao invés de 'reactive'/'proactive'
  created_at: string
  updated_at: string
  id_neurocore: string | null  // ⭐ NOVO - FK para neurocores
  reactive: boolean  // ⭐ NOVO - substituiu is_intent_agent
}
```

---

## 🎯 Impacto no Planejamento

### ❌ O que NÃO é mais possível:

1. Campos de personalidade (persona, personality_tone, objective, gender)
2. JSON editors para instruções complexas
3. Associação N:N com múltiplos neurocores
4. Campo `function` (support/sales)

### ✅ O que AINDA é possível:

1. Listagem de agentes do neurocore do tenant
2. CRUD básico (criar, editar, deletar, visualizar)
3. Associação 1:N (agente pertence a 1 neurocore)
4. Filtros e busca simples

---

## 🎨 Abordagem de UI: Lista + Drawer (ABORDAGEM 3)

Mantemos a **ABORDAGEM 3** (Lista + Drawer Lateral), mas com formulário drasticamente simplificado.

---

## 📐 Design da Interface

### Tela Principal - Lista de Agentes:

```
┌────────────────────────────────────────────────────────────────┐
│  TAB: Agentes                                 [+ Novo Agente]  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Buscar: [                    ] [Todos ▼]                      │
│                                                                │
│  ┌─── Agentes do Neurocore ───────────────────────────────┐   │
│  │                                                         │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ 🤖 Signum - Fernando                 🟢 Reactive  │  │   │
│  │  │    Tipo: intention                          [>]   │  │   │
│  │  ├──────────────────────────────────────────────────┤  │   │
│  │  │ 🤖 Assistente Virtual                🟢 Reactive  │  │   │
│  │  │    Tipo: intention                          [>]   │  │   │
│  │  ├──────────────────────────────────────────────────┤  │   │
│  │  │ 🤖 Vendedor Proativo                 🔴 Proactive│  │   │
│  │  │    Tipo: intention                          [>]   │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                         │   │
│  │  Mostrando 3 de 8 agentes                              │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Elementos:**
- **Badge Reactive/Proactive:** Visual baseado em `reactive: boolean`
- **Tipo:** Exibe `type` (ex: "intention")
- **Busca:** Filtro por nome do agente
- **Dropdown:** Filtro por tipo ou modo (reactive/proactive)

---

### Drawer Lateral - Detalhes do Agente:

```
┌───────────────────────────────────────────────────────────┐
│  Agente: Signum - Fernando              [Editar] [X]      │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ▼ Informações Básicas                                    │
│  ┌────────────────────────────────────────────────────┐   │
│  │                                                    │   │
│  │  Nome do Agente:                                   │   │
│  │  Signum - Fernando                                 │   │
│  │                                                    │   │
│  │  Tipo:                                             │   │
│  │  intention                                         │   │
│  │                                                    │   │
│  │  Modo de Operação:                                 │   │
│  │  ☑ Reactive (Agente reativo)                       │   │
│  │                                                    │   │
│  │  Neurocore Associado:                              │   │
│  │  Neurocore Demo                                    │   │
│  │  🔗 Ver Neurocore                                  │   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                           │
│  ▼ Metadados                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │                                                    │   │
│  │  Criado em:   24/11/2025 15:34                     │   │
│  │  Atualizado:  24/11/2025 15:34                     │   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                           │
│  ▼ Estatísticas (Opcional)                                │
│  ┌────────────────────────────────────────────────────┐   │
│  │                                                    │   │
│  │  Mensagens enviadas: 142                           │   │
│  │  Última atividade:   Hoje às 18:30                 │   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                           │
│  ┌────────────────────────────────────────────────────┐   │
│  │  [Salvar]           [Deletar Agente]              │   │
│  └────────────────────────────────────────────────────┘   │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

### Modal de Criação/Edição:

```
┌───────────────────────────────────────────────────────────┐
│  Novo Agente                                        [X]   │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  Nome do Agente *                                         │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Ex: Assistente de Vendas                          │   │
│  └────────────────────────────────────────────────────┘   │
│                                                           │
│  Tipo *                                                   │
│  ┌────────────────────────────────────────────────────┐   │
│  │ intention ▼                                        │   │
│  └────────────────────────────────────────────────────┘   │
│  ⓘ Tipo do agente (ex: intention, support, sales)        │
│                                                           │
│  Neurocore *                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Neurocore Demo ▼                                   │   │
│  └────────────────────────────────────────────────────┘   │
│  ⓘ Neurocore ao qual este agente pertence                │
│                                                           │
│  Modo de Operação                                         │
│  ┌────────────────────────────────────────────────────┐   │
│  │ ☑ Reactive (Agente reativo)                        │   │
│  └────────────────────────────────────────────────────┘   │
│  ⓘ Se ativo, o agente responde a mensagens              │
│                                                           │
│  ┌────────────────────────────────────────────────────┐   │
│  │  [Cancelar]                          [Criar Agente]│   │
│  └────────────────────────────────────────────────────┘   │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**Validações:**
- `name`: obrigatório, mínimo 3 caracteres
- `type`: obrigatório, string livre
- `id_neurocore`: obrigatório, UUID válido
- `reactive`: opcional, default true

---

## 🛠️ Implementação Técnica

### Arquivos a Criar:

```
src/
├── components/
│   └── agents/
│       ├── AgentsTab.tsx                   # Tab principal (lista + drawer)
│       ├── AgentList.tsx                   # Lista de agentes
│       ├── AgentCard.tsx                   # Card individual do agente
│       ├── AgentDrawer.tsx                 # Drawer de detalhes
│       ├── AgentForm.tsx                   # Formulário (criar/editar)
│       └── AgentFormDialog.tsx             # Dialog wrapper do form
│
├── hooks/
│   └── useAgentFilters.ts                  # Hook de filtros (busca, tipo)
│
├── lib/
│   ├── queries/
│   │   └── agent/
│   │       ├── index.ts
│   │       ├── agent-fetch.queries.ts      # Buscar agents por neurocore
│   │       ├── agent-crud.queries.ts       # CRUD operations
│   │       └── agent-stats.queries.ts      # Estatísticas (opcional)
│   │
│   └── validations/
│       └── agentValidation.ts              # Validações e schemas Zod
│
├── store/
│   └── agent/
│       ├── index.ts
│       ├── agentStore.types.ts             # Tipos TypeScript
│       ├── agentStore.ts                   # Store principal
│       ├── agentStore.crud.ts              # Operações CRUD
│       └── agentStore.filters.ts           # Gerenciamento de filtros
│
└── types/
    └── agent-extended.types.ts             # Tipos estendidos
```

**Total estimado:** ~10 arquivos (muito mais simples que o planejamento original)

---

### Tipos TypeScript:

```typescript
// types/agent-extended.types.ts

import { Database } from './database.types'

export type Agent = Database['public']['Tables']['agents']['Row']
export type AgentInsert = Database['public']['Tables']['agents']['Insert']
export type AgentUpdate = Database['public']['Tables']['agents']['Update']

/**
 * Agent com relacionamento de neurocore populado
 */
export interface AgentWithNeurocore extends Agent {
  neurocore: {
    id: string
    name: string
    is_active: boolean
  } | null
}

/**
 * Filtros para listagem de agents
 */
export interface AgentFilters {
  search?: string       // Busca por nome
  type?: string         // Filtro por tipo
  reactive?: boolean    // Filtro por modo
  id_neurocore?: string // Filtro por neurocore
}

/**
 * Estatísticas do agente (opcional)
 */
export interface AgentStats {
  total_messages: number
  last_activity_at: string | null
}
```

---

### Validações Zod:

```typescript
// lib/validations/agentValidation.ts

import { z } from 'zod'

export const agentCreateSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  type: z.string()
    .min(1, 'Tipo é obrigatório')
    .max(50, 'Tipo deve ter no máximo 50 caracteres'),

  id_neurocore: z.string()
    .uuid('Selecione um Neurocore válido')
    .nullable(),

  reactive: z.boolean()
    .default(true)
})

export const agentUpdateSchema = agentCreateSchema.partial()

export type AgentFormData = z.infer<typeof agentCreateSchema>
```

---

### Queries Supabase:

```typescript
// lib/queries/agent/agent-fetch.queries.ts

import { supabase } from '@/lib/supabase'
import { AgentWithNeurocore, AgentFilters } from '@/types/agent-extended.types'

/**
 * Busca agents de um tenant (via neurocore)
 */
export async function fetchAgentsByTenantNeurocore(
  neurocoreId: string,
  filters?: AgentFilters
) {
  let query = supabase
    .from('agents')
    .select(`
      *,
      neurocore:neurocores!id_neurocore(
        id,
        name,
        is_active
      )
    `)
    .eq('id_neurocore', neurocoreId)

  // Aplicar filtros
  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  if (filters?.type) {
    query = query.eq('type', filters.type)
  }

  if (filters?.reactive !== undefined) {
    query = query.eq('reactive', filters.reactive)
  }

  // Ordenar por nome
  query = query.order('name', { ascending: true })

  const { data, error } = await query

  if (error) throw error

  return data as AgentWithNeurocore[]
}
```

---

### Store Zustand:

```typescript
// store/agent/agentStore.types.ts

import { AgentWithNeurocore, AgentFilters, AgentStats } from '@/types/agent-extended.types'
import { AgentInsert, AgentUpdate } from '@/types/agent-extended.types'

export interface AgentStore {
  // Estado
  agents: AgentWithNeurocore[]
  selectedAgent: AgentWithNeurocore | null
  filters: AgentFilters
  isLoading: boolean
  error: string | null

  // Ações de Leitura
  fetchAgents: (neurocoreId: string) => Promise<void>
  fetchAgentById: (id: string) => Promise<void>
  fetchAgentStats: (id: string) => Promise<AgentStats | null>

  // Ações de Escrita
  createAgent: (data: AgentInsert) => Promise<void>
  updateAgent: (id: string, data: AgentUpdate) => Promise<void>
  deleteAgent: (id: string) => Promise<void>

  // Ações de Filtro
  setFilters: (filters: Partial<AgentFilters>) => void
  clearFilters: () => void

  // Ações de Seleção
  selectAgent: (agent: AgentWithNeurocore | null) => void
}
```

---

## 🔄 Fluxo de Usuário

### Fluxo 1: Visualizar Agentes do Tenant

1. Usuário acessa tab "Agentes" no modal de gerenciar empresa
2. Sistema busca `tenant.neurocore_id`
3. Sistema busca todos os agents onde `agent.id_neurocore = tenant.neurocore_id`
4. Exibe lista de agentes

### Fluxo 2: Criar Novo Agente

1. Usuário clica "+ Novo Agente"
2. Sistema abre dialog com formulário
3. Usuário preenche:
   - Nome (obrigatório)
   - Tipo (obrigatório)
   - Neurocore (pré-selecionado com neurocore do tenant)
   - Modo Reactive (checkbox, default true)
4. Sistema valida e cria agente
5. Agente aparece na lista

### Fluxo 3: Editar Agente

1. Usuário clica no agente da lista
2. Sistema abre drawer lateral
3. Usuário clica "Editar"
4. Sistema abre dialog com formulário preenchido
5. Usuário modifica campos
6. Sistema salva e atualiza lista

### Fluxo 4: Deletar Agente

1. Usuário clica no agente da lista
2. Sistema abre drawer lateral
3. Usuário clica "Deletar Agente"
4. Sistema exibe confirmação:
   - "Tem certeza que deseja deletar o agente 'Signum - Fernando'?"
   - "⚠️ Essa ação NÃO pode ser desfeita"
5. Usuário confirma
6. Sistema deleta agente do banco
7. Lista é atualizada

---

## ✅ Checklist de Implementação

### Fase 1: Setup
- [ ] Criar tipos TypeScript (`agent-extended.types.ts`)
- [ ] Criar validações Zod (`agentValidation.ts`)
- [ ] Criar queries Supabase (`agent-fetch.queries.ts`, `agent-crud.queries.ts`)
- [ ] Criar store Zustand (modular)

### Fase 2: Componentes Base
- [ ] `AgentCard.tsx` - Card individual
- [ ] `AgentList.tsx` - Lista de agentes
- [ ] `AgentForm.tsx` - Formulário (criar/editar)
- [ ] `AgentFormDialog.tsx` - Dialog wrapper

### Fase 3: Drawer e Filtros
- [ ] `AgentDrawer.tsx` - Drawer de detalhes
- [ ] `useAgentFilters.ts` - Hook de filtros
- [ ] Integrar busca e filtros na lista

### Fase 4: Tab Principal
- [ ] `AgentsTab.tsx` - Orquestrar lista + drawer
- [ ] Integrar com store
- [ ] Testar fluxos completos

### Fase 5: Polimento
- [ ] Loading states
- [ ] Empty states ("Nenhum agente encontrado")
- [ ] Error handling
- [ ] Responsividade
- [ ] Acessibilidade

---

## 📊 Comparação: Antes vs Agora

| Aspecto | Planejamento Original | Planejamento Simplificado |
|---------|----------------------|---------------------------|
| **Campos** | 17 | 7 |
| **Formulário** | Complexo (4 tabs, JSON editors) | Simples (4 campos) |
| **Relacionamento** | N:N (via array) | 1:N (via FK) |
| **Arquivos** | ~20 | ~10 |
| **Complexidade** | Alta | Baixa |
| **Tempo estimado** | 3-4 dias | 1-2 dias |

---

## 🚀 Próximos Passos

1. ✅ Confirmar estrutura do banco (feito)
2. ⏳ Implementar Fase 1 (Setup)
3. ⏳ Implementar Fase 2 (Componentes Base)
4. ⏳ Implementar Fase 3 (Drawer e Filtros)
5. ⏳ Implementar Fase 4 (Tab Principal)
6. ⏳ Implementar Fase 5 (Polimento)

---

## 💡 Observações Finais

1. **Simplicidade:** A reestruturação do banco simplificou drasticamente a implementação
2. **Relacionamento:** Agora é 1:N (agent pertence a 1 neurocore), muito mais simples que N:N
3. **Campos removidos:** Possível que sejam movidos para outra tabela futuramente (ex: `agent_configurations`)
4. **MVP:** Esta versão é perfeita para MVP - simples, funcional e escalável

---

**Versão:** 2.0
**Data:** 30/11/2025
**Status:** 📋 Planejamento Aprovado - Aguardando Implementação
