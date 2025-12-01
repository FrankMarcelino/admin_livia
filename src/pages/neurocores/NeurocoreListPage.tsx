/**
 * NeurocoreListPage
 * Página principal de gerenciamento de neurocores
 */

import { useEffect, useState } from 'react'
import { useNeurocoreStore } from '@/store/neurocore'
import { useNeurocoreFilters } from '@/hooks/useNeurocoreFilters'
import { NeurocoreTable } from '@/components/neurocores/NeurocoreTable'
import { NeurocoreFilters } from '@/components/neurocores/NeurocoreFilters'
import { NeurocorePagination } from '@/components/neurocores/NeurocorePagination'
import { NeurocoreFormDialog } from '@/components/neurocores/NeurocoreFormDialog'
import { NeurocoreDetailsDrawer } from '@/components/neurocores/NeurocoreDetailsDrawer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, RefreshCw } from 'lucide-react'
import { NeurocoreWithRelations } from '@/types/neurocore-extended.types'
import { useToast } from '@/hooks/use-toast'

export function NeurocoreListPage() {
  const { toast } = useToast()

  // Store
  const {
    neurocores,
    isLoading,
    pagination,
    setFilters,
    setPagination,
    fetchNeurocores,
    activateNeurocore,
    deactivateNeurocore,
    deleteNeurocore
  } = useNeurocoreStore()

  // Filters hook
  const {
    filters,
    searchInput,
    handleSearchChange,
    handleActiveChange,
    clearFilters,
    hasActiveFilters
  } = useNeurocoreFilters()

  // Local state for actions
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedNeurocoreForEdit, setSelectedNeurocoreForEdit] = useState<NeurocoreWithRelations | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedNeurocoreForView, setSelectedNeurocoreForView] = useState<NeurocoreWithRelations | null>(null)

  // Fetch neurocores on mount and when filters change
  useEffect(() => {
    setFilters(filters)
  }, [filters, setFilters])

  useEffect(() => {
    fetchNeurocores()
  }, [fetchNeurocores])

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchNeurocores()
    setIsRefreshing(false)
  }

  const handleClearFilters = () => {
    clearFilters()
  }

  const handlePageChange = (page: number) => {
    setPagination({ page })
  }

  const handlePageSizeChange = (pageSize: number) => {
    setPagination({ pageSize, page: 1 })
  }

  const handleEdit = (neurocore: NeurocoreWithRelations) => {
    setSelectedNeurocoreForEdit(neurocore)
    setIsFormOpen(true)
  }

  const handleView = (neurocore: NeurocoreWithRelations) => {
    setSelectedNeurocoreForView(neurocore)
    setIsDetailsOpen(true)
  }

  const handleToggleStatus = async (neurocore: NeurocoreWithRelations) => {
    if (neurocore.is_active) {
      await deactivateNeurocore(neurocore.id)
    } else {
      await activateNeurocore(neurocore.id)
    }
  }

  const handleDelete = async (neurocore: NeurocoreWithRelations) => {
    // Check if neurocore has tenants
    const tenantCount = neurocore.stats?.total_tenants || 0
    if (tenantCount > 0) {
      toast({
        variant: 'destructive',
        title: 'Não é possível excluir',
        description: `Este neurocore está sendo usado por ${tenantCount} tenant(s).`
      })
      return
    }

    // Confirm deletion
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o neurocore "${neurocore.name}"?\n\n` +
      `Isso também excluirá ${neurocore.agents?.length || 0} agent(s) associado(s).\n\n` +
      `Esta ação não pode ser desfeita.`
    )

    if (confirmed) {
      await deleteNeurocore(neurocore.id)
    }
  }

  const handleCreateNeurocore = () => {
    setSelectedNeurocoreForEdit(null)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setSelectedNeurocoreForEdit(null)
    fetchNeurocores()
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedNeurocoreForEdit(null)
  }

  const handleDetailsClose = () => {
    setIsDetailsOpen(false)
    setSelectedNeurocoreForView(null)
  }

  const handleEditFromDetails = (neurocore: NeurocoreWithRelations) => {
    setIsDetailsOpen(false)
    setSelectedNeurocoreForEdit(neurocore)
    setIsFormOpen(true)
  }

  const handleToggleStatusFromDetails = async (neurocore: NeurocoreWithRelations) => {
    await handleToggleStatus(neurocore)
    // Update the selected neurocore for view with fresh data
    if (selectedNeurocoreForView?.id === neurocore.id) {
      const updatedNeurocore = neurocores.find(n => n.id === neurocore.id)
      if (updatedNeurocore) {
        setSelectedNeurocoreForView(updatedNeurocore)
      }
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar NeuroCores</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os neurocores e seus agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button size="sm" onClick={handleCreateNeurocore}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Neurocore
          </Button>
        </div>
      </div>

      {/* Filters */}
      <NeurocoreFilters
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        activeFilter={filters.is_active}
        onActiveFilterChange={handleActiveChange}
        hasActiveFilters={hasActiveFilters()}
        onClearFilters={handleClearFilters}
      />

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <NeurocoreTable
          neurocores={neurocores}
          isLoading={isLoading}
          onEdit={handleEdit}
          onView={handleView}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      </Card>

      {/* Pagination */}
      {!isLoading && neurocores.length > 0 && (
        <NeurocorePagination
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Footer Stats */}
      {!isLoading && (
        <div className="text-center text-sm text-muted-foreground">
          {hasActiveFilters() ? (
            <p>
              Mostrando {pagination.total} neurocore{pagination.total !== 1 ? 's' : ''} filtrado
              {pagination.total !== 1 ? 's' : ''}
            </p>
          ) : (
            <p>
              Total de {pagination.total} neurocore{pagination.total !== 1 ? 's' : ''} cadastrado
              {pagination.total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* Form Dialog */}
      <NeurocoreFormDialog
        open={isFormOpen}
        onOpenChange={handleFormClose}
        neurocore={selectedNeurocoreForEdit}
        onSuccess={handleFormSuccess}
      />

      {/* Details Drawer */}
      <NeurocoreDetailsDrawer
        neurocore={selectedNeurocoreForView}
        open={isDetailsOpen}
        onOpenChange={handleDetailsClose}
        onEdit={handleEditFromDetails}
        onToggleStatus={handleToggleStatusFromDetails}
      />
    </div>
  )
}
