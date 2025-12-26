import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { guardRailsPromptSchema, type GuardRailsPromptInput } from '@/lib/validations/agentPromptValidation'
import { PromptTextarea } from './PromptTextarea'
import { PROMPT_TYPE_CONFIGS } from '@/lib/config/promptTypeConfigs'

interface GuardRailsPromptFormProps {
  defaultValues?: GuardRailsPromptInput
  onSubmit: (data: GuardRailsPromptInput) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function GuardRailsPromptForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false
}: GuardRailsPromptFormProps) {
  const config = PROMPT_TYPE_CONFIGS.guard_rails

  const form = useForm<GuardRailsPromptInput>({
    resolver: zodResolver(guardRailsPromptSchema),
    defaultValues: {
      prompt_jailbreak: '',
      prompt_nsfw: ''
    }
  })

  // Atualizar formulário quando defaultValues mudar
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  const handleSubmit = async (data: GuardRailsPromptInput) => {
    await onSubmit(data)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <PromptTextarea
          form={form}
          name={config.fields[0].name}
          label={config.fields[0].label}
          placeholder={config.fields[0].placeholder}
          description={config.fields[0].description}
          rows={config.fields[0].rows}
        />

        <PromptTextarea
          form={form}
          name={config.fields[1].name}
          label={config.fields[1].label}
          placeholder={config.fields[1].placeholder}
          description={config.fields[1].description}
          rows={config.fields[1].rows}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Prompts
          </Button>
        </div>
      </form>
    </Form>
  )
}
