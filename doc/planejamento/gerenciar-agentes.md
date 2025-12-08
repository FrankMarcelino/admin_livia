# Gerenciar Agentes IA (Templates)

## Objetivo

Permitir ao Super Admin criar, visualizar, editar e gerenciar **templates de agents de IA** com configurações complexas (prompts, limitações, instruções, roteiros), que podem ser reutilizados ao criar neurocores, facilitando a jornada do Tenant e garantindo consistência e qualidade nas configurações de IA.

---

## Contexto e Motivação

### Problema Atual

No fluxo atual de criação de neurocores (70-80% implementado):

1. **Super Admin cria Neurocore** → Adiciona agents com apenas estrutura técnica:
   - Nome: "Recepcionista"
   - Tipo: Suporte
   - Modo: Reativo
   - Salvo em: `agents` table ✅

2. **Tenant recebe neurocore** → Precisa configurar TUDO do zero em `agent_prompts`:
   - Prompt completo
   - Limitações
   - Instruções
   - Roteiro (etapas)
   - Escapes e Fallback
   - Bases de conhecimento
   - **Tempo:** 30-60 minutos por agent ❌
   - **Risco:** Configurações inconsistentes ou de baixa qualidade ❌

### Solução Proposta

Criar feature "Gerenciar Agentes" que permite:

1. **Super Admin cria Agent Template** com configuração completa:
   - Estrutura técnica (nome, tipo, modo)
   - Configuração complexa (prompt, limitações, roteiro, etc)
   - Salvo em: `agent_templates` table ✅

2. **Super Admin usa template ao criar Neurocore**:
   - Seleciona template da biblioteca
   - Sistema COPIA configuração completa
   - Cria agent em `agents` (estrutura)
   - **Tempo:** 2-3 minutos por agent ✅

3. **Tenant recebe agent PRÉ-CONFIGURADO**:
   - Agent funciona profissionalmente desde o início
   - Tenant apenas PERSONALIZA se quiser
   - **Tempo:** 5-10 minutos (opcional) ✅

### Benefícios

| Métrica | Sem Feature (Atual) | Com Feature (Proposta) | Melhoria |
|---------|---------------------|------------------------|----------|
| **Tempo do Super Admin** | 5 min (estrutura vazia) | 20 min (template completo 1x) + 2 min (reusar N vezes) | 80%+ economia em escala |
| **Tempo do Tenant** | 30-60 min (configurar tudo) | 5-10 min (personalizar) | 85%+ redução |
| **Consistência** | ⚠️ Variável (cada tenant configura diferente) | ✅ Alta (baseado em templates profissionais) | N/A |
| **Qualidade** | ⚠️ Depende do tenant | ✅ Garantida pelo Super Admin | N/A |
| **Retrabalho** | 🔴 Alto (replicar configs manualmente) | 🟢 Baixo (criar 1x, reusar N vezes) | N/A |

---

## Requisitos Funcionais

### RF-001: Criar Agent Template
**Descrição:** Super Admin pode criar um agent template com configuração completa.

**Campos:**
- **Estrutura Técnica:**
  - Nome do Agent (ex: "Recepcionista Padrão")
  - Tipo: Suporte / Vendas / Geral
  - Modo: Reativo / Proativo

- **Informações Básicas:**
  - Nome personalidade (ex: "Alex")
  - Idade (ex: "25")
  - Sexo (ex: "Masculino")
  - Objetivo (ex: "Atender clientes com excelência")
  - Comunicação/Tom de Voz (ex: "Animado e profissional")
  - Personalidade (ex: "Prestativo, paciente, empático")

- **Limitações (JSONB Array):**
  - Lista de regras do que o agent NÃO deve fazer
  - Exemplo: `["Não discutir política ou religião", "Não prometer prazos sem confirmar"]`

- **Instruções (JSONB Array):**
  - Lista de regras do que o agent DEVE fazer
  - Exemplo: `["Cumprimentar cliente pelo nome", "Ser sempre educado"]`

- **Roteiro/Guide Line (JSONB Array de Objetos):**
  - Fluxo em etapas estruturadas com tipo (rank/markdown) e controle de ativação
  - **✅ Estrutura Atualizada (2025-12-03)**
  - Exemplo:
    ```json
    [
      {
        "title": "Roteiro de Suporte",
        "type": "rank",
        "active": true,
        "sub": [
          {
            "content": "Identifique o motivo do contato no histórico anterior",
            "active": true
          },
          {
            "content": "SE for Boleto: Informe o link do portal",
            "active": true
          },
          {
            "content": "Finalize com empatia",
            "active": false
          }
        ]
      },
      {
        "title": "Instruções Operacionais",
        "type": "markdown",
        "active": true,
        "sub": [
          {
            "content": "*Formatação:* Respostas curtas. Use emojis 🛠",
            "active": true
          }
        ]
      }
    ]
    ```
  - **Campos:**
    - `title`: Título da etapa
    - `type`: "rank" (numerado) ou "markdown" (formatado)
    - `active`: Se a etapa está ativa
    - `sub`: Array de objetos `{content: string, active: boolean}`

- **Regras/Rules (JSONB):**
  - Regras gerais de comportamento

- **Outras Instruções (JSONB):**
  - Instruções adicionais específicas

**Validações:**
- [x] Nome do agent é obrigatório (min 3 caracteres)
- [x] Tipo é obrigatório (enum: support, sales, general)
- [x] Modo é obrigatório (boolean: reactive)
- [x] Nome da personalidade é opcional mas recomendado
- [x] Pelo menos 1 limitação ou 1 instrução deve ser definida

---

### RF-002: Listar Agent Templates
**Descrição:** Super Admin pode visualizar todos os agent templates criados.

**Funcionalidades:**
- [x] Tabela com colunas: Nome, Tipo, Modo, Status, Ações
- [x] Busca por nome (com debounce)
- [x] Filtro por tipo (Suporte / Vendas / Geral)
- [x] Filtro por status (Ativo / Inativo)
- [x] Ordenação por colunas
- [x] Paginação (10/20/50/100 itens)
- [x] Badge visual indicando tipo e modo
- [x] Ações inline:
  - Ver detalhes
  - Editar template
  - Ativar/Desativar
  - (Futuramente) Ver neurocores usando este template

---

### RF-003: Ver Detalhes de Agent Template
**Descrição:** Super Admin pode visualizar configuração completa de um template.

**Componente:** Drawer lateral

**Conteúdo:**
- [x] Header: Nome + Status + Botão Fechar
- [x] Seção "Estrutura Técnica": Tipo, Modo
- [x] Seção "Informações Básicas": Nome personalidade, idade, sexo, objetivo, tom, personalidade
- [x] Seção "Limitações": Lista formatada
- [x] Seção "Instruções": Lista formatada
- [x] Seção "Roteiro": Etapas colapsáveis
- [x] Seção "Estatísticas":
  - Quantidade de neurocores usando este template
  - Quantidade total de instâncias (tenants)
