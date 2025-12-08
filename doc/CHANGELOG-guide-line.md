# Changelog: Atualização da Estrutura `guide_line`

**Data:** 2025-12-03
**Versão:** 2.0
**Impacto:** BREAKING CHANGE

---

## 📋 Resumo da Mudança

A estrutura JSONB do campo `guide_line` em `agent_templates` e `agent_prompts` foi **completamente reestruturada** para suportar:

1. **Tipo de etapa** (rank ou markdown)
2. **Controle de ativação** (ativar/desativar etapas e instruções)
3. **Sub-instruções como objetos** (em vez de strings)

---

## 🔄 Antes vs Depois

### ❌ Estrutura Antiga (v1.0)

```json
[
  {
    "title": "Etapa 1: Saudação",
    "steps": [
      "Saudar o cliente",
      "Perguntar nome"
    ]
  }
]
```

**Problemas:**
- Sem controle de tipo (rank vs markdown)
- Sem controle de ativação individual
- Instruções como strings simples
- Limitação para desativar etapas/instruções específicas

### ✅ Estrutura Nova (v2.0)

```json
[
  {
    "title": "Roteiro de Suporte",
    "type": "rank",
    "active": true,
    "sub": [
      {
        "content": "Identificar motivo",
        "active": true
      },
      {
        "content": "Finalize com empatia",
        "active": false
      }
    ]
  }
]
```

**Benefícios:**
- ✅ Controle de tipo (`rank` ou `markdown`)
- ✅ Ativação granular (etapa e sub-instruções)
- ✅ Sub-instruções como objetos estruturados
- ✅ Flexibilidade para desativar partes do roteiro

---

## 📊 Mudanças Técnicas

### 1. Tipos TypeScript

**Arquivo:** `src/types/agent-template-extended.types.ts`

```typescript
// NOVO: Interface para sub-instrução
export interface GuidelineSubInstruction {
  content: string
  active: boolean
}

// ATUALIZADO: Interface da etapa
export interface GuidelineStep {
  title: string
  type: 'rank' | 'markdown'  // 🆕 NOVO
  active: boolean             // 🆕 NOVO
  sub: GuidelineSubInstruction[]  // 🆕 RENOMEADO de "steps"
}
```

### 2. Validação Zod

**Arquivo:** `src/lib/validations/agentTemplateValidation.ts`

```typescript
// NOVO: Schema para sub-instrução
const guidelineSubInstructionSchema = z.object({
  content: z.string().min(1, 'Conteúdo não pode estar vazio'),
  active: z.boolean()
})

// ATUALIZADO: Schema da etapa
const guidelineStepSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  type: z.enum(['rank', 'markdown'], {           // 🆕 NOVO
    message: 'Tipo deve ser "rank" ou "markdown"'
  }),
  active: z.boolean(),                           // 🆕 NOVO
  sub: z.array(guidelineSubInstructionSchema)    // 🆕 RENOMEADO
    .min(1, 'Etapa deve ter pelo menos 1 instrução')
})
```

### 3. Componente de Formulário

**Arquivo:** `src/components/agents/form-sections/AgentTemplateGuidelineSection.tsx`

**Mudanças:**
- ✅ Adicionado campo `Select` para escolher tipo (rank/markdown)
- ✅ Adicionado `Switch` para ativar/desativar etapa
- ✅ Adicionado `Switch` para ativar/desativar cada sub-instrução
- ✅ Renomeado `useFieldArray` de `steps` para `sub`
- ✅ Path atualizado: `guide_line.${index}.sub.${subIndex}.content`
- ✅ Indicador visual de etapas inativas (opacity reduzida)

**Default ao adicionar etapa:**
```typescript
{
  title: '',
  type: 'rank',
  active: true,
  sub: [{ content: '', active: true }]
}
```

---

## 🗄️ Impacto no Banco de Dados

### Tabelas Afetadas

1. **`agent_templates`**
   - Campo `guide_line` (JSONB)
   - **Ação:** Atualizar dados existentes (migração manual necessária)

2. **`agent_prompts`**
   - Campo `guide_line` (JSONB)
   - **Ação:** Atualizar dados existentes (migração manual necessária)

### Script de Migração (Recomendado)

