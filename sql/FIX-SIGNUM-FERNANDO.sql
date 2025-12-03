-- ===================================================================
-- CORREÇÃO: Associar agent "Signum - Fernando" ao Neurocore Signum Cursos
-- ===================================================================

-- PASSO 1: Verificar os dados antes da correção
-- Execute isso primeiro para confirmar

SELECT 'ANTES DA CORREÇÃO' as status;

-- Ver o agent órfão
SELECT
  id,
  name,
  type,
  id_neurocore,
  reactive
FROM agents
WHERE id = 'f1f2f567-975e-4a14-8cfe-8433204899f0';

-- Ver o neurocore do Signum
SELECT
  id,
  name,
  id_subwork_n8n_neurocore,
  is_active
FROM neurocores
WHERE id = 'e266d1f8-1cc1-4db2-b0f5-4d14c9e5e2b4';

-- Ver quantos agents o Signum tem atualmente
SELECT
  n.name as neurocore_name,
  COUNT(a.id) as agent_count,
  array_agg(a.name) FILTER (WHERE a.name IS NOT NULL) as agent_names
FROM neurocores n
LEFT JOIN agents a ON a.id_neurocore = n.id
WHERE n.id = 'e266d1f8-1cc1-4db2-b0f5-4d14c9e5e2b4'
GROUP BY n.name;

-- ===================================================================
-- PASSO 2: EXECUTAR A CORREÇÃO
-- ===================================================================

-- Associar o agent "Signum - Fernando" ao neurocore Signum Cursos
UPDATE agents
SET id_neurocore = 'e266d1f8-1cc1-4db2-b0f5-4d14c9e5e2b4'
WHERE id = 'f1f2f567-975e-4a14-8cfe-8433204899f0';

-- Mensagem de sucesso
SELECT '✅ Agent associado com sucesso!' as status;

-- ===================================================================
-- PASSO 3: VERIFICAR APÓS A CORREÇÃO
-- ===================================================================

SELECT 'DEPOIS DA CORREÇÃO' as status;

-- Ver o agent atualizado
SELECT
  id,
  name,
  type,
  id_neurocore,
  reactive
FROM agents
WHERE id = 'f1f2f567-975e-4a14-8cfe-8433204899f0';

-- Ver todos os agents do Signum Cursos
SELECT
  n.name as neurocore_name,
  a.id as agent_id,
  a.name as agent_name,
  a.type,
  a.reactive
FROM neurocores n
LEFT JOIN agents a ON a.id_neurocore = n.id
WHERE n.id = 'e266d1f8-1cc1-4db2-b0f5-4d14c9e5e2b4'
ORDER BY a.name;

-- Verificar contagem final
SELECT
  n.name as neurocore_name,
  COUNT(a.id) as agent_count
FROM neurocores n
LEFT JOIN agents a ON a.id_neurocore = n.id
WHERE n.id = 'e266d1f8-1cc1-4db2-b0f5-4d14c9e5e2b4'
GROUP BY n.name;

-- ===================================================================
-- RESULTADO ESPERADO
-- ===================================================================
-- Após executar este script, você deve ver:
-- - Agent "Signum - Fernando" com id_neurocore preenchido
-- - Signum Cursos com 1 agent
-- - Na tabela de neurocores, coluna "Agents" deve mostrar "1"
