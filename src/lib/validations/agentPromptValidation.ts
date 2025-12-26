import { z } from 'zod'

const promptFieldSchema = z
  .string()
  .min(10, 'Prompt deve ter no mínimo 10 caracteres')
  .max(5000, 'Prompt deve ter no máximo 5000 caracteres')

export const guardRailsPromptSchema = z.object({
  prompt_jailbreak: promptFieldSchema,
  prompt_nsfw: promptFieldSchema
})

export const singlePromptSchema = z.object({
  prompt: promptFieldSchema
})

export type GuardRailsPromptInput = z.infer<typeof guardRailsPromptSchema>
export type SinglePromptInput = z.infer<typeof singlePromptSchema>
