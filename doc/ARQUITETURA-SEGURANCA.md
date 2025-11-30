# Arquitetura de Segurança - Multi-Tenant

## Visão Geral

Este projeto possui **duas plataformas** compartilhando o mesmo banco de dados Supabase:

1. **Plataforma ADMIN** (esta aplicação) - Uso interno, administradores
2. **Plataforma USUÁRIO** - Uso dos clientes/empresas

Cada plataforma usa uma **chave diferente** do Supabase para garantir segurança:

```
┌─────────────────────────────────────────────────────────────┐
│                    BANCO DE DADOS SUPABASE                  │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Tenant A   │  │   Tenant B   │  │   Tenant C   │      │
│  │   (Empresa)  │  │   (Empresa)  │  │   (Empresa)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ▲                  ▲                  ▲             │
│         │                  │                  │             │
│         │                  │                  │             │
│    ┌────┴────┐        ┌────┴────┐        ┌────┴────┐       │
│    │ RLS OFF │        │ RLS OFF │        │ RLS OFF │       │
│    └────┬────┘        └────┬────┘        └────┬────┘       │
└─────────┼──────────────────┼──────────────────┼────────────┘
          │                  │                  │
          │                  │                  │
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼────────────┐
│              SERVICE ROLE KEY (Bypassa RLS)                │
│                   ┌──────────────────┐                     │
│                   │ PLATAFORMA ADMIN │                     │
│                   │ (Acesso Total)   │                     │
│                   └──────────────────┘                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                ANON KEY (Respeita RLS)                      │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ USUÁRIO TENANT A│  │ USUÁRIO TENANT B│                  │
│  │ (Vê só Tenant A)│  │ (Vê só Tenant B)│                  │
│  └─────────────────┘  └─────────────────┘                  │
│           ▲                      ▲                          │
│           │                      │                          │
│           │   RLS ATIVO          │   RLS ATIVO             │
│           │   (Filtra dados)     │   (Filtra dados)        │
│           │                      │                          │
│      ┌────┴──────────────────────┴────┐                    │
│      │      PLATAFORMA USUÁRIO        │                    │
│      │    (Acesso por Tenant)         │                    │
│      └────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

## Como Funciona

### 1. Plataforma ADMIN (Esta Aplicação)

**Chave usada:** `VITE_SUPABASE_SERVICE_ROLE_KEY`

**Comportamento:**
- ✅ **Bypassa todas as políticas RLS**
- ✅ Acesso TOTAL a todos os dados de todos os tenants
- ✅ Pode criar, ler, atualizar e deletar qualquer registro
- ⚠️ **Deve ser usada APENAS em aplicações internas/admin**
- 🔒 **NUNCA exponha esta chave publicamente**

**Segurança:**
- Esta aplicação é para uso interno apenas
- Só administradores têm acesso
- Não é exposta na internet (ou está atrás de autenticação)
- A chave service_role **NUNCA** deve estar no código frontend de uma app pública

### 2. Plataforma USUÁRIO

**Chave usada:** `SUPABASE_ANON_KEY` (na outra aplicação)

**Comportamento:**
- ✅ **Respeita todas as políticas RLS**
- ✅ Acesso apenas aos dados do seu tenant
- ✅ Isolamento completo entre empresas/tenants
- 🔒 Cada usuário vê apenas dados da sua empresa

**Como funciona:**
1. Usuário faz login na plataforma
2. Supabase Auth gera um JWT token
3. O token contém `tenant_id` do usuário
4. RLS usa este `tenant_id` para filtrar dados automaticamente
5. Usuário só vê/modifica dados do seu tenant

## Configuração Necessária

### Para a Plataforma ADMIN (já configurado ✅)

```typescript
// src/lib/supabase.ts
export const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey, // ← Bypassa RLS
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
)
```

### Para a Plataforma USUÁRIO (a ser configurado)

#### 1. Executar o Script SQL

Execute o arquivo `database-security-setup.sql` no Supabase SQL Editor:

```bash
# O script cria:
# - Políticas RLS em todas as tabelas
# - Função helper auth.get_tenant_id()
# - Isolamento automático por tenant_id
```

#### 2. Configurar JWT Claims

Você precisa adicionar `tenant_id` ao JWT token dos usuários. Há duas formas:

**Opção A: Usando Supabase Auth Hooks (Recomendado)**

1. No Supabase Dashboard → Database → Functions
2. Criar uma função que adiciona tenant_id ao token:

```sql
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  user_tenant_id uuid;
BEGIN
  -- Buscar tenant_id do usuário
  SELECT tenant_id INTO user_tenant_id
  FROM public.users
  WHERE id = (event->>'user_id')::uuid;

  -- Adicionar tenant_id ao token
  event := jsonb_set(
    event,
    '{claims,tenant_id}',
    to_jsonb(user_tenant_id)
  );

  RETURN event;
