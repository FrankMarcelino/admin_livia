-- ===================================================================
-- CRIAR AGENTS PARA NEUROCORE DEMO
-- ===================================================================

-- PASSO 1: Verificar se o Neurocore Demo existe
SELECT
  id,
  name,
  id_subwork_n8n_neurocore,
  is_active
FROM neurocores
WHERE id = 'd9d3f30f-d36b-4f39-8468-e3e65fe955c9';

-- Resultado esperado: 1 linha com "Neurocore Demo" ou nome similar

-- ===================================================================
-- PASSO 2: Criar agents para o Neurocore Demo
-- ===================================================================

INSERT INTO agents (name, type, id_neurocore, reactive)
VALUES
  ('Demo - Recepcionista', 'attendant', 'd9d3f30f-d36b-4f39-8468-e3e65fe955c9', true),
  ('Demo - Suporte Técnico', 'attendant', 'd9d3f30f-d36b-4f39-8468-e3e65fe955c9', true),
  ('Demo - Vendas', 'attendant', 'd9d3f30f-d36b-4f39-8468-e3e65fe955c9', false);

-- ===================================================================
-- PASSO 3: Verificar que os agents foram criados
-- ===================================================================

SELECT
  n.name AS neurocore_name,
  a.id AS agent_id,
  a.name AS agent_name,
  a.type,
  a.reactive,
  a.created_at
FROM neurocores n
LEFT JOIN agents a ON a.id_neurocore = n.id
WHERE n.id = 'd9d3f30f-d36b-4f39-8468-e3e65fe955c9'
ORDER BY a.created_at DESC;

-- Resultado esperado: 3 agents listados

-- ===================================================================
-- PASSO 4: Verificar contagem
-- ===================================================================

SELECT
  n.name AS neurocore_name,
  COUNT(a.id) AS agent_count
FROM neurocores n
LEFT JOIN agents a ON a.id_neurocore = n.id
WHERE n.id = 'd9d3f30f-d36b-4f39-8468-e3e65fe955c9'
GROUP BY n.name;

-- Resultado esperado: agent_count = 3