- [x] Ações:
  - Editar template
  - Ativar/Desativar

---

### RF-004: Editar Agent Template
**Descrição:** Super Admin pode editar um agent template existente.

**Comportamento:**
- [x] Abre formulário igual ao de criação, pré-preenchido
- [x] Permite editar todos os campos
- [x] Validação em tempo real
- [x] **IMPORTANTE:** Editar template NÃO afeta instâncias já criadas (neurocores)
  - Apenas novas instâncias (neurocores criados após a edição) usarão configuração atualizada
- [x] Exibe aviso se houver neurocores usando este template
- [x] Confirmação antes de salvar

---

### RF-005: Ativar/Desativar Agent Template
**Descrição:** Super Admin pode marcar template como inativo sem deletar.

**Comportamento:**
- [x] Template inativo não aparece na lista de seleção ao criar neurocore
- [x] Instâncias já criadas (neurocores) continuam funcionando normalmente
- [x] Template pode ser reativado a qualquer momento
- [x] Confirmação com mensagem clara

---

### RF-006: Usar Template ao Criar Neurocore
**Descrição:** Ao criar neurocore, Super Admin pode escolher template para agents.

**Integração com "Gerenciar NeuroCores":**
- [x] Na aba "Agents" do formulário de neurocore, adicionar botão "Usar Template"
- [x] Modal abre com biblioteca de templates disponíveis
- [x] Filtros: Tipo, Status
- [x] Busca por nome
- [x] Visualização em cards com preview da configuração
- [x] Seleção de template
- [x] Confirmação
- [x] Sistema cria:
  - Entry em `agents` (estrutura técnica) com `id_neurocore`
  - Entry em `agent_prompts` (configuração completa) com `id_agent` e `id_tenant = NULL`
    - COPIA todos os campos do template

---

### RF-007: Criar Tenant com Agents Herdados
**Descrição:** Ao criar tenant e associá-lo a um neurocore, agents são herdados.

**Comportamento (Integração com "Gerenciar Empresas"):**
- [x] Quando tenant é criado e associado a neurocore:
  1. Sistema busca todos os agents do neurocore (`SELECT * FROM agents WHERE id_neurocore = ?`)
  2. Para cada agent, cria entry em `agent_prompts`:
     - `id_agent`: UUID do agent
     - `id_tenant`: UUID do tenant
     - COPIA configuração de `agent_prompts WHERE id_agent = ? AND id_tenant IS NULL`
       - Se não existir (agent criado do zero sem template), cria entry vazia
- [x] Tenant recebe agents pré-configurados
- [x] Tenant pode personalizar via tela "Agentes de IA" (feature futura do sistema Tenant)

---

## Modelo de Dados

### Nova Tabela: `agent_templates`

```sql
CREATE TABLE agent_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Estrutura Técnica (mesmo padrão de 'agents')
  name TEXT NOT NULL,                      -- Nome do agent (ex: "Recepcionista Padrão")
  type agent_function NOT NULL,            -- Enum: support, sales, general
  reactive BOOLEAN NOT NULL DEFAULT true,  -- Reativo ou Proativo

  -- Informações Básicas
  persona_name TEXT,                       -- Nome da personalidade (ex: "Alex")
  age TEXT,                                -- Idade (ex: "25")
  gender TEXT,                             -- Sexo (ex: "Masculino", "Feminino", "Não especificado")
  objective TEXT,                          -- Objetivo principal
  communication TEXT,                      -- Tom de voz / Estilo de comunicação
  personality TEXT,                        -- Traços de personalidade

  -- Configurações Complexas (JSONB)
  limitations JSONB,                       -- Array de strings: ["Não fazer X", "Não fazer Y"]
  rules JSONB,                             -- Regras gerais (estrutura flexível)
  instructions JSONB,                      -- Array de strings: ["Fazer X", "Fazer Y"]
  guide_line JSONB,                        -- Roteiro em etapas (array de objetos)
  others_instructions JSONB,               -- Outras instruções

  -- Relacionamentos (Futuros)
  -- knowledge_bases UUID[],              -- Array de IDs de bases de conhecimento

  -- Status e Metadados
  is_active BOOLEAN DEFAULT true,
  created_by UUID,                         -- Super Admin que criou (FK para users)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_agent_templates_type ON agent_templates(type);
CREATE INDEX idx_agent_templates_active ON agent_templates(is_active);
CREATE INDEX idx_agent_templates_name ON agent_templates(name);
```

---

### Tabelas Existentes (Modificações)

#### Tabela `agent_prompts` - **SEM ALTERAÇÃO DE SCHEMA**

Uso existente será expandido:

| Cenário | `id_agent` | `id_tenant` | Uso |
|---------|-----------|-------------|-----|
| **Template de Neurocore** | UUID (agent do neurocore) | NULL | Configuração herdada do template, aguardando tenant |
| **Personalização de Tenant** | UUID (agent do neurocore) | UUID (tenant) | Configuração personalizada pelo tenant |

**Fluxo:**
1. Super Admin cria agent template → Salvo em `agent_templates` ✅
2. Super Admin usa template em neurocore → Cria `agent` + copia para `agent_prompts` (id_tenant=NULL) ✅
3. Tenant é criado → Sistema copia de `agent_prompts` (id_tenant=NULL) para novo registro com `id_tenant` ✅
4. Tenant personaliza → Atualiza seu registro em `agent_prompts` ✅

---

## Componentes Necessários

### Estrutura de Pastas

```
src/
├── components/
│   └── agents/                                # 🆕 Nova pasta
│       ├── AgentTemplateTable.tsx            # Tabela de templates
│       ├── AgentTemplateFilters.tsx          # Filtros (busca, tipo, status)
│       ├── AgentTemplatePagination.tsx       # Paginação
│       ├── AgentTemplateForm.tsx             # Formulário master (tabs)
│       ├── AgentTemplateFormDialog.tsx       # Dialog wrapper
│       ├── AgentTemplateDetailsDrawer.tsx    # Drawer de detalhes
│       ├── AgentTemplateSelector.tsx         # 🔗 Seletor para usar em Neurocores
│       │
│       ├── form-sections/
│       │   ├── AgentTemplateBasicFields.tsx      # Estrutura técnica
│       │   ├── AgentTemplatePersonaFields.tsx    # Informações básicas (nome, idade, etc)
│       │   ├── AgentTemplateLimitationsSection.tsx  # Lista de limitações
│       │   ├── AgentTemplateInstructionsSection.tsx # Lista de instruções
│       │   └── AgentTemplateGuidelineSection.tsx    # Roteiro em etapas
│       │
│       └── details-sections/
│           ├── AgentTemplateDetailsHeader.tsx
│           ├── AgentTemplateDetailsInfo.tsx
│           ├── AgentTemplateDetailsConfig.tsx    # Limitações, instruções, roteiro
│           └── AgentTemplateDetailsStats.tsx     # Estatísticas de uso
│
├── pages/
│   └── agents/
│       └── AgentTemplateListPage.tsx          # 🆕 Página principal
│
├── store/
│   └── agentTemplate/                          # 🆕 Nova store
│       ├── index.ts
│       ├── agentTemplateStore.types.ts
│       ├── agentTemplateStore.ts
│       ├── agentTemplateStore.crud.ts
│       ├── agentTemplateStore.status.ts
│       └── agentTemplateStore.filters.ts
│
├── lib/
│   ├── queries/
│   │   └── agentTemplate/                      # 🆕 Novas queries
│   │       ├── index.ts
│   │       ├── agent-template-fetch.queries.ts
│   │       ├── agent-template-crud.queries.ts
│   │       └── agent-template-stats.queries.ts
│   │
│   └── validations/
│       └── agentTemplateValidation.ts          # 🆕 Validações e schemas Zod
│
└── types/
    └── agent-template-extended.types.ts        # 🆕 Tipos estendidos
```

