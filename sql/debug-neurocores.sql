-- ===================================================================
-- SCRIPT DE DIAGNÓSTICO: Neurocores e Agents
-- Execute no Supabase SQL Editor
-- ===================================================================

-- 1. Verificar se os neurocores existem
SELECT
  id,
  name,
  id_subwork_n8n_neurocore,
  is_active,
  created_at
FROM neurocores
WHERE name IN ('signum cursos', 'neurocore demo')
ORDER BY name;

-- 2. Verificar quantos agents cada neurocore tem
SELECT
  n.name AS neurocore_name,
  n.id AS neurocore_id,
  COUNT(a.id) AS agent_count
FROM neurocores n
LEFT JOIN agents a ON a.id_neurocore = n.id
WHERE n.name IN ('signum cursos', 'neurocore demo')
GROUP BY n.id, n.name
ORDER BY n.name;

-- 3. Listar agents desses neurocores
SELECT
  n.name AS neurocore_name,
  a.id AS agent_id,
  a.name AS agent_name,
  a.type AS agent_type,
  a.reactive,
  a.id_neurocore,
  a.created_at
FROM neurocores n
LEFT JOIN agents a ON a.id_neurocore = n.id
WHERE n.name IN ('signum cursos', 'neurocore demo')
ORDER BY n.name, a.name;

-- 4. Verificar se há agents órfãos (sem id_neurocore)
SELECT
  id,
  name,
  type,
  id_neurocore,
  created_at
FROM agents
WHERE id_neurocore IS NULL
ORDER BY name;

-- 5. Verificar se há problema de tipo de dados
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'agents'
  AND column_name IN ('id', 'id_neurocore', 'name', 'type')
ORDER BY ordinal_position;

-- 6. Verificar constraints e foreign keys (agents)
SELECT
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'agents'
  AND tc.constraint_type = 'FOREIGN KEY'
  AND kcu.column_name = 'id_neurocore';

-- ===================================================================
-- DIAGNÓSTICO DE TENANTS
-- ===================================================================

-- 7. Verificar quantos tenants cada neurocore tem
SELECT
  n.name AS neurocore_name,
  n.id AS neurocore_id,
  COUNT(t.id) AS tenant_count
FROM neurocores n
LEFT JOIN tenants t ON t.neurocore_id = n.id
WHERE n.name IN ('signum cursos', 'neurocore demo')
GROUP BY n.id, n.name
ORDER BY n.name;

-- 8. Listar tenants que usam esses neurocores
SELECT
  n.name AS neurocore_name,
  t.id AS tenant_id,
  t.name AS tenant_name,
  t.cnpj,
  t.plan,
  t.is_active,
  t.neurocore_id,
  t.created_at
FROM neurocores n
LEFT JOIN tenants t ON t.neurocore_id = n.id
WHERE n.name IN ('signum cursos', 'neurocore demo')
ORDER BY n.name, t.name;

-- 9. Verificar se há tenants sem neurocore_id
SELECT
  id,
  name,
  cnpj,
  neurocore_id,
  created_at
FROM tenants
WHERE neurocore_id IS NULL
ORDER BY name;

-- 10. Verificar todos os tenants e seus neurocores
SELECT
  t.name AS tenant_name,
  t.cnpj,
  t.neurocore_id,
  n.name AS neurocore_name
FROM tenants t
LEFT JOIN neurocores n ON n.id = t.neurocore_id
ORDER BY t.name;

-- 11. Verificar foreign key de tenants → neurocores
SELECT
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'tenants'
  AND tc.constraint_type = 'FOREIGN KEY'
  AND kcu.column_name = 'neurocore_id';
