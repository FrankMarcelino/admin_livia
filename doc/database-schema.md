# Schema do Banco de Dados Supabase

**Exportado em:** 30/11/2025, 20:45:53

**URL:** https://wfrxwfbslhkkzkexyilx.supabase.co

**Total de Tabelas:** 21

---

## 📋 synapses

**Registros:** 6

**Colunas:** 11

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "cf606f4f-e51b-4681-b3fc-74ecbd964d92" |
| base_conhecimento_id | string | ❌ | "b500762c-8f8a-4602-a0c3-b2d97ecad3e8" |
| tenant_id | string | ❌ | "d23e15bb-5294-4f33-905e-f1565ba6022d" |
| title | string | ❌ | "Política de Devolução" |
| description | string | ❌ | "Regras para devolução de produtos" |
| image_url | object | ✅ | null |
| status | string | ❌ | "draft" |
| created_at | string | ❌ | "2025-11-17T14:48:25.357024+00:00" |
| updated_at | string | ❌ | "2025-11-19T01:00:38.677787+00:00" |
| content | string | ❌ | "Aceitamos devoluções em até 30 dias..." |
| is_enabled | boolean | ❌ | true |

---

## 📋 contacts

**Registros:** 25

**Colunas:** 23

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "dad7d9e6-1a7f-458b-9fa3-e0df17f4a36f" |
| tenant_id | string | ❌ | "d23e15bb-5294-4f33-905e-f1565ba6022d" |
| name | string | ❌ | "João Silva" |
| phone | string | ❌ | "+5511911111111" |
| phone_secondary | object | ✅ | null |
| email | object | ✅ | null |
| country | object | ✅ | null |
| city | object | ✅ | null |
| zip_code | object | ✅ | null |
| address_street | object | ✅ | null |
| address_number | object | ✅ | null |
| address_complement | object | ✅ | null |
| cpf | object | ✅ | null |
| rg | object | ✅ | null |
| last_interaction_at | string | ❌ | "2025-11-17T14:48:23.367+00:00" |
| status | string | ❌ | "open" |
| customer_data_extracted | object | ✅ | null |
| last_negotiation | object | ✅ | null |
| created_at | string | ❌ | "2025-11-17T14:48:23.639234+00:00" |
| updated_at | string | ❌ | "2025-11-17T14:48:23.639234+00:00" |
| external_identification_contact | object | ✅ | null |
| external_contact_id | object | ✅ | null |
| tag | object | ✅ | null |

---

## 📋 conversation_reactivations_settings

**Registros:** 0

**Colunas:** 1

*Tabela vazia - estrutura não disponível*

---

## 📋 neurocores

**Registros:** 3

**Colunas:** 7 ⚠️ (MUDOU: era 8)

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "d9d3f30f-d36b-4f39-8468-e3e65fe955c9" |
| name | string | ❌ | "Neurocore Demo" |
| description | string | ❌ | "Neurocore de demonstração" |
| id_subwork_n8n_neurocore | string | ❌ | "IPtwAsJ1ERtgIuEt" |
| is_active | boolean | ❌ | true |
| created_at | string | ❌ | "2025-11-17T14:48:23.005913+00:00" |
| updated_at | string | ❌ | "2025-11-21T20:33:10.77237+00:00" |

**⚠️ MUDANÇA:** Campo `associated_agents` (array) foi **REMOVIDO**

---

## 📋 message_feedback

**Registros:** 12 (era 11)

**Colunas:** 8

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "d38c00f0-e922-41de-aaa2-c3a70becfd27" |
| tenant_id | string | ❌ | "d23e15bb-5294-4f33-905e-f1565ba6022d" |
| message_id | string | ❌ | "73ac393b-1944-40c8-8f00-3822038b4e24" |
| conversation_id | string | ❌ | "088cc19e-383e-4bed-b9a9-0991516b5e97" |
| rating | string | ❌ | "negative" |
| comment | string | ❌ | "ateindemitno ficou ruim" |
| user_id | string | ❌ | "618ea8de-2231-4300-939e-8bf53301c2a0" |
| created_at | string | ❌ | "2025-11-18T23:49:49.486554+00:00" |

