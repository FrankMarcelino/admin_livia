# 🔧 Correção: Agent "Signum - Fernando"

## 📋 Problema Encontrado

- ❌ Agent **"Signum - Fernando"** está órfão (sem `id_neurocore`)
- ✅ Neurocore **"Signum Cursos"** existe no banco
- ✅ Tenant **"SIGNUM CURSOS"** está usando o neurocore correto
- ❌ Mas o agent não aparece na listagem porque não está associado

---

## 🚀 Solução em 3 Passos

### **PASSO 1: Acessar o Supabase SQL Editor**

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Clique em **"SQL Editor"** no menu lateral
4. Clique em **"New Query"**

---

### **PASSO 2: Executar o Script de Correção**

Copie e cole todo o conteúdo do arquivo **[FIX-SIGNUM-FERNANDO.sql](FIX-SIGNUM-FERNANDO.sql)** no SQL Editor e clique em **"Run"** (ou pressione Ctrl+Enter).

**OU** execute apenas este comando:

```sql
-- Associar o agent ao neurocore Signum Cursos
UPDATE agents
SET id_neurocore = 'e266d1f8-1cc1-4db2-b0f5-4d14c9e5e2b4'
WHERE id = 'f1f2f567-975e-4a14-8cfe-8433204899f0';
```

**Resultado esperado:**
```
UPDATE 1
```

---

### **PASSO 3: Verificar que Funcionou**

Execute esta query para confirmar:

```sql
SELECT
  n.name as neurocore_name,
  COUNT(a.id) as agent_count,
  array_agg(a.name) as agent_names
FROM neurocores n
LEFT JOIN agents a ON a.id_neurocore = n.id
WHERE n.name ILIKE '%signum%'
GROUP BY n.name;
```

**Resultado esperado:**
```
neurocore_name  | agent_count | agent_names
Signum Cursos   | 1           | {Signum - Fernando}
```

---

## ✅ Verificação Final

Depois de executar o script, **atualize as páginas** no browser:

### 1. **Página de Neurocores**
```
http://localhost:5173/neurocores
```
- A linha "Signum Cursos" deve mostrar **1** na coluna "Agents" ✅

### 2. **Console do Browser**
- Abra DevTools (F12) → Console
- Deve mostrar: `Signum Cursos: 1 agents, 1 tenants` ✅

### 3. **Página de Debug**
```
http://localhost:5173/neurocores/debug
```
- Seção "3. Agents Órfãos" deve mostrar **0** (ou não mostrar "Signum - Fernando") ✅

---

## 🎯 E o Neurocore Demo?

**Análise:**
- O Neurocore Demo existe no banco (ID: `d9d3f30f-d36b-4f39-8468-e3e65fe955c9`)
- Tenant "Teste DEV" está usando ele
- **MAS não há agents criados para ele ainda**

**Opções:**

**A) Criar agents novos para o Neurocore Demo:**

```sql
-- Pegar o ID do Neurocore Demo
-- d9d3f30f-d36b-4f39-8468-e3e65fe955c9

-- Criar agents de teste
INSERT INTO agents (name, type, id_neurocore, reactive)
VALUES
  ('Demo - Recepcionista', 'attendant', 'd9d3f30f-d36b-4f39-8468-e3e65fe955c9', true),
  ('Demo - Suporte', 'attendant', 'd9d3f30f-d36b-4f39-8468-e3e65fe955c9', true);
```

**B) Ou usar a interface web:**
1. Acesse: http://localhost:5173/neurocores
2. Clique nos 3 pontinhos do "Neurocore Demo"
3. Clique em "Editar"
4. Vá na aba "Agents"
5. Clique em "Adicionar Agent"
6. Preencha e salve

---

## 📞 Precisa de Ajuda?

Se algo der errado, me envie:
- Screenshot do erro no Supabase SQL Editor
- Ou o resultado da query de verificação

Vou te ajudar! 🚀

---

## 📁 Arquivos de Referência

- **[FIX-SIGNUM-FERNANDO.sql](FIX-SIGNUM-FERNANDO.sql)** - Script completo com verificações
- [CORRIGIR-AGENTS.md](CORRIGIR-AGENTS.md) - Guia geral de correção
- [debug-neurocores.sql](debug-neurocores.sql) - Queries de diagnóstico
