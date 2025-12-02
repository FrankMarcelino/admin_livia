/**
 * AgentsListSection Component
 * Seção inline de gerenciamento de agents do neurocore
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { AgentFormData } from '../NeurocoreForm'
import { AgentFormDialog } from '../AgentFormDialog'
import { AgentFunction } from '@/types/database.types'

interface AgentsListSectionProps {
  agents: AgentFormData[]
  onAddAgent: (agent: AgentFormData) => void
  onEditAgent: (index: number, agent: AgentFormData) => void
  onDeleteAgent: (index: number) => void
}

const getAgentTypeLabel = (type: AgentFunction): string => {
  const labels: Record<AgentFunction, string> = {
    attendant: 'Atendente',
    intention: 'Intenções',
    in_guard_rails: 'In Guard Rails',
    observer: 'Observador'
  }
  return labels[type] || type
}

export function AgentsListSection({
  agents,
  onAddAgent,
  onEditAgent,
  onDeleteAgent
}: AgentsListSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingAgent, setEditingAgent] = useState<AgentFormData | null>(null)

  // Filter out deleted agents
  const visibleAgents = agents.filter(agent => agent._action !== 'delete')

  const handleAddClick = () => {
    setEditingIndex(null)
    setEditingAgent(null)
    setIsDialogOpen(true)
  }

  const handleEditClick = (index: number) => {
    setEditingIndex(index)
    setEditingAgent(agents[index])
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (index: number) => {
    const agent = agents[index]
    const confirmed = window.confirm(
      `Tem certeza que deseja remover o agent "${agent.name}"?\n\n` +
      `Esta ação será aplicada ao salvar o neurocore.`
    )
    if (confirmed) {
      onDeleteAgent(index)
    }
  }

  const handleDialogSuccess = (agentData: AgentFormData) => {
    if (editingIndex !== null) {
      // Edit existing agent
      onEditAgent(editingIndex, agentData)
    } else {
      // Add new agent
      onAddAgent(agentData)
    }
    setIsDialogOpen(false)
    setEditingIndex(null)
    setEditingAgent(null)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingIndex(null)
    setEditingAgent(null)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Agents do Neurocore</h3>
          <p className="text-sm text-muted-foreground">
            Defina os agents que fazem parte deste neurocore
          </p>
        </div>
        <Button type="button" size="sm" onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Agent
        </Button>
      </div>

      {/* Agents Table */}
      {visibleAgents.length === 0 ? (
        <div className="rounded-md border">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum agent adicionado ainda
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Clique em "Adicionar Agent" para começar
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Modo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent, index) => {
                // Skip deleted agents
                if (agent._action === 'delete') return null

                const isNew = agent._action === 'create'
                const isModified = agent._action === 'update'

                return (
                  <TableRow key={index}>
                    {/* Nome */}
                    <TableCell className="font-medium">
                      {agent.name}
                      {isNew && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Novo
                        </Badge>
                      )}
                      {isModified && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Modificado
                        </Badge>
                      )}
                    </TableCell>

                    {/* Tipo */}
                    <TableCell className="text-sm">
                      {getAgentTypeLabel(agent.type)}
                    </TableCell>

                    {/* Modo (Reactive/Proactive) */}
                    <TableCell>
                      <Badge variant={agent.reactive ? 'default' : 'secondary'}>
                        {agent.reactive ? 'Reativo' : 'Proativo'}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {isNew ? 'Será criado' : isModified ? 'Será atualizado' : 'Existente'}
                      </Badge>
                    </TableCell>

                    {/* Ações */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditClick(index)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Agent Form Dialog */}
      <AgentFormDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        agent={editingAgent}
        onSuccess={handleDialogSuccess}
      />
    </div>
  )
}