---

## 📋 channel_providers

**Registros:** 1

**Colunas:** 8

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "076b2291-d532-41b0-8b41-a2f721e22ea5" |
| name | string | ❌ | "Evolution API 2.3.6" |
| description | string | ❌ | "Evolution API " |
| api_base_config | object | ✅ | null |
| created_at | string | ❌ | "2025-11-17T14:48:23.293378+00:00" |
| updated_at | string | ❌ | "2025-11-21T20:06:26.861688+00:00" |
| channel_provider_identifier_code | string | ❌ | "evolution_001" |
| id_subwork_n8n_master_integrator | string | ❌ | "D9ttjvWYMf40Yd0i" |

---

## 📋 base_conhecimentos

**Registros:** 8

**Colunas:** 8

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "897fa151-16ac-4086-9621-224682968dd0" |
| tenant_id | string | ❌ | "d23e15bb-5294-4f33-905e-f1565ba6022d" |
| name | string | ❌ | "teste" |
| description | string | ❌ | "teste" |
| neurocore_id | string | ❌ | "d9d3f30f-d36b-4f39-8468-e3e65fe955c9" |
| is_active | boolean | ❌ | true |
| created_at | string | ❌ | "2025-11-19T13:58:26.03712+00:00" |
| updated_at | string | ❌ | "2025-11-19T13:59:14.597844+00:00" |

---

## 📋 niches

**Registros:** 3

**Colunas:** 5

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "188d1ca8-6cb8-4c57-a816-921e0d9414d6" |
| name | string | ❌ | "Escola" |
| description | object | ✅ | null |
| created_at | string | ❌ | "2025-11-24T14:27:04.587885+00:00" |
| updated_at | string | ❌ | "2025-11-24T14:27:04.587885+00:00" |

---

## 📋 conversation_reasons_pauses_and_closures

**Registros:** 0

**Colunas:** 1

*Tabela vazia - estrutura não disponível*

---

## 📋 conversation_tags

**Registros:** 109

**Colunas:** 4

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "0917454a-6eac-48f2-a678-4cfab969d738" |
| conversation_id | string | ❌ | "4279da91-12d7-47cc-b7d1-ad6307a546ea" |
| tag_id | string | ❌ | "c1228f91-2e1f-4250-beb6-81dd9e7c98ef" |
| created_at | string | ❌ | "2025-11-24T20:08:33.057065+00:00" |

---

## 📋 quick_reply_templates

**Registros:** 70

**Colunas:** 10

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "4f5cd744-3fe1-4bbf-a344-a662608b8b36" |
| tenant_id | string | ❌ | "31701213-794d-43c3-a74a-50d57fcd9d2b" |
| title | string | ❌ | "Perfeito" |
| message | string | ❌ | "Perfeito, vou te passar as informações" |
| icon | string | ❌ | "✅" |
| usage_count | number | ❌ | 1 |
| created_at | string | ❌ | "2025-11-26T14:53:53.161064+00:00" |
| updated_at | string | ❌ | "2025-11-26T14:54:44.853323+00:00" |
| active | boolean | ❌ | true |
| created_by | object | ✅ | null |

---

## 📋 feature_modules

**Registros:** 0

**Colunas:** 1

*Tabela vazia - estrutura não disponível*

---

## 📋 feedbacks

**Registros:** 0

**Colunas:** 1

*Tabela vazia - estrutura não disponível*

---

## 📋 messages

**Registros:** 871 (era 858, +13)

**Colunas:** 13

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "e8f8b3b3-041b-4ca8-b324-990cf8eb55f2" |
| conversation_id | string | ❌ | "bec67dce-8237-43f5-9260-a219f6d2307b" |
| sender_type | string | ❌ | "attendant" |
| sender_user_id | string | ❌ | "618ea8de-2231-4300-939e-8bf53301c2a0" |
| sender_agent_id | object | ✅ | null |
| content | string | ❌ | "oi" |
| timestamp | string | ❌ | "2025-11-18T00:01:07.737852+00:00" |
| feedback_type | object | ✅ | null |
| feedback_text | object | ✅ | null |
| created_at | string | ❌ | "2025-11-18T00:01:07.737852+00:00" |
| updated_at | string | ❌ | "2025-11-18T00:01:07.737852+00:00" |
| external_message_id | object | ✅ | null |
| status | string | ❌ | "sent" |