---

### Componentes Detalhados

#### 1. `AgentTemplateListPage.tsx` (Página Principal)

**Responsabilidade:** Orquestrar listagem, filtros, ações.

**Estrutura:**
```tsx
<div className="container">
  <PageHeader title="Gerenciar Agentes IA">
    <Button onClick={openCreateDialog}>+ Novo Template</Button>
  </PageHeader>

  <AgentTemplateFilters />

  <AgentTemplateTable
    onViewDetails={openDetailsDrawer}
    onEdit={openEditDialog}
    onToggleStatus={handleToggleStatus}
  />

  <AgentTemplatePagination />

  {/* Modals/Drawers */}
  <AgentTemplateFormDialog />
  <AgentTemplateDetailsDrawer />
</div>
```

---

#### 2. `AgentTemplateForm.tsx` (Formulário com Tabs)

**Estrutura:**
```tsx
<Form>
  <Tabs>
    <Tab value="basic">Estrutura Técnica</Tab>
    <Tab value="persona">Informações Básicas</Tab>
    <Tab value="limitations">Limitações</Tab>
    <Tab value="instructions">Instruções</Tab>
    <Tab value="guideline">Roteiro</Tab>
  </Tabs>

  <TabContent value="basic">
    <AgentTemplateBasicFields />  {/* Nome, Tipo, Modo */}
  </TabContent>

  <TabContent value="persona">
    <AgentTemplatePersonaFields />  {/* Nome, idade, sexo, objetivo, etc */}
  </TabContent>

  <TabContent value="limitations">
    <AgentTemplateLimitationsSection />  {/* Lista dinâmica */}
  </TabContent>

  <TabContent value="instructions">
    <AgentTemplateInstructionsSection />  {/* Lista dinâmica */}
  </TabContent>

  <TabContent value="guideline">
    <AgentTemplateGuidelineSection />  {/* Etapas com sub-instruções */}
  </TabContent>

  <FormActions>
    <Button type="button" onClick={onCancel}>Cancelar</Button>
    <Button type="submit">Salvar Template</Button>
  </FormActions>
</Form>
```

---

#### 3. `AgentTemplateSelector.tsx` (Para Usar em Neurocores)

**Responsabilidade:** Modal para selecionar template ao criar neurocore.

**Uso:**
```tsx
// Dentro de NeurocoreForm.tsx, na aba "Agents"
<AgentsListSection>
  <Button onClick={openTemplateSelector}>
    <Plus /> Usar Template
  </Button>
</AgentsListSection>

<AgentTemplateSelector
  open={isOpen}
  onSelect={(template) => {
    // Cria agent no neurocore usando configuração do template
    handleAddAgentFromTemplate(template)
  }}
/>
```

**Estrutura do Modal:**
```tsx
<Dialog>
  <DialogHeader>Selecionar Template de Agent</DialogHeader>

  <div className="filters">
    <Input placeholder="Buscar template..." />
    <Select placeholder="Filtrar por tipo">
      <Option>Suporte</Option>
      <Option>Vendas</Option>
      <Option>Geral</Option>
    </Select>
  </div>

  <div className="template-grid">
    {templates.map(template => (
      <Card key={template.id} onClick={() => onSelect(template)}>
        <CardHeader>
          <h3>{template.name}</h3>
          <Badge>{template.type}</Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{template.objective || 'Sem descrição'}</p>
          <div className="preview">
            <small>Limitações: {template.limitations?.length || 0}</small>
            <small>Instruções: {template.instructions?.length || 0}</small>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>

  <DialogFooter>
    <Button onClick={onClose}>Cancelar</Button>
  </DialogFooter>
</Dialog>
```

---

## Fluxo de Usuário

### Fluxo 1: Criar Agent Template

```
1. Super Admin acessa "Gerenciar Agentes"
   └─> Clica em "+ Novo Template"

2. Modal/Dialog abre com formulário em Tabs

3. Tab "Estrutura Técnica"
   ├─> Nome: "Recepcionista Imobiliária"
   ├─> Tipo: Suporte
   └─> Modo: Reativo

4. Tab "Informações Básicas"
   ├─> Nome personalidade: "Alex"
   ├─> Idade: "25"
   ├─> Sexo: "Não especificado"
   ├─> Objetivo: "Atender clientes de forma profissional e eficiente"
   ├─> Comunicação: "Animado, cordial e prestativo"
   └─> Personalidade: "Paciente, empático, proativo"

5. Tab "Limitações"
   ├─> Clica "+ Adicionar Limitação"
   ├─> "Não discutir política ou religião"
   ├─> Clica "+ Adicionar Limitação"
   └─> "Não prometer prazos de entrega sem consultar sistema"

6. Tab "Instruções"
   ├─> Clica "+ Adicionar Instrução"
   ├─> "Cumprimentar cliente pelo nome se disponível"
   ├─> Clica "+ Adicionar Instrução"
   └─> "Ser sempre educado e agradecer ao final"

7. Tab "Roteiro"
   ├─> Clica "+ Adicionar Etapa"
   ├─> Nome: "Etapa 1: Saudação e Identificação"
   │   ├─> Clica "+ Adicionar Instrução"
   │   ├─> "Saudar o cliente de forma amigável"
   │   ├─> Clica "+ Adicionar Instrução"
   │   └─> "Perguntar nome e motivo do contato"
   │
   ├─> Clica "+ Adicionar Etapa"
   └─> Nome: "Etapa 2: Resolução"
       ├─> "Buscar solução na base de conhecimento"
       └─> "Se não encontrar, transferir para atendente"

8. Clica em "Salvar Template"
   └─> Sistema valida e salva em `agent_templates`
   └─> Toast de sucesso
   └─> Modal fecha
   └─> Template aparece na lista
```

---

### Fluxo 2: Usar Template ao Criar Neurocore

