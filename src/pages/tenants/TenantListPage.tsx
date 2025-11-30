/**
 * TenantListPage
 * Página principal de gerenciamento de empresas (tenants)
 */

import { useEffect, useState } from 'react'
import { useTenantStore } from '@/store/tenant'
import { useTenantFilters } from '@/hooks/useTenantFilters'
import { TenantTable } from '@/components/tenants/TenantTable'
import { TenantFilters } from '@/components/tenants/TenantFilters'
import { TenantPagination } from '@/components/tenants/TenantPagination'
import { TenantFormDialog } from '@/components/tenants/TenantFormDialog'
import { TenantDetailsDrawer } from '@/components/tenants/TenantDetailsDrawer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, RefreshCw } from 'lucide-react'
import { TenantWithRelations } from '@/types/tenant-extended.types'

export function TenantListPage() {
  // Store
  const {
    tenants,
    isLoading,
    pagination,
    setFilters,
    setPagination,
    fetchTenants,
    activateTenant,
    deactivateTenant
  } = useTenantStore()

  // Filters hook
  const {
    filters,
    searchInput,
    handleSearchChange,
    handlePlanChange,
    handleActiveChange,
    clearFilters,
    hasActiveFilters
  } = useTenantFilters()

  // Local state for actions
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedTenantForEdit, setSelectedTenantForEdit] = useState<TenantWithRelations | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedTenantForView, setSelectedTenantForView] = useState<TenantWithRelations | null>(null)

  // Fetch tenants on mount and when filters change
  useEffect(() => {
    setFilters(filters)
  }, [filters, setFilters])

  useEffect(() => {
    fetchTenants()
  }, [fetchTenants])

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchTenants()
    setIsRefreshing(false)
  }

  const handleClearFilters = () => {
    clearFilters()
    // Filters will be synced via useEffect
  }

  const handlePageChange = (page: number) => {
    setPagination({ page })
  }

  const handlePageSizeChange = (pageSize: number) => {
    setPagination({ pageSize, page: 1 })
  }

  const handleEdit = (tenant: TenantWithRelations) => {
    setSelectedTenantForEdit(tenant)
    setIsFormOpen(true)
  }

  const handleView = (tenant: TenantWithRelations) => {
    setSelectedTenantForView(tenant)
    setIsDetailsOpen(true)
  }

  const handleToggleStatus = async (tenant: TenantWithRelations) => {
    if (tenant.is_active) {
      await deactivateTenant(tenant.id)
    } else {
      await activateTenant(tenant.id)
    }
  }

  const handleCreateTenant = () => {
    setSelectedTenantForEdit(null)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    fetchTenants()
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedTenantForEdit(null)
  }

  const handleDetailsClose = () => {
    setIsDetailsOpen(false)
    setSelectedTenantForView(null)
  }

  const handleEditFromDetails = (tenant: TenantWithRelations) => {
    setIsDetailsOpen(false)
    setSelectedTenantForEdit(tenant)
    setIsFormOpen(true)
  }

  const handleToggleStatusFromDetails = async (tenant: TenantWithRelations) => {
    await handleToggleStatus(tenant)
    // Update the selected tenant for view with fresh data
    if (selectedTenantForView?.id === tenant.id) {
      const updatedTenant = tenants.find(t => t.id === tenant.id)
      if (updatedTenant) {
        setSelectedTenantForView(updatedTenant)
      }
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Empresas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todas as empresas cadastradas na plataforma
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
          <Button size="sm" onClick={handleCreateTenant}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Empresa
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TenantFilters
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        selectedPlans={filters.plan || []}
        onPlanChange={handlePlanChange}
        activeFilter={filters.is_active}
        onActiveFilterChange={handleActiveChange}
        hasActiveFilters={hasActiveFilters()}
        onClearFilters={handleClearFilters}
      />

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <TenantTable
          tenants={tenants}
          isLoading={isLoading}
          onEdit={handleEdit}
          onView={handleView}
          onToggleStatus={handleToggleStatus}
        />
      </Card>

      {/* Pagination */}
      {!isLoading && tenants.length > 0 && (
        <TenantPagination
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
              Mostrando {pagination.total} empresa{pagination.total !== 1 ? 's' : ''} filtrada
              {pagination.total !== 1 ? 's' : ''}
            </p>
          ) : (
            <p>
              Total de {pagination.total} empresa{pagination.total !== 1 ? 's' : ''} cadastrada
              {pagination.total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* Form Dialog */}
      <TenantFormDialog
        open={isFormOpen}
        onOpenChange={handleFormClose}
        tenant={selectedTenantForEdit}
        onSuccess={handleFormSuccess}
      />

      {/* Details Drawer */}
      <TenantDetailsDrawer
        tenant={selectedTenantForView}
        open={isDetailsOpen}
        onOpenChange={handleDetailsClose}
        onEdit={handleEditFromDetails}
        onToggleStatus={handleToggleStatusFromDetails}
      />
    </div>
  )
}
