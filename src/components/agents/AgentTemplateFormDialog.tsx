/**
 * AgentTemplateFormDialog
 * Dialog wrapper para o formulário de agent templates
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { AgentTemplateForm } from './AgentTemplateForm'
import { AgentTemplate } from '@/types/agent-template-extended.types'
import { useAgentTemplateStore } from '@/store/agentTemplate'

interface AgentTemplateFormDialogProps {
  open: boolean
  onClose: () => void
  template?: AgentTemplate | null
}

export function AgentTemplateFormDialog({
  open,
  onClose,
  template
}: AgentTemplateFormDialogProps) {
  const { createTemplate, updateTemplate, isSubmitting } = useAgentTemplateStore()
  const isEditing = Boolean(template)

  const handleSubmit = async (data: any) => {
    try {
      if (isEditing && template) {
        await updateTemplate(template.id, data)
      } else {
        await createTemplate(data)
      }
      onClose()
    } catch (error) {
      console.error('Error saving template:', error)
      // Error toast is already shown by the store
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Template' : 'Novo Template de Agent'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edite as informações do template. As alterações não afetam agents já criados.'
              : 'Crie um template de agent que pode ser reutilizado em múltiplos neurocores.'}
          </DialogDescription>
        </DialogHeader>

        <AgentTemplateForm
          template={template}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
}
