# Checklist de Testes - Gerenciar Empresas

**Data:** 2025-12-03
**Versão:** 1.0
**Status:** Em execução

## Instruções

- [ ] = Não testado
- [x] = Testado e funcionando
- [⚠️] = Testado com problemas (descrever)

---

## 1. Teste de Listagem

### 1.1 Carregamento Inicial
- [ ] Página carrega sem erros
- [ ] Loading skeletons aparecem durante carregamento
- [ ] Dados são exibidos corretamente após carregamento
- [ ] Paginação funciona corretamente

### 1.2 Exibição de Dados
- [ ] Nome da empresa é exibido corretamente
- [ ] CNPJ formatado está correto (XX.XXX.XXX/XXXX-XX)
- [ ] Badge de plano está correta (Basic/Pro/Enterprise)
- [ ] Nome do Neurocore é exibido
- [ ] Status (Ativa/Inativa) está correto
- [ ] Data de criação formatada (dd/MM/yyyy)

### 1.3 Responsividade
- [ ] Layout funciona em tela desktop (>1024px)
- [ ] Layout funciona em tablet (640px-1024px)
- [ ] Layout funciona em mobile (<640px)
- [ ] Colunas ocultas aparecem/desaparecem conforme breakpoints
- [ ] Scroll horizontal funciona em telas pequenas

---

## 2. Teste de Filtros

### 2.1 Busca
- [ ] Busca por nome funciona
- [ ] Busca por CNPJ funciona
- [ ] Debounce de 300ms está funcionando
- [ ] Limpar busca funciona

### 2.2 Filtro por Plano
- [ ] Filtrar por Basic funciona
- [ ] Filtrar por Pro funciona
- [ ] Filtrar por Enterprise funciona
- [ ] Múltiplos planos podem ser selecionados
- [ ] Desmarcar filtros funciona

### 2.3 Filtro por Status
- [ ] Filtrar por "Ativa" funciona
- [ ] Filtrar por "Inativa" funciona
- [ ] Alternar entre filtros funciona
- [ ] Desmarcar filtro funciona

### 2.4 Combinação de Filtros
- [ ] Busca + Plano funcionam juntos
- [ ] Busca + Status funcionam juntos
- [ ] Plano + Status funcionam juntos
- [ ] Todos os filtros combinados funcionam

### 2.5 Limpar Filtros
- [ ] Botão "Limpar filtros" aparece quando há filtros ativos
- [ ] Limpar filtros remove todos os filtros
- [ ] Resumo de filtros ativos está correto

---

## 3. Teste de Paginação

- [ ] Primeira página funciona
- [ ] Página anterior funciona
- [ ] Próxima página funciona
- [ ] Última página funciona
- [ ] Mudar tamanho de página (10/20/50/100) funciona
- [ ] Contador "X de Y" está correto
- [ ] Botões de navegação habilitam/desabilitam corretamente

---

## 4. Teste de Criação

### 4.1 Abrir Formulário
- [ ] Botão "Nova Empresa" abre o dialog
- [ ] Formulário renderiza corretamente
- [ ] Todos os campos estão vazios

### 4.2 Aba 1 - Informações Básicas
- [ ] Campo "Nome" aceita texto
- [ ] Campo "CNPJ" valida formato
- [ ] Campo "CNPJ" valida CNPJ válido
- [ ] Campo "Telefone" aceita formato +5511999999999
- [ ] Select "Plano" funciona (Basic/Pro/Enterprise)

### 4.3 Aba 2 - Responsável Técnico
- [ ] Campo "Nome" aceita texto
- [ ] Campo "WhatsApp" valida formato +5511999999999
- [ ] Campo "Email" valida email

### 4.4 Aba 3 - Responsável Financeiro
- [ ] Campo "Nome" aceita texto
- [ ] Campo "WhatsApp" valida formato +5511999999999
- [ ] Campo "Email" valida email

### 4.5 Aba 4 - Configurações
- [ ] Select "Neurocore" carrega opções do Supabase
- [ ] Select "Nicho" carrega opções do Supabase (opcional)

### 4.6 Validações
- [ ] Enviar formulário vazio mostra erros
- [ ] CNPJ inválido mostra erro
- [ ] CNPJ duplicado mostra erro
- [ ] Email inválido mostra erro
- [ ] Telefone inválido mostra erro
- [ ] Resumo de erros aparece corretamente

