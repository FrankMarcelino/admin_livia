/**
 * TenantFilters Component
 * Componente de filtros para listagem de tenants
 */

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, X, Filter } from 'lucide-react'
import { TenantPlan } from '@/types/database.types'

interface TenantFiltersProps {
  searchInput: string
  onSearchChange: (value: string) => void
  selectedPlans: TenantPlan[]
  onPlanChange: (plans: TenantPlan[]) => void
  activeFilter?: boolean
  onActiveFilterChange: (value: boolean | undefined) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export function TenantFilters({
  searchInput,
  onSearchChange,
  selectedPlans,
  onPlanChange,
  activeFilter,
  onActiveFilterChange,
  hasActiveFilters,
  onClearFilters
}: TenantFiltersProps) {
  const plans: { value: TenantPlan; label: string }[] = [
    { value: 'basic', label: 'Basic' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise' }
  ]

  const togglePlan = (plan: TenantPlan) => {
    if (selectedPlans.includes(plan)) {
      onPlanChange(selectedPlans.filter(p => p !== plan))
    } else {
      onPlanChange([...selectedPlans, plan])
    }
  }

  const getPlanBadgeVariant = (plan: TenantPlan) => {
    switch (plan) {
      case 'basic':
        return 'secondary'
      case 'pro':
        return 'default'
      case 'enterprise':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-4 rounded-lg border p-4 bg-card">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-xs"
          >
            <X className="mr-1 h-3 w-3" />
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nome ou CNPJ..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Plan Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Plano
          </label>
          <div className="flex flex-wrap gap-2">
            {plans.map(({ value, label }) => (
              <Badge
                key={value}
                variant={selectedPlans.includes(value) ? getPlanBadgeVariant(value) : 'outline'}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => togglePlan(value)}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={activeFilter === true ? 'default' : 'outline'}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onActiveFilterChange(activeFilter === true ? undefined : true)}
            >
              Ativa
            </Badge>
            <Badge
              variant={activeFilter === false ? 'destructive' : 'outline'}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onActiveFilterChange(activeFilter === false ? undefined : false)}
            >
              Inativa
            </Badge>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-2 border-t">
          <div className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground">
            <span>Filtros ativos:</span>
            {searchInput && (
              <Badge variant="secondary" className="text-xs">
                Busca: {searchInput}
              </Badge>
            )}
            {selectedPlans.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {selectedPlans.length} plano{selectedPlans.length > 1 ? 's' : ''}
              </Badge>
            )}
            {activeFilter !== undefined && (
              <Badge variant="secondary" className="text-xs">
                {activeFilter ? 'Ativas' : 'Inativas'}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