```
1. Super Admin acessa "Gerenciar NeuroCores"
   └─> Clica "+ Novo Neurocore"

2. Preenche dados básicos na Tab "Dados do Neurocore"

3. Vai para Tab "Agents"
   └─> Vê botões:
       ├─ "+ Adicionar Agent" (criar do zero - fluxo atual)
       └─ "+ Usar Template" (novo)

4. Clica em "+ Usar Template"
   └─> Modal abre (AgentTemplateSelector)

5. Vê biblioteca de templates:
   ├─> Busca: "recepcionista"
   ├─> Filtro: Tipo = Suporte
   └─> Lista filtrada exibe:
       ├─ Card: "Recepcionista Imobiliária"
       ├─ Card: "Recepcionista Varejo"
       └─ Card: "Recepcionista Padrão"

6. Clica no card "Recepcionista Imobiliária"
   └─> Sistema adiciona agent à lista (local state):
       {
         name: "Recepcionista Imobiliária",
         type: "support",
         reactive: true,
         _templateId: "UUID_do_template",  // Referência
         _action: "create"
       }

7. Agent aparece na lista da Tab "Agents"
   └─> Badge: "📋 De Template"

8. Pode adicionar mais agents (template ou do zero)

9. Clica em "Criar Neurocore"
   └─> Sistema:
       1. Cria neurocore
       2. Para cada agent:
          a) Cria entry em `agents` (estrutura técnica)
          b) Se veio de template, busca configuração de `agent_templates`
          c) Cria entry em `agent_prompts`:
             - id_agent: UUID criado
             - id_tenant: NULL
             - COPIA: limitations, instructions, guide_line, etc do template
```

---

### Fluxo 3: Tenant Herda Configuração

```
1. Super Admin acessa "Gerenciar Empresas"
   └─> Clica "+ Nova Empresa"

2. Preenche dados e seleciona Neurocore
   └─> Neurocore: "Imobiliária"
       (que contém agent "Recepcionista Imobiliária" de template)

3. Clica em "Criar Empresa"
   └─> Sistema:
       1. Cria tenant
       2. Busca agents do neurocore:
          SELECT * FROM agents WHERE id_neurocore = 'UUID_neurocore'
       3. Para cada agent:
          a) Busca configuração base:
             SELECT * FROM agent_prompts
             WHERE id_agent = 'UUID_agent' AND id_tenant IS NULL
          b) COPIA para novo registro:
             INSERT INTO agent_prompts (id_agent, id_tenant, ...)
             VALUES ('UUID_agent', 'UUID_tenant', <campos_copiados>)

4. Tenant "Imobiliária XYZ" faz login
   └─> Acessa "Agentes de IA" (tela do tenant - futura)

5. Vê agent "Recepcionista Imobiliária" PRÉ-CONFIGURADO:
   ✅ Limitações: já preenchidas
   ✅ Instruções: já preenchidas
   ✅ Roteiro: já preenchido
   └─> Badge: "Configuração Padrão"

6. Pode PERSONALIZAR se quiser:
   ├─> Muda tom: "Animado" → "Formal"
   ├─> Adiciona limitação: "Não falar de concorrentes"
   └─> Salva → Atualiza em `agent_prompts` (seu registro com id_tenant)
```

---

## Mockups ASCII

### Tela: Lista de Agent Templates

```
╔══════════════════════════════════════════════════════════════════════════════╗
║ Gerenciar Agentes IA                                        [+ Novo Template] ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║ [🔍 Buscar template...]  [Tipo: Todos ▼]  [Status: Todos ▼]                 ║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║ Nome                        │ Tipo      │ Modo      │ Status  │ Ações        ║
╠═════════════════════════════╪═══════════╪═══════════╪═════════╪══════════════╣
║ Recepcionista Padrão        │ 🛟 Suporte│ ⚪ Reativo│ ✅ Ativo│ [👁][✏][⏸]  ║
║ Vendedor Imobiliária        │ 💰 Vendas │ 🔵 Proativo│ ✅ Ativo│ [👁][✏][⏸] ║
║ Secretária Médica           │ 🛟 Suporte│ ⚪ Reativo│ ✅ Ativo│ [👁][✏][⏸]  ║
║ Agent Pós-Venda             │ 📦 Geral  │ ⚪ Reativo│ ❌ Inativo│[👁][✏][▶] ║
╠═════════════════════════════╧═══════════╧═══════════╧═════════╧══════════════╣
║                                                                               ║
║ Mostrando 4 de 4 templates               [◀ Anterior] Página 1/1 [Próxima ▶] ║
║ [10 ▼] itens por página                                                      ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

### Modal: Criar/Editar Agent Template

```
╔══════════════════════════════════════════════════════════════════════════════╗
║ Novo Template de Agent                                                [✕]   ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║ ┌──────────────────────────────────────────────────────────────────────────┐ ║
║ │ [Estrutura Técnica] [Informações Básicas] [Limitações] [Instruções]     │ ║
║ │                                            [Roteiro]                      │ ║
║ └──────────────────────────────────────────────────────────────────────────┘ ║
║                                                                               ║
║ ┌─ Tab: Estrutura Técnica ───────────────────────────────────────────────┐  ║
║ │                                                                          │  ║
║ │ Nome do Agent *                                                          │  ║
║ │ ┌──────────────────────────────────────────────────────────────────────┐│  ║
║ │ │ Ex: Recepcionista Padrão                                             ││  ║
║ │ └──────────────────────────────────────────────────────────────────────┘│  ║
║ │                                                                          │  ║
║ │ Tipo do Agent *                  Modo do Agent *                        │  ║
║ │ ┌─────────────────────────────┐  ┌─────────────────────────────────────┐│  ║
║ │ │ ● Suporte                   │  │ Switch [●─────] Reativo             ││  ║
║ │ │ ○ Vendas                    │  │        [─────●] Proativo            ││  ║
║ │ │ ○ Geral                     │  │                                     ││  ║
║ │ └─────────────────────────────┘  └─────────────────────────────────────┘│  ║
║ │                                                                          │  ║
║ └──────────────────────────────────────────────────────────────────────────┘  ║
║                                                                               ║
║                                                  [Cancelar]  [Salvar Template]║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

