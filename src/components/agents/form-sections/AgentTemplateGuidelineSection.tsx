/**
 * AgentTemplateGuidelineSection
 * Seção de roteiro/guideline com etapas e sub-instruções
 */

import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { AgentTemplateCreateInput } from '@/types/agent-template-extended.types'
import { useState } from 'react'

interface AgentTemplateGuidelineSectionProps {
  form: UseFormReturn<AgentTemplateCreateInput>
}

export function AgentTemplateGuidelineSection({
  form
}: AgentTemplateGuidelineSectionProps) {
  const { fields: steps, append: appendStep, remove: removeStep } = useFieldArray({
    control: form.control,
    name: 'guide_line'
  })

  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]))

  const toggleStepExpanded = (index: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const handleAddStep = () => {
    appendStep({ title: '', steps: [''] })
    // Expand the newly added step
    setExpandedSteps((prev) => new Set([...prev, steps.length]))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Roteiro / Guideline</h3>
        <p className="text-sm text-muted-foreground">
          Defina um fluxo estruturado em etapas para o agent seguir
        </p>
      </div>

      {/* Lista de Etapas */}
      <div className="space-y-4">
        {steps.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma etapa adicionada ainda
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Clique no botão abaixo para criar o primeiro passo do roteiro
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {steps.map((step, stepIndex) => (
              <StepCard
                key={step.id}
                form={form}
                stepIndex={stepIndex}
                isExpanded={expandedSteps.has(stepIndex)}
                onToggleExpanded={() => toggleStepExpanded(stepIndex)}
                onRemove={() => {
                  removeStep(stepIndex)
                  setExpandedSteps((prev) => {
                    const next = new Set(prev)
                    next.delete(stepIndex)
                    return next
                  })
                }}
              />
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddStep}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Etapa
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        💡 <strong>Dica:</strong> Organize o atendimento em etapas sequenciais.
        Cada etapa pode ter múltiplas instruções.
      </p>
    </div>
  )
}

/**
 * Card para cada etapa do guideline
 */
interface StepCardProps {
  form: UseFormReturn<AgentTemplateCreateInput>
  stepIndex: number
  isExpanded: boolean
  onToggleExpanded: () => void
  onRemove: () => void
}

function StepCard({
  form,
  stepIndex,
  isExpanded,
  onToggleExpanded,
  onRemove
}: StepCardProps) {
  const { fields: substeps, append, remove } = useFieldArray({
    control: form.control,
    name: `guide_line.${stepIndex}.steps`
  })

  const stepTitle = form.watch(`guide_line.${stepIndex}.title`)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onToggleExpanded}
            className="flex flex-1 items-center gap-2 text-left"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )}
            <CardTitle className="text-base">
              {stepTitle || `Etapa ${stepIndex + 1}`}
            </CardTitle>
          </button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 shrink-0"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remover etapa</span>
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 pt-0">
          {/* Título da Etapa */}
          <FormField
            control={form.control}
            name={`guide_line.${stepIndex}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título da Etapa</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Etapa 1: Saudação e Identificação"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sub-instruções */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Instruções desta Etapa
            </label>
            {substeps.map((substep, substepIndex) => (
              <FormField
                key={substep.id}
                control={form.control}
                name={`guide_line.${stepIndex}.steps.${substepIndex}`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder={`Ex: Saudar o cliente de forma amigável`}
                          {...field}
                        />
                      </FormControl>
                      {substeps.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(substepIndex)}
                          className="shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover instrução</span>
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => append('')}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Instrução
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
