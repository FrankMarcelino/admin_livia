-- ============================================================================
-- FIX RLS POLICIES FOR TENANTS TABLE
-- Este script corrige as políticas RLS para permitir acesso aos dados
-- ============================================================================

-- OPÇÃO 1: Desabilitar RLS (mais simples, menos seguro)
-- Use esta opção se esta é uma aplicação de desenvolvimento/admin
-- ============================================================================
ALTER TABLE tenants DISABLE ROW LEVEL SECURITY;

-- OPÇÃO 2: Habilitar RLS com políticas permissivas (mais seguro)
-- Comente a linha acima e descomente as linhas abaixo se preferir usar RLS
-- ============================================================================
-- Primeiro, habilita RLS na tabela
-- ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir SELECT (leitura) para todos
-- DROP POLICY IF EXISTS "Enable read access for all users" ON tenants;
-- CREATE POLICY "Enable read access for all users"
--   ON tenants
--   FOR SELECT
--   USING (true);

-- Criar política para permitir INSERT (criação) para todos
-- DROP POLICY IF EXISTS "Enable insert access for all users" ON tenants;
-- CREATE POLICY "Enable insert access for all users"
--   ON tenants
--   FOR INSERT
--   WITH CHECK (true);

-- Criar política para permitir UPDATE (atualização) para todos
-- DROP POLICY IF EXISTS "Enable update access for all users" ON tenants;
-- CREATE POLICY "Enable update access for all users"
--   ON tenants
--   FOR UPDATE
--   USING (true)
--   WITH CHECK (true);

-- Criar política para permitir DELETE (exclusão) para todos
-- DROP POLICY IF EXISTS "Enable delete access for all users" ON tenants;
-- CREATE POLICY "Enable delete access for all users"
--   ON tenants
--   FOR DELETE
--   USING (true);

-- ============================================================================
-- Aplicar o mesmo para as tabelas relacionadas
-- ============================================================================

-- Desabilitar RLS nas tabelas relacionadas (necessário para os JOINs funcionarem)
ALTER TABLE neurocores DISABLE ROW LEVEL SECURITY;
ALTER TABLE niches DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- VERIFICAR SE AS POLÍTICAS FORAM APLICADAS
-- ============================================================================
-- Execute esta query depois de aplicar as políticas acima:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename IN ('tenants', 'neurocores', 'niches');