### Modal: Usar Template (Integrado em Neurocore)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║ Selecionar Template de Agent                                          [✕]   ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║ [🔍 Buscar template...]              [Tipo: Todos ▼]                         ║
║                                                                               ║
║ ┌────────────────────────────┬────────────────────────────┐                 ║
║ │ 📋 Recepcionista Padrão    │ 📋 Vendedor Imobiliária    │                 ║
║ │ ─────────────────────────  │ ─────────────────────────  │                 ║
║ │ Tipo: 🛟 Suporte           │ Tipo: 💰 Vendas            │                 ║
║ │ Modo: ⚪ Reativo           │ Modo: 🔵 Proativo          │                 ║
║ │                            │                            │                 ║
║ │ "Atender clientes com      │ "Apresentar produtos e     │                 ║
║ │  profissionalismo..."      │  fechar vendas..."         │                 ║
║ │                            │                            │                 ║
║ │ ✓ 3 Limitações             │ ✓ 5 Limitações             │                 ║
║ │ ✓ 5 Instruções             │ ✓ 8 Instruções             │                 ║
║ │ ✓ 2 Etapas                 │ ✓ 4 Etapas                 │                 ║
║ │                            │                            │                 ║
║ │ [Selecionar Template]      │ [Selecionar Template]      │                 ║
║ └────────────────────────────┴────────────────────────────┘                 ║
║                                                                               ║
║ ┌────────────────────────────┬────────────────────────────┐                 ║
║ │ 📋 Secretária Médica       │ 📋 Pós-Venda               │                 ║
║ │ ─────────────────────────  │ ─────────────────────────  │                 ║
║ │ Tipo: 🛟 Suporte           │ Tipo: 📦 Geral             │                 ║
║ │ Modo: ⚪ Reativo           │ Modo: ⚪ Reativo           │                 ║
║ │ ...                        │ ...                        │                 ║
║ └────────────────────────────┴────────────────────────────┘                 ║
║                                                                               ║
║                                                            [Cancelar]        ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

### Drawer: Detalhes de Agent Template

```
                              ╔════════════════════════════════════════════════╗
                              ║ Recepcionista Padrão          ✅ Ativo    [✕] ║
                              ╠════════════════════════════════════════════════╣
                              ║                                                ║
                              ║ ┌─ Estrutura Técnica ────────────────────────┐║
                              ║ │ Tipo: 🛟 Suporte                           │║
                              ║ │ Modo: ⚪ Reativo                           │║
                              ║ └────────────────────────────────────────────┘║
                              ║                                                ║
                              ║ ┌─ Informações Básicas ──────────────────────┐║
                              ║ │ Nome: Alex                                 │║
                              ║ │ Idade: 25 anos                             │║
                              ║ │ Sexo: Não especificado                     │║
                              ║ │ Objetivo: Atender clientes com excelência  │║
                              ║ │ Comunicação: Animado e profissional        │║
                              ║ │ Personalidade: Prestativo, paciente        │║
                              ║ └────────────────────────────────────────────┘║
                              ║                                                ║
                              ║ ┌─ Limitações ────────────────────────────────┐║
                              ║ │ • Não discutir política ou religião        │║
                              ║ │ • Não prometer prazos sem confirmar        │║
                              ║ │ • Não oferecer descontos não autorizados   │║
                              ║ └────────────────────────────────────────────┘║
                              ║                                                ║
                              ║ ┌─ Instruções ────────────────────────────────┐║
                              ║ │ • Cumprimentar cliente pelo nome           │║
                              ║ │ • Ser sempre educado e prestativo          │║
                              ║ │ • Agradecer ao final da conversa           │║
                              ║ │ • Usar linguagem clara e objetiva          │║
                              ║ │ • Demonstrar empatia com o cliente         │║
                              ║ └────────────────────────────────────────────┘║
                              ║                                                ║
                              ║ ┌─ Roteiro ───────────────────────────────────┐║
                              ║ │ ▼ Etapa 1: Saudação e Identificação        │║
                              ║ │   • Saudar cliente de forma amigável       │║
                              ║ │   • Perguntar nome e motivo do contato     │║
                              ║ │                                            │║
                              ║ │ ▼ Etapa 2: Resolução do Problema           │║
                              ║ │   • Buscar solução na base de conhecimento │║
                              ║ │   • Se não encontrar, transferir p/ humano │║
                              ║ └────────────────────────────────────────────┘║
                              ║                                                ║
                              ║ ┌─ Estatísticas ──────────────────────────────┐║
                              ║ │ 📊 Usado em 3 neurocores                   │║
                              ║ │ 👥 12 tenants com este agent               │║
                              ║ └────────────────────────────────────────────┘║
                              ║                                                ║
                              ║                                                ║
                              ║                         [Editar]  [Desativar] ║
                              ╚════════════════════════════════════════════════╝
```

---

## Princípios de Desenvolvimento

Esta feature deve seguir os mesmos princípios estabelecidos para o projeto:

### 1. **SOLID**
- **Single Responsibility:** Cada componente tem uma única responsabilidade clara
  - Exemplo: `AgentTemplateForm` apenas gerencia formulário, não faz queries
  - Exemplo: `AgentTemplateSelector` apenas seleciona, não cria templates

- **Open/Closed:** Componentes abertos para extensão, fechados para modificação
  - Exemplo: `AgentTemplateBasicFields` pode ser estendido sem alterar código existente

- **Liskov Substitution:** Interfaces e tipos bem definidos
  - `AgentTemplate` e `AgentTemplateWithStats` são substituíveis onde apropriado

- **Interface Segregation:** Hooks e stores com interfaces específicas
  - `useAgentTemplateFilters` não depende de todo o store, apenas da parte de filtros

- **Dependency Inversion:** Depender de abstrações (tipos), não de implementações
  - Componentes dependem de tipos TypeScript, não de stores específicos

### 2. **MVP Mindset**
- ✅ Evitar over-engineering
- ✅ Implementar apenas o necessário para v1
- ❌ NÃO adicionar features "nice to have" (deixar para versões futuras)
- ❌ NÃO criar abstrações desnecessárias

**Exemplos de Over-Engineering a Evitar:**
- Drag & drop no roteiro (fase 1 - usar lista simples)
- Sistema de versionamento de templates (adicionar depois se necessário)
- Preview em tempo real (não é crítico para MVP)

### 3. **Build Checks**
**OBRIGATÓRIO em TODAS as fases:**

```bash
# Antes de considerar fase completa
npm run build

# Build deve passar SEM erros
# Apenas warnings de Node.js 20.16.0 são aceitáveis
```

**Checklist de Build:**
- [ ] TypeScript compila sem erros
- [ ] Imports corretos (path aliases funcionando)
- [ ] Tipos corretos (sem `any` desnecessário)
- [ ] Bundle size aceitável (<1MB)

**Se build falhar:**
- 🔴 Fase está INCOMPLETA
- 🔴 NÃO avançar para próxima fase
- 🔴 Corrigir erros antes de continuar

### 4. **Documentation First**
- ✅ Consultar docs oficiais antes de implementar
  - React Hook Form: https://react-hook-form.com/
  - Zod: https://zod.dev/
  - Supabase: https://supabase.com/docs
  - shadcn/ui: https://ui.shadcn.com/

- ✅ Seguir padrões existentes do projeto
  - Usar `neurocores/` como referência de estrutura
  - Copiar padrão de validações de `tenantValidation.ts`
  - Seguir nomenclatura de stores (`agentTemplateStore.crud.ts`)

### 5. **Code Quality**
- ✅ Componentes pequenos e focados (< 200 linhas idealmente)
- ✅ Hooks customizados para lógica reutilizável
- ✅ Validações centralizadas (Zod schemas)
- ✅ Queries modulares (separar fetch, CRUD, stats)
- ✅ Error handling adequado (try/catch + toasts)
- ✅ Loading states em todas as operações assíncronas

