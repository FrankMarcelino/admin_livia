import type {
  GuardRailsPrompt,
  ObserverPrompt,
  IntentionPrompt,
  SystemPrompt,
  PromptType
} from '@/types/agent-prompts.types'

export interface AgentPromptsState {
  guardRails: GuardRailsPrompt | null
  observer: ObserverPrompt | null
  intention: IntentionPrompt | null
  system: SystemPrompt | null

  isLoading: boolean
  isSubmitting: boolean
  error: string | null

  currentTenantId: string | null
}

export interface AgentPromptsActions {
  fetchPromptByType: (type: PromptType, tenantId: string) => Promise<void>
  upsertPrompt: (type: PromptType, tenantId: string, data: any) => Promise<void>
  setCurrentTenantId: (tenantId: string | null) => void
  reset: () => void
}

export interface AgentPromptsStore extends AgentPromptsState, AgentPromptsActions {}