### 4.7 Submit
- [ ] Criar empresa com dados válidos funciona
- [ ] Toast de sucesso aparece
- [ ] Dialog fecha após sucesso
- [ ] Lista é atualizada com nova empresa
- [ ] Dados são salvos corretamente no Supabase

---

## 5. Teste de Edição

### 5.1 Abrir Formulário
- [ ] Botão "Editar" no menu abre o dialog
- [ ] Formulário carrega com dados da empresa
- [ ] Todos os campos estão preenchidos corretamente

### 5.2 Edição de Dados
- [ ] Alterar nome funciona
- [ ] Alterar CNPJ funciona (valida único)
- [ ] Alterar telefone funciona
- [ ] Alterar plano funciona
- [ ] Alterar responsáveis funciona
- [ ] Alterar neurocore funciona
- [ ] Alterar nicho funciona

### 5.3 Submit
- [ ] Salvar alterações funciona
- [ ] Toast de sucesso aparece
- [ ] Dialog fecha após sucesso
- [ ] Lista é atualizada
- [ ] Dados são salvos corretamente no Supabase

---

## 6. Teste de Detalhes

### 6.1 Abrir Drawer
- [ ] Botão "Ver detalhes" abre o drawer
- [ ] Drawer renderiza corretamente
- [ ] Botão de fechar funciona

### 6.2 Seções de Informações
- [ ] Seção "Informações Básicas" mostra dados corretos
- [ ] Seção "Responsável Técnico" mostra dados corretos
- [ ] Seção "Responsável Financeiro" mostra dados corretos
- [ ] Seção "Configurações" mostra Neurocore e Nicho
- [ ] Seção "Metadados" mostra datas corretas

### 6.3 Estatísticas
- [ ] Card "Usuários" mostra contagem correta
- [ ] Card "Contatos" mostra contagem correta
- [ ] Card "Conversas" mostra contagem correta
- [ ] Card "Canais" mostra contagem correta
- [ ] Skeleton loaders aparecem durante carregamento

### 6.4 Lista de Canais
- [ ] Lista de canais é exibida
- [ ] Badges de status (Ativo/Inativo) estão corretos
- [ ] Tipo de canal é exibido
- [ ] Skeleton loaders aparecem durante carregamento

### 6.5 Toggle Integração Master
- [ ] Switch é exibido corretamente
- [ ] Estado atual (ativo/inativo) está correto
- [ ] Alternar switch funciona
- [ ] Toast de sucesso aparece
- [ ] Estado é atualizado no Supabase

### 6.6 Ações no Drawer
- [ ] Botão "Editar" abre o formulário de edição
- [ ] Botão "Ativar/Desativar" funciona
- [ ] Status é atualizado após ação

---

## 7. Teste de Ativação/Desativação

### 7.1 Desativar Empresa
- [ ] Menu de ações mostra opção "Desativar"
- [ ] Clicar em "Desativar" muda status imediatamente
- [ ] Toast de sucesso aparece
- [ ] Badge muda para "Inativa"
- [ ] Status é atualizado no Supabase

### 7.2 Ativar Empresa
- [ ] Menu de ações mostra opção "Ativar"
- [ ] Clicar em "Ativar" muda status imediatamente
- [ ] Toast de sucesso aparece
- [ ] Badge muda para "Ativa"
- [ ] Status é atualizado no Supabase

---

## 8. Teste de Exclusão (Delete Dialog)

### 8.1 Abrir Dialog
- [ ] Opção "Excluir" aparece APENAS para empresas ativas
- [ ] Clicar em "Excluir" abre o dialog
- [ ] Dialog renderiza corretamente

### 8.2 Cálculo de Impactos
- [ ] Estatísticas carregam corretamente
- [ ] Skeleton loaders aparecem durante carregamento
- [ ] Contagem de usuários está correta
- [ ] Contagem de contatos está correta
- [ ] Contagem de conversas está correta
- [ ] Contagem de canais está correta
- [ ] Aviso aparece se há dados ativos

### 8.3 Confirmação
- [ ] Input de confirmação aparece
- [ ] Badge com nome da empresa aparece
- [ ] Digitação incorreta mostra erro
- [ ] Digitação correta habilita botão
- [ ] Botão "Desativar" está desabilitado inicialmente