---

## 📋 agents

**Registros:** 8 (era 2, +6) ⚠️

**Colunas:** 7 ⚠️ (MUDOU: era 17)

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "f1f2f567-975e-4a14-8cfe-8433204899f0" |
| name | string | ❌ | "Signum - Fernando" |
| type | string | ❌ | "intention" |
| created_at | string | ❌ | "2025-11-24T15:34:17.539856" |
| updated_at | string | ❌ | "2025-11-24T15:34:17.539856+00:00" |
| id_neurocore | string | ✅ | null |
| reactive | boolean | ❌ | true |

### ⚠️ MUDANÇAS CRÍTICAS:

**Campos REMOVIDOS:**
- ❌ `function` (support, sales, etc)
- ❌ `gender`
- ❌ `persona`
- ❌ `personality_tone`
- ❌ `communication_medium`
- ❌ `objective`
- ❌ `is_intent_agent`
- ❌ `associated_neurocores` (array JSON)
- ❌ `instructions` (JSON)
- ❌ `limitations` (JSON)
- ❌ `conversation_roteiro` (JSON)
- ❌ `other_instructions` (JSON)

**Campos NOVOS:**
- ✅ `id_neurocore` - FK para neurocores (relação 1:N)
- ✅ `reactive` - boolean (substitui is_intent_agent)

**Mudança de Valor:**
- `type`: antes "reactive"/"proactive", agora "intention"

---

## 📋 tenants

**Registros:** 3

**Colunas:** 17

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "d23e15bb-5294-4f33-905e-f1565ba6022d" |
| name | string | ❌ | "Teste DEV" |
| neurocore_id | string | ❌ | "d9d3f30f-d36b-4f39-8468-e3e65fe955c9" |
| is_active | boolean | ❌ | true |
| cnpj | string | ❌ | "12345678000190" |
| phone | string | ❌ | "+5511999999999" |
| responsible_tech_name | string | ❌ | "Pedro Técnico" |
| responsible_tech_whatsapp | string | ❌ | "+5511977777777" |
| responsible_tech_email | string | ❌ | "tech@empresademo.com" |
| responsible_finance_name | string | ❌ | "João Financeiro" |
| responsible_finance_whatsapp | string | ❌ | "+5511988888888" |
| responsible_finance_email | string | ❌ | "financeiro@empresademo.com" |
| plan | string | ❌ | "basic" |
| master_integration_active | boolean | ❌ | false |
| created_at | string | ❌ | "2025-11-17T14:48:23.179017+00:00" |
| updated_at | string | ❌ | "2025-11-21T18:47:36.709487+00:00" |
| niche_id | object | ✅ | null |

---

## 📋 tags

**Registros:** 3

**Colunas:** 8

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "c1228f91-2e1f-4250-beb6-81dd9e7c98ef" |
| created_at | string | ❌ | "2025-11-24T18:27:37.708744+00:00" |
| tag_name | string | ❌ | "Fechamento Presencial" |
| id_tenant | string | ❌ | "d23e15bb-5294-4f33-905e-f1565ba6022d" |
| prompt_to_ai | object | ✅ | null |
| active | boolean | ❌ | true |
| order_index | number | ❌ | 0 |
| color | string | ❌ | "#3b82f6" |

---

## 📋 users

**Registros:** 2

**Colunas:** 13

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "b194c90c-e158-4c88-bdf0-5cbd6e35fba9" |
| tenant_id | string | ❌ | "31701213-794d-43c3-a74a-50d57fcd9d2b" |
| full_name | string | ❌ | "Sergio" |
| email | string | ❌ | "admin@signumcursos.com" |
| whatsapp_number | string | ❌ | "5511945248552" |
| role | string | ❌ | "super_admin" |
| avatar_url | object | ✅ | null |
| is_active | boolean | ❌ | true |
| last_sign_in_at | object | ✅ | null |
| modules | object | ❌ | [] |
| created_at | string | ❌ | "2025-11-24T14:47:12.874434+00:00" |
| updated_at | string | ❌ | "2025-11-24T14:48:40.043454+00:00" |
| ai_paused | boolean | ❌ | false |

