/**
 * AgentFormDialog Component
 * Dialog para criar/editar agent individual
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { agentFormSchema, AgentFormInput } from '@/lib/validations/neurocoreValidation'
import { AgentFormData } from './NeurocoreForm'
import { AgentFunction } from '@/types/database.types'

interface AgentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agent?: AgentFormData | null
  onSuccess: (agent: AgentFormData) => void
}

export function AgentFormDialog({
  open,
  onOpenChange,
  agent,
  onSuccess
}: AgentFormDialogProps) {
  const isEditing = !!agent

  // Form setup
  const form = useForm<AgentFormInput>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: agent
      ? {
          name: agent.name,
          type: agent.type as AgentFunction,
          reactive: agent.reactive
        }
      : {
          name: '',
          type: 'attendant' as AgentFunction,
          reactive: true
        }
  })

  // Reset form when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
    }
    onOpenChange(open)
  }

  // Submit handler
  function onSubmit(data: AgentFormInput, e?: React.BaseSyntheticEvent) {
    // Prevent event propagation to parent forms
    e?.preventDefault()
    e?.stopPropagation()

    // Pass data back to parent (preserving id if editing)
    onSuccess({
      ...agent, // Preserve existing fields like id
      name: data.name,
      type: data.type,
      reactive: data.reactive
    } as AgentFormData)

    form.reset()
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Agent' : 'Novo Agent'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize as informações do agent abaixo.'
              : 'Preencha as informações para adicionar um novo agent.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit(onSubmit)(e)
            }}
            className="space-y-4"
          >
            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Agent *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Agent Recepcionista" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nome descritivo do agent (mínimo 3 caracteres)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo do Agent *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="attendant">Atendente</SelectItem>
                      <SelectItem value="intention">Intenções</SelectItem>
                      <SelectItem value="in_guard_rails">In Guard Rails</SelectItem>
                      <SelectItem value="observer">Observador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Função principal que o agent desempenhará
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reactive/Proactive */}
            <FormField
              control={form.control}
              name="reactive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Modo do Agent</FormLabel>
                    <FormDescription>
                      {field.value
                        ? 'Reativo: responde apenas quando acionado'
                        : 'Proativo: pode iniciar conversas'}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Atualizar' : 'Adicionar'} Agent
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
