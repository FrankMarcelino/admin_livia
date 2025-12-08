# Gerenciar Empresas - Melhorias (Sub-tabs)

## Objetivo

Transformar o formulário de gerenciamento de empresas (tenants) em um sistema de **3 sub-tabs principais** no nível superior, onde cada sub-tab gerencia um aspecto do tenant:

1. **Tenant** (Dados da empresa - já existe com suas próprias sub-tabs)
2. **Channels** (Canais de comunicação WhatsApp - NOVO)
3. **Usuários** (Usuários do tenant - FUTURO/Placeholder)

---

## Contexto e Motivação

### Situação Atual

Atualmente, o formulário de criação/edição de empresas possui apenas os dados do tenant organizados em **4 sub-tabs**:
- Básico
- Técnico Responsável
- Financeiro Responsável
- Configurações

**Problema:**
- Canais WhatsApp são gerenciados separadamente (não integrado)
- Usuários do tenant não podem ser criados durante criação da empresa
- Falta visão unificada de todos os recursos do tenant

### Solução Proposta

Criar estrutura hierárquica de tabs:
- **Nível 1 (Main Tabs):** TENANT | CHANNELS | USUÁRIOS
- **Nível 2 (Sub-tabs):** Dentro de cada main tab
  - TENANT → Básico | Téc. Responsável | Fin. Responsável | Configurações
  - CHANNELS → Lista de canais + formulário de criação
  - USUÁRIOS → Placeholder vazio (implementação futura)

### Benefícios

| Aspecto | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Centralização** | Dados em telas separadas | Tudo em um lugar | ✅ UX melhorada |
| **Fluxo** | Criar empresa → Ir para outra tela → Criar canal | Criar empresa + canais na mesma tela | ✅ 50% mais rápido |
| **Consistência** | Canais podem ser esquecidos | Visível durante criação | ✅ Menos erros |
| **Escalabilidade** | Difícil adicionar novos recursos | Adicionar nova tab facilmente | ✅ Arquitetura preparada |

---

