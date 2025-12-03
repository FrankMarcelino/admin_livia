-- ===================================================================
-- SCRIPT DE CORREÇÃO: Agents de Signum Cursos e Neurocore Demo
-- ===================================================================

-- PASSO 1: Identificar os IDs dos neurocores
-- Execute isso primeiro e COPIE os IDs retornados
SELECT
  id,
  name,
  id_subwork_n8n_neurocore
FROM neurocores
WHERE name IN ('Signum Cursos', 'Neurocore Demo')
ORDER BY name;

-- Resultado esperado:
-- id                                      | name            | id_subwork_n8n_neurocore
-- xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   | Neurocore Demo  | IPtwAs31ERtgIuEt
-- xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   | Signum Cursos   | BiUuanHra22uI6ab

-- ===================================================================
-- PASSO 2: Verificar se há agents órfãos (sem id_neurocore)
-- ===================================================================
SELECT
  id,
  name,
  type,
  reactive,
  id_neurocore,
  created_at
FROM agents
WHERE id_neurocore IS NULL
ORDER BY created_at DESC;

-- ===================================================================
-- PASSO 3: Verificar se há agents com id_neurocore errado
-- ===================================================================
-- Buscar agents que PODEM pertencer a Signum ou Demo mas estão órfãos
SELECT
  a.id,
  a.name,
  a.type,
  a.reactive,
  a.id_neurocore,
  a.created_at
FROM agents a
WHERE a.id_neurocore IS NULL
  OR a.id_neurocore NOT IN (SELECT id FROM neurocores)
ORDER BY a.created_at DESC;

-- ===================================================================
-- PASSO 4: CORREÇÃO - Associar agents ao Signum Cursos
-- ===================================================================
-- ⚠️ ATENÇÃO: Substitua 'UUID-DO-SIGNUM-CURSOS' pelo ID real retornado no PASSO 1
-- ⚠️ Execute este UPDATE somente se você souber quais agents pertencem ao Signum

-- Exemplo de correção (AJUSTE CONFORME NECESSÁRIO):
/*
UPDATE agents
SET id_neurocore = 'UUID-DO-SIGNUM-CURSOS'
WHERE name IN (
  -- Liste aqui os nomes dos agents que pertencem ao Signum Cursos
  'Agent 1 do Signum',
  'Agent 2 do Signum'
);
*/

-- OU, se você sabe os IDs dos agents:
/*
UPDATE agents
SET id_neurocore = 'UUID-DO-SIGNUM-CURSOS'
WHERE id IN (
  'UUID-DO-AGENT-1',
  'UUID-DO-AGENT-2'
);
*/

-- ===================================================================
-- PASSO 5: CORREÇÃO - Associar agents ao Neurocore Demo
-- ===================================================================
-- ⚠️ ATENÇÃO: Substitua 'UUID-DO-NEUROCORE-DEMO' pelo ID real retornado no PASSO 1

-- Exemplo de correção (AJUSTE CONFORME NECESSÁRIO):
/*
UPDATE agents
SET id_neurocore = 'UUID-DO-NEUROCORE-DEMO'
WHERE name IN (
  -- Liste aqui os nomes dos agents que pertencem ao Neurocore Demo
  'Agent Demo 1',
  'Agent Demo 2'
);
*/

-- ===================================================================
-- PASSO 6: VERIFICAÇÃO - Confirmar que a correção funcionou
-- ===================================================================
-- Execute isso após fazer os UPDATEs acima

-- Verificar Signum Cursos
SELECT
  n.name AS neurocore_name,
  a.id AS agent_id,
  a.name AS agent_name,
  a.type,
  a.reactive
FROM neurocores n
LEFT JOIN agents a ON a.id_neurocore = n.id
WHERE n.name = 'Signum Cursos'
ORDER BY a.name;

-- Verificar Neurocore Demo
SELECT
  n.name AS neurocore_name,
  a.id AS agent_id,
  a.name AS agent_name,
  a.type,
  a.reactive
FROM neurocores n
LEFT JOIN agents a ON a.id_neurocore = n.id
WHERE n.name = 'Neurocore Demo'
ORDER BY a.name;

-- ===================================================================
-- PASSO 7: Verificar contadores após correção
-- ===================================================================
SELECT
  n.name AS neurocore_name,
  COUNT(a.id) AS agent_count,
  array_agg(a.name) FILTER (WHERE a.name IS NOT NULL) AS agent_names
FROM neurocores n
LEFT JOIN agents a ON a.id_neurocore = n.id
WHERE n.name IN ('Signum Cursos', 'Neurocore Demo')
GROUP BY n.id, n.name
ORDER BY n.name;

-- ===================================================================
-- INFORMAÇÕES ADICIONAIS
-- ===================================================================

-- Se você precisar criar agents novos para teste:
/*
-- Para Signum Cursos
INSERT INTO agents (name, type, id_neurocore, reactive)
VALUES
  ('Recepcionista Signum', 'support', 'UUID-DO-SIGNUM-CURSOS', true),
  ('Vendedor Signum', 'sales', 'UUID-DO-SIGNUM-CURSOS', false);

-- Para Neurocore Demo
INSERT INTO agents (name, type, id_neurocore, reactive)
VALUES
  ('Agent Demo 1', 'support', 'UUID-DO-NEUROCORE-DEMO', true),
  ('Agent Demo 2', 'general', 'UUID-DO-NEUROCORE-DEMO', false);
*/
