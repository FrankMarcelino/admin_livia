import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { singlePromptSchema, type SinglePromptInput } from '@/lib/validations/agentPromptValidation'
import { PromptTextarea } from './PromptTextarea'
import type { PromptTypeConfig } from '@/types/agent-prompts.types'

interface SinglePromptFormProps {
  config: PromptTypeConfig
  defaultValues?: SinglePromptInput
  onSubmit: (data: SinglePromptInput) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function SinglePromptForm({
  config,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false
}: SinglePromptFormProps) {
  const form = useForm<SinglePromptInput>({
    resolver: zodResolver(singlePromptSchema),
    defaultValues: { prompt: '' }
  })

  // Atualizar formulário quando defaultValues mudar
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  const handleSubmit = async (data: SinglePromptInput) => {
    await onSubmit(data)
    form.reset()
  }

  const fieldConfig = config.fields[0]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <PromptTextarea
          form={form}
          name={fieldConfig.name}
          label={fieldConfig.label}
          placeholder={fieldConfig.placeholder}
          description={fieldConfig.description}
          rows={fieldConfig.rows}
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
            Salvar Prompt
          </Button>
        </div>
      </form>
    </Form>
  )
}