## 🎨 Diagrama da Nova UI (ASCII Art)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CRIAR/EDITAR EMPRESA                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┏━━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━┓  ◄─── MAIN TABS (Nível 1)      │
│  ┃   TENANT   ┃  CHANNELS  ┃  USUÁRIOS  ┃                                  │
│  ┗━━━━━━━━━━━━┻━━━━━━━━━━━━┻━━━━━━━━━━━━┛                                  │
│                                                                             │
│  ╔═══════════════════════════════════════════════════════════════════════╗ │
│  ║ TAB: TENANT (quando selecionado)                                     ║ │
│  ╠═══════════════════════════════════════════════════════════════════════╣ │
│  ║                                                                       ║ │
│  ║  ┌──────────┬──────────┬──────────┬──────────┐  ◄─── SUBTABS (Nível 2)║
│  ║  │  BÁSICO  │  TÉCNICO │ FINANCEIRO│  CONFIG  │                      ║ │
│  ║  └──────────┴──────────┴──────────┴──────────┘                      ║ │
│  ║                                                                       ║ │
│  ║  ┌─────────────────────────────────────────────────────────┐        ║ │
│  ║  │ [Conteúdo da subtab ativa]                              │        ║ │
│  ║  │                                                          │        ║ │
│  ║  │ Nome da Empresa:  [_________________________]           │        ║ │
│  ║  │ CNPJ:             [__.__.___ /____ -__]                │        ║ │
│  ║  │ Telefone:         [+__ __ _____-____]                  │        ║ │
│  ║  │                                                          │        ║ │
│  ║  └─────────────────────────────────────────────────────────┘        ║ │
│  ║                                                                       ║ │
│  ╚═══════════════════════════════════════════════════════════════════════╝ │
│                                                                             │
│  ╔═══════════════════════════════════════════════════════════════════════╗ │
│  ║ TAB: CHANNELS (quando selecionado)                                   ║ │
│  ╠═══════════════════════════════════════════════════════════════════════╣ │
│  ║                                                                       ║ │
│  ║  [+ Novo Canal]                                                       ║ │
│  ║                                                                       ║ │
│  ║  ┌─────────────────────────────────────────────────────────────────┐ ║ │
│  ║  │ 📱 WhatsApp Principal                              [✏️] [🗑️]  │ ║ │
│  ║  │ ────────────────────────────────────────────────────────────── │ ║ │
│  ║  │ Número: +55 11 98989-9999                                      │ ║ │
│  ║  │ Status: 🟢 Ativo | Recebendo: ✅ | Enviando: ✅               │ ║ │
│  ║  │ Instância: Lab Rodinele - DEV                                  │ ║ │
│  ║  └─────────────────────────────────────────────────────────────────┘ ║ │
│  ║                                                                       ║ │
│  ║  [Mensagem: Salve a empresa primeiro para adicionar canais]          ║ │
│  ║  (Se tenant ainda não foi criado)                                    ║ │
│  ║                                                                       ║ │
│  ╚═══════════════════════════════════════════════════════════════════════╝ │
│                                                                             │
│  ╔═══════════════════════════════════════════════════════════════════════╗ │
│  ║ TAB: USUÁRIOS (quando selecionado) - FUTURO                          ║ │
│  ╠═══════════════════════════════════════════════════════════════════════╣ │
│  ║                                                                       ║ │
│  ║  [Implementação futura - criar vazio por enquanto]                   ║ │
│  ║                                                                       ║ │
│  ╚═══════════════════════════════════════════════════════════════════════╝ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                [ Cancelar ]  [ Salvar Empresa ]       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Mockup: Formulário de Canal (Baseado no Print)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║ Criar Novo Canal: WhatsApp                                           [✕]   ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║ ┌─ INFORMAÇÕES BÁSICAS ───────────────────────────────────────────────────┐ ║
║ │                                                                          │ ║
║ │ Nome do Canal *                                                          │ ║
║ │ ┌──────────────────────────────────────────────────────────────────────┐│ ║
║ │ │ Ex.: Atendimento VIP                                                 ││ ║
║ │ └──────────────────────────────────────────────────────────────────────┘│ ║
║ │                                                                          │ ║
║ │ Número de Identificação (WhatsApp) *                                     │ ║
║ │ ┌──────────────────────────────────────────────────────────────────────┐│ ║
║ │ │ +55 11 98989-9999                                                    ││ ║
║ │ └──────────────────────────────────────────────────────────────────────┘│ ║
║ │                                                                          │ ║
║ │ Nome da Empresa da Instância *                                           │ ║
║ │ ┌──────────────────────────────────────────────────────────────────────┐│ ║
║ │ │ Ex.: Acapulco FC                                                     ││ ║
║ │ └──────────────────────────────────────────────────────────────────────┘│ ║
║ │                                                                          │ ║
║ └──────────────────────────────────────────────────────────────────────────┘ ║
║                                                                               ║
║ ┌─ STATUS E OBSERVAÇÕES ───────────────────────────────────────────────────┐ ║
║ │                                                                          │ ║
║ │ Canal Ativo           [●─────]    Recebendo Mensagens    [●─────]      │ ║
║ │                                                                          │ ║
║ │ Enviando Mensagens    [●─────]                                          │ ║
║ │                                                                          │ ║
║ │ Observações                                                              │ ║
║ │ ┌──────────────────────────────────────────────────────────────────────┐│ ║
║ │ │ Adicione notas ou observações importantes sobre este canal...        ││ ║
║ │ │                                                                      ││ ║
║ │ └──────────────────────────────────────────────────────────────────────┘│ ║
║ │                                                                          │ ║
║ └──────────────────────────────────────────────────────────────────────────┘ ║
║                                                                               ║
║ ┌─ CONFIGURAÇÕES TÉCNICAS E AVANÇADAS ─────────────────────────────────────┐ ║
║ │                                                                          │ ║
║ │ URL Externa da API *                                                     │ ║
║ │ ┌──────────────────────────────────────────────────────────────────────┐│ ║
║ │ │ https://api.provider.com/v1                                          ││ ║
║ │ └──────────────────────────────────────────────────────────────────────┘│ ║
║ │                                                                          │ ║
║ │ ID Externo do Provedor de Canal *                                        │ ║
║ │ ┌──────────────────────────────────────────────────────────────────────┐│ ║
║ │ │ Ex.: a92c93d4-c016-g7b8-a9c0                                         ││ ║
║ │ └──────────────────────────────────────────────────────────────────────┘│ ║
║ │                                                                          │ ║
║ │ Descrição do Cliente do Canal de Identificação                           │ ║
║ │ ┌──────────────────────────────────────────────────────────────────────┐│ ║
║ │ │ Descrição para identificação interna do cliente...                  ││ ║
║ │ └──────────────────────────────────────────────────────────────────────┘│ ║
║ │                                                                          │ ║
║ │ Fragmentos de Tempo de Espera de Mensagem (segundos) *                  │ ║
║ │ ┌──────────────────────────────────────────────────────────────────────┐│ ║
║ │ │ 8                                                                    ││ ║
║ │ └──────────────────────────────────────────────────────────────────────┘│ ║
║ │                                                                          │ ║
║ └──────────────────────────────────────────────────────────────────────────┘ ║
║                                                                               ║
║                                                  [Cancelar]  [Criar Canal]  ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 📊 Estrutura de Dados (Database Schema)

### Tabelas Envolvidas

```
TENANTS (Principal - já existe)
   ├── id
   ├── name
   ├── cnpj
   ├── phone
   ├── neurocore_id (FK → neurocores)
   ├── niche_id (FK → niches)
   └── ... (outros campos)

CHANNELS (Relacionado - já existe)
   ├── id
   ├── tenant_id (FK → tenants) ⚠️ PRINCIPAL RELAÇÃO
   ├── channel_provider_id (FK → channel_providers)
   ├── name
   ├── identification_number (WhatsApp)
   ├── instance_company_name
   ├── is_active
   ├── is_receiving_messages
   ├── is_sending_messages
   ├── observations
   ├── external_api_url
   ├── provider_external_channel_id
   ├── identification_channel_client_descriptions
   └── message_wait_time_fragments

CHANNEL_PROVIDERS (Lookup - já existe)
   ├── id
   ├── name (Ex.: "Evolution API 2.3.6")
   ├── channel_provider_identifier_code
   └── id_subwork_n8n_master_integrator

USERS (Futuro - Tab 3 - já existe)
   ├── id
   ├── tenant_id (FK → tenants) ⚠️
   ├── full_name
   ├── email
   ├── role
   └── ...
```

