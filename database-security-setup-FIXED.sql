-- ============================================================================
-- CONFIGURAÇÃO DE SEGURANÇA DO BANCO DE DADOS - VERSÃO CORRIGIDA
-- ============================================================================
--
-- ARQUITETURA:
-- 1. Plataforma ADMIN (esta): Usa Service Role Key → Bypassa RLS → Acesso Total
-- 2. Plataforma USUÁRIO: Usa Anon Key → RLS Ativo → Acesso por Tenant
--
-- Este script configura RLS para proteger a plataforma de usuário mantendo
-- a flexibilidade da plataforma admin.
-- ============================================================================

-- ============================================================================
-- STEP 1: HABILITAR RLS EM TODAS AS TABELAS RELEVANTES
-- ============================================================================

-- Tabelas principais
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE base_conhecimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE synapses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_reply_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_data_changes ENABLE ROW LEVEL SECURITY;

-- Tabelas compartilhadas (sem tenant_id) - Desabilitar RLS
ALTER TABLE neurocores DISABLE ROW LEVEL SECURITY;
ALTER TABLE niches DISABLE ROW LEVEL SECURITY;
ALTER TABLE channel_providers DISABLE ROW LEVEL SECURITY;
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: CRIAR FUNÇÃO HELPER PARA OBTER TENANT_ID DO JWT (NO SCHEMA PUBLIC)
-- ============================================================================

-- Esta função extrai o tenant_id do JWT token do usuário autenticado
-- Criada no schema PUBLIC para evitar erro de permissão
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    -- Tenta pegar do custom claim
    NULLIF(current_setting('request.jwt.claims', true)::json->>'tenant_id', '')::uuid,
    -- Se não existir, tenta pegar do user_id (se user_id for igual ao tenant_id)
    NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::uuid,
    -- Fallback para NULL
    NULL::uuid
  );
$$;

-- ============================================================================
-- STEP 3: POLÍTICAS RLS PARA TABELA TENANTS
-- ============================================================================

-- Permite que usuários vejam apenas seu próprio tenant
DROP POLICY IF EXISTS "Users can view their own tenant" ON tenants;
CREATE POLICY "Users can view their own tenant"
  ON tenants
  FOR SELECT
  USING (id = public.get_user_tenant_id());

-- Permite que usuários atualizem apenas seu próprio tenant
DROP POLICY IF EXISTS "Users can update their own tenant" ON tenants;
CREATE POLICY "Users can update their own tenant"
  ON tenants
  FOR UPDATE
  USING (id = public.get_user_tenant_id())
  WITH CHECK (id = public.get_user_tenant_id());

-- ============================================================================
-- STEP 4: POLÍTICAS RLS PARA TABELA USERS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view users from their tenant" ON users;
CREATE POLICY "Users can view users from their tenant"
  ON users
  FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

DROP POLICY IF EXISTS "Users can update users from their tenant" ON users;
CREATE POLICY "Users can update users from their tenant"
  ON users
  FOR UPDATE
  USING (tenant_id = public.get_user_tenant_id())
  WITH CHECK (tenant_id = public.get_user_tenant_id());

DROP POLICY IF EXISTS "Users can insert users to their tenant" ON users;
CREATE POLICY "Users can insert users to their tenant"
  ON users
  FOR INSERT
  WITH CHECK (tenant_id = public.get_user_tenant_id());

-- ============================================================================
-- STEP 5: POLÍTICAS RLS PARA TABELA CONTACTS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view contacts from their tenant" ON contacts;
CREATE POLICY "Users can view contacts from their tenant"
  ON contacts
  FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

DROP POLICY IF EXISTS "Users can manage contacts from their tenant" ON contacts;
CREATE POLICY "Users can manage contacts from their tenant"
  ON contacts
  FOR ALL
  USING (tenant_id = public.get_user_tenant_id())
  WITH CHECK (tenant_id = public.get_user_tenant_id());

-- ============================================================================
-- STEP 6: POLÍTICAS RLS PARA TABELA CONVERSATIONS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view conversations from their tenant" ON conversations;
CREATE POLICY "Users can view conversations from their tenant"
  ON conversations
  FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

DROP POLICY IF EXISTS "Users can manage conversations from their tenant" ON conversations;
CREATE POLICY "Users can manage conversations from their tenant"
  ON conversations
  FOR ALL
  USING (tenant_id = public.get_user_tenant_id())
  WITH CHECK (tenant_id = public.get_user_tenant_id());

-- ============================================================================
-- STEP 7: POLÍTICAS RLS PARA TABELA MESSAGES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view messages from their tenant conversations" ON messages;
CREATE POLICY "Users can view messages from their tenant conversations"
  ON messages
  FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE tenant_id = public.get_user_tenant_id()
    )
  );

DROP POLICY IF EXISTS "Users can insert messages to their tenant conversations" ON messages;
CREATE POLICY "Users can insert messages to their tenant conversations"
  ON messages
  FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE tenant_id = public.get_user_tenant_id()
    )
  );

DROP POLICY IF EXISTS "Users can update messages from their tenant conversations" ON messages;
CREATE POLICY "Users can update messages from their tenant conversations"
  ON messages
  FOR UPDATE
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE tenant_id = public.get_user_tenant_id()
    )
  )
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE tenant_id = public.get_user_tenant_id()
    )
  );

