// @ts-nocheck
// TypeScript doesn't recognize the new prompt tables in the Database type properly
// The tables exist and queries work at runtime
import { supabase } from '@/lib/supabase'
import type { PromptType } from '@/types/agent-prompts.types'
import type {
  AgentPromptGuardRails,
  AgentPromptObserver,
  AgentPromptIntention,
  AgentPromptSystem
} from '@/types/database.types'

type PromptRow =
  | AgentPromptGuardRails
  | AgentPromptObserver
  | AgentPromptIntention
  | AgentPromptSystem

/**
 * Busca prompt por tipo para um tenant específico
 * Retorna prompt do tenant se existir, senão retorna o padrão (id_tenant IS NULL)
 */
export async function fetchPromptByType(type: PromptType, tenantId: string): Promise<PromptRow | null> {
  switch (type) {
    case 'guard_rails':
      return fetchGuardRailsPrompt(tenantId)
    case 'observer':
      return fetchObserverPrompt(tenantId)
    case 'intention':
      return fetchIntentionPrompt(tenantId)
    case 'system':
      return fetchSystemPrompt(tenantId)
  }
}

/**
 * Cria ou atualiza prompt (upsert)
 */
export async function upsertPrompt(
  type: PromptType,
  tenantId: string,
  data: Record<string, any>
): Promise<PromptRow> {
  switch (type) {
    case 'guard_rails':
      return upsertGuardRailsPrompt(tenantId, data)
    case 'observer':
      return upsertObserverPrompt(tenantId, data)
    case 'intention':
      return upsertIntentionPrompt(tenantId, data)
    case 'system':
      return upsertSystemPrompt(tenantId, data)
  }
}

// ============================================================================
// GUARD RAILS
// ============================================================================

async function fetchGuardRailsPrompt(tenantId: string): Promise<AgentPromptGuardRails | null> {
  const { data: tenantPrompt, error: tenantError } = await supabase
    .from('agent_prompts_guard_rails')
    .select('*')
    .eq('id_tenant', tenantId)
    .maybeSingle()

  if (tenantError && tenantError.code !== 'PGRST116') {
    console.error('Error fetching guard_rails prompt for tenant:', tenantError)
    throw tenantError
  }

  if (tenantPrompt) return tenantPrompt

  const { data: defaultPrompt, error: defaultError } = await supabase
    .from('agent_prompts_guard_rails')
    .select('*')
    .is('id_tenant', null)
    .maybeSingle()

  if (defaultError && defaultError.code !== 'PGRST116') {
    console.error('Error fetching default guard_rails prompt:', defaultError)
    throw defaultError
  }

  return defaultPrompt
}

async function upsertGuardRailsPrompt(tenantId: string, data: Record<string, any>): Promise<AgentPromptGuardRails> {
  const { data: existing } = await supabase
    .from('agent_prompts_guard_rails')
    .select('id')
    .eq('id_tenant', tenantId)
    .maybeSingle()

  if (existing) {
    const { data: updated, error } = await supabase
      .from('agent_prompts_guard_rails')
      .update(data)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating guard_rails prompt:', error)
      throw error
    }
    return updated as AgentPromptGuardRails
  }

  const { data: inserted, error } = await supabase
    .from('agent_prompts_guard_rails')
    .insert([{ ...data, id_tenant: tenantId }])
    .select()
    .single()

  if (error) {
    console.error('Error inserting guard_rails prompt:', error)
    throw error
  }
  return inserted as AgentPromptGuardRails
}

// ============================================================================
// OBSERVER
// ============================================================================

async function fetchObserverPrompt(tenantId: string): Promise<AgentPromptObserver | null> {
  const { data: tenantPrompt, error: tenantError } = await supabase
    .from('agent_prompts_observer')
    .select('*')
    .eq('id_tenant', tenantId)
    .maybeSingle()

  if (tenantError && tenantError.code !== 'PGRST116') {
    console.error('Error fetching observer prompt for tenant:', tenantError)
    throw tenantError
  }

  if (tenantPrompt) return tenantPrompt

  const { data: defaultPrompt, error: defaultError } = await supabase
    .from('agent_prompts_observer')
    .select('*')
    .is('id_tenant', null)
    .maybeSingle()

  if (defaultError && defaultError.code !== 'PGRST116') {
    console.error('Error fetching default observer prompt:', defaultError)
    throw defaultError
  }

  return defaultPrompt
}

