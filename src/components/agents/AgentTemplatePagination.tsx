/**
 * AgentTemplatePagination Component
 * Componente de paginação para listagem de templates
 */

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAgentTemplateStore } from '@/store/agentTemplate'

export function AgentTemplatePagination() {
  const { pagination, setPagination } = useAgentTemplateStore()

  const totalPages = Math.ceil(pagination.total / pagination.pageSize)
  const hasNextPage = pagination.page < totalPages
  const hasPreviousPage = pagination.page > 1

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPagination(newPage, pagination.pageSize)
    }
  }

  const handlePageSizeChange = (newSize: string) => {
    setPagination(1, Number(newSize))
  }

  // Don't show pagination if there are no results
  if (pagination.total === 0) {
    return null
  }

  const startItem = (pagination.page - 1) * pagination.pageSize + 1
  const endItem = Math.min(pagination.page * pagination.pageSize, pagination.total)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Mostrando <span className="font-medium text-foreground">{startItem}</span> a{' '}
        <span className="font-medium text-foreground">{endItem}</span> de{' '}
        <span className="font-medium text-foreground">{pagination.total}</span>{' '}
        {pagination.total === 1 ? 'template' : 'templates'}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Itens por página:</span>
          <Select
            value={String(pagination.pageSize)}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!hasPreviousPage}
            className="h-8"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>

          <div className="flex items-center gap-1">
            <span className="text-sm">
              Página{' '}
              <span className="font-medium">{pagination.page}</span> de{' '}
              <span className="font-medium">{totalPages}</span>
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!hasNextPage}
            className="h-8"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima página</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
