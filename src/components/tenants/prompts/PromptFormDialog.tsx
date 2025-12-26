import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useAgentPromptsStore } from '@/store/agentPrompts'
import { PROMPT_TYPE_CONFIGS } from '@/lib/config/promptTypeConfigs'
import { GuardRailsPromptForm } from './GuardRailsPromptForm'
import { SinglePromptForm } from './SinglePromptForm'
import type { PromptType } from '@/types/agent-prompts.types'

interface PromptFormDialogProps {
  open: boolean
  onClose: () => void
  promptType: PromptType
  tenantId: string
  tenantName: string
}

export function PromptFormDialog({
  open,
  onClose,
  promptType,
  tenantId,
  tenantName
}: PromptFormDialogProps) {
  const config = PROMPT_TYPE_CONFIGS[promptType]
  const {
    guardRails,
    observer,
    intention,
    system,
    isSubmitting,
    fetchPromptByType,
    upsertPrompt
  } = useAgentPromptsStore()

  // Carregar prompt existente quando abrir dialog
  useEffect(() => {
    if (open && tenantId) {
      fetchPromptByType(promptType, tenantId)
    }
  }, [open, promptType, tenantId, fetchPromptByType])

  const handleSubmit = async (data: any) => {
    await upsertPrompt(promptType, tenantId, data)
    onClose()
  }

  // Obter valores atuais baseado no tipo
  const getCurrentValues = () => {
    switch (promptType) {
      case 'guard_rails':
        return guardRails ? {
          prompt_jailbreak: guardRails.prompt_jailbreak,
          prompt_nsfw: guardRails.prompt_nsfw
        } : undefined
      case 'observer':
        return observer ? { prompt: observer.prompt } : undefined
      case 'intention':
        return intention ? { prompt: intention.prompt } : undefined
      case 'system':
        return system ? { prompt: system.prompt } : undefined
    }
  }

  const Icon = config.icon

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Icon className="h-5 w-5" />
            {config.label} - {tenantName}
          </DialogTitle>
          <DialogDescription className="text-base">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {promptType === 'guard_rails' ? (
            <GuardRailsPromptForm
              defaultValues={getCurrentValues() as any}
              onSubmit={handleSubmit}
              onCancel={onClose}
              isSubmitting={isSubmitting}
            />
          ) : (
            <SinglePromptForm
              config={config}
              defaultValues={getCurrentValues() as any}
              onSubmit={handleSubmit}
              onCancel={onClose}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
