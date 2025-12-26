import { LucideIcon } from 'lucide-react'

// Base para todos os prompts
export interface BasePromptConfig {
  id: string
  id_tenant: string | null
  created_at: string
  updated_at: string
}

// Tipos específicos
export interface GuardRailsPrompt extends BasePromptConfig {
  prompt_jailbreak: string
  prompt_nsfw: string
}

export interface SingleFieldPrompt extends BasePromptConfig {
  prompt: string
}

export type ObserverPrompt = SingleFieldPrompt
export type IntentionPrompt = SingleFieldPrompt
export type SystemPrompt = SingleFieldPrompt

// Discriminador de tipo
export type PromptType = 'guard_rails' | 'observer' | 'intention' | 'system'

// Configuração de campo
export interface PromptFieldConfig {
  name: string
  label: string
  placeholder: string
  description?: string
  rows?: number
}

// Configuração de tipo de prompt (metadados)
export interface PromptTypeConfig {
  type: PromptType
  label: string
  description: string
  icon: LucideIcon
  tableName: string
  fields: PromptFieldConfig[]
}

// Tipos para inserção (sem id/timestamps/tenant)
export interface GuardRailsPromptInsert {
  prompt_jailbreak: string
  prompt_nsfw: string
}

export interface SinglePromptInsert {
  prompt: string
}
