/**
 * NeurocoreForm Component
 * Formulário de criação/edição de neurocores com agents inline
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useNeurocoreStore } from '@/store/neurocore'
import { NeurocoreWithRelations } from '@/types/neurocore-extended.types'
import { Agent, AgentFunction } from '@/types/database.types'
import { neurocoreCreateSchema, NeurocoreCreateInput } from '@/lib/validations/neurocoreValidation'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { NeurocoreBasicFields } from './form-sections/NeurocoreBasicFields'
import { AgentsListSection } from './form-sections/AgentsListSection'

/**
 * Agent Form Data with action flag
 * Used to track what needs to be done with each agent when saving
 */
export interface AgentFormData extends Partial<Agent> {
  _action?: 'create' | 'update' | 'delete'
  // Required fields for new agents
  name: string
  type: AgentFunction
  reactive: boolean
}

interface NeurocoreFormProps {
  neurocore?: NeurocoreWithRelations | null
  onSuccess: () => void
  onCancel: () => void
}

export function NeurocoreForm({ neurocore, onSuccess, onCancel }: NeurocoreFormProps) {
  const { createNeurocore, updateNeurocore, isLoading } = useNeurocoreStore()
  const isEditing = !!neurocore

  // Local state for agents (managed before save)
  const [agents, setAgents] = useState<AgentFormData[]>(
    neurocore?.agents?.map(agent => ({
      ...agent,
      _action: undefined // Existing agents have no action until modified
    })) || []
  )

  // Form setup
  const form = useForm<NeurocoreCreateInput>({
    resolver: zodResolver(neurocoreCreateSchema),
    defaultValues: neurocore
      ? {
          name: neurocore.name,
          description: neurocore.description,
          id_subwork_n8n_neurocore: neurocore.id_subwork_n8n_neurocore,
          is_active: neurocore.is_active
        }
      : {
          name: '',
          description: '',
          id_subwork_n8n_neurocore: '',
          is_active: true
        }
  })

  // Agent handlers
  const handleAddAgent = (agent: AgentFormData) => {
    setAgents([...agents, { ...agent, _action: 'create' }])
  }

  const handleEditAgent = (index: number, agent: AgentFormData) => {
    const updated = [...agents]
    // If agent already exists (has id), mark as update
    if (updated[index].id) {
      updated[index] = { ...agent, _action: 'update' }
    } else {
      // If agent is new (no id yet), keep as create
      updated[index] = { ...agent, _action: 'create' }
    }
    setAgents(updated)
  }

  const handleDeleteAgent = (index: number) => {
    const updated = [...agents]
    // If agent has id (exists in DB), mark for deletion
    if (updated[index].id) {
      updated[index] = { ...updated[index], _action: 'delete' }
    } else {
      // If agent is new (no id), just remove from list
      updated.splice(index, 1)
    }
    setAgents(updated)
  }

  // Submit handler with transaction logic
  async function onSubmit(data: NeurocoreCreateInput) {
    console.log('🚀 Submit iniciado')
    console.log('📋 Agents a processar:', agents)
    let neurocoreId: string

    // Step 1: Create or update neurocore
    if (isEditing && neurocore) {
      console.log('✏️ Atualizando neurocore:', neurocore.id)
      const result = await updateNeurocore(neurocore.id, data)
      if (!result) {
        console.error('❌ Falha ao atualizar neurocore')
        return // Error already handled by store
      }
      neurocoreId = neurocore.id
      console.log('✅ Neurocore atualizado')
    } else {
      console.log('➕ Criando novo neurocore')
      const result = await createNeurocore(data)
      if (!result) {
        console.error('❌ Falha ao criar neurocore')
        return // Error already handled by store
      }
      neurocoreId = result.id
      console.log('✅ Neurocore criado:', neurocoreId)
    }

    // Step 2: Process agents (only if editing or if new agents were added)
    const { createAgent, updateAgent, deleteAgent } = useNeurocoreStore.getState()

    console.log('🔄 Processando agents...')
    for (const agent of agents) {
      console.log('  Agent:', agent.name, '| Ação:', agent._action)

      if (agent._action === 'create') {
        // Create new agent
        console.log('  ➕ Criando agent:', agent.name)
        const agentData = {
          name: agent.name,
          type: agent.type,
          reactive: agent.reactive,
          id_neurocore: neurocoreId
        }
        console.log('  📦 Dados do agent:', agentData)

        const result = await createAgent(agentData)
        if (result) {
          console.log('  ✅ Agent criado com sucesso:', result.id)
        } else {
          console.error('  ❌ Falha ao criar agent')
        }
      } else if (agent._action === 'update' && agent.id) {
        // Update existing agent
        console.log('  ✏️ Atualizando agent:', agent.name)
        await updateAgent(agent.id, {
          name: agent.name,
          type: agent.type,
          reactive: agent.reactive
        })
      } else if (agent._action === 'delete' && agent.id) {
        // Delete agent
        console.log('  🗑️ Deletando agent:', agent.name)
        await deleteAgent(agent.id)
      }
    }

    console.log('✅ Processamento concluído')
    onSuccess()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Dados do Neurocore</TabsTrigger>
            <TabsTrigger value="agents">
              Agents ({agents.filter(a => a._action !== 'delete').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <NeurocoreBasicFields form={form} />
          </TabsContent>

          <TabsContent value="agents" className="space-y-4 mt-4">
            <AgentsListSection
              agents={agents}
              onAddAgent={handleAddAgent}
              onEditAgent={handleEditAgent}
              onDeleteAgent={handleDeleteAgent}
            />
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Atualizar' : 'Criar'} Neurocore
          </Button>
        </div>

        {/* Validation Errors Summary */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <p className="font-medium">Corrija os seguintes erros:</p>
            <ul className="list-disc list-inside mt-1">
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </Form>
  )
}
