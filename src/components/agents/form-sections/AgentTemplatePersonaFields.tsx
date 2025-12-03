/**
 * AgentTemplatePersonaFields
 * Campos de informações da personalidade do agent
 */

import { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AgentTemplateCreateInput } from '@/types/agent-template-extended.types'

interface AgentTemplatePersonaFieldsProps {
  form: UseFormReturn<AgentTemplateCreateInput>
}

export function AgentTemplatePersonaFields({ form }: AgentTemplatePersonaFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informações Básicas</h3>
        <p className="text-sm text-muted-foreground">
          Configure a personalidade e características do agent
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Nome da Personalidade */}
        <FormField
          control={form.control}
          name="persona_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Personalidade</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Alex"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Nome que o agent usará para se identificar
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Idade */}
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Idade</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: 25"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Idade aparente da personalidade
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Sexo/Gênero */}
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sexo/Gênero</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Masculino, Feminino, Não especificado"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Identificação de gênero da personalidade
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Objetivo */}
      <FormField
        control={form.control}
        name="objective"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objetivo</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ex: Atender clientes com excelência e resolver problemas de forma eficiente"
                className="resize-none"
                rows={3}
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Objetivo principal do agent
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tom de Voz / Comunicação */}
      <FormField
        control={form.control}
        name="communication"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tom de Voz / Comunicação</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ex: Animado, cordial e profissional. Usa linguagem clara e acessível."
                className="resize-none"
                rows={3}
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Estilo de comunicação e tom de voz do agent
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Personalidade */}
      <FormField
        control={form.control}
        name="personality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Traços de Personalidade</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ex: Prestativo, paciente, empático, proativo e atencioso aos detalhes"
                className="resize-none"
                rows={3}
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Características e traços de personalidade do agent
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