```sql
-- Migração para converter estrutura antiga para nova
-- IMPORTANTE: Executar APENAS se houver dados existentes

-- Para agent_templates
UPDATE agent_templates
SET guide_line = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'title', step->>'title',
      'type', 'rank',
      'active', true,
      'sub', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'content', substep::text,
            'active', true
          )
        )
        FROM jsonb_array_elements(step->'steps') substep
      )
    )
  )
  FROM jsonb_array_elements(guide_line) step
)
WHERE guide_line IS NOT NULL
AND jsonb_typeof(guide_line) = 'array';

-- Para agent_prompts
UPDATE agent_prompts
SET guide_line = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'title', step->>'title',
      'type', 'rank',
      'active', true,
      'sub', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'content', substep::text,
            'active', true
          )
        )
        FROM jsonb_array_elements(step->'steps') substep
      )
    )
  )
  FROM jsonb_array_elements(guide_line) step
)
WHERE guide_line IS NOT NULL
AND jsonb_typeof(guide_line) = 'array';
```

**⚠️ IMPORTANTE:**
- Execute apenas se já existirem dados com a estrutura antiga
- Faça backup antes de executar
- Teste em ambiente de desenvolvimento primeiro

---

## 📝 Exemplos Completos

### Exemplo 1: Roteiro Tipo "Rank"

```json
{
  "title": "Atendimento Padrão",
  "type": "rank",
  "active": true,
  "sub": [
    { "content": "1. Saudar cliente", "active": true },
    { "content": "2. Identificar problema", "active": true },
    { "content": "3. Oferecer solução", "active": true },
    { "content": "4. Finalizar com agradecimento", "active": true }
  ]
}
```

### Exemplo 2: Instruções Tipo "Markdown"

```json
{
  "title": "Formatação e Estilo",
  "type": "markdown",
  "active": true,
  "sub": [
    { "content": "*Negrito:* Use para destacar informações importantes", "active": true },
    { "content": "_Itálico:_ Para ênfase suave", "active": true },
    { "content": "**Emojis:** 🛠 🎫 🤝 para criar conexão", "active": true }
  ]
}
```

### Exemplo 3: Etapa Desativada

```json
{
  "title": "Upsell (Temporariamente Desativado)",
  "type": "rank",
  "active": false,
  "sub": [
    { "content": "Oferecer upgrade de plano", "active": true },
    { "content": "Explicar benefícios", "active": true }
  ]
}
```

### Exemplo 4: Instrução Específica Desativada

```json
{
  "title": "Pós-Atendimento",
  "type": "rank",
  "active": true,
  "sub": [
    { "content": "Confirmar satisfação do cliente", "active": true },
    { "content": "Solicitar avaliação", "active": false },
    { "content": "Enviar e-mail de follow-up", "active": true }
  ]
}
```

---

## 🎯 Casos de Uso

### 1. Tenant Desativa Instrução Específica

**Cenário:** Cliente não quer que o agent solicite avaliação

```typescript
// Tenant edita guide_line
guideline[2].sub[1].active = false  // Desativa "Solicitar avaliação"
```

### 2. Super Admin Testa Nova Etapa

**Cenário:** Adiciona etapa experimental sem afetar produção

```typescript
// Adiciona etapa com active: false
{
  title: "Novo Fluxo (Beta)",
  type: "rank",
  active: false,  // ← Não será usada em produção
  sub: [...]
}
```

### 3. Tenant Personaliza Tipo de Etapa

**Cenário:** Quer usar markdown em vez de numeração

```typescript
// Altera tipo de rank para markdown
guideline[0].type = "markdown"
```

---

## ✅ Checklist de Atualização

### Para Desenvolvedores

- [x] Atualizar tipos TypeScript
- [x] Atualizar validação Zod
- [x] Atualizar componente de formulário
- [x] Testar build (`npm run build`)
- [x] Atualizar documentação
- [ ] Criar migration para dados existentes (se necessário)
- [ ] Testar criação de template via UI
- [ ] Testar edição de template via UI

### Para DBA/DevOps

- [ ] Verificar se existem dados na tabela `agent_templates`
- [ ] Verificar se existem dados na tabela `agent_prompts`
- [ ] Se sim: Executar script de migração
- [ ] Se não: Nenhuma ação necessária

---

## 📚 Documentação Relacionada

- **Planejamento:** `doc/planejamento/gerenciar-agentes.md`
- **Contexto Tenant:** `doc/contexto/fluxo-edicao-prompts-tenant.md`
- **Status:** `doc/status-projeto.md`

---

## 🔮 Próximas Melhorias (Futuro)

1. **Reordenação Drag & Drop**: Permitir reordenar etapas e sub-instruções
2. **Duplicação de Etapas**: Copiar etapa com todas as sub-instruções
3. **Templates de Etapas**: Biblioteca de etapas pré-definidas
4. **Versionamento**: Histórico de alterações do guide_line
5. **Preview Interativo**: Visualizar como o roteiro ficará para o agent

---

**Versão do Documento:** 1.0
**Última Atualização:** 2025-12-03
**Mantido por:** Equipe de Desenvolvimento - Plataforma Admin
