# 🧪 Teste de Diagnóstico: Criar Agent pela Interface

## 🔍 **Passo a Passo para Diagnosticar**

### **1. Abrir Console do Browser**
1. Acesse: http://localhost:5173/neurocores
2. Pressione **F12** (DevTools)
3. Clique na aba **Console**
4. Deixe o console aberto durante todo o teste

---

### **2. Tentar Criar Agent pelo Formulário**

1. Na tabela de neurocores, clique nos **3 pontinhos** do "Neurocore Demo"
2. Clique em **"Editar"**
3. Vá na aba **"Agents"**
4. Clique em **"Adicionar Agent"**
5. Preencha o formulário:
   - **Nome:** "Agent Demo Teste"
   - **Tipo:** Selecione qualquer um
   - **Reactive:** Marque ou desmarque
6. Clique em **"Salvar"** (no modal do agent)
   - ⚠️ **VERIFIQUE:** O modal fechou?
   - ⚠️ **VERIFIQUE:** O agent apareceu na lista de agents?
7. Se o agent apareceu na lista, clique em **"Salvar"** (botão verde no final do formulário)
   - ⚠️ **VERIFIQUE:** Apareceu mensagem de sucesso?
   - ⚠️ **VERIFIQUE:** O formulário fechou?

---

### **3. Verificar Erros no Console**

**O que procurar:**
- ❌ Linhas em **vermelho** (erros)
- ⚠️ Linhas em **amarelo** (warnings)
- Mensagens tipo: `Error creating agent`, `permission denied`, `RLS`, etc.

**Anote/copie qualquer erro que aparecer!**

---

### **4. Verificar no Supabase**

Execute esta query no **Supabase SQL Editor**:

```sql
-- Ver se o agent foi criado
SELECT
  a.id,
  a.name,
  a.type,
  a.id_neurocore,
  n.name as neurocore_name
FROM agents a
LEFT JOIN neurocores n ON n.id = a.id_neurocore
WHERE a.name ILIKE '%demo%teste%'
   OR a.created_at > NOW() - INTERVAL '1 hour'
ORDER BY a.created_at DESC
LIMIT 10;
```

**Resultado esperado:**
- Se o agent foi criado → vai aparecer aqui
- Se `id_neurocore` está NULL → o problema é a associação
- Se não aparecer nada → o agent não foi criado

---

## 🐛 **Possíveis Problemas e Soluções**

### **Problema 1: Erro "permission denied" ou "RLS"**

**Causa:** Row Level Security do Supabase está bloqueando

**Solução:**
1. Acesse Supabase → Authentication → Policies
2. Tabela `agents` → Desabilite RLS temporariamente **OU**
3. Crie políticas:

```sql
-- Permitir inserir agents (temporariamente - para teste)
CREATE POLICY "Allow all operations on agents"
ON agents
FOR ALL
USING (true)
WITH CHECK (true);
```

---

### **Problema 2: Modal fecha mas agent não aparece na lista**

**Causa:** Validação falhou ou estado não atualizou

**Solução:** Verificar logs no console do browser

---

### **Problema 3: Agent aparece na lista mas não é salvo**

**Causa:** Você não clicou no botão "Salvar" final do formulário

**Solução:**
- Depois de adicionar agents, você **DEVE** clicar no botão "Salvar" verde no final
- Esse botão salva o neurocore E todos os agents de uma vez

---

### **Problema 4: Erro "invalid input syntax for type uuid"**

**Causa:** O `id_neurocore` não está sendo passado corretamente

**Solução:** Bug no código - vou corrigir

---

## ✅ **Solução Alternativa: Criar via SQL** (Mais Rápido)

Se a interface não funcionar, use SQL direto:

```sql
-- Criar agents para Neurocore Demo
INSERT INTO agents (name, type, id_neurocore, reactive)
VALUES
  ('Demo - Recepcionista', 'attendant', 'd9d3f30f-d36b-4f39-8468-e3e65fe955c9', true),
  ('Demo - Suporte', 'attendant', 'd9d3f30f-d36b-4f39-8468-e3e65fe955c9', true),
  ('Demo - Vendedor', 'attendant', 'd9d3f30f-d36b-4f39-8468-e3e65fe955c9', false);

-- Verificar
SELECT COUNT(*) FROM agents WHERE id_neurocore = 'd9d3f30f-d36b-4f39-8468-e3e65fe955c9';
```

Depois atualize a página: http://localhost:5173/neurocores

---

## 📞 **Me Informe:**

Após fazer o teste, me diga:
1. ✅ ou ❌ O modal do agent fechou ao salvar?
2. ✅ ou ❌ O agent apareceu na lista antes de salvar o formulário?
3. ✅ ou ❌ Você clicou no botão "Salvar" verde final?
4. ✅ ou ❌ Apareceu mensagem de sucesso?
5. 📋 Copie/cole qualquer erro do console aqui

Vou te ajudar a resolver! 🚀
