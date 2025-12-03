import { z } from 'zod'

/**
 * Guideline step schema
 * Each step must have a title and at least one instruction
 */
const guidelineStepSchema = z.object({
  title: z.string().min(3, 'Título da etapa deve ter no mínimo 3 caracteres'),
  steps: z
    .array(z.string().min(1, 'Instrução não pode estar vazia'))
    .min(1, 'Etapa deve ter pelo menos 1 instrução')
})

/**
 * Schema for creating a new agent template
 * 
 * Validation rules:
 * - Name: required, 3-100 characters
 * - Type: required, must be valid AgentFunction
 * - Reactive: required boolean
 * - At least 1 limitation OR 1 instruction must be provided
 */
export const agentTemplateCreateSchema = z
  .object({
    // Technical Structure (required)
    name: z
      .string()
      .min(3, 'Nome deve ter no mínimo 3 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres'),
    type: z.enum(['attendant', 'intention', 'in_guard_rails', 'observer'], {
      message: 'Tipo de agent inválido'
    }),
    reactive: z.boolean(),

    // Persona Information (optional)
    persona_name: z.string().optional(),
    age: z.string().optional(),
    gender: z.string().optional(),
    objective: z.string().optional(),
    communication: z.string().optional(),
    personality: z.string().optional(),

    // Complex Configurations (optional)
    limitations: z.array(z.string().min(1)).optional(),
    instructions: z.array(z.string().min(1)).optional(),
    guide_line: z.array(guidelineStepSchema).optional(),
    rules: z.any().optional(),
    others_instructions: z.any().optional()
  })
  .refine(
    (data) => {
      // At least 1 limitation OR 1 instruction must be defined
      const hasLimitations = data.limitations && data.limitations.length > 0
      const hasInstructions = data.instructions && data.instructions.length > 0
      return hasLimitations || hasInstructions
    },
    {
      message: 'Template deve ter pelo menos 1 limitação ou 1 instrução',
      path: ['limitations'] // Show error on limitations field
    }
  )

/**
 * Schema for updating an existing agent template
 * All fields are optional (partial update)
 */
export const agentTemplateUpdateSchema = agentTemplateCreateSchema.partial()

/**
 * Type inference from Zod schemas
 */
export type AgentTemplateCreateInput = z.infer<typeof agentTemplateCreateSchema>
export type AgentTemplateUpdateInput = z.infer<typeof agentTemplateUpdateSchema>

/**
 * Helper function to validate agent template creation
 * Returns validation result with typed data or errors
 */
export function validateAgentTemplateCreate(data: unknown) {
  return agentTemplateCreateSchema.safeParse(data)
}

/**
 * Helper function to validate agent template update
 * Returns validation result with typed data or errors
 */
export function validateAgentTemplateUpdate(data: unknown) {
  return agentTemplateUpdateSchema.safeParse(data)
}
