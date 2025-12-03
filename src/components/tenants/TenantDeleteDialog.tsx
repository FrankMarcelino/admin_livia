/**
 * TenantDeleteDialog Component
 * Dialog de confirmação para desativação de tenant com cálculo de impactos
 */

import { useState, useEffect } from 'react'
import { TenantWithRelations } from '@/types/tenant-extended.types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertTriangle, Users, UserCircle, MessageCircle, Radio } from 'lucide-react'
import { useTenantStats } from '@/hooks/useTenantStats'
import { Skeleton } from '@/components/ui/skeleton'

interface TenantDeleteDialogProps {
  tenant: TenantWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (tenant: TenantWithRelations) => Promise<void>
}

export function TenantDeleteDialog({
  tenant,
  open,
  onOpenChange,
  onConfirm,
}: TenantDeleteDialogProps) {
  const [confirmText, setConfirmText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { stats, isLoading: isLoadingStats } = useTenantStats(tenant?.id || null)

  // Reset confirmText when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setConfirmText('')
    }
  }, [open])

  if (!tenant) return null

  const isConfirmValid = confirmText === tenant.name
  const hasActiveData = stats && (
    stats.total_users > 0 ||
    stats.total_contacts > 0 ||
    stats.total_conversations > 0 ||
    stats.total_channels > 0
  )

  const handleConfirm = async () => {
    if (!isConfirmValid) return

    setIsLoading(true)
    try {
      await onConfirm(tenant)
      onOpenChange(false)
    } catch (error) {
      console.error('Error deactivating tenant:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Desativar Empresa
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Você está prestes a desativar a empresa{' '}
            <span className="font-semibold text-foreground">{tenant.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning Message */}
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">
                  Atenção: Esta ação desativará todos os serviços
                </p>
                <p className="text-sm text-muted-foreground">
                  A empresa será marcada como inativa e perderá acesso ao sistema.
                  Os dados serão preservados e podem ser reativados posteriormente.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Impact Statistics */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Impactos da Desativação</h4>
            {isLoadingStats ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : stats ? (
              <>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.total_users}</p>
                      <p className="text-xs text-muted-foreground">Usuários afetados</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                      <UserCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.total_contacts}</p>
                      <p className="text-xs text-muted-foreground">Contatos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                      <MessageCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.total_conversations}</p>
                      <p className="text-xs text-muted-foreground">Conversas ativas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                      <Radio className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.total_channels}</p>
                      <p className="text-xs text-muted-foreground">Canais configurados</p>
                    </div>
                  </div>
                </div>
                {hasActiveData && (
                  <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Esta empresa possui dados ativos que serão desativados</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Não foi possível carregar estatísticas</p>
            )}
          </div>

          <Separator />

          {/* Confirmation Input */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="confirm-name" className="text-sm font-medium">
                Para confirmar, digite o nome da empresa:
              </Label>
              <div className="mt-2">
                <Badge variant="secondary" className="font-mono">
                  {tenant.name}
                </Badge>
              </div>
            </div>
            <Input
              id="confirm-name"
              placeholder="Digite o nome exato da empresa"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={isLoading}
              className={confirmText && !isConfirmValid ? 'border-destructive' : ''}
            />
            {confirmText && !isConfirmValid && (
              <p className="text-xs text-destructive">
                O nome digitado não corresponde ao nome da empresa
              </p>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmValid || isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Desativando...' : 'Desativar Empresa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