**Cardinalidade:**
- `Tenant → Channels`: **1:N** (um tenant pode ter vários canais)
- `Tenant → Users`: **1:N** (um tenant pode ter vários usuários)
- `Channel_Provider → Channels`: **1:N**

**⚠️ Importante:** Todas as tabelas já existem. Esta melhoria é apenas de UI/UX, não requer mudanças no schema.

---

## 🏗️ Arquitetura de Componentes

### Estrutura de Pastas Atual

```
src/components/tenants/
├── TenantFormDialog.tsx          ← Wrapper principal (já existe)
├── TenantForm.tsx                 ← Formulário principal (MODIFICAR)
│
├── form-sections/                 ← Sub-tabs do Tenant (já existem)
│   ├── BasicInfoFields.tsx
│   ├── TechnicalResponsibleFields.tsx
│   ├── FinancialResponsibleFields.tsx
│   └── ConfigurationFields.tsx
│
├── details-sections/              ← Detalhes (já existe)
│   ├── TenantDetailsHeader.tsx
│   └── TenantDetailsBasicInfo.tsx
│
├── TenantTable.tsx                ← Lista (já existe)
├── TenantFilters.tsx              ← Filtros (já existe)
├── TenantPagination.tsx           ← Paginação (já existe)
├── TenantDetailsDrawer.tsx        ← Drawer (já existe)
└── TenantDeleteDialog.tsx         ← Delete (já existe)
```

### Estrutura de Pastas Nova (Proposta)

```
src/components/tenants/
├── TenantFormDialog.tsx          ← Wrapper (já existe - sem mudança)
├── TenantForm.tsx                 ← Formulário master (MODIFICAR ESTRUTURA)
│
├── tabs/                          ← 🆕 NOVO: Main tabs (Nível 1)
│   ├── TenantInfoTab.tsx         ← Tab 1: Wrapper das sub-tabs de dados
│   ├── ChannelsTab.tsx           ← Tab 2: Gerenciar canais (NOVO)
│   └── UsersTab.tsx              ← Tab 3: Placeholder (NOVO)
│
├── form-sections/                 ← Sub-tabs do Tenant (mantém - Nível 2)
│   ├── BasicInfoFields.tsx       (já existe - sem mudança)
│   ├── TechnicalResponsibleFields.tsx (já existe - sem mudança)
│   ├── FinancialResponsibleFields.tsx (já existe - sem mudança)
│   └── ConfigurationFields.tsx   (já existe - sem mudança)
│
├── channels/                      ← 🆕 NOVO: Componentes de Channel
│   ├── ChannelList.tsx           ← Lista de canais do tenant
│   ├── ChannelForm.tsx           ← Formulário de criação/edição
│   ├── ChannelCard.tsx           ← Card individual do canal
│   ├── ChannelFormDialog.tsx     ← Dialog wrapper
│   └── sections/
│       ├── ChannelBasicInfoSection.tsx
│       ├── ChannelStatusSection.tsx
│       └── ChannelTechnicalSection.tsx
│
├── details-sections/              ← Mantém (sem mudança)
├── TenantTable.tsx                ← Mantém (sem mudança)
├── TenantFilters.tsx              ← Mantém (sem mudança)
├── TenantPagination.tsx           ← Mantém (sem mudança)
├── TenantDetailsDrawer.tsx        ← Mantém (sem mudança)
└── TenantDeleteDialog.tsx         ← Mantém (sem mudança)
```

---

## 🔧 Implementação Técnica

### 1️⃣ Modificar `TenantForm.tsx` (Estrutura Principal)

**Mudança:** Adicionar Main Tabs no nível 1, encapsulando as sub-tabs atuais.

```typescript
// TenantForm.tsx - Nova Estrutura
export function TenantForm({ tenant, onSuccess, onCancel }: TenantFormProps) {
  const [activeMainTab, setActiveMainTab] = useState('tenant')

  // ... código existente ...

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>

        {/* MAIN TABS - NÍVEL 1 (NOVO) */}
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tenant">Tenant</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="users" disabled>Usuários</TabsTrigger>
          </TabsList>

          {/* TAB 1: TENANT INFO (wrapper das sub-tabs atuais) */}
          <TabsContent value="tenant">
            <TenantInfoTab
              form={form}
              neurocores={neurocores}
              niches={niches}
            />
          </TabsContent>

          {/* TAB 2: CHANNELS (NOVO) */}
          <TabsContent value="channels">
            <ChannelsTab tenantId={tenant?.id} />
          </TabsContent>

          {/* TAB 3: USERS (FUTURO - Placeholder) */}
          <TabsContent value="users">
            <UsersTab tenantId={tenant?.id} />
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Atualizar' : 'Criar'} Empresa
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

---

### 2️⃣ Criar `TenantInfoTab.tsx` (Wrapper das Sub-tabs)

**Responsabilidade:** Encapsular as 4 sub-tabs existentes (Nível 2).

```typescript
// tabs/TenantInfoTab.tsx - NOVO
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BasicInfoFields } from '../form-sections/BasicInfoFields'
import { TechnicalResponsibleFields } from '../form-sections/TechnicalResponsibleFields'
import { FinancialResponsibleFields } from '../form-sections/FinancialResponsibleFields'
import { ConfigurationFields } from '../form-sections/ConfigurationFields'
import type { UseFormReturn } from 'react-hook-form'
import type { TenantCreateInput } from '@/lib/validations/tenantValidation'