---

**Regra de Ouro:** Build quebrado = Feature incompleta ❌

---

## Checklist de Implementação

### 🎯 Fase 1: Setup e Configuração (Estimativa: 1 dia)

- [ ] **1.1. Criar Tipos TypeScript**
  - [ ] `src/types/agent-template-extended.types.ts`:
    ```typescript
    import { AgentFunction } from './database.types'

    export interface AgentTemplate {
      id: string
      name: string
      type: AgentFunction
      reactive: boolean
      persona_name: string | null
      age: string | null
      gender: string | null
      objective: string | null
      communication: string | null
      personality: string | null
      limitations: string[] | null
      rules: any | null
      instructions: string[] | null
      guide_line: GuidelineStep[] | null
      others_instructions: any | null
      is_active: boolean
      created_by: string | null
      created_at: string
      updated_at: string
    }

    export interface GuidelineStep {
      title: string
      steps: string[]
    }

    export interface AgentTemplateWithStats extends AgentTemplate {
      neurocores_count: number
      tenants_count: number
    }

    export interface AgentTemplateCreateInput {
      name: string
      type: AgentFunction
      reactive: boolean
      persona_name?: string
      age?: string
      gender?: string
      objective?: string
      communication?: string
      personality?: string
      limitations?: string[]
      rules?: any
      instructions?: string[]
      guide_line?: GuidelineStep[]
      others_instructions?: any
    }

    export interface AgentTemplateUpdateInput
      extends Partial<AgentTemplateCreateInput> {}
    ```

- [ ] **1.2. Criar Validações Zod**
  - [ ] `src/lib/validations/agentTemplateValidation.ts`:
    ```typescript
    import { z } from 'zod'

    const guidelineStepSchema = z.object({
      title: z.string().min(3, 'Título da etapa deve ter no mínimo 3 caracteres'),
      steps: z.array(z.string().min(1)).min(1, 'Etapa deve ter pelo menos 1 instrução')
    })

    export const agentTemplateCreateSchema = z.object({
      name: z.string()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres'),
      type: z.enum(['support', 'sales', 'general'], {
        errorMap: () => ({ message: 'Tipo inválido' })
      }),
      reactive: z.boolean(),
      persona_name: z.string().optional(),
      age: z.string().optional(),
      gender: z.string().optional(),
      objective: z.string().optional(),
      communication: z.string().optional(),
      personality: z.string().optional(),
      limitations: z.array(z.string()).optional(),
      instructions: z.array(z.string()).optional(),
      guide_line: z.array(guidelineStepSchema).optional(),
      rules: z.any().optional(),
      others_instructions: z.any().optional(),
    }).refine(
      (data) => {
        // Pelo menos 1 limitação ou 1 instrução deve ser definida
        const hasLimitations = data.limitations && data.limitations.length > 0
        const hasInstructions = data.instructions && data.instructions.length > 0
        return hasLimitations || hasInstructions
      },
      {
        message: 'Template deve ter pelo menos 1 limitação ou 1 instrução',
        path: ['limitations']
      }
    )

    export const agentTemplateUpdateSchema = agentTemplateCreateSchema.partial()

    export type AgentTemplateCreateInput = z.infer<typeof agentTemplateCreateSchema>
    export type AgentTemplateUpdateInput = z.infer<typeof agentTemplateUpdateSchema>
    ```

- [ ] **1.3. Criar Tabela no Supabase**
  - [ ] Executar migration:
    ```sql
    -- Migration: create_agent_templates_table.sql

    CREATE TABLE agent_templates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      type agent_function NOT NULL,
      reactive BOOLEAN NOT NULL DEFAULT true,
      persona_name TEXT,
      age TEXT,
      gender TEXT,
      objective TEXT,
      communication TEXT,
      personality TEXT,
      limitations JSONB,
      rules JSONB,
      instructions JSONB,
      guide_line JSONB,
      others_instructions JSONB,
      is_active BOOLEAN DEFAULT true,
      created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Índices
    CREATE INDEX idx_agent_templates_type ON agent_templates(type);
    CREATE INDEX idx_agent_templates_active ON agent_templates(is_active);
    CREATE INDEX idx_agent_templates_name ON agent_templates USING gin(name gin_trgm_ops);

    -- RLS Policies (Row Level Security)
    ALTER TABLE agent_templates ENABLE ROW LEVEL SECURITY;

    -- Super Admin pode fazer tudo
    CREATE POLICY "Super Admin can do everything on agent_templates"
      ON agent_templates
      FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid()
          AND users.role = 'super_admin'
        )
      );

    -- Trigger para atualizar updated_at
    CREATE TRIGGER set_updated_at_agent_templates
      BEFORE UPDATE ON agent_templates
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    ```

---

### 🎯 Fase 2: Queries Supabase (Estimativa: 1 dia)

- [ ] **2.1. Fetch Queries**
  - [ ] `src/lib/queries/agentTemplate/agent-template-fetch.queries.ts`:
    ```typescript
    import { supabase } from '@/lib/supabase'
    import type { AgentTemplate } from '@/types/agent-template-extended.types'

    export interface FetchAgentTemplatesParams {
      search?: string
      type?: string
      isActive?: boolean
      limit?: number
      offset?: number
    }

    export async function fetchAgentTemplates(params: FetchAgentTemplatesParams) {
      let query = supabase
        .from('agent_templates')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (params.search) {
        query = query.ilike('name', `%${params.search}%`)
      }

      if (params.type) {
        query = query.eq('type', params.type)
      }

      if (params.isActive !== undefined) {
        query = query.eq('is_active', params.isActive)
      }

      if (params.limit) {
        query = query.limit(params.limit)
      }

      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 10) - 1)
      }

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data as AgentTemplate[],
        count: count || 0
      }
    }

    export async function fetchAgentTemplateById(id: string) {
      const { data, error } = await supabase
        .from('agent_templates')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as AgentTemplate
    }

    // Fetch apenas templates ativos (para seleção)
    export async function fetchActiveAgentTemplates() {
      const { data, error } = await supabase
        .from('agent_templates')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) throw error
      return data as AgentTemplate[]
    }
    ```

- [ ] **2.2. CRUD Queries**
  - [ ] `src/lib/queries/agentTemplate/agent-template-crud.queries.ts`:
    ```typescript
    import { supabase } from '@/lib/supabase'
    import type {
      AgentTemplateCreateInput,
      AgentTemplateUpdateInput
    } from '@/lib/validations/agentTemplateValidation'

    export async function createAgentTemplate(input: AgentTemplateCreateInput) {
      const { data, error } = await supabase
        .from('agent_templates')
        .insert([{
          ...input,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single()

      if (error) throw error
      return data
    }

    export async function updateAgentTemplate(
      id: string,
      input: AgentTemplateUpdateInput
    ) {
      const { data, error } = await supabase
        .from('agent_templates')
        .update(input)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    }

    export async function deleteAgentTemplate(id: string) {
      // Soft delete: apenas marca como inativo
      const { data, error } = await supabase
        .from('agent_templates')
        .update({ is_active: false })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    }

    export async function toggleAgentTemplateStatus(id: string) {
      // Busca status atual
      const { data: current, error: fetchError } = await supabase
        .from('agent_templates')
        .select('is_active')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // Inverte status
      const { data, error } = await supabase
        .from('agent_templates')
        .update({ is_active: !current.is_active })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    }
    ```

