# 🔧 Guia de Correção: Agents de Signum Cursos e Neurocore Demo

## 📋 Problema Identificado

**Sintomas:**
- ✅ Signum Cursos mostra 1 tenant (correto)
- ✅ Neurocore Demo mostra 1 tenant (correto)
- ❌ Signum Cursos mostra 0 agents (incorreto)
- ❌ Neurocore Demo mostra 0 agents (incorreto)

**Causa:**
Os agents existem no banco de dados, mas o campo `id_neurocore` está NULL ou incorreto.

---

## 🚀 Solução Passo a Passo

### **Opção A: Usar a Página de Debug (Mais Fácil)**

1. ✅ **Acesse:** http://localhost:5173/neurocores/debug

2. 👀 **Clique em "Executar Diagnóstico"**

3. 📊 **Veja a seção "3. Agents Órfãos"**
   - Se houver agents listados aqui, eles precisam ser associados aos neurocores

4. 📝 **Anote:**
   - IDs dos agents órfãos
   - IDs dos neurocores (seção "1. Neurocores Encontrados")

5. 🔧 **Vá para o Supabase SQL Editor** e execute o script de correção abaixo

---

### **Opção B: Usar SQL Direto (Mais Rápido)**

1. 🌐 **Acesse o Supabase SQL Editor**
   - https://app.supabase.com → Seu Projeto → SQL Editor

2. 📋 **Execute o PASSO 1 do script** [fix-signum-demo-agents.sql](fix-signum-demo-agents.sql)
   ```sql
   SELECT id, name, id_subwork_n8n_neurocore
   FROM neurocores
   WHERE name IN ('Signum Cursos', 'Neurocore Demo')
   ORDER BY name;
   ```

3. 📝 **COPIE os UUIDs retornados:**
   - UUID do Signum Cursos: `_______________________`
   - UUID do Neurocore Demo: `_______________________`

4. 🔍 **Execute o PASSO 2 para ver agents órfãos:**
   ```sql
   SELECT id, name, type, reactive, id_neurocore, created_at
   FROM agents
   WHERE id_neurocore IS NULL
   ORDER BY created_at DESC;
   ```

5. 🔧 **Associe os agents aos neurocores corretos:**

   **Exemplo para Signum Cursos:**
   ```sql
   -- Substitua 'UUID-DO-SIGNUM-CURSOS' pelo UUID real copiado no passo 3
   UPDATE agents
   SET id_neurocore = 'UUID-DO-SIGNUM-CURSOS'
   WHERE name IN (
     'Nome do Agent 1',
     'Nome do Agent 2'
   );
   ```

   **Exemplo para Neurocore Demo:**
   ```sql
   -- Substitua 'UUID-DO-NEUROCORE-DEMO' pelo UUID real copiado no passo 3
   UPDATE agents
   SET id_neurocore = 'UUID-DO-NEUROCORE-DEMO'
   WHERE name IN (
     'Nome do Agent Demo 1',
     'Nome do Agent Demo 2'
   );
   ```

6. ✅ **Verifique se funcionou:**
   ```sql
   SELECT
     n.name AS neurocore_name,
     COUNT(a.id) AS agent_count,
     array_agg(a.name) AS agent_names
   FROM neurocores n
   LEFT JOIN agents a ON a.id_neurocore = n.id
   WHERE n.name IN ('Signum Cursos', 'Neurocore Demo')
   GROUP BY n.id, n.name
   ORDER BY n.name;
   ```

   **Resultado esperado:**
   ```
   neurocore_name  | agent_count | agent_names
   Neurocore Demo  | 2           | {Agent Demo 1, Agent Demo 2}
   Signum Cursos   | 2           | {Agent 1, Agent 2}
   ```

7. 🔄 **Atualize a página** http://localhost:5173/neurocores
   - Os agents devem aparecer agora!

---

## 🆕 Alternativa: Criar Agents Novos de Teste

Se você **não tem agents** e quer criar alguns para testar:

```sql
-- 1. Copie o UUID do Signum Cursos (execute PASSO 1 primeiro)
-- 2. Execute:

-- Agents para Signum Cursos
INSERT INTO agents (name, type, id_neurocore, reactive)
VALUES
  ('Recepcionista Signum', 'support', 'UUID-DO-SIGNUM-CURSOS', true),
  ('Vendedor Signum', 'sales', 'UUID-DO-SIGNUM-CURSOS', false),
  ('Suporte Signum', 'support', 'UUID-DO-SIGNUM-CURSOS', true);

-- Agents para Neurocore Demo
INSERT INTO agents (name, type, id_neurocore, reactive)
VALUES
  ('Agent Demo Receptivo', 'support', 'UUID-DO-NEUROCORE-DEMO', true),
  ('Agent Demo Proativo', 'general', 'UUID-DO-NEUROCORE-DEMO', false);
```

---

## 🎯 Verificação Final

Após fazer as correções, execute **TODOS** esses checks:

### ✅ Check 1: Console do Browser
```
http://localhost:5173/neurocores
```
- Abra DevTools (F12) → Console
- Procure: `📊 Neurocores carregados:`
- Deve mostrar: `Signum Cursos: X agents` (X > 0)

### ✅ Check 2: Página de Debug
```
http://localhost:5173/neurocores/debug
```
- Seção "2. Agents de Signum Cursos" → deve mostrar agents
- Seção "3. Agents Órfãos" → deve estar vazio (ou sem os agents corrigidos)

### ✅ Check 3: Tabela de Neurocores
```
http://localhost:5173/neurocores
```
- Coluna "Agents" para Signum Cursos → número > 0
- Coluna "Agents" para Neurocore Demo → número > 0

---

## 📞 Precisa de Ajuda?

Se ainda não funcionar, **me envie:**
1. Screenshot da seção "3. Agents Órfãos" da página de debug
2. Resultado do PASSO 2 (agents órfãos) do SQL
3. Print da tabela de neurocores mostrando as colunas

Vou criar o script de correção específico para o seu caso!

---

## 🔗 Arquivos de Referência

- [fix-signum-demo-agents.sql](fix-signum-demo-agents.sql) - Script SQL completo
- [debug-neurocores.sql](debug-neurocores.sql) - Diagnóstico completo
- [fix-agent-relationships.sql](fix-agent-relationships.sql) - Correções gerais
