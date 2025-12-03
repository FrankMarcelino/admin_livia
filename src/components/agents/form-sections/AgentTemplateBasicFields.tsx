/**
 * AgentTemplateBasicFields
 * Campos básicos da estrutura técnica do agent template
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { AgentTemplateCreateInput } from '@/types/agent-template-extended.types'

interface AgentTemplateBasicFieldsProps {
  form: UseFormReturn<AgentTemplateCreateInput>
}

export function AgentTemplateBasicFields({ form }: AgentTemplateBasicFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Estrutura Técnica</h3>
        <p className="text-sm text-muted-foreground">
          Configure as informações básicas e técnicas do template
        </p>
      </div>

      {/* Nome do Agent */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Template *</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Recepcionista Padrão"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Nome identificador do template (3-100 caracteres)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Tipo do Agent */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo do Agent *</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="attendant">
                    <div className="flex flex-col items-start">
                      <span>Atendente</span>
                      <span className="text-xs text-muted-foreground">
                        Interage diretamente com clientes
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="intention">
                    <div className="flex flex-col items-start">
                      <span>Intenção</span>
                      <span className="text-xs text-muted-foreground">
                        Identifica intenções do usuário
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="in_guard_rails">
                    <div className="flex flex-col items-start">
                      <span>Guard Rails</span>
                      <span className="text-xs text-muted-foreground">
                        Monitora e previne comportamentos
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="observer">
                    <div className="flex flex-col items-start">
                      <span>Observador</span>
                      <span className="text-xs text-muted-foreground">
                        Observa e analisa interações
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Função principal do agent
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Modo do Agent */}
        <FormField
          control={form.control}
          name="reactive"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Modo do Agent *</FormLabel>
              <div className="flex items-center space-x-4 rounded-lg border p-4">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {field.value ? 'Reativo' : 'Proativo'}
                  </FormLabel>
                  <FormDescription>
                    {field.value
                      ? 'Responde quando acionado'
                      : 'Age por iniciativa própria'}
                  </FormDescription>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
