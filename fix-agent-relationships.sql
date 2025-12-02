-- ===================================================================
-- SCRIPT DE CORREÇÃO: Relacionamento Agents ↔ Neurocores
-- Execute no Supabase SQL Editor SOMENTE SE O DIAGNÓSTICO MOSTRAR PROBLEMA
-- ===================================================================

-- IMPORTANTE: Execute os scripts de diagnóstico primeiro!
-- Só execute este script se você confirmar que os agents não têm id_neurocore

-- ===================================================================
-- OPÇÃO 1: Se você souber quais agents pertencem a qual neurocore
-- ===================================================================

-- Exemplo: Atualizar agents específicos para um neurocore específico
-- Substitua os IDs pelos IDs reais do seu banco

-- 1. Primeiro, liste os IDs dos neurocores
SELECT id, name FROM neurocores WHERE name IN ('signum cursos', 'neurocore demo');

-- 2. Liste os agents que precisam ser associados
SELECT id, name, id_neurocore FROM agents WHERE id_neurocore IS NULL;

-- 3. Atualize os agents com o id_neurocore correto
-- EXEMPLO (AJUSTE OS IDs):
/*
UPDATE agents
SET id_neurocore = 'UUID-DO-NEUROCORE-SIGNUM'
WHERE name IN ('Agent 1', 'Agent 2', 'Agent 3');

UPDATE agents
SET id_neurocore = 'UUID-DO-NEUROCORE-DEMO'
WHERE name IN ('Agent 4', 'Agent 5');
*/

-- ===================================================================
-- OPÇÃO 2: Se havia um campo antigo de relacionamento (array)
-- ===================================================================

-- Se havia um campo "associated_neurocores" nos agents (schema antigo):
-- Verifique primeiro se esse campo existe:
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name = 'agents' AND column_name = 'associated_neurocores';

-- Se existir, migre os dados:
/*
UPDATE agents
SET id_neurocore = (associated_neurocores[1])::uuid
WHERE associated_neurocores IS NOT NULL
  AND array_length(associated_neurocores, 1) > 0
  AND id_neurocore IS NULL;
*/

-- ===================================================================
-- OPÇÃO 3: Criar agents de teste para cada neurocore
-- ===================================================================

-- Se você quiser criar agents de teste para testar a funcionalidade:
/*
-- Para Signum Cursos
INSERT INTO agents (name, type, id_neurocore, reactive)
SELECT
  'Agent ' || generate_series || ' - Signum',
  'support',
  n.id,
  true
FROM generate_series(1, 3), neurocores n
WHERE n.name = 'signum cursos';

-- Para Neurocore Demo
INSERT INTO agents (name, type, id_neurocore, reactive)
SELECT
  'Agent ' || generate_series || ' - Demo',
  'sales',
  n.id,
  false
FROM generate_series(1, 2), neurocores n
WHERE n.name = 'neurocore demo';
*/

-- ===================================================================
-- VERIFICAÇÃO PÓS-CORREÇÃO
-- ===================================================================

-- Execute isso após fazer as correções para verificar se funcionou:
SELECT
  n.name AS neurocore_name,
  COUNT(a.id) AS agent_count,
  array_agg(a.name) AS agent_names
FROM neurocores n
LEFT JOIN agents a ON a.id_neurocore = n.id
WHERE n.name IN ('signum cursos', 'neurocore demo')
GROUP BY n.id, n.name
ORDER BY n.name;
