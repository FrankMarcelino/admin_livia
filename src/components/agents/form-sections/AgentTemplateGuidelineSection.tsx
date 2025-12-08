/**
 * AgentTemplateGuidelineSection
 * Seção de roteiro/guideline com etapas e sub-instruções
 * Nova estrutura: type (rank/markdown), active, sub com objetos {content, active}
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
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
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
    appendStep({
      title: '',
      type: 'rank',
      active: true,
      sub: [{ content: '', active: true }]
    })
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
        Use "rank" para numeração e "markdown" para formatação.
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
  const { fields: subInstructions, append, remove } = useFieldArray({
    control: form.control,
    name: `guide_line.${stepIndex}.sub`
  })

  const stepTitle = form.watch(`guide_line.${stepIndex}.title`)
  const stepActive = form.watch(`guide_line.${stepIndex}.active`)

  return (
    <Card className={!stepActive ? 'opacity-60' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
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
              {!stepActive && <span className="ml-2 text-xs text-muted-foreground">(Inativa)</span>}
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
                    placeholder="Ex: Roteiro de Suporte"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo */}
            <FormField
              control={form.control}
              name={`guide_line.${stepIndex}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="rank">
                        Rank (numerado)
                      </SelectItem>
                      <SelectItem value="markdown">
                        Markdown (formatado)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Ativo */}
            <FormField
              control={form.control}
              name={`guide_line.${stepIndex}.active`}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end">
                  <FormLabel>Status</FormLabel>
                  <div className="flex items-center space-x-2 rounded-lg border p-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <span className="text-sm">
                      {field.value ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Sub-instruções */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Instruções desta Etapa
            </label>
            {subInstructions.map((subInstruction, subIndex) => (
              <div key={subInstruction.id} className="flex gap-2 items-start">
                <FormField
                  control={form.control}
                  name={`guide_line.${stepIndex}.sub.${subIndex}.content`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Ex: Identifique o motivo do contato"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`guide_line.${stepIndex}.sub.${subIndex}.active`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center h-10">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=unchecked]:opacity-50"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {subInstructions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(subIndex)}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remover instrução</span>
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => append({ content: '', active: true })}
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