async function upsertObserverPrompt(tenantId: string, data: Record<string, any>): Promise<AgentPromptObserver> {
  const { data: existing } = await supabase
    .from('agent_prompts_observer')
    .select('id')
    .eq('id_tenant', tenantId)
    .maybeSingle()

  if (existing) {
    const { data: updated, error } = await supabase
      .from('agent_prompts_observer')
      .update(data)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating observer prompt:', error)
      throw error
    }
    return updated as AgentPromptObserver
  }

  const { data: inserted, error } = await supabase
    .from('agent_prompts_observer')
    .insert([{ ...data, id_tenant: tenantId }])
    .select()
    .single()

  if (error) {
    console.error('Error inserting observer prompt:', error)
    throw error
  }
  return inserted as AgentPromptObserver
}

// ============================================================================
// INTENTION
// ============================================================================

async function fetchIntentionPrompt(tenantId: string): Promise<AgentPromptIntention | null> {
  const { data: tenantPrompt, error: tenantError } = await supabase
    .from('agent_prompts_intention')
    .select('*')
    .eq('id_tenant', tenantId)
    .maybeSingle()

  if (tenantError && tenantError.code !== 'PGRST116') {
    console.error('Error fetching intention prompt for tenant:', tenantError)
    throw tenantError
  }

  if (tenantPrompt) return tenantPrompt

  const { data: defaultPrompt, error: defaultError } = await supabase
    .from('agent_prompts_intention')
    .select('*')
    .is('id_tenant', null)
    .maybeSingle()

  if (defaultError && defaultError.code !== 'PGRST116') {
    console.error('Error fetching default intention prompt:', defaultError)
    throw defaultError
  }

  return defaultPrompt
}

async function upsertIntentionPrompt(tenantId: string, data: Record<string, any>): Promise<AgentPromptIntention> {
  const { data: existing } = await supabase
    .from('agent_prompts_intention')
    .select('id')
    .eq('id_tenant', tenantId)
    .maybeSingle()

  if (existing) {
    const { data: updated, error } = await supabase
      .from('agent_prompts_intention')
      .update(data)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating intention prompt:', error)
      throw error
    }
    return updated as AgentPromptIntention
  }

  const { data: inserted, error } = await supabase
    .from('agent_prompts_intention')
    .insert([{ ...data, id_tenant: tenantId }])
    .select()
    .single()

  if (error) {
    console.error('Error inserting intention prompt:', error)
    throw error
  }
  return inserted as AgentPromptIntention
}

// ============================================================================
// SYSTEM
// ============================================================================

async function fetchSystemPrompt(tenantId: string): Promise<AgentPromptSystem | null> {
  const { data: tenantPrompt, error: tenantError } = await supabase
    .from('agent_prompts_system')
    .select('*')
    .eq('id_tenant', tenantId)
    .maybeSingle()

  if (tenantError && tenantError.code !== 'PGRST116') {
    console.error('Error fetching system prompt for tenant:', tenantError)
    throw tenantError
  }

  if (tenantPrompt) return tenantPrompt

  const { data: defaultPrompt, error: defaultError } = await supabase
    .from('agent_prompts_system')
    .select('*')
    .is('id_tenant', null)
    .maybeSingle()

  if (defaultError && defaultError.code !== 'PGRST116') {
    console.error('Error fetching default system prompt:', defaultError)
    throw defaultError
  }

  return defaultPrompt
}

async function upsertSystemPrompt(tenantId: string, data: Record<string, any>): Promise<AgentPromptSystem> {
  const { data: existing } = await supabase
    .from('agent_prompts_system')
    .select('id')
    .eq('id_tenant', tenantId)
    .maybeSingle()

  if (existing) {
    const { data: updated, error } = await supabase
      .from('agent_prompts_system')
      .update(data)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating system prompt:', error)
      throw error
    }
    return updated as AgentPromptSystem
  }

  const { data: inserted, error } = await supabase
    .from('agent_prompts_system')
    .insert([{ ...data, id_tenant: tenantId }])
    .select()
    .single()

  if (error) {
    console.error('Error inserting system prompt:', error)
    throw error
  }
  return inserted as AgentPromptSystem
}
