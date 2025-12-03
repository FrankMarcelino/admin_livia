/**
 * AgentTemplateForm
 * Formulário master com Tabs para criar/editar templates de agents
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import {
  AgentTemplateCreateInput,
  AgentTemplateUpdateInput,
  AgentTemplate
} from '@/types/agent-template-extended.types'
import { agentTemplateCreateSchema } from '@/lib/validations/agentTemplateValidation'
import { AgentTemplateBasicFields } from './form-sections/AgentTemplateBasicFields'
import { AgentTemplatePersonaFields } from './form-sections/AgentTemplatePersonaFields'
import { AgentTemplateLimitationsSection } from './form-sections/AgentTemplateLimitationsSection'
import { AgentTemplateInstructionsSection } from './form-sections/AgentTemplateInstructionsSection'
import { AgentTemplateGuidelineSection } from './form-sections/AgentTemplateGuidelineSection'

interface AgentTemplateFormProps {
  template?: AgentTemplate | null
  onSubmit: (data: AgentTemplateCreateInput | AgentTemplateUpdateInput) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function AgentTemplateForm({
  template,
  onSubmit,
  onCancel,
  isSubmitting = false
}: AgentTemplateFormProps) {
  const isEditing = Boolean(template)

  // Form initialization
  const form = useForm<AgentTemplateCreateInput>({
    resolver: zodResolver(agentTemplateCreateSchema) as any,
    defaultValues: isEditing && template
      ? {
          name: template.name,
          type: template.type,
          reactive: template.reactive,
          persona_name: template.persona_name || '',
          age: template.age || '',
          gender: template.gender || '',
          objective: template.objective || '',
          communication: template.communication || '',
          personality: template.personality || '',
          limitations: template.limitations || [],
          instructions: template.instructions || [],
          guide_line: template.guide_line || [],
          rules: template.rules,
          others_instructions: template.others_instructions
        }
      : {
          name: '',
          type: 'attendant',
          reactive: true,
          persona_name: '',
          age: '',
          gender: '',
          objective: '',
          communication: '',
          personality: '',
          limitations: [],
          instructions: [],
          guide_line: []
        }
  })

  const handleSubmit = async (data: AgentTemplateCreateInput) => {
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  // Get form errors for display
  const limitationsError = form.formState.errors.limitations?.message
  const hasErrors = Object.keys(form.formState.errors).length > 0

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Display form-level validation errors */}
        {hasErrors && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm font-medium text-destructive mb-2">
              Por favor, corrija os seguintes erros:
            </p>
            <ul className="text-sm text-destructive list-disc list-inside space-y-1">
              {form.formState.errors.name && (
                <li>{form.formState.errors.name.message}</li>
              )}
              {form.formState.errors.type && (
                <li>{form.formState.errors.type.message}</li>
              )}
              {limitationsError && <li>{limitationsError}</li>}
            </ul>
          </div>
        )}

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="persona">Personalidade</TabsTrigger>
            <TabsTrigger value="limitations">Limitações</TabsTrigger>
            <TabsTrigger value="instructions">Instruções</TabsTrigger>
            <TabsTrigger value="guideline">Roteiro</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="basic" className="space-y-4">
              <AgentTemplateBasicFields form={form} />
            </TabsContent>

            <TabsContent value="persona" className="space-y-4">
              <AgentTemplatePersonaFields form={form} />
            </TabsContent>

            <TabsContent value="limitations" className="space-y-4">
              <AgentTemplateLimitationsSection form={form} />
            </TabsContent>

            <TabsContent value="instructions" className="space-y-4">
              <AgentTemplateInstructionsSection form={form} />
            </TabsContent>

            <TabsContent value="guideline" className="space-y-4">
              <AgentTemplateGuidelineSection form={form} />
            </TabsContent>
          </div>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 border-t pt-6">
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
            {isEditing ? 'Salvar Alterações' : 'Criar Template'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