---

## 📋 channels

**Registros:** 2

**Colunas:** 17

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "b372d7ea-64ed-49e0-b1b6-a5176490f999" |
| tenant_id | string | ❌ | "d23e15bb-5294-4f33-905e-f1565ba6022d" |
| channel_provider_id | string | ❌ | "076b2291-d532-41b0-8b41-a2f721e22ea5" |
| name | string | ❌ | "WhatsApp Principal" |
| identification_number | string | ❌ | "+5511999999999" |
| instance_company_name | string | ❌ | "Lab Rodinele - DEV" |
| is_active | boolean | ❌ | true |
| is_receiving_messages | boolean | ❌ | true |
| is_sending_messages | boolean | ❌ | true |
| observations | object | ✅ | null |
| external_api_url | string | ❌ | "https://wsapilocal2.ligeira.net" |
| provider_external_channel_id | string | ❌ | "62A0BF13D900-4256-B27A-52C3FBD192D5" |
| config_json | object | ✅ | null |
| created_at | string | ❌ | "2025-11-17T14:48:23.403184+00:00" |
| updated_at | string | ❌ | "2025-11-21T21:06:28.106411+00:00" |
| identification_channel_client_descriptions | object | ✅ | null |
| message_wait_time_fragments | number | ❌ | 8 |

---

## 📋 contact_data_changes

**Registros:** 36

**Colunas:** 8

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "5f197879-93ec-4053-bacd-3c687a80e454" |
| tenant_id | string | ❌ | "d23e15bb-5294-4f33-905e-f1565ba6022d" |
| contact_id | string | ❌ | "f3ecfd4a-c697-460d-8ff6-e4424b62d481" |
| field_name | string | ❌ | "email" |
| old_value | object | ✅ | null |
| new_value | string | ❌ | "frank.silva.ti@gmail.com" |
| changed_by | string | ❌ | "618ea8de-2231-4300-939e-8bf53301c2a0" |
| changed_at | string | ❌ | "2025-11-18T23:50:46.93332+00:00" |

---

## 📋 conversations

**Registros:** 74

**Colunas:** 16

### Estrutura:

| Coluna | Tipo | Nullable | Exemplo |
|--------|------|----------|----------|
| id | string | ❌ | "088cc19e-383e-4bed-b9a9-0991516b5e97" |
| contact_id | string | ❌ | "f3ecfd4a-c697-460d-8ff6-e4424b62d481" |
| tenant_id | string | ❌ | "d23e15bb-5294-4f33-905e-f1565ba6022d" |
| channel_id | string | ❌ | "b372d7ea-64ed-49e0-b1b6-a5176490f999" |
| external_id | object | ✅ | null |
| status | string | ❌ | "paused" |
| ia_active | boolean | ❌ | true |
| last_message_at | string | ❌ | "2025-11-17T12:48:23.928+00:00" |
| overall_feedback_type | object | ✅ | null |
| overall_feedback_text | object | ✅ | null |
| created_at | string | ❌ | "2025-11-17T14:48:24.208857+00:00" |
| updated_at | string | ❌ | "2025-11-17T14:48:24.208857+00:00" |
| conversation_pause_reason_id | object | ✅ | null |
| pause_notes | object | ✅ | null |
| conversation_closure_reason_id | object | ✅ | null |
| closure_notes | object | ✅ | null |

---

## 🚨 RESUMO DAS MUDANÇAS (30/11/2025)

### Tabelas Modificadas:

1. **`agents`** - REESTRUTURAÇÃO COMPLETA
   - 17 → 7 colunas
   - Relacionamento mudou de N:N para 1:N com neurocores
   - Campos complexos (persona, instructions, etc) removidos

2. **`neurocores`** - Campo removido
   - 8 → 7 colunas
   - Removido `associated_agents`

### Dados Atualizados:

- `message_feedback`: 11 → 12 registros
- `messages`: 858 → 871 registros (+13)
- `agents`: 2 → 8 registros (+6)
