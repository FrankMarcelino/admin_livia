import { z } from 'zod'

/**
 * Schema Zod para criação de neurocore
 */
export const neurocoreCreateSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  description: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),

  id_subwork_n8n_neurocore: z.string()
    .min(1, 'ID do Workflow N8N é obrigatório')
    .regex(/^[a-zA-Z0-9_-]+$/, 'ID deve conter apenas letras, números, hífen e underscore'),

  is_active: z.boolean()
})

/**
 * Schema Zod para atualização de neurocore (todos os campos opcionais)
 */
export const neurocoreUpdateSchema = neurocoreCreateSchema.partial()

/**
 * Schema Zod para criação de agent
 */
export const agentCreateSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  type: z.string()
    .min(1, 'Tipo do agente é obrigatório')
    .max(50, 'Tipo deve ter no máximo 50 caracteres'),

  id_neurocore: z.string()
    .uuid('ID do Neurocore inválido'),

  reactive: z.boolean()
})

/**
 * Schema Zod para atualização de agent (todos os campos opcionais)
 */
export const agentUpdateSchema = agentCreateSchema.partial()

/**
 * Tipo inferido do schema de criação de neurocore
 */
export type NeurocoreCreateInput = z.infer<typeof neurocoreCreateSchema>

/**
 * Tipo inferido do schema de atualização de neurocore
 */
export type NeurocoreUpdateInput = z.infer<typeof neurocoreUpdateSchema>

/**
 * Tipo inferido do schema de criação de agent
 */
export type AgentCreateInput = z.infer<typeof agentCreateSchema>

/**
 * Tipo inferido do schema de atualização de agent
 */
export type AgentUpdateInput = z.infer<typeof agentUpdateSchema>
