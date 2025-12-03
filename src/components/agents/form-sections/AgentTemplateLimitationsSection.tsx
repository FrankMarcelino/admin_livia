/**
 * AgentTemplateLimitationsSection
 * Seção de lista dinâmica de limitações (coisas que o agent NÃO deve fazer)
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

interface AgentTemplateLimitationsSectionProps {
  form: UseFormReturn<AgentTemplateCreateInput>
}

export function AgentTemplateLimitationsSection({
  form
}: AgentTemplateLimitationsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'limitations'
  })

  const handleAddLimitation = () => {
    append('')
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Limitações</h3>
        <p className="text-sm text-muted-foreground">
          Defina o que o agent <strong>NÃO</strong> deve fazer
        </p>
      </div>

      {/* Lista de Limitações */}
      <div className="space-y-4">
        {fields.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma limitação adicionada ainda
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Clique no botão abaixo para adicionar a primeira limitação
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`limitations.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">
                      Limitação {index + 1}
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder={`Ex: Não discutir política ou religião`}
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
                        <span className="sr-only">Remover limitação</span>
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
          onClick={handleAddLimitation}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Limitação
        </Button>
      </div>

      <FormDescription className="text-xs">
        💡 <strong>Dica:</strong> Limitações ajudam a definir os limites de atuação do
        agent. Pelo menos 1 limitação ou 1 instrução deve ser definida.
      </FormDescription>
    </div>
  )
}
