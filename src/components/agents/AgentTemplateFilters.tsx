/**
 * AgentTemplateFilters Component
 * Filtros para a listagem de templates de agents
 */

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useAgentTemplateFilters } from '@/hooks/useAgentTemplateFilters'

export function AgentTemplateFilters() {
  const {
    searchValue,
    typeValue,
    statusValue,
    onSearchChange,
    onTypeChange,
    onStatusChange,
    onResetFilters,
    hasActiveFilters
  } = useAgentTemplateFilters()

  return (
    <div className="space-y-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar templates..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type Filter */}
        <Select value={typeValue} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="attendant">Atendente</SelectItem>
            <SelectItem value="intention">Intenção</SelectItem>
            <SelectItem value="in_guard_rails">Guard Rails</SelectItem>
            <SelectItem value="observer">Observador</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusValue} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="w-full sm:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Filtros ativos:
          </span>

          {searchValue && (
            <Badge variant="secondary" className="gap-1">
              Busca: {searchValue}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onSearchChange('')}
              />
            </Badge>
          )}

          {typeValue !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Tipo: {getTypeLabel(typeValue)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onTypeChange('all')}
              />
            </Badge>
          )}

          {statusValue !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusValue === 'active' ? 'Ativo' : 'Inativo'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onStatusChange('all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Helper function to get type label
 */
function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    attendant: 'Atendente',
    intention: 'Intenção',
    in_guard_rails: 'Guard Rails',
    observer: 'Observador'
  }
  return labels[type] || type
}
