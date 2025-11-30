# Relacionamentos do Banco de Dados

**Exportado em:** 28/11/2025, 13:22:00

**Banco:** Supabase - Sistema de Conversação Multi-tenant com IA

---

## 🏗️ Arquitetura Geral

O banco de dados segue uma arquitetura **multi-tenant** com sistema de conversação/chat integrado a agentes de IA.

### Entidades Principais:
1. **Tenants** - Organizações/Empresas
2. **Users** - Usuários do sistema
3. **Contacts** - Contatos/Clientes
4. **Conversations** - Conversas
5. **Messages** - Mensagens
6. **Agents** - Agentes de IA
7. **Neurocores** - Núcleos de IA

---

## 📊 Diagrama de Relacionamentos (Texto)

```
┌─────────────┐
│   TENANTS   │ (Multi-tenancy root)
└──────┬──────┘
       │
       ├──────────────────────────────────────────────────┐
       │                                                  │
       ▼                                                  ▼
┌─────────────┐                                    ┌──────────────┐
│    USERS    │                                    │   CONTACTS   │
└──────┬──────┘                                    └──────┬───────┘
       │                                                  │
       │                                                  │
       │                                                  ▼
       │                                          ┌───────────────┐
       │                                          │ CONVERSATIONS │
       │                                          └───────┬───────┘
       │                                                  │
       │                                                  ├─────────────┐
       │                                                  │             │
       ▼                                                  ▼             ▼
┌─────────────┐                                    ┌──────────┐  ┌─────────┐
│  MESSAGES   │◄───────────────────────────────────┤ MESSAGES │  │  TAGS   │
└─────────────┘                                    └──────────┘  └─────────┘
       │                                                              │
       │                                                              │
       ▼                                                              ▼
┌──────────────────┐                                      ┌──────────────────┐
│ MESSAGE_FEEDBACK │                                      │ CONVERSATION_TAGS│
└──────────────────┘                                      └──────────────────┘


┌─────────────┐        ┌──────────────────┐        ┌──────────────┐
│ NEUROCORES  │◄───────┤ BASE_CONHECIMENTOS│───────►│   SYNAPSES   │
└──────┬──────┘        └──────────────────┘        └──────────────┘
       │
       │
       ▼
┌─────────────┐
│   AGENTS    │
└─────────────┘


┌──────────────────┐        ┌──────────┐
│ CHANNEL_PROVIDERS│◄───────┤ CHANNELS │
└──────────────────┘        └──────────┘
```

---

## 🔗 Relacionamentos Detalhados

### 1. **TENANTS** (Organizações)
Tabela central do multi-tenancy.

**Relacionamentos:**
- `tenants.neurocore_id` → `neurocores.id` (N:1)
- `tenants.niche_id` → `niches.id` (N:1)

**Tabelas Dependentes:**
- `users.tenant_id` → `tenants.id`
- `contacts.tenant_id` → `tenants.id`
- `conversations.tenant_id` → `tenants.id`
- `base_conhecimentos.tenant_id` → `tenants.id`
- `synapses.tenant_id` → `tenants.id`
- `channels.tenant_id` → `tenants.id`
- `quick_reply_templates.tenant_id` → `tenants.id`
- `message_feedback.tenant_id` → `tenants.id`
- `contact_data_changes.tenant_id` → `tenants.id`
- `tags.id_tenant` → `tenants.id`

---

### 2. **USERS** (Usuários do Sistema)
Atendentes e administradores.

**Relacionamentos:**
- `users.tenant_id` → `tenants.id` (N:1)

**Referenciado por:**
- `messages.sender_user_id` → `users.id`
- `message_feedback.user_id` → `users.id`
- `contact_data_changes.changed_by` → `users.id`
- `quick_reply_templates.created_by` → `users.id`

---

### 3. **CONTACTS** (Contatos/Clientes)
Pessoas que interagem com o sistema.

