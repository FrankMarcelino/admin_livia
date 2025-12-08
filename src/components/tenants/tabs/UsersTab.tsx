/**
 * UsersTab Component
 * Placeholder para gerenciamento de usuários do tenant (FUTURO)
 */

interface UsersTabProps {
  tenantId?: string
}

/**
 * Tab de usuários (placeholder para implementação futura)
 */
export function UsersTab({ tenantId }: UsersTabProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
      <p className="text-muted-foreground text-lg font-medium">
        Gerenciamento de usuários em desenvolvimento
      </p>
      <p className="text-sm text-muted-foreground max-w-md">
        Esta funcionalidade será implementada em breve. Você poderá criar e gerenciar usuários do tenant diretamente nesta tela.
      </p>
      {tenantId && (
        <p className="text-xs text-muted-foreground mt-4">
          Tenant ID: {tenantId}
        </p>
      )}
    </div>
  )
}