interface TenantInfoTabProps {
  form: UseFormReturn<TenantCreateInput>
  neurocores: { id: string; name: string }[]
  niches: { id: string; name: string }[]
}

export function TenantInfoTab({ form, neurocores, niches }: TenantInfoTabProps) {
  return (
    <Tabs defaultValue="basic" className="w-full mt-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Básico</TabsTrigger>
        <TabsTrigger value="tech">Téc. Responsável</TabsTrigger>
        <TabsTrigger value="finance">Fin. Responsável</TabsTrigger>
        <TabsTrigger value="config">Configurações</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4 mt-4">
        <BasicInfoFields form={form} />
      </TabsContent>

      <TabsContent value="tech" className="space-y-4 mt-4">
        <TechnicalResponsibleFields form={form} />
      </TabsContent>

      <TabsContent value="finance" className="space-y-4 mt-4">
        <FinancialResponsibleFields form={form} />
      </TabsContent>

      <TabsContent value="config" className="space-y-4 mt-4">
        <ConfigurationFields
          form={form}
          neurocores={neurocores}
          niches={niches}
        />
      </TabsContent>
    </Tabs>
  )
}
```

---

### 3️⃣ Criar `ChannelsTab.tsx` (Gerenciar Canais)

**Responsabilidade:** Listar e gerenciar canais do tenant.

```typescript
// tabs/ChannelsTab.tsx - NOVO
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ChannelList } from '../channels/ChannelList'
import { ChannelFormDialog } from '../channels/ChannelFormDialog'
import { useChannelStore } from '@/store/channel'
import type { Channel } from '@/types/database.types'

interface ChannelsTabProps {
  tenantId?: string
}

export function ChannelsTab({ tenantId }: ChannelsTabProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null)
  const { channels, fetchChannelsByTenant, isLoading } = useChannelStore()

  useEffect(() => {
    if (tenantId) {
      fetchChannelsByTenant(tenantId)
    }
  }, [tenantId, fetchChannelsByTenant])

  // Se tenant ainda não foi criado
  if (!tenantId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-2">
          Salve a empresa primeiro para adicionar canais
        </p>
        <p className="text-sm text-muted-foreground">
          Você poderá adicionar canais WhatsApp após criar o cadastro da empresa.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Canais WhatsApp</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie os canais de comunicação desta empresa
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Canal
        </Button>
      </div>

      {/* Lista de canais */}
      <ChannelList
        channels={channels}
        isLoading={isLoading}
        onEdit={(channel) => setEditingChannel(channel)}
      />

      {/* Dialog de criação/edição */}
      <ChannelFormDialog
        open={isCreating || !!editingChannel}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false)
            setEditingChannel(null)
          }
        }}
        tenantId={tenantId}
        channel={editingChannel}
        onSuccess={() => {
          setIsCreating(false)
          setEditingChannel(null)
          fetchChannelsByTenant(tenantId)
        }}
      />
    </div>
  )
}
```

---

### 4️⃣ Criar `UsersTab.tsx` (Placeholder Futuro)

```typescript
// tabs/UsersTab.tsx - NOVO (Placeholder)
interface UsersTabProps {
  tenantId?: string
}

export function UsersTab({ tenantId }: UsersTabProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-muted-foreground mb-2">
        Gerenciamento de usuários em desenvolvimento
      </p>
      <p className="text-sm text-muted-foreground">
        Esta funcionalidade será implementada em breve.
      </p>
    </div>
  )
}
```

---

### 5️⃣ Criar Componentes de Channel

#### `ChannelForm.tsx`

```typescript
// channels/ChannelForm.tsx - NOVO
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useChannelStore } from '@/store/channel'
import { channelCreateSchema, type ChannelCreateInput } from '@/lib/validations/channelValidation'
import { fetchChannelProviders } from '@/lib/queries/channelQueries'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import { ChannelBasicInfoSection } from './sections/ChannelBasicInfoSection'
import { ChannelStatusSection } from './sections/ChannelStatusSection'
import { ChannelTechnicalSection } from './sections/ChannelTechnicalSection'
import type { Channel } from '@/types/database.types'

interface ChannelFormProps {
  tenantId: string
  channel?: Channel | null
  onSuccess: () => void
  onCancel: () => void
}

