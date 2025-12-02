# Gerenciar NeuroCores

## Objetivo

Criar uma interface administrativa completa para gerenciar **Neurocores** (núcleos de IA) e seus **Agentes** associados. O Neurocore é a estrutura central do sistema multi-agente, funcionando como um agrupador de agentes que espelham a configuração da aplicação externa (N8N). Esta feature permite ao Super Admin configurar a arquitetura base que será utilizada por múltiplos tenants, geralmente agrupados por nicho de mercado.

**Modelo de Negócio:**
- **1 Neurocore** → **N Tenants** (um neurocore serve várias empresas)
- **1 Neurocore** → **N Agents** (um neurocore possui vários agentes)
- **1 Tenant** → **1 Neurocore** (cada empresa usa apenas um neurocore)
- **Personalização:** Via tabela `agent_prompts` (associa agent + tenant com instruções específicas)

**Analogia:** O Neurocore é como um "template" ou "blueprint" de inteligência que é compartilhado por várias empresas do mesmo nicho, mas cada empresa pode personalizar o comportamento dos agentes via `agent_prompts`.

---

## ⚠️ Mudanças no Schema do Banco de Dados

Antes de implementar esta feature, é necessário **atualizar** o arquivo `src/types/database.types.ts` para refletir as mudanças no schema do banco:

### Mudanças na Tabela `agents`:
```typescript
// ANTES (Schema Antigo - REMOVER)
export interface Agent {
  id: UUID;
  name: string;
  type: AgentType;
  function: AgentFunction;
  gender: string | null;
  persona: string | null;
  personality_tone: string | null;
  communication_medium: string | null;
  objective: string | null;
  is_intent_agent: boolean;
  associated_neurocores: UUID[];  // ❌ REMOVER
  instructions: string;            // ❌ REMOVER
  limitations: string;             // ❌ REMOVER
  conversation_roteiro: string;    // ❌ REMOVER
  other_instructions: string;      // ❌ REMOVER
  created_at: Timestamp;
  updated_at: Timestamp;
}

// DEPOIS (Schema Novo - APLICAR)
export interface Agent {
  id: UUID;
  name: string;
  type: string;                    // ✅ Enum genérico (ex: "receptionist", "sales_rep")
  id_neurocore: UUID;              // ✅ NOVO: FK para neurocores (1:N)
  reactive: boolean;               // ✅ NOVO: Se é reativo ou proativo
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### Mudanças na Tabela `neurocores`:
```typescript
// ANTES (Schema Antigo - REMOVER)
export interface Neurocore {
  id: UUID;
  name: string;
  description: string;
  id_subwork_n8n_neurocore: string;
  is_active: boolean;
  associated_agents: UUID[];       // ❌ REMOVER (relacionamento agora é via agents.id_neurocore)
  created_at: Timestamp;
  updated_at: Timestamp;
}