### 8.4 Executar Desativação
- [ ] Confirmar desativa a empresa
- [ ] Toast de sucesso aparece
- [ ] Dialog fecha
- [ ] Lista é atualizada
- [ ] Empresa aparece como "Inativa"
- [ ] Status é atualizado no Supabase

### 8.5 Cancelar
- [ ] Botão "Cancelar" fecha o dialog
- [ ] Nenhuma alteração é feita
- [ ] Input é limpo ao fechar

---

## 9. Teste de Estados Vazios

- [ ] Empty state aparece quando não há empresas
- [ ] Ícone é exibido corretamente
- [ ] Mensagem está clara
- [ ] Empty state com filtros tem mensagem adequada

---

## 10. Teste de Loading States

- [ ] Skeleton loaders aparecem na tabela
- [ ] Skeleton loaders aparecem no drawer (stats)
- [ ] Skeleton loaders aparecem no delete dialog
- [ ] Botões mostram "Carregando..." durante ações
- [ ] Ícones de refresh animam durante atualização

---

## 11. Teste de Tooltips

- [ ] Tooltip no botão "Atualizar" funciona
- [ ] Tooltip no botão "Nova Empresa" funciona
- [ ] Tooltips aparecem ao hover
- [ ] Tooltips desaparecem ao sair do hover

---

## 12. Teste de Acessibilidade

### 12.1 Navegação por Teclado
- [ ] Tab funciona em todos os campos
- [ ] Enter submete formulários
- [ ] Esc fecha dialogs e drawers
- [ ] Setas navegam em selects

### 12.2 Screen Readers
- [ ] Labels estão associados aos inputs
- [ ] Botões têm textos descritivos
- [ ] sr-only text funciona nos botões de ação

### 12.3 Contraste
- [ ] Cores têm contraste adequado (WCAG AA)
- [ ] Texto é legível em todos os temas

---

## 13. Teste de Erros

### 13.1 Erros de Rede
- [ ] Erro ao carregar lista mostra mensagem
- [ ] Erro ao criar empresa mostra toast de erro
- [ ] Erro ao editar empresa mostra toast de erro
- [ ] Erro ao deletar empresa mostra toast de erro

### 13.2 Erros de Validação
- [ ] Erros de validação aparecem em tempo real
- [ ] Erros são claros e específicos
- [ ] Resumo de erros lista todos os problemas

### 13.3 Error Boundary
- [ ] Erro crítico é capturado pelo ErrorBoundary
- [ ] Tela de erro amigável aparece
- [ ] Botão "Tentar novamente" funciona
- [ ] Botão "Recarregar página" funciona

---

## 14. Teste de Performance

- [ ] Página carrega em menos de 3 segundos
- [ ] Busca com debounce não trava a UI
- [ ] Paginação é rápida
- [ ] Filtros são rápidos
- [ ] Bundle size está aceitável (< 1MB)

---

## 15. Teste de Integração Supabase

### 15.1 CRUD Operations
- [ ] Create funciona e salva no Supabase
- [ ] Read carrega dados do Supabase
- [ ] Update atualiza dados no Supabase
- [ ] Soft Delete (desativação) funciona

### 15.2 Relacionamentos
- [ ] Neurocores são carregados corretamente
- [ ] Niches são carregados corretamente
- [ ] Joins funcionam corretamente

### 15.3 Queries
- [ ] fetchTenants retorna dados corretos
- [ ] fetchTenantStats retorna contagens corretas
- [ ] fetchTenantChannels retorna canais corretos
- [ ] toggleMasterIntegration atualiza flag corretamente

---

## Resultados

### Bugs Encontrados
_Listar bugs encontrados aqui com severidade (Crítico/Alto/Médio/Baixo)_

1. [Severidade] Descrição do bug
   - Passos para reproduzir:
   - Resultado esperado:
   - Resultado obtido:

### Melhorias Sugeridas
_Listar melhorias que não são bugs mas podem melhorar a UX_

1. Descrição da melhoria
   - Justificativa:
   - Impacto:

---

## Aprovação

- [ ] Todos os testes críticos passaram
- [ ] Bugs críticos foram corrigidos
- [ ] Feature está pronta para produção

**Testado por:** _Nome_
**Data:** _Data_
**Versão testada:** _Versão_