export function ChannelForm({ tenantId, channel, onSuccess, onCancel }: ChannelFormProps) {
  const { createChannel, updateChannel, isLoading } = useChannelStore()
  const [providers, setProviders] = useState<{ id: string; name: string }[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  const isEditing = !!channel

  // Form setup
  const form = useForm<ChannelCreateInput>({
    resolver: zodResolver(channelCreateSchema),
    defaultValues: channel
      ? {
          tenant_id: channel.tenant_id,
          channel_provider_id: channel.channel_provider_id,
          name: channel.name,
          identification_number: channel.identification_number,
          instance_company_name: channel.instance_company_name,
          is_active: channel.is_active,
          is_receiving_messages: channel.is_receiving_messages,
          is_sending_messages: channel.is_sending_messages,
          observations: channel.observations || '',
          external_api_url: channel.external_api_url,
          provider_external_channel_id: channel.provider_external_channel_id,
          identification_channel_client_descriptions: channel.identification_channel_client_descriptions || '',
          message_wait_time_fragments: channel.message_wait_time_fragments || 8
        }
      : {
          tenant_id: tenantId,
          channel_provider_id: '',
          name: '',
          identification_number: '',
          instance_company_name: '',
          is_active: true,
          is_receiving_messages: true,
          is_sending_messages: true,
          observations: '',
          external_api_url: '',
          provider_external_channel_id: '',
          identification_channel_client_descriptions: '',
          message_wait_time_fragments: 8
        }
  })

  // Load providers
  useEffect(() => {
    async function loadData() {
      setIsLoadingData(true)
      try {
        const providersData = await fetchChannelProviders()
        setProviders(providersData)
      } catch (error) {
        console.error('Error loading providers:', error)
      } finally {
        setIsLoadingData(false)
      }
    }
    loadData()
  }, [])

  // Submit handler
  async function onSubmit(data: ChannelCreateInput) {
    let result
    if (isEditing) {
      result = await updateChannel(channel.id, data)
    } else {
      result = await createChannel(data)
    }

    if (result) {
      onSuccess()
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Carregando...</span>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Seção: Informações Básicas */}
        <ChannelBasicInfoSection form={form} providers={providers} />

        {/* Seção: Status e Observações */}
        <ChannelStatusSection form={form} />

        {/* Seção: Configurações Técnicas */}
        <ChannelTechnicalSection form={form} />

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Atualizar' : 'Criar'} Canal
          </Button>
        </div>

        {/* Validation Errors */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <p className="font-medium">Corrija os seguintes erros:</p>
            <ul className="list-disc list-inside mt-1">
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </Form>
  )
}
```

---

## ✅ Validação (Zod Schema)

```typescript
// lib/validations/channelValidation.ts - NOVO
import { z } from 'zod'

export const channelCreateSchema = z.object({
  tenant_id: z.string().uuid('ID do tenant inválido'),
  channel_provider_id: z.string().uuid('Selecione um provedor'),
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  identification_number: z.string()
    .regex(/^\+\d{2}\s?\d{2}\s?\d{4,5}-?\d{4}$/, 'Formato inválido. Use: +55 11 98989-9999'),
  instance_company_name: z.string()
    .min(3, 'Nome da instância deve ter no mínimo 3 caracteres'),
  is_active: z.boolean().default(true),
  is_receiving_messages: z.boolean().default(true),
  is_sending_messages: z.boolean().default(true),
  observations: z.string().optional(),
  external_api_url: z.string()
    .url('URL inválida')
    .min(1, 'URL da API é obrigatória'),
  provider_external_channel_id: z.string()
    .min(1, 'ID externo do provedor é obrigatório'),
  identification_channel_client_descriptions: z.string().optional(),
  message_wait_time_fragments: z.number()
    .int('Deve ser um número inteiro')
    .min(1, 'Mínimo 1 segundo')
    .max(60, 'Máximo 60 segundos')
    .default(8)
})

export const channelUpdateSchema = channelCreateSchema.partial().required({
  tenant_id: true
})

export type ChannelCreateInput = z.infer<typeof channelCreateSchema>
export type ChannelUpdateInput = z.infer<typeof channelUpdateSchema>
```

---

## 📦 Checklist de Implementação

### 🎯 Fase 1: Preparação e Validações (1 dia)

- [ ] **1.1. Criar Validações**
  - [ ] `lib/validations/channelValidation.ts`
    - [ ] Schema de criação (`channelCreateSchema`)
    - [ ] Schema de edição (`channelUpdateSchema`)
    - [ ] Tipos TypeScript

- [ ] **1.2. Criar Queries**
  - [ ] `lib/queries/channelQueries.ts`
    - [ ] `fetchChannelsByTenant(tenantId)` (se não existir)
    - [ ] `fetchChannelProviders()` (se não existir)
    - [ ] `createChannel(data)`
    - [ ] `updateChannel(id, data)`
    - [ ] `deleteChannel(id)`

- [ ] **1.3. Teste de Build**
  ```bash
  npm run build
  ```
  - [ ] Build passa sem erros TypeScript

---

### 🎯 Fase 2: Store Zustand (1 dia)

- [ ] **2.1. Criar/Atualizar Channel Store**
  - [ ] `store/channel/index.ts`
    - [ ] State: `channels`, `isLoading`, `error`
    - [ ] Actions: `fetchChannelsByTenant`, `createChannel`, `updateChannel`, `deleteChannel`
    - [ ] Filtros (se necessário)

- [ ] **2.2. Teste de Build**
  ```bash
  npm run build
  ```
  - [ ] Build passa sem erros TypeScript

---

### 🎯 Fase 3: Modificar TenantForm (Main Structure) (1 dia)

- [ ] **3.1. Modificar TenantForm.tsx**
  - [ ] Adicionar Main Tabs (Nível 1)
  - [ ] Mover sub-tabs para TenantInfoTab
  - [ ] Integrar ChannelsTab
  - [ ] Adicionar UsersTab (placeholder)

- [ ] **3.2. Criar TenantInfoTab.tsx**
  - [ ] Wrapper das 4 sub-tabs existentes
  - [ ] Passa form, neurocores, niches como props

- [ ] **3.3. Teste de Build**
  ```bash
  npm run build
  ```
  - [ ] Build passa sem erros TypeScript
  - [ ] Testar navegação entre tabs manualmente

---

### 🎯 Fase 4: Componentes de Channel - Estrutura (2 dias)

- [ ] **4.1. Criar ChannelsTab.tsx**
  - [ ] Lógica de carregamento de canais
  - [ ] Botão "Novo Canal"
  - [ ] Mensagem quando tenant não existe
  - [ ] Integração com ChannelList e ChannelFormDialog

- [ ] **4.2. Criar ChannelList.tsx**
  - [ ] Listar canais do tenant
  - [ ] ChannelCard para cada canal
  - [ ] Empty state (sem canais)
  - [ ] Loading state

- [ ] **4.3. Criar ChannelCard.tsx**
  - [ ] Exibir informações do canal
  - [ ] Badges de status (ativo, recebendo, enviando)
  - [ ] Botões: Editar, Deletar

- [ ] **4.4. Criar ChannelFormDialog.tsx**
  - [ ] Wrapper do ChannelForm
  - [ ] Dialog com título dinâmico (Criar/Editar)

- [ ] **4.5. Teste de Build**
  ```bash
  npm run build
  ```
  - [ ] Build passa sem erros TypeScript

---

### 🎯 Fase 5: Componentes de Channel - Formulário (2 dias)

- [ ] **5.1. Criar ChannelForm.tsx**
  - [ ] Formulário master
  - [ ] Integração com react-hook-form + Zod
  - [ ] Carregar channel providers
  - [ ] Submit handler (criar/editar)
  - [ ] Exibir erros de validação

- [ ] **5.2. Criar Seções do Formulário**
  - [ ] `channels/sections/ChannelBasicInfoSection.tsx`
    - [ ] Nome do canal
    - [ ] Número de identificação (WhatsApp)
    - [ ] Nome da empresa da instância
    - [ ] Seletor de provider

  - [ ] `channels/sections/ChannelStatusSection.tsx`
    - [ ] Switch: Canal ativo
    - [ ] Switch: Recebendo mensagens
    - [ ] Switch: Enviando mensagens
    - [ ] Textarea: Observações

  - [ ] `channels/sections/ChannelTechnicalSection.tsx`
    - [ ] URL externa da API
    - [ ] ID externo do provedor
    - [ ] Descrição do cliente
    - [ ] Fragmentos de tempo de espera

- [ ] **5.3. Teste de Build**
  ```bash
  npm run build
  ```
  - [ ] Build passa sem erros TypeScript
  - [ ] Testar formulário manualmente (validações, campos obrigatórios)

---

### 🎯 Fase 6: Criar UsersTab (Placeholder) (30 minutos)

- [ ] **6.1. Criar UsersTab.tsx**
  - [ ] Componente simples com mensagem de placeholder
  - [ ] "Gerenciamento de usuários em desenvolvimento"

- [ ] **6.2. Teste de Build**
  ```bash
  npm run build
  ```
  - [ ] Build passa sem erros TypeScript

---

### 🎯 Fase 7: Testes Funcionais (2 dias)

- [ ] **7.1. Teste de Fluxo Completo**
  - [ ] Criar nova empresa
    - [ ] Preencher tab "Tenant" (todas as sub-tabs)
    - [ ] Salvar empresa
    - [ ] Verificar criação no banco

  - [ ] Adicionar canal à empresa
    - [ ] Clicar na tab "Channels"
    - [ ] Clicar em "Novo Canal"
    - [ ] Preencher todas as seções
    - [ ] Salvar canal
    - [ ] Verificar criação no banco
    - [ ] Verificar canal aparece na lista

  - [ ] Editar canal
    - [ ] Clicar em "Editar" no ChannelCard
    - [ ] Modificar campos
    - [ ] Salvar
    - [ ] Verificar atualização no banco

  - [ ] Deletar canal
    - [ ] Clicar em "Deletar"
    - [ ] Confirmar
    - [ ] Verificar remoção do banco

- [ ] **7.2. Teste de Edição de Empresa Existente**
  - [ ] Abrir empresa existente (com canais)
  - [ ] Verificar tab "Channels" carrega canais
  - [ ] Editar dados do tenant (tab "Tenant")
  - [ ] Salvar
  - [ ] Verificar canais não foram afetados

- [ ] **7.3. Testes de Edge Cases**
  - [ ] Empresa sem canais (empty state)
  - [ ] Formulário de canal com validações
    - [ ] Campos obrigatórios vazios
    - [ ] Formato de telefone inválido
    - [ ] URL inválida
  - [ ] Loading states em todas as operações
  - [ ] Error handling (toast de erro em falhas)

- [ ] **7.4. Teste de Build Final**
  ```bash
  npm run build
  ```
  - [ ] Build passa sem erros TypeScript
  - [ ] Verificar bundle size aceitável

---

### 🎯 Fase 8: Polimento e UX (1 dia)

- [ ] **8.1. Responsividade**
  - [ ] Testar em mobile (main tabs responsivos)
  - [ ] Formulário de canal responsivo
  - [ ] ChannelCard responsivo

- [ ] **8.2. Acessibilidade**
  - [ ] Adicionar aria-labels em tabs
  - [ ] Keyboard navigation funcionando
  - [ ] Focus management correto

- [ ] **8.3. Feedback Visual**
  - [ ] Toasts informativos:
    - [ ] "Canal criado com sucesso"
    - [ ] "Canal atualizado com sucesso"
    - [ ] "Canal removido com sucesso"
    - [ ] Erros: "Erro ao criar canal"
  - [ ] Loading spinners em operações assíncronas
  - [ ] Skeleton loaders em lista de canais

- [ ] **8.4. Confirmações**
  - [ ] Deletar canal: Dialog de confirmação
  - [ ] Mensagem clara: "Tem certeza que deseja remover este canal?"

---

### 🎯 Fase 9: Documentação (30 minutos)

- [ ] **9.1. Atualizar Documentação**
  - [ ] Adicionar comentários em componentes chave
  - [ ] Documentar props de componentes (JSDoc)
  - [ ] Atualizar README se necessário

- [ ] **9.2. Changelog**
  - [ ] Criar entrada em `doc/CHANGELOG.md`:
    ```markdown
    ## [Unreleased]
    ### Added
    - Gerenciamento de canais integrado ao formulário de empresas
    - 3 main tabs: Tenant | Channels | Usuários (placeholder)
    - Formulário completo de criação/edição de canais WhatsApp
    - Listagem de canais por tenant
    - Validações Zod para canais

    ### Changed
    - TenantForm agora usa estrutura hierárquica de tabs
    - Sub-tabs de tenant movidas para TenantInfoTab
    ```

---

## 🏃 Princípios de Desenvolvimento

### 1. **MVP Mindset**
- ✅ Implementar apenas o necessário para v1
- ✅ Não adicionar features "nice to have"
- ❌ NÃO criar drag & drop para canais (não é crítico)
- ❌ NÃO criar sistema de duplicar canais (pode adicionar depois)

### 2. **Build Checks - OBRIGATÓRIO**

**⚠️ REGRA DE OURO:** Após CADA fase, executar:

```bash
npm run build
```

**Build deve passar SEM erros:**
- ✅ TypeScript compila sem erros
- ✅ Imports corretos (path aliases funcionando)
- ✅ Tipos corretos (sem `any` desnecessário)
- ⚠️ Warnings de Node.js 20.16.0 são aceitáveis

**Se build falhar:**
- 🔴 Fase está INCOMPLETA
- 🔴 NÃO avançar para próxima fase
- 🔴 Corrigir erros antes de continuar

### 3. **Seguir Padrões Existentes**
- ✅ Copiar estrutura de `components/tenants/` (já existe)
- ✅ Seguir nomenclatura de arquivos (PascalCase para componentes)
- ✅ Usar mesmos patterns de validação (Zod)
- ✅ Usar mesmos hooks do projeto (`useForm`, stores Zustand)

### 4. **Code Quality**
- ✅ Componentes pequenos (< 200 linhas idealmente)
- ✅ Separar lógica em seções (ChannelBasicInfoSection, etc)
- ✅ Props tipadas (TypeScript strict)
- ✅ Error handling (try/catch + toasts)
- ✅ Loading states visíveis

---

## 🎯 Fluxo de Usuário

### Cenário 1: Criar Empresa + Canais (Fluxo Completo)

```
1. Super Admin acessa "Gerenciar Empresas"
   └─> Clica em "+ Nova Empresa"

2. Modal/Dialog abre com 3 main tabs: TENANT | CHANNELS | USUÁRIOS

3. Tab "TENANT" (ativa por padrão)
   ├─> Preenche sub-tab "Básico":
   │   ├─ Nome: "Imobiliária XYZ"
   │   ├─ CNPJ: "12.345.678/0001-90"
   │   └─ Telefone: "+55 11 99999-9999"
   │
   ├─> Preenche sub-tab "Téc. Responsável":
   │   ├─ Nome: "João Silva"
   │   ├─ WhatsApp: "+55 11 98888-8888"
   │   └─ Email: "tech@imobiliaraxyz.com"
   │
   ├─> Preenche sub-tab "Fin. Responsável":
   │   └─ (mesma estrutura)
   │
   └─> Preenche sub-tab "Configurações":
       ├─ Neurocore: "Imobiliária"
       ├─ Nicho: "Imobiliária"
       └─ Plano: "Premium"

4. Clica em "Salvar Empresa"
   └─> Sistema:
       1. Valida dados do tenant
       2. Cria tenant no banco
       3. Toast: "Empresa criada com sucesso"
       4. Dialog NÃO fecha (permanece aberto)
       5. tenantId agora está disponível

5. Usuário clica na tab "CHANNELS"
   └─> Vê tela vazia com botão "Novo Canal"

6. Clica em "Novo Canal"
   └─> Modal abre com formulário de canal

7. Preenche seção "Informações Básicas":
   ├─ Nome: "WhatsApp Atendimento"
   ├─ Número: "+55 11 97777-7777"
   ├─ Nome da Instância: "Imobiliária XYZ - Principal"
   └─ Provider: "Evolution API 2.3.6"

8. Preenche seção "Status e Observações":
   ├─ Canal Ativo: ON
   ├─ Recebendo Mensagens: ON
   ├─ Enviando Mensagens: ON
   └─ Observações: "Canal principal de atendimento"

9. Preenche seção "Configurações Técnicas":
   ├─ URL API: "https://api.provider.com/v1"
   ├─ ID Externo: "abc123-def456"
   ├─ Descrição: "Canal WhatsApp principal"
   └─ Tempo de Espera: 8 segundos

10. Clica em "Criar Canal"
    └─> Sistema:
        1. Valida dados do canal
        2. Cria canal no banco (tenant_id vinculado)
        3. Toast: "Canal criado com sucesso"
        4. Modal fecha
        5. Canal aparece na lista da tab "CHANNELS"

11. Pode adicionar mais canais repetindo passos 6-10

12. Clica em "Salvar Empresa" (botão do formulário principal)
    └─> Dialog fecha
    └─> Retorna para lista de empresas
```

---

### Cenário 2: Editar Empresa Existente (Com Canais)

```
1. Super Admin clica em "Editar" em empresa existente

2. Dialog abre mostrando:
   ├─ Tab "TENANT" com dados pré-preenchidos
   ├─ Tab "CHANNELS" (clicável)
   └─ Tab "USUÁRIOS" (disabled)

3. Clica na tab "CHANNELS"
   └─> Sistema carrega canais do tenant
   └─> Exibe lista de canais existentes:
       ├─ Canal 1: "WhatsApp Atendimento" [Editar] [Deletar]
       └─ Canal 2: "WhatsApp Suporte" [Editar] [Deletar]

4. Clica em "Editar" no Canal 1
   └─> Modal abre com formulário pré-preenchido
   └─> Modifica campos
   └─> Clica em "Atualizar Canal"
   └─> Toast: "Canal atualizado com sucesso"

5. Clica em "Deletar" no Canal 2
   └─> Confirmação: "Tem certeza?"
   └─> Confirma
   └─> Toast: "Canal removido com sucesso"
   └─> Canal desaparece da lista

6. Pode voltar para tab "TENANT" e modificar dados da empresa

7. Clica em "Salvar Empresa"
   └─> Atualiza dados do tenant
   └─> Dialog fecha
```

---

## 📊 Tempo Total Estimado

| Fase | Tempo |
|------|-------|
| Fase 1: Preparação e Validações | 1 dia |
| Fase 2: Store Zustand | 1 dia |
| Fase 3: Modificar TenantForm | 1 dia |
| Fase 4: Componentes de Channel - Estrutura | 2 dias |
| Fase 5: Componentes de Channel - Formulário | 2 dias |
| Fase 6: Criar UsersTab (Placeholder) | 30 min |
| Fase 7: Testes Funcionais | 2 dias |
| Fase 8: Polimento e UX | 1 dia |
| Fase 9: Documentação | 30 min |
| **TOTAL** | **10-11 dias úteis** |

**Calendário:** ~2 semanas

---

## 🚀 Próximos Passos Após Implementação

### Feature Futura 1: Tab "Usuários" (Completa)

**Descrição:** Implementar gerenciamento completo de usuários do tenant.

**Funcionalidades:**
- Listar usuários do tenant
- Criar novo usuário
- Editar usuário
- Desativar/Ativar usuário
- Definir roles (admin, atendente, etc.)

**Estrutura:**
- Seguir mesmo padrão de ChannelsTab
- `UsersTab.tsx` + `UserList.tsx` + `UserForm.tsx`

---

### Feature Futura 2: Histórico de Alterações

**Descrição:** Exibir histórico de alterações em canais.

**Funcionalidades:**
- Log de criação
- Log de edições (campo alterado, valor antigo, valor novo)
- Quem fez a alteração (user_id)

**Implementação:**
- Usar tabela `contact_data_changes` como referência
- Criar `channel_data_changes`

---

### Feature Futura 3: Status em Tempo Real de Canais

**Descrição:** Integrar com API externa para verificar status real do canal WhatsApp.

**Funcionalidades:**
- Badge: "🟢 Online" / "🔴 Offline"
- Última verificação: timestamp
- Botão "Verificar Status Agora"

---

## 📚 Referências

- Estrutura atual: [src/components/tenants/TenantForm.tsx](src/components/tenants/TenantForm.tsx:1-184)
- Schema do banco: [doc/database-relationships.md](doc/database-relationships.md)
- Padrão de implementação: `doc/planejamento/gerenciar-agentes.md`

---

**Criado em:** 2025-12-08
**Versão:** 1.0
**Status:** 🟡 Planejado