**Relacionamentos:**
- `contacts.tenant_id` → `tenants.id` (N:1)

**Referenciado por:**
- `conversations.contact_id` → `contacts.id`
- `contact_data_changes.contact_id` → `contacts.id`

**Campos Importantes:**
- `phone` - Telefone principal
- `email` - Email
- `status` - Status do contato (open, closed, etc.)
- `last_interaction_at` - Última interação

---

### 4. **CONVERSATIONS** (Conversas)
Sessões de conversa entre contatos e o sistema.

**Relacionamentos:**
- `conversations.contact_id` → `contacts.id` (N:1)
- `conversations.tenant_id` → `tenants.id` (N:1)
- `conversations.channel_id` → `channels.id` (N:1)
- `conversations.conversation_pause_reason_id` → `conversation_reasons_pauses_and_closures.id` (N:1)
- `conversations.conversation_closure_reason_id` → `conversation_reasons_pauses_and_closures.id` (N:1)

**Referenciado por:**
- `messages.conversation_id` → `conversations.id`
- `message_feedback.conversation_id` → `conversations.id`
- `conversation_tags.conversation_id` → `conversations.id`

**Campos Importantes:**
- `status` - Status da conversa (paused, active, closed)
- `ia_active` - Se a IA está ativa
- `last_message_at` - Última mensagem

---

### 5. **MESSAGES** (Mensagens)
Mensagens trocadas nas conversas.

**Relacionamentos:**
- `messages.conversation_id` → `conversations.id` (N:1)
- `messages.sender_user_id` → `users.id` (N:1) - quando sender_type = 'attendant'
- `messages.sender_agent_id` → `agents.id` (N:1) - quando sender_type = 'agent'

**Referenciado por:**
- `message_feedback.message_id` → `messages.id`

**Campos Importantes:**
- `sender_type` - Tipo do remetente (attendant, agent, contact)
- `content` - Conteúdo da mensagem
- `status` - Status (sent, delivered, read, failed)
- `external_message_id` - ID externo (WhatsApp, etc.)

---

### 6. **AGENTS** (Agentes de IA)
Agentes virtuais que conversam com contatos.

**Relacionamentos:**
- `agents.associated_neurocores` → `neurocores.id[]` (N:N via JSON array)

**Referenciado por:**
- `messages.sender_agent_id` → `agents.id`

**Campos Importantes:**
- `type` - Tipo do agente (reactive, proactive)
- `function` - Função (support, sales, etc.)
- `is_intent_agent` - Se é agente de intenção
- `instructions` - Instruções para o agente
- `conversation_roteiro` - Roteiro de conversa

---

### 7. **NEUROCORES** (Núcleos de IA)
Núcleos de processamento de IA.

**Relacionamentos:**
- `neurocores.associated_agents` → `agents.id[]` (N:N via JSON array)

**Referenciado por:**
- `tenants.neurocore_id` → `neurocores.id`
- `base_conhecimentos.neurocore_id` → `neurocores.id`
- `agents.associated_neurocores` → `neurocores.id[]`

**Campos Importantes:**
- `id_subwork_n8n_neurocore` - ID do subworkflow N8N
- `is_active` - Se está ativo

---

### 8. **BASE_CONHECIMENTOS** (Bases de Conhecimento)
Bases de conhecimento para os agentes.

**Relacionamentos:**
- `base_conhecimentos.tenant_id` → `tenants.id` (N:1)
- `base_conhecimentos.neurocore_id` → `neurocores.id` (N:1)

**Referenciado por:**
- `synapses.base_conhecimento_id` → `base_conhecimentos.id`

---

### 9. **SYNAPSES** (Sinapses/Artigos de Conhecimento)
Artigos/documentos de conhecimento.

**Relacionamentos:**
- `synapses.base_conhecimento_id` → `base_conhecimentos.id` (N:1)
- `synapses.tenant_id` → `tenants.id` (N:1)