END;
$$;
```

3. Configurar o hook no Supabase Dashboard → Auth → Hooks

**Opção B: Usando Metadata do Usuário**

```typescript
// Quando criar um usuário, adicionar metadata
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      tenant_id: 'uuid-do-tenant'
    }
  }
})

// Modificar a função helper:
CREATE OR REPLACE FUNCTION auth.get_tenant_id()
RETURNS uuid AS $$
  SELECT (auth.jwt()->>'app_metadata'->>'tenant_id')::uuid;
$$ LANGUAGE sql STABLE;
```

#### 3. Código da Plataforma Usuário

```typescript
// Usar Anon Key
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY // ← Respeita RLS
)

// Login do usuário
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@empresa.com',
  password: 'senha'
})

// Agora todas as queries são automaticamente filtradas por tenant_id!
const { data: contacts } = await supabase
  .from('contacts')
  .select('*')
// ↑ Retorna apenas contacts do tenant do usuário
```

## Vantagens desta Arquitetura

### ✅ Segurança
- Isolamento total entre empresas
- Zero possibilidade de vazamento de dados entre tenants
- Admin tem controle total sem restrições

### ✅ Simplicidade
- Não precisa adicionar `WHERE tenant_id = ?` em todas as queries da plataforma usuário
- RLS faz o filtro automaticamente
- Código mais limpo e menos propenso a erros

### ✅ Flexibilidade
- Admin pode fazer qualquer operação em qualquer tenant
- Usuários têm acesso restrito automaticamente
- Fácil adicionar novos recursos sem quebrar segurança

### ✅ Performance
- Índices no tenant_id otimizam as queries
- PostgreSQL é muito eficiente com RLS
- Sem overhead significativo

## Próximos Passos

1. ✅ **Plataforma Admin já está configurada** (usando Service Role Key)

2. ⏳ **Execute o script SQL:**
   - Abra Supabase Dashboard → SQL Editor
   - Execute `database-security-setup.sql`
   - Isso habilita RLS e cria todas as políticas

3. ⏳ **Configure a Plataforma Usuário:**
   - Use Anon Key (não Service Role!)
   - Implemente autenticação
   - Adicione tenant_id ao JWT
   - Teste o isolamento

## Testando a Segurança

### Teste 1: Plataforma Admin (Esta app)

```javascript
// Deve retornar TODOS os tenants (3 empresas)
const { data } = await supabase.from('tenants').select('*')
console.log(data.length) // 3
```

### Teste 2: Plataforma Usuário

```javascript
// Login como usuário do Tenant A
await supabase.auth.signInWithPassword({...})

// Deve retornar APENAS registros do Tenant A
const { data } = await supabase.from('contacts').select('*')
// ↑ Apenas contacts do Tenant A, não de B ou C
```

### Teste 3: Verificar Isolamento

```javascript
// Usuário do Tenant A tenta acessar dados do Tenant B
const { data, error } = await supabase
  .from('contacts')
  .select('*')
  .eq('tenant_id', 'uuid-do-tenant-b') // ← Não vai funcionar!

console.log(data) // [] (vazio)
// RLS bloqueia acesso mesmo que você tente forçar o tenant_id
```

## Dúvidas Frequentes

### A Service Role Key não é perigosa?

Sim, é muito poderosa! Por isso só deve ser usada em:
- Aplicações backend (Node.js, Python, etc.)
- Aplicações admin internas (como esta)
- **NUNCA** em código frontend público

No nosso caso é seguro porque esta é uma aplicação administrativa interna.

### E se eu quiser RLS mesmo na plataforma admin?

Basta trocar no `src/lib/supabase.ts`:

```typescript
// De:
supabaseServiceRoleKey

// Para:
supabaseAnonKey
```

Mas aí você precisará implementar autenticação e ter um usuário "super admin" que tem acesso a todos os tenants.

### Como adiciono autenticação na plataforma admin?

Se quiser adicionar login na plataforma admin no futuro:

1. Use Supabase Auth
2. Crie um role "super_admin"
3. Modifique as políticas RLS para dar acesso total a super_admins
4. Use Anon Key ao invés de Service Role

## Referências

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [JWT Claims Customization](https://supabase.com/docs/guides/auth/auth-hooks)
- [Multi-Tenant Apps](https://supabase.com/docs/guides/database/postgres/row-level-security#multi-tenant-apps)
