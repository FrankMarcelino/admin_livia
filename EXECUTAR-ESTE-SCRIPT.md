# ✅ Execute ESTE Script SQL (Versão Corrigida)

## ⚡ Passo a Passo Rápido

### 1️⃣ Acesse o Supabase SQL Editor

1. Vá para: https://app.supabase.com
2. Selecione seu projeto
3. Clique em **SQL Editor** no menu lateral
4. Clique em **New Query**

### 2️⃣ Execute o Script Corrigido

1. Abra o arquivo: **`database-security-setup-FIXED.sql`**
2. Copie TODO o conteúdo
3. Cole no SQL Editor
4. Clique em **Run** (ou Ctrl+Enter)

✅ **Deve executar sem erros!**

---

## ❓ O que mudou?

### Problema Original:
```sql
-- ❌ ERRO: permission denied for schema auth
CREATE FUNCTION auth.get_tenant_id() ...
```

### Solução:
```sql
-- ✅ Agora criamos a função no schema public
CREATE FUNCTION public.get_user_tenant_id() ...
```

---

## 📋 O que o Script Faz?

### 1. Habilita RLS nas Tabelas Multi-Tenant
```sql
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
-- ... e outras
```

### 2. Desabilita RLS nas Tabelas Compartilhadas
```sql
ALTER TABLE neurocores DISABLE ROW LEVEL SECURITY;
ALTER TABLE niches DISABLE ROW LEVEL SECURITY;
-- ... (estas são compartilhadas entre todos)
```

### 3. Cria Função Helper
```sql
CREATE FUNCTION public.get_user_tenant_id()
-- Esta função pega o tenant_id do JWT token
```

### 4. Cria Políticas de Segurança
```sql
-- Exemplo: Usuários só veem contacts do seu tenant
CREATE POLICY "Users can view contacts from their tenant"
  ON contacts
  FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());
```

---

## ✅ Verificar se Funcionou

Após executar o script, rode esta query no SQL Editor:

```sql
SELECT
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Você deve ver várias políticas criadas (cerca de 15-20 linhas).

---

## 🎯 Resultado Final

Agora você tem:

### ✅ Plataforma Admin (esta app)
- Usa **Service Role Key**
- Bypassa RLS
- Acesso total a todos os dados
- **Funcionando agora!** (empresas aparecem)

### ✅ Plataforma Usuário (protegida)
- Usa **Anon Key**
- Respeita RLS
- Cada usuário vê apenas dados do seu tenant
- **Isolamento garantido!**

---

## 🔧 Próximo Passo (Para Plataforma Usuário)

Para a plataforma de usuário funcionar com RLS, você precisa adicionar `tenant_id` ao JWT token.

Há 2 formas de fazer isso (escolha uma):

### Opção 1: Auth Hook (Recomendado)

1. No Supabase Dashboard → Database → Functions
2. Crie esta função:

```sql
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  user_tenant_id uuid;
BEGIN
  -- Buscar tenant_id do usuário
  SELECT tenant_id INTO user_tenant_id
  FROM public.users
  WHERE id = (event->>'user_id')::uuid;

  -- Adicionar ao token
  event := jsonb_set(
    event,
    '{claims,tenant_id}',
    to_jsonb(user_tenant_id::text)
  );

  RETURN event;
END;
$$;
```

3. Ative em: **Auth → Hooks → Custom Access Token Hook**

### Opção 2: User Metadata (Mais simples)

Quando criar usuários, adicione tenant_id:

```typescript
await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      tenant_id: 'uuid-do-tenant'
    }
  }
})
```

E modifique a função helper para usar metadata:

```sql
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS uuid AS $$
  SELECT (
    auth.jwt()->>'app_metadata'->>'tenant_id'
  )::uuid;
$$ LANGUAGE sql STABLE;
```

---

## ❓ Dúvidas?

- A plataforma admin **já está funcionando** (empresas aparecem)
- O script RLS é para **proteger a plataforma de usuário**
- Se você não tiver plataforma de usuário ainda, pode executar o script depois
- Mas é recomendado executar **agora** para já deixar a segurança configurada

---

## 📚 Mais Informações

Leia: **`ARQUITETURA-SEGURANCA.md`** para entender toda a arquitetura.