**Campos Importantes:**
- `title` - Título do artigo
- `content` - Conteúdo
- `status` - Status (draft, published)
- `is_enabled` - Se está habilitado

---

### 10. **CHANNELS** (Canais de Comunicação)
Canais de comunicação (WhatsApp, etc.).

**Relacionamentos:**
- `channels.tenant_id` → `tenants.id` (N:1)
- `channels.channel_provider_id` → `channel_providers.id` (N:1)

**Referenciado por:**
- `conversations.channel_id` → `channels.id`

**Campos Importantes:**
- `identification_number` - Número do canal (telefone)
- `is_active` - Se está ativo
- `is_receiving_messages` - Se está recebendo mensagens
- `is_sending_messages` - Se está enviando mensagens
- `provider_external_channel_id` - ID externo no provider

---

### 11. **CHANNEL_PROVIDERS** (Provedores de Canal)
Provedores de API de comunicação (Evolution API, etc.).

**Referenciado por:**
- `channels.channel_provider_id` → `channel_providers.id`

**Campos Importantes:**
- `channel_provider_identifier_code` - Código identificador
- `id_subwork_n8n_master_integrator` - ID do integrador N8N

---

### 12. **TAGS** (Tags/Etiquetas)
Tags para categorização.

**Relacionamentos:**
- `tags.id_tenant` → `tenants.id` (N:1)

**Referenciado por:**
- `conversation_tags.tag_id` → `tags.id`

**Campos Importantes:**
- `tag_name` - Nome da tag
- `color` - Cor da tag
- `active` - Se está ativa
- `order_index` - Ordem de exibição

---

### 13. **CONVERSATION_TAGS** (Tags de Conversas)
Tabela de relacionamento N:N entre conversas e tags.

**Relacionamentos:**
- `conversation_tags.conversation_id` → `conversations.id` (N:1)
- `conversation_tags.tag_id` → `tags.id` (N:1)

---

### 14. **MESSAGE_FEEDBACK** (Feedback de Mensagens)
Feedback sobre mensagens específicas.

**Relacionamentos:**
- `message_feedback.tenant_id` → `tenants.id` (N:1)
- `message_feedback.message_id` → `messages.id` (N:1)
- `message_feedback.conversation_id` → `conversations.id` (N:1)
- `message_feedback.user_id` → `users.id` (N:1)

**Campos Importantes:**
- `rating` - Avaliação (positive, negative, neutral)
- `comment` - Comentário

---

### 15. **CONTACT_DATA_CHANGES** (Histórico de Alterações de Contatos)
Auditoria de mudanças nos dados de contatos.

**Relacionamentos:**
- `contact_data_changes.tenant_id` → `tenants.id` (N:1)
- `contact_data_changes.contact_id` → `contacts.id` (N:1)
- `contact_data_changes.changed_by` → `users.id` (N:1)

**Campos Importantes:**
- `field_name` - Nome do campo alterado
- `old_value` - Valor antigo
- `new_value` - Valor novo
- `changed_at` - Data da alteração

---

### 16. **QUICK_REPLY_TEMPLATES** (Modelos de Resposta Rápida)
Templates de mensagens rápidas para atendentes.

**Relacionamentos:**
- `quick_reply_templates.tenant_id` → `tenants.id` (N:1)
- `quick_reply_templates.created_by` → `users.id` (N:1)

**Campos Importantes:**
- `title` - Título do template
- `message` - Mensagem
- `icon` - Ícone
- `usage_count` - Contador de uso
- `active` - Se está ativo

---

### 17. **NICHES** (Nichos de Mercado)
Nichos/segmentos de mercado.

**Referenciado por:**
- `tenants.niche_id` → `niches.id`

---

### 18. **Tabelas Vazias** (Estrutura Futura)

#### **CONVERSATION_REACTIVATIONS_SETTINGS**
Configurações de reativação de conversas (não implementado ainda).

