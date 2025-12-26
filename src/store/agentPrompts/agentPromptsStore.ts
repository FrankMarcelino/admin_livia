import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createAgentPromptsCrudSlice } from './agentPromptsStore.crud'
import type { AgentPromptsStore } from './agentPromptsStore.types'

export const useAgentPromptsStore = create<AgentPromptsStore>()(
  devtools(
    (...a) => ({
      ...createAgentPromptsCrudSlice(...a)
    }),
    { name: 'agent-prompts-store' }
  )
)
