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
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { agentCreateSchema, AgentCreateInput } from '@/lib/validations/neurocoreValidation'
import { AgentFormData } from './NeurocoreForm'

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
  const form = useForm<AgentCreateInput>({
    resolver: zodResolver(agentCreateSchema),
    defaultValues: agent
      ? {
          name: agent.name,
          type: agent.type,
          reactive: agent.reactive,
          id_neurocore: agent.id_neurocore || '' // Will be set by parent
        }
      : {
          name: '',
          type: '',
          reactive: true,
          id_neurocore: '' // Will be set by parent
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
  function onSubmit(data: AgentCreateInput) {
    // Pass data back to parent (preserving id if editing)
    onSuccess({
      ...agent, // Preserve existing fields like id
      name: data.name,
      type: data.type,
      reactive: data.reactive
    } as AgentFormData)

    form.reset()
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <FormControl>
                    <Input placeholder="Ex: receptionist, sales_rep, support" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tipo genérico que define a função do agent
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
