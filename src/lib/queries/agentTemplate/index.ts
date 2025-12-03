/**
 * Agent Template Queries
 * 
 * Modular query functions for agent_templates table operations
 */

// Fetch queries
export {
  fetchAgentTemplates,
  fetchAgentTemplateById,
  fetchActiveAgentTemplates,
  type FetchAgentTemplatesParams
} from './agent-template-fetch.queries'

// CRUD queries
export {
  createAgentTemplate,
  updateAgentTemplate,
  deleteAgentTemplate,
  toggleAgentTemplateStatus
} from './agent-template-crud.queries'

// Statistics queries
export {
  getAgentTemplateUsageStats,
  getTotalTemplatesCount,
  getActiveTemplatesCount
} from './agent-template-stats.queries'