- [ ] **2.3. Stats Queries**
  - [ ] `src/lib/queries/agentTemplate/agent-template-stats.queries.ts`:
    ```typescript
    import { supabase } from '@/lib/supabase'

    export async function getAgentTemplateUsageStats(templateId: string) {
      // Conta quantos neurocores usam este template
      // Lógica: agents que foram criados a partir deste template
      // Precisa rastrear origem (adicionar campo template_id em agents?)

      // Por enquanto, retorna mock
      // TODO: Implementar tracking de template_id em agents

      return {
        neurocores_count: 0,
        tenants_count: 0
      }
    }

    export async function getTotalTemplatesCount() {
      const { count, error } = await supabase
        .from('agent_templates')
        .select('*', { count: 'exact', head: true })

      if (error) throw error
      return count || 0
    }

    export async function getActiveTemplatesCount() {
      const { count, error } = await supabase
        .from('agent_templates')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      if (error) throw error
      return count || 0
    }
    ```

- [ ] **2.4. Index Exports**
  - [ ] `src/lib/queries/agentTemplate/index.ts`

---

### 🎯 Fase 3: Store Zustand (Estimativa: 1 dia)

- [ ] **3.1. Types**
  - [ ] `src/store/agentTemplate/agentTemplateStore.types.ts`

- [ ] **3.2. CRUD Actions**
  - [ ] `src/store/agentTemplate/agentTemplateStore.crud.ts`

- [ ] **3.3. Status Actions**
  - [ ] `src/store/agentTemplate/agentTemplateStore.status.ts`

- [ ] **3.4. Filters**
  - [ ] `src/store/agentTemplate/agentTemplateStore.filters.ts`

- [ ] **3.5. Store Principal**
  - [ ] `src/store/agentTemplate/agentTemplateStore.ts`

- [ ] **3.6. Index**
  - [ ] `src/store/agentTemplate/index.ts`

---

### 🎯 Fase 4: Componentes de Listagem (Estimativa: 2 dias)

- [ ] **4.1. Página Principal**
  - [ ] `src/pages/agents/AgentTemplateListPage.tsx`

- [ ] **4.2. Tabela**
  - [ ] `src/components/agents/AgentTemplateTable.tsx`

- [ ] **4.3. Filtros**
  - [ ] `src/components/agents/AgentTemplateFilters.tsx`
  - [ ] `src/hooks/useAgentTemplateFilters.ts`

- [ ] **4.4. Paginação**
  - [ ] `src/components/agents/AgentTemplatePagination.tsx`

---

### 🎯 Fase 5: Formulário de Criação/Edição (Estimativa: 3 dias)

- [ ] **5.1. Formulário Master**
  - [ ] `src/components/agents/AgentTemplateForm.tsx` (com Tabs)
  - [ ] `src/components/agents/AgentTemplateFormDialog.tsx` (wrapper)

- [ ] **5.2. Seções do Formulário**
  - [ ] `src/components/agents/form-sections/AgentTemplateBasicFields.tsx`
  - [ ] `src/components/agents/form-sections/AgentTemplatePersonaFields.tsx`
  - [ ] `src/components/agents/form-sections/AgentTemplateLimitationsSection.tsx`
    - Lista dinâmica: add/edit/delete limitações
  - [ ] `src/components/agents/form-sections/AgentTemplateInstructionsSection.tsx`
    - Lista dinâmica: add/edit/delete instruções
  - [ ] `src/components/agents/form-sections/AgentTemplateGuidelineSection.tsx`
    - Lista de etapas
    - Cada etapa com sub-lista de instruções
    - Drag & drop para reordenar (opcional)

---

### 🎯 Fase 6: Drawer de Detalhes (Estimativa: 1 dia)

- [ ] **6.1. Drawer Principal**
  - [ ] `src/components/agents/AgentTemplateDetailsDrawer.tsx`

- [ ] **6.2. Seções de Detalhes**
  - [ ] `src/components/agents/details-sections/AgentTemplateDetailsHeader.tsx`
  - [ ] `src/components/agents/details-sections/AgentTemplateDetailsInfo.tsx`
  - [ ] `src/components/agents/details-sections/AgentTemplateDetailsConfig.tsx`
    - Exibe limitações, instruções, roteiro formatados
  - [ ] `src/components/agents/details-sections/AgentTemplateDetailsStats.tsx`

---

### 🎯 Fase 7: Integração com Neurocores (Estimativa: 2 dias)

- [ ] **7.1. Seletor de Template**
  - [ ] `src/components/agents/AgentTemplateSelector.tsx`
    - Modal para selecionar template
    - Busca e filtros
    - Cards com preview

- [ ] **7.2. Modificar NeurocoreForm**
  - [ ] Adicionar botão "Usar Template" na aba Agents
  - [ ] Integrar AgentTemplateSelector
  - [ ] Ao selecionar template:
    - Adicionar agent à lista local com flag `_templateId`
    - Badge visual "📋 De Template"

- [ ] **7.3. Modificar neurocoreStore.crud**
  - [ ] Ao criar neurocore, para cada agent:
    - Se `_templateId` existir:
      1. Buscar template em `agent_templates`
      2. Criar agent em `agents`
      3. Criar entry em `agent_prompts` (id_tenant=NULL)
      4. COPIAR configuração do template para `agent_prompts`

---

### 🎯 Fase 8: Integração com Tenants (Estimativa: 1 dia)

- [ ] **8.1. Modificar tenantStore.crud**
  - [ ] Ao criar tenant:
    1. Buscar agents do neurocore: `SELECT * FROM agents WHERE id_neurocore = ?`
    2. Para cada agent:
       - Buscar config base: `SELECT * FROM agent_prompts WHERE id_agent = ? AND id_tenant IS NULL`
       - COPIAR para novo registro:
         ```sql
         INSERT INTO agent_prompts (id_agent, id_tenant, ...)
         SELECT id_agent, 'UUID_tenant', ... FROM agent_prompts
         WHERE id_agent = ? AND id_tenant IS NULL
         ```

---

### 🎯 Fase 9: Testes e Validação (Estimativa: 2 dias)

- [ ] **9.1. Testes Manuais**
  - [ ] Criar agent template completo
  - [ ] Editar agent template
  - [ ] Ativar/Desativar template
  - [ ] Usar template ao criar neurocore
  - [ ] Criar tenant e verificar herança
  - [ ] Validações de formulário
  - [ ] Empty states
  - [ ] Loading states

