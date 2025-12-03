/**
 * AgentTemplateListPage
 * Página principal de gerenciamento de templates de agents
 */

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AgentTemplateFilters } from '@/components/agents/AgentTemplateFilters'
import { AgentTemplateTable } from '@/components/agents/AgentTemplateTable'
import { AgentTemplatePagination } from '@/components/agents/AgentTemplatePagination'
import { AgentTemplateFormDialog } from '@/components/agents/AgentTemplateFormDialog'
import { useAgentTemplateStore } from '@/store/agentTemplate'
import { AgentTemplate } from '@/types/agent-template-extended.types'
import { toast } from 'sonner'

export function AgentTemplateListPage() {
  const {
    templates,
    isLoading,
    fetchTemplates,
    toggleTemplateStatus
  } = useAgentTemplateStore()

  // Local state for modals/drawers
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null)
  // const [isDetailsOpen, setIsDetailsOpen] = useState(false) // TODO: Implement details drawer
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Fetch templates on mount
  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  // Handlers
  const handleViewDetails = (_template: AgentTemplate) => {
    // TODO: Implement details drawer
    toast.info('Visualização de detalhes será implementada em breve')
  }

  const handleEdit = (template: AgentTemplate) => {
    setSelectedTemplate(template)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setSelectedTemplate(null)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedTemplate(null)
  }

  const handleToggleStatus = async (template: AgentTemplate) => {
    try {
      await toggleTemplateStatus(template.id)
      toast.success(
        template.is_active
          ? 'Template desativado com sucesso'
          : 'Template ativado com sucesso'
      )
    } catch (error) {
      console.error('Error toggling template status:', error)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gerenciar Agentes
          </h1>
          <p className="text-muted-foreground">
            Crie e gerencie templates de agents para seus neurocores
          </p>
        </div>
        <Button onClick={handleCreate} className="sm:w-auto w-full">
          <Plus className="mr-2 h-4 w-4" />
          Novo Template
        </Button>
      </div>

      {/* Filters */}
      <AgentTemplateFilters />

      {/* Table */}
      <AgentTemplateTable
        templates={templates}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      {/* Pagination */}
      <AgentTemplatePagination />

      {/* Form Dialog */}
      <AgentTemplateFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        template={selectedTemplate}
      />

      {/* TODO: Add details drawer when implemented */}
      {/* <AgentTemplateDetailsDrawer
        template={selectedTemplate}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      /> */}
    </div>
  )
}
