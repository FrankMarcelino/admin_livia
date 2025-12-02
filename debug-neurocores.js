/**
 * Script de Diagnóstico - Neurocores e Agents
 * Execute no navegador (Console do DevTools) ou com Node.js
 */

// ===== COLE ISSO NO CONSOLE DO BROWSER =====
// (Certifique-se de estar na página http://localhost:5173)

// 1. Importar o cliente Supabase (se estiver no console do browser)
// const { supabase } = await import('/src/lib/supabase.ts')

// 2. Testar query dos neurocores
async function debugNeurocores() {
  console.log('🔍 Diagnóstico: Neurocores e Agents')
  console.log('=' .repeat(50))

  // Buscar neurocores
  const { data: neurocores, error: neurocoreError } = await supabase
    .from('neurocores')
    .select('*')
    .in('name', ['signum cursos', 'neurocore demo'])

  if (neurocoreError) {
    console.error('❌ Erro ao buscar neurocores:', neurocoreError)
    return
  }

  console.log('✅ Neurocores encontrados:', neurocores.length)
  neurocores.forEach(nc => {
    console.log(`  - ${nc.name} (ID: ${nc.id})`)
  })
  console.log('')

  // Para cada neurocore, buscar agents
  for (const neurocore of neurocores) {
    console.log(`🔍 Buscando agents do neurocore: ${neurocore.name}`)

    // Query 1: Buscar agents com id_neurocore = neurocore.id
    const { data: agents, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id_neurocore', neurocore.id)

    if (agentError) {
      console.error(`  ❌ Erro ao buscar agents:`, agentError)
    } else {
      console.log(`  ✅ Agents encontrados: ${agents.length}`)
      agents.forEach(agent => {
        console.log(`    - ${agent.name} (type: ${agent.type}, id_neurocore: ${agent.id_neurocore})`)
      })
    }

    // Query 2: Testar JOIN (como está na query de fetch)
    const { data: neurocoreWithAgents, error: joinError } = await supabase
      .from('neurocores')
      .select(`
        *,
        agents (*)
      `)
      .eq('id', neurocore.id)
      .single()

    if (joinError) {
      console.error(`  ❌ Erro no JOIN:`, joinError)
    } else {
      console.log(`  ✅ JOIN retornou: ${neurocoreWithAgents.agents?.length || 0} agents`)
      if (neurocoreWithAgents.agents) {
        neurocoreWithAgents.agents.forEach(agent => {
          console.log(`    - ${agent.name}`)
        })
      }
    }
    console.log('')
  }

  // Verificar se há agents sem id_neurocore
  const { data: orphanAgents, error: orphanError } = await supabase
    .from('agents')
    .select('*')
    .is('id_neurocore', null)

  if (orphanError) {
    console.error('❌ Erro ao buscar agents órfãos:', orphanError)
  } else {
    console.log(`⚠️  Agents sem id_neurocore (órfãos): ${orphanAgents.length}`)
    if (orphanAgents.length > 0) {
      orphanAgents.forEach(agent => {
        console.log(`  - ${agent.name} (ID: ${agent.id})`)
      })
    }
  }

  console.log('')
  console.log('=' .repeat(50))
  console.log('🏁 Diagnóstico concluído!')
}

// Execute a função
debugNeurocores()