- [ ] **9.2. Edge Cases**
  - [ ] Template sem limitações nem instruções (deve bloquear)
  - [ ] Criar neurocore misturando templates e agents do zero
  - [ ] Desativar template não afeta neurocores existentes
  - [ ] Tenant sem agent_prompts base (criar vazio)

- [ ] **9.3. Performance**
  - [ ] Paginação funciona corretamente
  - [ ] Busca com debounce
  - [ ] Queries otimizadas

---

### 🎯 Fase 10: Polimento e Documentação (Estimativa: 1 dia)

- [ ] **10.1. UX/UI**
  - [ ] Responsividade mobile
  - [ ] Acessibilidade (aria-labels, keyboard navigation)
  - [ ] Toasts informativos
  - [ ] Confirmações para ações destrutivas

- [ ] **10.2. Atualizar Rotas**
  - [ ] Adicionar `/agentes` no React Router
  - [ ] Adicionar item "Gerenciar Agentes" na Sidebar

- [ ] **10.3. Atualizar Documentação**
  - [ ] Atualizar `doc/status-projeto.md` com progresso
  - [ ] Marcar feature como completa em `doc/planejamento/README.md`

- [ ] **10.4. Build Final**
  - [ ] `npm run build` deve passar sem erros
  - [ ] Verificar bundle size

---

## Notas Técnicas

### Decisão 1: Template vs Instância

**Definição:**
- **Template (agent_templates):** Configuração mestre criada pelo Super Admin
- **Instância (agents + agent_prompts):** Cópia do template criada ao usar em neurocore

**Comportamento:**
- Editar template NÃO afeta instâncias já criadas
- Instâncias são independentes após criação
- Template pode ser deletado (soft delete) sem afetar instâncias

**Analogia:** Classes e Objetos em POO
- Classe = Template (definição)
- Objeto = Instância (cópia independente)

---

### Decisão 2: Tracking de Origem (Opcional)

**Problema:** Como saber quais agents foram criados a partir de qual template?

**Solução (Futura):**
Adicionar campo `template_id` em tabela `agents`:
```sql
ALTER TABLE agents ADD COLUMN template_id UUID REFERENCES agent_templates(id) ON DELETE SET NULL;
```

**Benefícios:**
- Estatísticas precisas: "Template X usado em Y neurocores"
- Auditoria: rastrear origem de agents
- Atualização opcional: propagar mudanças de template para instâncias

**Status:** NÃO IMPLEMENTAR na v1 (adicionar em versão futura)

---

### Decisão 3: JSONB vs Tabelas Relacionais

**Por que JSONB para limitations, instructions, guide_line?**

**Prós:**
- ✅ Flexibilidade: estrutura pode mudar sem migrations
- ✅ Performance: menos JOINs
- ✅ Simplicidade: menos tabelas

**Contras:**
- ❌ Menos validação (schema livre)
- ❌ Queries JSONB são mais complexas

**Decisão:** Usar JSONB conforme schema atual de `agent_prompts`

---

### Decisão 4: Soft Delete vs Hard Delete

**Comportamento:** Sempre soft delete (marcar `is_active = false`)

**Motivo:**
- Preserva histórico
- Neurocores existentes não quebram
- Pode reverter facilmente

**Hard Delete:** Apenas se Super Admin explicitamente solicitar (feature futura)

---

## Próximos Passos Após Implementação

### Feature: Atualização Propagada de Templates

**Descrição:** Ao editar template, oferecer opção de propagar mudanças para instâncias.

**Requisitos:**
1. Adicionar campo `template_id` em `agents`
2. Ao editar template, mostrar modal:
   ```
   ⚠️ Este template é usado em 3 neurocores (12 tenants)

   Como deseja proceder?

   ○ Atualizar apenas o template (instâncias não mudam)
   ● Atualizar template e propagar para todas as instâncias

   ⚠️ Atenção: Propagação sobrescreverá personalizações de tenants!

   [Cancelar]  [Confirmar]
   ```
3. Se propagar:
   - Atualizar `agent_prompts WHERE template_id = ? AND id_tenant IS NULL`
   - Opcionalmente, atualizar `agent_prompts WHERE template_id = ? AND id_tenant IS NOT NULL`
     (com outra confirmação)

---

### Feature: Duplicar Template

**Descrição:** Criar novo template a partir de template existente.

**Fluxo:**
1. Na lista ou detalhes, botão "Duplicar"
2. Abre formulário pré-preenchido
3. Nome: "[Original] - Cópia"
4. Salva como novo template

---

### Feature: Exportar/Importar Template (JSON)

**Descrição:** Exportar configuração de template para JSON e importar.

**Casos de Uso:**
- Backup de templates
- Compartilhar entre ambientes (dev → prod)
- Migração de dados

**Formato JSON:**
```json
{
  "version": "1.0",
  "template": {
    "name": "Recepcionista Padrão",
    "type": "support",
    "reactive": true,
    "persona_name": "Alex",
    "limitations": ["...", "..."],
    "instructions": ["...", "..."],
    "guide_line": [...]
  }
}
```

---

### Feature: Preview de Template ao Selecionar

**Descrição:** Ao selecionar template em modal, mostrar preview completo antes de confirmar.

**Fluxo:**
1. Clica em card de template
2. Drawer abre mostrando detalhes completos (limitações, instruções, roteiro)
3. Botão "Usar Este Template"

---

### Feature: Templates por Categoria/Tag

**Descrição:** Adicionar sistema de tags para organizar templates.

**Exemplos:**
- Tags: "Imobiliária", "Varejo", "Saúde", "Educação"
- Filtrar por tag
- Um template pode ter múltiplas tags

**Schema:**
```sql
ALTER TABLE agent_templates ADD COLUMN tags TEXT[];
CREATE INDEX idx_agent_templates_tags ON agent_templates USING gin(tags);
```

---

## Referências

- Padrão arquitetural: `src/components/neurocores/` (feature de Gerenciar NeuroCores)
- Schema do banco: `doc/database-relationships.md`
- Status do projeto: `doc/status-projeto.md`
- Planejamento geral: `doc/planejamento/README.md`

---

## Tempo Total Estimado

| Fase | Dias |
|------|------|
| Fase 1: Setup | 1 |
| Fase 2: Queries | 1 |
| Fase 3: Store | 1 |
| Fase 4: Listagem | 2 |
| Fase 5: Formulário | 3 |
| Fase 6: Detalhes | 1 |
| Fase 7: Integração Neurocores | 2 |
| Fase 8: Integração Tenants | 1 |
| Fase 9: Testes | 2 |
| Fase 10: Polimento | 1 |
| **TOTAL** | **15 dias úteis** |

**Calendário:** ~3 semanas (considerando imprevistos)

---

**Criado em:** 2025-12-02
**Versão:** 1.0
**Status:** 🟡 Planejado