#### **CONVERSATION_REASONS_PAUSES_AND_CLOSURES**
Motivos de pausa e fechamento de conversas (não implementado ainda).

**Será referenciado por:**
- `conversations.conversation_pause_reason_id`
- `conversations.conversation_closure_reason_id`

#### **FEATURE_MODULES**
Módulos de funcionalidades (não implementado ainda).

#### **FEEDBACKS**
Feedbacks gerais (não implementado ainda).

---

## 🎯 Fluxo Principal de Dados

### Fluxo de Conversa:

1. **Tenant** cria uma conta no sistema
2. **User** (atendente) é criado para o tenant
3. **Channel** é configurado (WhatsApp via Evolution API)
4. **Contact** envia mensagem via WhatsApp
5. **Conversation** é criada automaticamente
6. **Messages** são trocadas entre:
   - Contact → Agent (IA)
   - Agent → Contact
   - Contact → User (atendente humano)
   - User → Contact
7. **Tags** podem ser aplicadas à conversa
8. **Message_Feedback** pode ser registrado
9. **Contact_Data_Changes** registra alterações nos dados do contato

### Fluxo de IA:

1. **Neurocore** é configurado com ID do N8N
2. **Base_Conhecimentos** é criada e vinculada ao neurocore
3. **Synapses** (artigos) são adicionados à base
4. **Agent** é criado e vinculado ao neurocore
5. Agent usa a base de conhecimento para responder mensagens

---

## 📈 Cardinalidade dos Relacionamentos

| Relacionamento | Cardinalidade | Tipo |
|----------------|---------------|------|
| Tenant → Users | 1:N | Um tenant tem vários usuários |
| Tenant → Contacts | 1:N | Um tenant tem vários contatos |
| Tenant → Conversations | 1:N | Um tenant tem várias conversas |
| Contact → Conversations | 1:N | Um contato pode ter várias conversas |
| Conversation → Messages | 1:N | Uma conversa tem várias mensagens |
| User → Messages | 1:N | Um usuário pode enviar várias mensagens |
| Agent → Messages | 1:N | Um agente pode enviar várias mensagens |
| Neurocore → Agents | N:N | Neurocores e Agents têm relação N:N |
| Neurocore → Base_Conhecimentos | 1:N | Um neurocore tem várias bases |
| Base_Conhecimentos → Synapses | 1:N | Uma base tem várias sinapses |
| Conversation → Tags | N:N | Via conversation_tags |
| Channel_Provider → Channels | 1:N | Um provider tem vários canais |
| Tenant → Channels | 1:N | Um tenant tem vários canais |

---

## 🔐 Campos de Auditoria

Quase todas as tabelas possuem:
- `created_at` - Data de criação
- `updated_at` - Data de atualização

Algumas tabelas específicas têm campos adicionais:
- `contact_data_changes` - Auditoria completa de mudanças
- `message_feedback` - Feedback com timestamp

---

## 💡 Observações Importantes

1. **Multi-tenancy**: Quase todas as tabelas têm `tenant_id` para isolamento de dados
2. **Soft Delete**: Não há campos de soft delete visíveis (usar `is_active` ou `status`)
3. **JSON Fields**: Vários campos usam JSON para flexibilidade (`associated_neurocores`, `modules`, etc.)
4. **External IDs**: Campos como `external_message_id`, `provider_external_channel_id` para integração
5. **N8N Integration**: IDs de subworkflows N8N em `neurocores` e `channel_providers`
6. **Status Fields**: Uso extensivo de campos `status` para máquinas de estado

---

## 🚀 Próximos Passos Sugeridos

1. ✅ Implementar as tabelas vazias conforme necessário
2. ✅ Adicionar índices em foreign keys para performance
3. ✅ Criar views para queries complexas comuns
4. ✅ Implementar RLS (Row Level Security) do Supabase
5. ✅ Criar triggers para auditoria automática
6. ✅ Documentar constraints e validações