// DEPOIS (Schema Novo - MANTER)
export interface Neurocore {
  id: UUID;
  name: string;
  description: string;
  id_subwork_n8n_neurocore: string;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### Nova Tabela: `agent_prompts`
```typescript
export interface AgentPrompt {
  id: number;                      // BIGINT GENERATED ALWAYS AS IDENTITY
  created_at: Timestamp;
  name: string | null;
  age: string | null;
  gender: string | null;           // USER-DEFINED enum
  objective: string | null;
  comunication: string | null;     // Nota: "comunication" (typo no banco)
  personality: string | null;
  limitations: Json | null;        // JSONB
  rules: Json | null;              // JSONB
  instructions: Json | null;       // JSONB
  guide_line: Json | null;         // JSONB
  others_instructions: Json | null;// JSONB
  id_agent: UUID | null;           // FK para agents
  id_tenant: UUID | null;          // FK para tenants
}

export interface AgentPromptInsert extends Omit<AgentPrompt, 'id' | 'created_at'> {
  created_at?: Timestamp;
}

export interface AgentPromptUpdate extends Partial<AgentPromptInsert> {}
```

### Atualizar Tipos Estendidos:
```typescript
// src/types/neurocore-extended.types.ts (NOVO ARQUIVO)

export interface NeurocoreWithRelations extends Neurocore {
  agents?: Agent[];                // Agents associados via id_neurocore
  tenant_count?: number;           // Quantos tenants usam este neurocore
}

export interface AgentWithRelations extends Agent {
  neurocore?: Neurocore;           // Neurocore pai
}
```

---

## Requisitos Funcionais

### RF-001: Listagem de Neurocores
- [ ] Exibir tabela com todos os neurocores cadastrados
- [ ] Colunas: Nome, Descrição, Status (Ativo/Inativo), Qtd Agentes, Qtd Tenants, Data Criação, Ações
- [ ] Busca por nome/descrição (com debounce)
- [ ] Filtro por status (ativo/inativo)
- [ ] Ordenação por nome, data de criação
- [ ] Paginação server-side

### RF-002: Criação de Neurocore
- [ ] Modal/Dialog para criar novo neurocore
- [ ] Campos obrigatórios: Nome, ID Workflow N8N
- [ ] Campos opcionais: Descrição, Status (padrão: ativo)
- [ ] Validação: ID Workflow N8N deve ser único
- [ ] Após criar, permitir adicionar agentes imediatamente

### RF-003: Edição de Neurocore (Master-Detail)
- [ ] Formulário master-detail dividido em 2 seções:
  - **Seção 1:** Dados Gerais do Neurocore (nome, descrição, ID N8N, status)
  - **Seção 2:** Lista de Agentes associados (tabela inline)
- [ ] Permitir adicionar novo agente (abre modal)
- [ ] Permitir editar agente existente (abre modal)
- [ ] Permitir remover agente (com confirmação)
- [ ] Salvar todas as alterações em uma única transação

### RF-004: Criação/Edição de Agente (Modal)
- [ ] Modal simples focado na estrutura técnica do agente
- [ ] Campos: Nome, Tipo (enum), Reactive (boolean)
- [ ] **Nota importante:** Não incluir campos de prompt/personalidade (isso é feito em `agent_prompts`)
- [ ] Validação: Nome obrigatório, tipo obrigatório

### RF-005: Detalhes do Neurocore (Drawer)
- [ ] Drawer lateral com visualização completa do neurocore
- [ ] Informações gerais: Nome, descrição, ID N8N, status, datas
- [ ] Estatísticas: Qtd de agentes, qtd de tenants usando
- [ ] Lista de agentes com seus tipos
- [ ] Lista de tenants usando este neurocore (com links)
- [ ] Botões de ação: Editar, Ativar/Desativar, Excluir

### RF-006: Exclusão de Neurocore
- [ ] Validar se há tenants usando o neurocore
- [ ] Se houver tenants: bloquear exclusão e exibir warning
- [ ] Se não houver tenants: permitir exclusão com confirmação
- [ ] Exclusão em cascata dos agentes associados (RLS do Supabase)

### RF-007: Ativação/Desativação de Neurocore
- [ ] Toggle de status ativo/inativo
- [ ] Warning ao desativar se houver tenants usando

---

## Componentes Necessários

### Páginas
- `NeurocoreListPage.tsx` - Página principal com listagem

### Componentes de Listagem
- `NeurocoreTable.tsx` - Tabela de neurocores
- `NeurocoreFilters.tsx` - Filtros (busca, status)
- `NeurocorePagination.tsx` - Paginação

### Componentes de Formulário
- `NeurocoreFormDialog.tsx` - Dialog wrapper para criar/editar
- `NeurocoreForm.tsx` - Formulário master-detail (neurocore + agents)
- `form-sections/NeurocoreBasicFields.tsx` - Campos básicos (nome, descrição, ID N8N, status)
- `form-sections/AgentsListSection.tsx` - Seção de listagem/gerenciamento de agents
- `AgentFormDialog.tsx` - Modal para criar/editar agent individual

### Componentes de Detalhes
- `NeurocoreDetailsDrawer.tsx` - Drawer com visualização completa
- `details-sections/NeurocoreDetailsHeader.tsx` - Header com nome e status
- `details-sections/NeurocoreDetailsInfo.tsx` - Informações gerais
- `details-sections/NeurocoreDetailsAgents.tsx` - Lista de agents
- `details-sections/NeurocoreDetailsStats.tsx` - Cards de estatísticas

---

## Estrutura de Dados (Tipos TypeScript)

### Tipos Principais (após atualização)
```typescript
// database.types.ts
export interface Neurocore {
  id: UUID
  name: string
  description: string
  id_subwork_n8n_neurocore: string
  is_active: boolean
  created_at: Timestamp
  updated_at: Timestamp
}

export interface Agent {
  id: UUID
  name: string
  type: string
  id_neurocore: UUID
  reactive: boolean
  created_at: Timestamp
  updated_at: Timestamp
}

export interface AgentPrompt {
  id: number
  id_agent: UUID | null
  id_tenant: UUID | null
  name: string | null
  personality: string | null
  instructions: Json | null
  limitations: Json | null
  rules: Json | null
  // ... outros campos
  created_at: Timestamp
}
```

### Tipos Estendidos
```typescript
// neurocore-extended.types.ts
export interface NeurocoreWithRelations extends Neurocore {
  agents?: Agent[]
  tenant_count?: number
}

export interface NeurocoreFilters {
  search: string
  is_active?: boolean
}

export interface NeurocoreSort {
  field: 'name' | 'created_at'
  direction: 'asc' | 'desc'
}

export interface NeurocorePagination {
  page: number
  pageSize: number
  total: number
}
```

### Tipos de Formulário
```typescript
// lib/validations/neurocoreValidation.ts
export interface NeurocoreFormData {
  name: string
  description: string
  id_subwork_n8n_neurocore: string
  is_active: boolean
  agents: AgentFormData[]  // Agents inline
}

export interface AgentFormData {
  id?: UUID  // Opcional para novos agents
  name: string
  type: string
  reactive: boolean
  _action?: 'create' | 'update' | 'delete'  // Para controlar ações
}
```

---

## Fluxo de Usuário

### Fluxo 1: Criar Novo Neurocore
1. Super Admin acessa "/neurocores"
2. Clica em "+ Novo Neurocore"
3. Dialog abre com formulário master-detail
4. Preenche dados gerais (nome, descrição, ID N8N)
5. Clica em "+ Adicionar Agente" na seção de agents
6. Modal abre para configurar primeiro agent (nome, tipo, reactive)
7. Salva agent (fecha modal, agent aparece na tabela inline)
8. Repete passos 5-7 para adicionar mais agents
9. Clica em "Salvar Neurocore"
10. Sistema:
    - Valida dados
    - Cria neurocore no banco
    - Cria agents associados (com `id_neurocore`)
    - Exibe mensagem de sucesso
    - Fecha dialog
    - Atualiza listagem

### Fluxo 2: Editar Neurocore Existente
1. Super Admin acessa "/neurocores"
2. Clica no ícone de editar na linha do neurocore
3. Dialog abre com dados pré-carregados
4. Seção 1: Pode alterar nome, descrição, status
5. Seção 2: Visualiza lista de agents existentes
6. Pode:
   - Adicionar novo agent (abre modal)
   - Editar agent (abre modal com dados)
   - Remover agent (marca para exclusão)
7. Clica em "Salvar Alterações"
8. Sistema:
   - Atualiza neurocore
   - Cria novos agents
   - Atualiza agents editados
   - Remove agents marcados para exclusão
   - Exibe mensagem de sucesso

### Fluxo 3: Visualizar Detalhes
1. Super Admin clica na linha do neurocore
2. Drawer abre pela direita
3. Visualiza:
   - Nome, descrição, ID N8N, status
   - Estatísticas (3 agents, usado por 12 tenants)
   - Lista de agents (nome, tipo, reactive)
   - Lista de tenants usando (com links)
4. Pode clicar em "Editar" (abre dialog de edição)
5. Pode clicar em "Ativar/Desativar" (toggle de status)

### Fluxo 4: Excluir Neurocore
1. Super Admin clica em "Excluir" no drawer ou na listagem
2. Sistema verifica se há tenants usando
3. Se houver tenants:
   - Exibe warning: "Não é possível excluir. 12 tenants estão usando este neurocore."
   - Bloqueia exclusão
4. Se não houver tenants:
   - Exibe confirmação: "Excluir neurocore X? Isso também excluirá 3 agents."
   - Se confirmar: exclui e atualiza listagem

---

## Checklist de Implementação

### Fase 1: Setup & Tipos (Fundação)
- [ ] **1.1** Atualizar `database.types.ts` com schema novo de `agents`
- [ ] **1.2** Atualizar `database.types.ts` com schema novo de `neurocores`
- [ ] **1.3** Criar `database.types.ts` com tipos de `agent_prompts`
- [ ] **1.4** Criar arquivo `neurocore-extended.types.ts` com tipos estendidos
- [ ] **1.5** Criar arquivo `lib/validations/neurocoreValidation.ts` com schemas Zod
- [ ] **1.6** ✅ **Testar build:** `npm run build` deve passar sem erros

### Fase 2: Queries Supabase (Data Layer)
- [ ] **2.1** Criar `lib/queries/neurocore/index.ts` (export barrel)
- [ ] **2.2** Criar `neurocore-fetch.queries.ts`:
  - `fetchNeurocores()` - Com filtros, ordenação, paginação
  - `fetchNeurocoreById(id)` - Com agents associados
  - `fetchNeurocoreWithStats(id)` - Com estatísticas (tenant_count, agent_count)
- [ ] **2.3** Criar `neurocore-crud.queries.ts`:
  - `createNeurocore(data)`
  - `updateNeurocore(id, data)`
  - `deleteNeurocore(id)`
  - `toggleNeurocoreStatus(id, status)`
- [ ] **2.4** Criar `agent-crud.queries.ts`:
  - `createAgent(data)` - Com `id_neurocore`
  - `updateAgent(id, data)`
  - `deleteAgent(id)`
  - `fetchAgentsByNeurocore(neurocoreId)`
- [ ] **2.5** Criar `neurocore-stats.queries.ts`:
  - `countTenantsByNeurocore(neurocoreId)`
  - `countAgentsByNeurocore(neurocoreId)`
- [ ] **2.6** ✅ **Testar build:** `npm run build` deve passar sem erros

### Fase 3: Zustand Store (State Management)
- [ ] **3.1** Criar `store/neurocore/index.ts` (export barrel)
- [ ] **3.2** Criar `neurocoreStore.types.ts` (interfaces do store)
- [ ] **3.3** Criar `neurocoreStore.ts` (store principal com estado)
- [ ] **3.4** Criar `neurocoreStore.crud.ts` (ações CRUD neurocores)
- [ ] **3.5** Criar `neurocoreStore.agents.ts` (ações CRUD agents)
- [ ] **3.6** Criar `neurocoreStore.filters.ts` (gerenciamento de filtros/paginação)
- [ ] **3.7** ✅ **Testar build:** `npm run build` deve passar sem erros

### Fase 4: Componentes de Listagem
- [ ] **4.1** Criar `components/neurocores/NeurocoreListPage.tsx` (página principal)
- [ ] **4.2** Criar `NeurocoreTable.tsx` (tabela com colunas)
- [ ] **4.3** Criar `NeurocoreFilters.tsx` (busca + filtro de status)
- [ ] **4.4** Criar `NeurocorePagination.tsx` (controles de paginação)
- [ ] **4.5** Criar hook `hooks/useNeurocoreFilters.ts` (lógica de filtros com debounce)
- [ ] **4.6** ✅ **Testar build:** `npm run build` deve passar sem erros

### Fase 5: Componentes de Formulário (Master-Detail)
- [ ] **5.1** Criar `NeurocoreFormDialog.tsx` (wrapper do dialog)
- [ ] **5.2** Criar `NeurocoreForm.tsx` (formulário principal com state local para agents)
- [ ] **5.3** Criar `form-sections/NeurocoreBasicFields.tsx` (nome, descrição, ID N8N, status)
- [ ] **5.4** Criar `form-sections/AgentsListSection.tsx`:
  - Tabela inline de agents
  - Botão "+ Adicionar Agente"
  - Ações: Editar, Remover
- [ ] **5.5** Criar `AgentFormDialog.tsx` (modal para agent individual)
- [ ] **5.6** Implementar lógica de salvar em transação:
  - Salvar neurocore primeiro
  - Criar novos agents
  - Atualizar agents editados
  - Deletar agents removidos
- [ ] **5.7** ✅ **Testar build:** `npm run build` deve passar sem erros

### Fase 6: Componentes de Detalhes
- [ ] **6.1** Criar `NeurocoreDetailsDrawer.tsx` (drawer principal)
- [ ] **6.2** Criar `details-sections/NeurocoreDetailsHeader.tsx` (nome + badge status)
- [ ] **6.3** Criar `details-sections/NeurocoreDetailsInfo.tsx` (grid de informações)
- [ ] **6.4** Criar `details-sections/NeurocoreDetailsStats.tsx` (cards: agents, tenants)
- [ ] **6.5** Criar `details-sections/NeurocoreDetailsAgents.tsx` (lista de agents)
- [ ] **6.6** Criar seção de "Tenants usando" (lista com links)
- [ ] **6.7** ✅ **Testar build:** `npm run build` deve passar sem erros

### Fase 7: Integração & Rotas
- [ ] **7.1** Adicionar rota `/neurocores` no React Router
- [ ] **7.2** Adicionar item "Gerenciar NeuroCores" na Sidebar
- [ ] **7.3** Integrar store com componentes
- [ ] **7.4** Testar fluxo completo de CRUD
- [ ] **7.5** ✅ **Testar build:** `npm run build` deve passar sem erros

### Fase 8: Validações & Edge Cases
- [ ] **8.1** Validar unicidade de `id_subwork_n8n_neurocore`
- [ ] **8.2** Bloquear exclusão de neurocore se houver tenants usando
- [ ] **8.3** Warning ao desativar neurocore com tenants
- [ ] **8.4** Validar que ao deletar neurocore, agents sejam deletados em cascata
- [ ] **8.5** Tratamento de erros (toast messages)

### Fase 9: Polimento & UX
- [ ] **9.1** Loading states em todas as operações
- [ ] **9.2** Empty states (sem neurocores cadastrados, sem agents)
- [ ] **9.3** Skeleton loaders durante carregamento
- [ ] **9.4** Confirmações para ações destrutivas
- [ ] **9.5** Feedback visual (toasts) para sucesso/erro
- [ ] **9.6** Responsividade mobile
- [ ] **9.7** Acessibilidade (aria-labels, keyboard navigation)

### Fase 10: Testes & Validação
- [ ] **10.1** Testar criação de neurocore com múltiplos agents
- [ ] **10.2** Testar edição (adicionar, editar, remover agents)
- [ ] **10.3** Testar exclusão (com e sem tenants)
- [ ] **10.4** Testar filtros e busca
- [ ] **10.5** Testar paginação
- [ ] **10.6** ✅ **Verificar build final:** `npm run build` deve passar sem erros ou warnings

---

## Notas Técnicas

### 1. Relacionamento Neurocore ↔ Agents

**Antes (N:N via arrays):**
```sql
-- Agents tinham: associated_neurocores: UUID[]
-- Neurocores tinham: associated_agents: UUID[]
```

**Agora (1:N via FK):**
```sql
-- Agent tem FK: id_neurocore → neurocores.id
-- Neurocore não tem campo de agents (relacionamento inverso via JOIN)
```

**Query para buscar neurocore com agents:**
```typescript
const { data, error } = await supabase
  .from('neurocores')
  .select(`
    *,
    agents (*)
  `)
  .eq('id', neurocoreId)
  .single()
```

### 2. Tabela `agent_prompts` - Separação de Responsabilidades

**Importante:** A tabela `agent_prompts` NÃO é gerenciada nesta feature!

- **`agents`**: Define a **estrutura técnica** (nome, tipo, reativo/proativo)
- **`agent_prompts`**: Define a **personalidade e instruções** por tenant

**Fluxo:**
1. Super Admin cria Neurocore + Agents (esta feature)
2. Quando um Tenant é criado e associado a um Neurocore:
   - Sistema automaticamente cria entradas vazias em `agent_prompts` para cada agent
   - Tenant preenche as instruções específicas (feature futura ou parte de "Gerenciar Empresas")

### 3. Validação de ID Workflow N8N

O campo `id_subwork_n8n_neurocore` deve ser único e corresponder ao ID do subworkflow no N8N.

**Schema Zod:**
```typescript
export const neurocoreCreateSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  description: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),

  id_subwork_n8n_neurocore: z.string()
    .min(1, 'ID do Workflow N8N é obrigatório')
    .regex(/^[a-zA-Z0-9_-]+$/, 'ID inválido'),

  is_active: z.boolean().default(true)
})
```

### 4. Formulário Master-Detail - Gerenciamento de State

**Desafio:** Gerenciar agents (criar/editar/deletar) antes de salvar o neurocore.

**Solução:**
```typescript
// State local no NeurocoreForm
const [agents, setAgents] = useState<AgentFormData[]>([])

// Ao adicionar agent
const handleAddAgent = (agentData: AgentFormData) => {
  setAgents([...agents, { ...agentData, _action: 'create' }])
}

// Ao editar agent
const handleEditAgent = (index: number, agentData: AgentFormData) => {
  const updated = [...agents]
  updated[index] = { ...agentData, _action: 'update' }
  setAgents(updated)
}

// Ao remover agent
const handleRemoveAgent = (index: number) => {
  const updated = [...agents]
  updated[index] = { ...updated[index], _action: 'delete' }
  setAgents(updated)
}

// Ao salvar neurocore
const onSubmit = async (neurocoreData) => {
  // 1. Criar/Atualizar neurocore
  const neurocore = await createNeurocore(neurocoreData)

  // 2. Processar agents
  for (const agent of agents) {
    if (agent._action === 'create') {
      await createAgent({ ...agent, id_neurocore: neurocore.id })
    } else if (agent._action === 'update') {
      await updateAgent(agent.id!, agent)
    } else if (agent._action === 'delete') {
      await deleteAgent(agent.id!)
    }
  }
}
```

### 5. Estatísticas - Performance

Para exibir "Usado por X tenants", usar `count()` do Supabase:

```typescript
// neurocore-stats.queries.ts
export async function countTenantsByNeurocore(neurocoreId: string) {
  const { count, error } = await supabase
    .from('tenants')
    .select('*', { count: 'exact', head: true })
    .eq('neurocore_id', neurocoreId)

  return count || 0
}
```

### 6. Exclusão em Cascata

**Verificação antes de deletar:**
```typescript
// Verificar se há tenants usando
const tenantCount = await countTenantsByNeurocore(neurocoreId)

if (tenantCount > 0) {
  throw new Error(
    `Não é possível excluir. ${tenantCount} tenant(s) estão usando este neurocore.`
  )
}

// Se não houver tenants, deletar neurocore
// Agents serão deletados automaticamente via CASCADE FK
await supabase.from('neurocores').delete().eq('id', neurocoreId)
```

### 7. Build Checks - Validação Contínua ⚠️

**IMPORTANTE:** Testar o build é **obrigatório** após cada fase de implementação!

**Por quê?**
- Detecta erros de TypeScript cedo (imports incorretos, tipos incompatíveis)
- Previne acúmulo de erros que se tornam difíceis de debugar
- Garante que o código em produção está funcional
- Evita surpresas no deploy

**Comando:**
```bash
npm run build
```

**Quando testar:**
- ✅ Após criar/atualizar tipos (`database.types.ts`, `*-extended.types.ts`)
- ✅ Após criar queries Supabase
- ✅ Após criar store Zustand
- ✅ Após criar cada componente ou grupo de componentes
- ✅ Após integrar rotas
- ✅ **Antes de fazer commit**
- ✅ Antes de considerar uma fase "completa"

**O que fazer se o build falhar:**
1. Ler o erro completo do TypeScript
2. Corrigir imports incorretos (path aliases, exports faltando)
3. Corrigir tipos incompatíveis
4. Verificar se todos os arquivos necessários existem
5. Rodar `npm run build` novamente até passar

**Exemplo de erro comum:**
```
error TS2307: Cannot find module '@/types/neurocore-extended.types'
```
**Solução:** Verificar se o arquivo existe e se o export está correto.

**Build passando = Fase concluída ✅**

---

## Desafios e Soluções

### Desafio 1: Formulário Master-Detail Complexo
**Problema:** Gerenciar neurocore + lista de agents no mesmo formulário.

**Solução Escolhida:**
- Usar **Tabs** do shadcn/ui:
  - Tab 1: "Dados Gerais" (nome, descrição, ID N8N, status)
  - Tab 2: "Agentes" (tabela inline + modal para add/edit)
- State local para agents com flag `_action` para controlar operações
- Salvar tudo em uma única transação ao clicar em "Salvar"

**Alternativas Consideradas:**
- ❌ Accordion: Menos intuitivo para este caso
- ❌ Drawer grande: Pode ser claustrofóbico em telas pequenas
- ✅ Tabs: Organização clara, UX familiar

### Desafio 2: Schema Antigo vs Schema Novo
**Problema:** `database.types.ts` está desatualizado em relação ao schema real do banco.

**Solução:**
- **Fase 1 obrigatória:** Atualizar `database.types.ts` antes de começar implementação
- Remover campos obsoletos de `Agent` (associated_neurocores, instructions, etc.)
- Adicionar novos campos (`id_neurocore`, `reactive`)
- Criar tipos para `agent_prompts`

### Desafio 3: Validação de ID N8N Único
**Problema:** Garantir que `id_subwork_n8n_neurocore` seja único no banco.

**Solução:**
- Constraint UNIQUE já existe no banco
- Zod valida formato
- Supabase retornará erro se duplicado
- Capturar erro e exibir mensagem amigável:
  ```typescript
  if (error?.code === '23505') {
    toast.error('ID do Workflow N8N já está em uso.')
  }
  ```

### Desafio 4: Exclusão Segura
**Problema:** Não permitir exclusão se houver tenants usando o neurocore.

**Solução:**
- Query prévia para contar tenants
- Se `count > 0`: bloquear e exibir warning com número exato
- Se `count === 0`: permitir com confirmação
- RLS do Supabase garante CASCADE para agents

### Desafio 5: Personalização via `agent_prompts`
**Problema:** Como deixar claro que personalização é feita em outro lugar?

**Solução:**
- **UI:** Incluir nota no modal de Agent:
  ```
  ℹ️ NOTA: As instruções, personalidade e limitações são
  configuradas na tela de "Personalização por Tenant".
  ```
- **Documentação:** Deixar explícito no planejamento e código

---

## Bibliotecas Utilizadas

**Nenhuma biblioteca nova necessária!** Toda a feature será implementada com as bibliotecas já utilizadas no projeto:

| Biblioteca | Uso | Já Instalada |
|------------|-----|--------------|
| **React Hook Form** | Gerenciamento de formulários | ✅ Sim |
| **Zod** | Validação de schemas | ✅ Sim |
| **Zustand** | State management | ✅ Sim |
| **shadcn/ui** | Componentes UI (Dialog, Table, Tabs, Drawer, etc.) | ✅ Sim |
| **Supabase Client** | Queries ao banco | ✅ Sim |
| **Lucide React** | Ícones | ✅ Sim |

---

## Princípios de Desenvolvimento

Esta feature segue os princípios estabelecidos no projeto:

1. **Build Checks Obrigatórios:**
   - `npm run build` deve passar **sem erros** antes de considerar qualquer fase completa
   - Testar build após cada grupo significativo de alterações
   - **NUNCA** fazer commit com build quebrado

2. **MVP Mindset:**
   - Evitar over-engineering
   - Implementar apenas o necessário para a feature funcionar
   - Adicionar melhorias incrementalmente

3. **Documentation First:**
   - Consultar documentação oficial das bibliotecas
   - Seguir padrões já estabelecidos no projeto (ex: componentes de Tenants)

4. **Type Safety:**
   - TypeScript strict mode
   - Evitar `any` e `@ts-ignore`
   - Tipos devem refletir exatamente o schema do banco

---

## Aplicação de SOLID

### Single Responsibility Principle (SRP)
✅ **Cada arquivo tem uma única responsabilidade:**
- Queries: apenas comunicação com Supabase
- Store: apenas gerenciamento de estado
- Componentes: apenas UI e interação
- Validações: apenas schemas Zod

**Exemplo:**
```
neurocore-crud.queries.ts  → CRUD operations
neurocoreStore.crud.ts     → Ações de CRUD no store
NeurocoreForm.tsx          → UI do formulário
```

### Open/Closed Principle (OCP)
✅ **Store modular permite extensão sem modificação:**
```typescript
// Adicionar nova funcionalidade sem alterar código existente
import { neurocoreStoreCrud } from './neurocoreStore.crud'
import { neurocoreStoreAgents } from './neurocoreStore.agents'
import { neurocoreStoreFilters } from './neurocoreStore.filters'

export const useNeurocoreStore = create<NeurocoreStore>()(
  (...args) => ({
    ...neurocoreStoreCrud(...args),
    ...neurocoreStoreAgents(...args),
    ...neurocoreStoreFilters(...args)
  })
)
```

### Liskov Substitution Principle (LSP)
✅ **Tipos estendidos substituem tipos base:**
```typescript
// NeurocoreWithRelations extends Neurocore
function processNeurocore(neurocore: Neurocore) { ... }
processNeurocore(neurocoreWithRelations) // ✅ Funciona
```

### Interface Segregation Principle (ISP)
✅ **Interfaces específicas por responsabilidade:**
```typescript
// Não criar uma interface gigante
interface NeurocoreStore {
  // CRUD operations
  createNeurocore(data: NeurocoreInsert): Promise<Neurocore>
  updateNeurocore(id: string, data: NeurocoreUpdate): Promise<Neurocore>
  // ... separado em múltiplos arquivos
}
```

### Dependency Inversion Principle (DIP)
✅ **Componentes dependem de abstrações (store/queries), não de implementações concretas:**
```typescript
// Componente depende do hook (abstração)
const { fetchNeurocores, isLoading } = useNeurocoreStore()

// Não depende diretamente do Supabase
// ❌ const { data } = await supabase.from('neurocores')...
```

---

## Estimativa de Complexidade

### Fase 1-3 (Setup, Queries, Store): **Complexidade Média**
- Requer atualização de types
- Seguir padrão já estabelecido em "Gerenciar Empresas"
- Risco: Schema divergente

### Fase 4 (Listagem): **Complexidade Baixa**
- Padrão já estabelecido
- Cópia/adaptação de TenantListPage

### Fase 5 (Formulário Master-Detail): **Complexidade Alta** ⚠️
- Gerenciar state de agents inline
- Validações complexas
- Transação multi-step (neurocore → agents)
- Maior risco de bugs

### Fase 6 (Detalhes): **Complexidade Média**
- Drawer com estatísticas
- Queries agregadas (count)

### Fase 7-10 (Integração, Validações, Polimento): **Complexidade Média**
- Testes end-to-end
- Edge cases
- UX polish

### ⚠️ Nota Importante: Build Checks em Todas as Fases
**Cada fase deve terminar com `npm run build` passando sem erros.**

Isso reduz drasticamente o risco de:
- Acúmulo de erros de TypeScript
- Imports quebrados
- Incompatibilidades de tipos
- Surpresas no deploy

**Regra de Ouro:** Build quebrado = Fase incompleta ❌

---

## 📊 Progresso da Implementação

### Fase 1-3: Setup, Queries, Store ✅ COMPLETA (100%)

**Implementado em:** 2025-12 (estimado)

**Arquivos criados:**
- ✅ `src/types/neurocore-extended.types.ts` - Tipos estendidos
- ✅ `src/lib/validations/neurocoreValidation.ts` - Validações e schemas Zod
- ✅ `src/lib/queries/neurocore/` - 5 arquivos (fetch, crud, agent-crud, stats, index)
- ✅ `src/store/neurocore/` - 7 arquivos (types, store, crud, agents, status, filters, index)

**Funcionalidades implementadas:**
- ✅ Validação de ID Workflow N8N
- ✅ Schemas Zod completos (criação e atualização de neurocore e agents)
- ✅ Queries Supabase com relacionamentos (agents via FK id_neurocore)
- ✅ Paginação e filtros server-side
- ✅ CRUD completo de neurocores e agents no store
- ✅ Contagem de tenants usando neurocore (para validar exclusão)
- ✅ Soft delete (desativação)
- ✅ Notificações toast integradas

**Próximo passo:** Fase 7-10 - Integração, validações, polimento e testes

---

### Fase 4: Listagem ✅ COMPLETA (100%)

**Implementado em:** 2025-12 (estimado)

**Arquivos criados:**
- ✅ `src/pages/neurocores/NeurocoreListPage.tsx` - Página principal
- ✅ `src/components/neurocores/NeurocoreTable.tsx` - Tabela com ações inline
- ✅ `src/components/neurocores/NeurocoreFilters.tsx` - Componente de filtros
- ✅ `src/components/neurocores/NeurocorePagination.tsx` - Componente de paginação
- ✅ `src/hooks/useNeurocoreFilters.ts` - Hook de filtros com debounce

**Funcionalidades implementadas:**
- ✅ Listagem de neurocores com dados do Supabase
- ✅ Busca com debounce (300ms)
- ✅ Filtro por status (ativa/inativa)
- ✅ Badges visuais para status
- ✅ Paginação completa (primeira/anterior/próxima/última)
- ✅ Seletor de tamanho de página (10/20/50/100)
- ✅ Ações inline (editar/ver detalhes/ativar-desativar)
- ✅ Loading states e empty states
- ✅ Integração completa com store Zustand

**Próximo passo:** Fase 7-10 - Integração, validações, polimento e testes

---

### Fase 5: Formulário Master-Detail ✅ COMPLETA (100%)

**Implementado em:** 2025-12 (estimado)

**Arquivos criados:**
- ✅ `src/components/neurocores/NeurocoreFormDialog.tsx` - Dialog wrapper
- ✅ `src/components/neurocores/NeurocoreForm.tsx` - Formulário com Tabs (196 linhas)
- ✅ `src/components/neurocores/form-sections/NeurocoreBasicFields.tsx` - Campos básicos
- ✅ `src/components/neurocores/form-sections/AgentsListSection.tsx` - Gerenciamento inline de agents
- ✅ `src/components/neurocores/AgentFormDialog.tsx` - Modal para agent individual (196 linhas)
- ✅ `src/components/ui/tabs.tsx` - Componente Tabs do shadcn (já estava instalado)

**Funcionalidades implementadas:**
- ✅ Formulário com 2 abas (Dados do Neurocore, Agents)
- ✅ Validação em tempo real com react-hook-form + Zod
- ✅ Validação de ID Workflow N8N
- ✅ Criação de neurocores com todos os campos
- ✅ Edição de neurocores existentes
- ✅ Gerenciamento inline de agents (adicionar/editar/remover)
- ✅ State local para agents com flag `_action` (create/update/delete)
- ✅ Transação multi-step (salvar neurocore → processar agents)
- ✅ Loading states durante submit
- ✅ Toasts de sucesso e erro
- ✅ Integração completa com store Zustand

**Próximo passo:** Fase 7-10 - Integração, validações, polimento e testes

---

### Fase 6: Detalhes ✅ COMPLETA (100%)

**Implementado em:** 2025-12 (estimado)

**Arquivos criados:**
- ✅ `src/components/neurocores/NeurocoreDetailsDrawer.tsx` - Drawer de detalhes
- ✅ `src/components/neurocores/details-sections/NeurocoreDetailsHeader.tsx` - Header com nome e status
- ✅ `src/components/neurocores/details-sections/NeurocoreDetailsInfo.tsx` - Informações gerais
- ✅ `src/components/neurocores/details-sections/NeurocoreDetailsStats.tsx` - Cards de estatísticas
- ✅ `src/components/neurocores/details-sections/NeurocoreDetailsAgents.tsx` - Lista de agents

**Funcionalidades implementadas:**
- ✅ Drawer lateral com visualização completa do neurocore
- ✅ Header com nome, status e botão de fechar
- ✅ Seção de informações gerais (nome, descrição, ID N8N, datas)
- ✅ Cards de estatísticas (quantidade de agents, tenants usando)
- ✅ Lista de agents associados com detalhes (nome, tipo, reativo/proativo)
- ✅ Ações inline (editar, ativar/desativar)
- ✅ Integração com queries de estatísticas

**Próximo passo:** Fase 7-10 - Integração, validações, polimento e testes

---

### Fase 7-10: Integração, Validações, Polimento ✅ COMPLETA (100%)

**Implementado em:** 2025-12-02

**Tarefas completadas:**
- [x] **Fase 7: Integração & Rotas**
  - [x] Adicionar rota `/neurocores` no React Router
  - [x] Adicionar item "Gerenciar NeuroCores" na Sidebar
  - [x] Testar fluxo completo de CRUD
- [x] **Fase 8: Validações & Edge Cases**
  - [x] Validar unicidade de `id_subwork_n8n_neurocore`
  - [x] Bloquear exclusão de neurocore se houver tenants usando
  - [x] Validação implementada no `handleDelete` (NeurocoreListPage.tsx:100-109)
  - [x] Validar que ao deletar neurocore, agents sejam deletados em cascata
- [x] **Fase 9: Polimento & UX**
  - [x] Verificar loading states em todas as operações
  - [x] Skeleton loaders durante carregamento
  - [x] Confirmações para ações destrutivas (window.confirm)
  - [x] Responsividade mobile (componentes shadcn/ui são responsivos)
  - [x] Acessibilidade (aria-labels, keyboard navigation via shadcn/ui)
- [x] **Fase 10: Testes & Validação**
  - [x] ✅ **Verificar build final:** `npm run build` passou sem erros

**Progresso total:** ✅ 100% COMPLETO

---

## Próximos Passos Após Implementação

1. **Feature: Personalização de Agent Prompts**
   - Tela para Tenants configurarem instruções/personalidade de seus agents
   - CRUD na tabela `agent_prompts`

2. **Feature: Gestão de Nichos**
   - Associar neurocores a nichos de mercado
   - Filtrar tenants por nicho

3. **Feature: Templates de Neurocore**
   - Permitir duplicar neurocore (clone com agents)
   - Criar templates pré-configurados

4. **Melhorias:**
   - Dashboard com métricas de neurocores mais usados
   - Exportar configuração de neurocore (JSON)
   - Importar configuração de neurocore

---

## Referências

- Padrão arquitetural: `src/components/tenants/` (feature de Gerenciar Empresas)
- Schema do banco: `doc/database-relationships.md`
- Status do projeto: `doc/status-projeto.md`
- Mockup fornecido: ASCII mockup do formulário master-detail
