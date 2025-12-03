/**
 * AgentTemplateInstructionsSection
 * Seção de lista dinâmica de instruções (coisas que o agent DEVE fazer)
 */

import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import { AgentTemplateCreateInput } from '@/types/agent-template-extended.types'

interface AgentTemplateInstructionsSectionProps {
  form: UseFormReturn<AgentTemplateCreateInput>
}

export function AgentTemplateInstructionsSection({
  form
}: AgentTemplateInstructionsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'instructions'
  })

  const handleAddInstruction = () => {
    append('')
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Instruções</h3>
        <p className="text-sm text-muted-foreground">
          Defina o que o agent <strong>DEVE</strong> fazer
        </p>
      </div>

      {/* Lista de Instruções */}
      <div className="space-y-4">
        {fields.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma instrução adicionada ainda
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Clique no botão abaixo para adicionar a primeira instrução
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`instructions.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">
                      Instrução {index + 1}
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder={`Ex: Cumprimentar cliente pelo nome se disponível`}
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remover instrução</span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddInstruction}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Instrução
        </Button>
      </div>

      <FormDescription className="text-xs">
        💡 <strong>Dica:</strong> Instruções definem o comportamento esperado do agent.
        Pelo menos 1 limitação ou 1 instrução deve ser definida.
      </FormDescription>
    </div>
  )
}