-- ============================================================================
-- STEP 8: POLÍTICAS RLS PARA OUTRAS TABELAS
-- ============================================================================

-- CHANNELS
DROP POLICY IF EXISTS "Users can manage channels from their tenant" ON channels;
CREATE POLICY "Users can manage channels from their tenant"
  ON channels
  FOR ALL
  USING (tenant_id = public.get_user_tenant_id())
  WITH CHECK (tenant_id = public.get_user_tenant_id());

-- BASE_CONHECIMENTOS
DROP POLICY IF EXISTS "Users can manage knowledge bases from their tenant" ON base_conhecimentos;
CREATE POLICY "Users can manage knowledge bases from their tenant"
  ON base_conhecimentos
  FOR ALL
  USING (tenant_id = public.get_user_tenant_id())
  WITH CHECK (tenant_id = public.get_user_tenant_id());

-- SYNAPSES
DROP POLICY IF EXISTS "Users can manage synapses from their tenant" ON synapses;
CREATE POLICY "Users can manage synapses from their tenant"
  ON synapses
  FOR ALL
  USING (tenant_id = public.get_user_tenant_id())
  WITH CHECK (tenant_id = public.get_user_tenant_id());

-- QUICK_REPLY_TEMPLATES
DROP POLICY IF EXISTS "Users can manage quick replies from their tenant" ON quick_reply_templates;
CREATE POLICY "Users can manage quick replies from their tenant"
  ON quick_reply_templates
  FOR ALL
  USING (tenant_id = public.get_user_tenant_id())
  WITH CHECK (tenant_id = public.get_user_tenant_id());

-- TAGS
DROP POLICY IF EXISTS "Users can manage tags from their tenant" ON tags;
CREATE POLICY "Users can manage tags from their tenant"
  ON tags
  FOR ALL
  USING (id_tenant = public.get_user_tenant_id())
  WITH CHECK (id_tenant = public.get_user_tenant_id());

-- CONVERSATION_TAGS
DROP POLICY IF EXISTS "Users can manage conversation tags from their tenant" ON conversation_tags;
CREATE POLICY "Users can manage conversation tags from their tenant"
  ON conversation_tags
  FOR ALL
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE tenant_id = public.get_user_tenant_id()
    )
  )
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE tenant_id = public.get_user_tenant_id()
    )
  );

-- MESSAGE_FEEDBACK
DROP POLICY IF EXISTS "Users can manage feedback from their tenant" ON message_feedback;
CREATE POLICY "Users can manage feedback from their tenant"
  ON message_feedback
  FOR ALL
  USING (tenant_id = public.get_user_tenant_id())
  WITH CHECK (tenant_id = public.get_user_tenant_id());

-- CONTACT_DATA_CHANGES
DROP POLICY IF EXISTS "Users can view contact changes from their tenant" ON contact_data_changes;
CREATE POLICY "Users can view contact changes from their tenant"
  ON contact_data_changes
  FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

DROP POLICY IF EXISTS "Users can insert contact changes to their tenant" ON contact_data_changes;
CREATE POLICY "Users can insert contact changes to their tenant"
  ON contact_data_changes
  FOR INSERT
  WITH CHECK (tenant_id = public.get_user_tenant_id());

-- ============================================================================
-- VERIFICAÇÃO DAS POLÍTICAS
-- ============================================================================

-- Execute esta query para verificar todas as políticas criadas:
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
--
-- 1. A Service Role Key BYPASSA todas estas políticas RLS
--    → Plataforma Admin tem acesso total
--
-- 2. A Anon Key RESPEITA todas estas políticas RLS
--    → Plataforma Usuário só vê dados do seu tenant
--
-- 3. Para a plataforma de usuário funcionar, você precisa:
--    a) Autenticar o usuário com Supabase Auth
--    b) Incluir tenant_id no JWT token (claims customizados)
--
-- 4. Como adicionar tenant_id ao JWT - OPÇÃO 1 (Recomendada):
--    Use um Hook do Supabase Auth para adicionar tenant_id ao token:
--
--    a) No Supabase Dashboard → Database → Functions, crie:
--
--    CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
--    RETURNS jsonb
--    LANGUAGE plpgsql
--    STABLE
--    AS $$
--    DECLARE
--      user_tenant_id uuid;
--    BEGIN
--      -- Buscar tenant_id do usuário na tabela users
--      SELECT tenant_id INTO user_tenant_id
--      FROM public.users
--      WHERE id = (event->>'user_id')::uuid;
--
--      -- Adicionar tenant_id aos claims do token
--      event := jsonb_set(
--        event,
--        '{claims,tenant_id}',
--        to_jsonb(user_tenant_id::text)
--      );
--
--      RETURN event;
--    END;
--    $$;
--
--    b) Ative o hook em: Auth → Hooks → Custom Access Token Hook
--
-- 5. Como adicionar tenant_id ao JWT - OPÇÃO 2 (Mais simples):
--    Ao criar usuário na plataforma, adicione tenant_id aos custom claims
--
-- ============================================================================
