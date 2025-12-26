/**
 * Database Types - Auto-generated from Supabase Schema
 * Generated at: 2025-11-30
 *
 * This file contains TypeScript types for all database tables.
 * Updated to reflect new schema changes (agents, neurocores, agent_prompts)
 */

// ============================================================================
// UTILITY TYPES
// ============================================================================

/** UUID type alias for better readability */
export type UUID = string;

/** ISO 8601 timestamp string */
export type Timestamp = string;

/** JSON object type */
export type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/** Sender types for messages */
export type SenderType = 'attendant' | 'agent' | 'contact';

/** Message status */
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

/** Conversation status */
export type ConversationStatus = 'active' | 'paused' | 'closed';

/** Contact status */
export type ContactStatus = 'open' | 'closed';

/** Synapse status */
export type SynapseStatus = 'draft' | 'published';

/** Agent type */
export type AgentType = 'reactive' | 'proactive';

/** Agent function */
export type AgentFunction = 'attendant' | 'intention' | 'in_guard_rails' | 'observer';

/** User role */
export type UserRole = 'super_admin' | 'admin' | 'attendant' | 'viewer';

/** Feedback rating */
export type FeedbackRating = 'positive' | 'negative' | 'neutral';

/** Tenant plan */
export type TenantPlan = 'basic' | 'pro' | 'enterprise';

// ============================================================================
// TABLE TYPES
// ============================================================================

/**
 * TENANTS - Multi-tenant organizations
 */
export interface Tenant {
  id: UUID;
  name: string;
  neurocore_id: UUID;
  is_active: boolean;
  cnpj: string;
  phone: string;
  responsible_tech_name: string;
  responsible_tech_whatsapp: string;
  responsible_tech_email: string;
  responsible_finance_name: string;
  responsible_finance_whatsapp: string;
  responsible_finance_email: string;
  plan: TenantPlan;
  master_integration_active: boolean;
  niche_id: UUID | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface TenantInsert extends Omit<Tenant, 'id' | 'created_at' | 'updated_at'> {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface TenantUpdate extends Partial<TenantInsert> {}

/**
 * USERS - System users (attendants, admins)
 */
export interface User {
  id: UUID;
  tenant_id: UUID;
  full_name: string;
  email: string;
  whatsapp_number: string;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  last_sign_in_at: Timestamp | null;
  modules: string[];
  ai_paused: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface UserInsert extends Omit<User, 'id' | 'created_at' | 'updated_at'> {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface UserUpdate extends Partial<UserInsert> {}

/**
 * CONTACTS - Customer contacts
 */
export interface Contact {
  id: UUID;
  tenant_id: UUID;
  name: string;
  phone: string;
  phone_secondary: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
  zip_code: string | null;
  address_street: string | null;
  address_number: string | null;
  address_complement: string | null;
  cpf: string | null;
  rg: string | null;
  last_interaction_at: Timestamp;
  status: ContactStatus;
  customer_data_extracted: Json | null;
  last_negotiation: Json | null;
  external_identification_contact: string | null;
  external_contact_id: string | null;
  tag: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ContactInsert extends Omit<Contact, 'id' | 'created_at' | 'updated_at'> {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface ContactUpdate extends Partial<ContactInsert> {}

/**
 * CONVERSATIONS - Chat conversations
 */
export interface Conversation {
  id: UUID;
  contact_id: UUID;
  tenant_id: UUID;
  channel_id: UUID;
  external_id: string | null;
  status: ConversationStatus;
  ia_active: boolean;
  last_message_at: Timestamp;
  overall_feedback_type: string | null;
  overall_feedback_text: string | null;
  conversation_pause_reason_id: UUID | null;
  pause_notes: string | null;
  conversation_closure_reason_id: UUID | null;
  closure_notes: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ConversationInsert extends Omit<Conversation, 'id' | 'created_at' | 'updated_at'> {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface ConversationUpdate extends Partial<ConversationInsert> {}

/**
 * MESSAGES - Chat messages
 */
export interface Message {
  id: UUID;
  conversation_id: UUID;
  sender_type: SenderType;
  sender_user_id: UUID | null;
  sender_agent_id: UUID | null;
  content: string;
  timestamp: Timestamp;
  feedback_type: string | null;
  feedback_text: string | null;
  external_message_id: string | null;
  status: MessageStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface MessageInsert extends Omit<Message, 'id' | 'created_at' | 'updated_at'> {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface MessageUpdate extends Partial<MessageInsert> {}

/**
 * AGENTS - AI agents
 * Updated: 2025-11-30 - New schema with id_neurocore FK
 */
export interface Agent {
  id: UUID;
  name: string;
  type: AgentFunction;  // Function type: support, sales, or general
  id_neurocore: UUID;  // FK to neurocores table (1:N relationship)
  reactive: boolean;  // If agent is reactive (responds when triggered) vs proactive
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface AgentInsert extends Omit<Agent, 'id' | 'created_at' | 'updated_at'> {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface AgentUpdate extends Partial<AgentInsert> {}

/**
 * NEUROCORES - AI processing cores
 * Updated: 2025-11-30 - Removed associated_agents (now via agents.id_neurocore)
 */
export interface Neurocore {
  id: UUID;
  name: string;
  description: string;
  id_subwork_n8n_neurocore: string;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface NeurocoreInsert extends Omit<Neurocore, 'id' | 'created_at' | 'updated_at'> {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface NeurocoreUpdate extends Partial<NeurocoreInsert> {}

/**
 * BASE_CONHECIMENTOS - Knowledge bases
 */
export interface BaseConhecimento {
  id: UUID;
  tenant_id: UUID;
  name: string;
  description: string;
  neurocore_id: UUID;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface BaseConhecimentoInsert extends Omit<BaseConhecimento, 'id' | 'created_at' | 'updated_at'> {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface BaseConhecimentoUpdate extends Partial<BaseConhecimentoInsert> {}

/**
 * SYNAPSES - Knowledge articles
 */
export interface Synapse {
  id: UUID;
  base_conhecimento_id: UUID;
  tenant_id: UUID;
  title: string;
  description: string;
  content: string;
  image_url: string | null;
  status: SynapseStatus;
  is_enabled: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface SynapseInsert extends Omit<Synapse, 'id' | 'created_at' | 'updated_at'> {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface SynapseUpdate extends Partial<SynapseInsert> {}

/**
 * CHANNELS - Communication channels
 */
export interface Channel {
  id: UUID;
  tenant_id: UUID;
  channel_provider_id: UUID;
  name: string;
  identification_number: string;
  instance_company_name: string;
  is_active: boolean;
  is_receiving_messages: boolean;
  is_sending_messages: boolean;
  observations: string | null;
  external_api_url: string;
  provider_external_channel_id: string;
  config_json: Json | null;
  identification_channel_client_descriptions: Json | null;
  message_wait_time_fragments: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ChannelInsert extends Omit<Channel, 'id' | 'created_at' | 'updated_at'> {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface ChannelUpdate extends Partial<ChannelInsert> {}

/**
 * CHANNEL_PROVIDERS - Channel API providers
 */
export interface ChannelProvider {
  id: UUID;
  name: string;
  description: string;
  api_base_config: Json | null;
  channel_provider_identifier_code: string;
  id_subwork_n8n_master_integrator: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ChannelProviderInsert extends Omit<ChannelProvider, 'id' | 'created_at' | 'updated_at'> {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface ChannelProviderUpdate extends Partial<ChannelProviderInsert> {}

/**
 * TAGS - Conversation tags
 */
export interface Tag {
  id: UUID;
  id_tenant: UUID;
  tag_name: string;
  prompt_to_ai: string | null;
  active: boolean;
  order_index: number;
  color: string;
  created_at: Timestamp;
}

export interface TagInsert extends Omit<Tag, 'id' | 'created_at'> {
  id?: UUID;
  created_at?: Timestamp;
}

export interface TagUpdate extends Partial<TagInsert> {}

/**
 * CONVERSATION_TAGS - Many-to-many relationship
 */
export interface ConversationTag {
  id: UUID;
  conversation_id: UUID;
  tag_id: UUID;
  created_at: Timestamp;
}

export interface ConversationTagInsert extends Omit<ConversationTag, 'id' | 'created_at'> {
  id?: UUID;
  created_at?: Timestamp;
}

export interface ConversationTagUpdate extends Partial<ConversationTagInsert> {}

/**
 * MESSAGE_FEEDBACK - Feedback on messages
 */
export interface MessageFeedback {
  id: UUID;
  tenant_id: UUID;
  message_id: UUID;
  conversation_id: UUID;
  rating: FeedbackRating;
  comment: string;
  user_id: UUID;
  created_at: Timestamp;
}

export interface MessageFeedbackInsert extends Omit<MessageFeedback, 'id' | 'created_at'> {
  id?: UUID;
  created_at?: Timestamp;
}

export interface MessageFeedbackUpdate extends Partial<MessageFeedbackInsert> {}

/**
 * CONTACT_DATA_CHANGES - Audit trail for contact changes
 */
export interface ContactDataChange {
  id: UUID;
  tenant_id: UUID;
  contact_id: UUID;
  field_name: string;
  old_value: string | null;
  new_value: string;
  changed_by: UUID;
  changed_at: Timestamp;
}

export interface ContactDataChangeInsert extends Omit<ContactDataChange, 'id'> {
  id?: UUID;
}

export interface ContactDataChangeUpdate extends Partial<ContactDataChangeInsert> {}

/**
 * QUICK_REPLY_TEMPLATES - Quick reply message templates
 */
export interface QuickReplyTemplate {
  id: UUID;
  tenant_id: UUID;
  title: string;
  message: string;
  icon: string;
  usage_count: number;
  active: boolean;
  created_by: UUID | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface QuickReplyTemplateInsert extends Omit<QuickReplyTemplate, 'id' | 'created_at' | 'updated_at'> {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface QuickReplyTemplateUpdate extends Partial<QuickReplyTemplateInsert> {}

/**
 * NICHES - Market niches
 */
export interface Niche {
  id: UUID;
  name: string;
  description: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface NicheInsert extends Omit<Niche, 'id' | 'created_at' | 'updated_at'> {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface NicheUpdate extends Partial<NicheInsert> {}

/**
 * AGENT_PROMPTS - Agent personality and instructions per tenant
 * New table: 2025-11-30
 * This table stores the personalization layer for agents per tenant
 */
export interface AgentPrompt {
  id: number;  // BIGINT GENERATED ALWAYS AS IDENTITY
  created_at: Timestamp;
  name: string | null;
  age: string | null;
  gender: string | null;  // USER-DEFINED enum
  objective: string | null;
  comunication: string | null;  // Note: typo in database (not "communication")
  personality: string | null;
  limitations: Json | null;  // JSONB
  rules: Json | null;  // JSONB
  instructions: Json | null;  // JSONB
  guide_line: Json | null;  // JSONB
  others_instructions: Json | null;  // JSONB
  id_agent: UUID | null;  // FK to agents
  id_tenant: UUID | null;  // FK to tenants
}

export interface AgentPromptInsert extends Omit<AgentPrompt, 'id' | 'created_at'> {
  created_at?: Timestamp;
}

export interface AgentPromptUpdate extends Partial<AgentPromptInsert> {}

/**
 * AGENT_TEMPLATES - Agent templates for reuse across neurocores
 * New table: 2025-12-03
 * This table stores master agent configurations created by Super Admin
 */
export interface AgentTemplate {
  id: UUID;
  name: string;
  type: AgentFunction;
  reactive: boolean;
  persona_name: string | null;
  age: string | null;
  gender: string | null;
  objective: string | null;
  communication: string | null;
  personality: string | null;
  limitations: Json | null;  // JSONB array of strings
  rules: Json | null;  // JSONB
  instructions: Json | null;  // JSONB array of strings
  guide_line: Json | null;  // JSONB array of objects
  others_instructions: Json | null;  // JSONB
  is_active: boolean;
  created_by: UUID | null;  // FK to auth.users
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface AgentTemplateInsert extends Omit<AgentTemplate, 'id' | 'created_at' | 'updated_at'> {
  id?: UUID;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface AgentTemplateUpdate extends Partial<AgentTemplateInsert> {}

/**
 * AGENT_PROMPTS_GUARD_RAILS - Guard Rails prompts per tenant
 * Table: agent_prompts_guard_rails
 */
export interface AgentPromptGuardRails {
  id: number;  // BIGINT GENERATED ALWAYS AS IDENTITY
  created_at: Timestamp;
  prompt_jailbreak: string | null;
  prompt_nsfw: string | null;
  id_agent: UUID | null;  // FK to agents
  id_tenant: UUID | null;  // FK to tenants (NULL = default)
}

export interface AgentPromptGuardRailsInsert extends Omit<AgentPromptGuardRails, 'id' | 'created_at'> {
  created_at?: Timestamp;
}

export interface AgentPromptGuardRailsUpdate extends Partial<AgentPromptGuardRailsInsert> {}

/**
 * AGENT_PROMPTS_OBSERVER - Observer prompts per tenant
 * Table: agent_prompts_observer
 */
export interface AgentPromptObserver {
  id: number;  // BIGINT GENERATED ALWAYS AS IDENTITY
  created_at: Timestamp;
  prompt: string | null;
  id_agent: UUID | null;  // FK to agents
  id_tenant: UUID | null;  // FK to tenants (NULL = default)
}

export interface AgentPromptObserverInsert extends Omit<AgentPromptObserver, 'id' | 'created_at'> {
  created_at?: Timestamp;
}

export interface AgentPromptObserverUpdate extends Partial<AgentPromptObserverInsert> {}

/**
 * AGENT_PROMPTS_INTENTION - Intention prompts per tenant
 * Table: agent_prompts_intention
 */
export interface AgentPromptIntention {
  id: number;  // BIGINT GENERATED ALWAYS AS IDENTITY
  created_at: Timestamp;
  prompt: string | null;
  id_agent: UUID | null;  // FK to agents
  id_tenant: UUID | null;  // FK to tenants (NULL = default)
}

export interface AgentPromptIntentionInsert extends Omit<AgentPromptIntention, 'id' | 'created_at'> {
  created_at?: Timestamp;
}

export interface AgentPromptIntentionUpdate extends Partial<AgentPromptIntentionInsert> {}

/**
 * AGENT_PROMPTS_SYSTEM - System prompts per tenant
 * Table: agent_prompts_system (será criada pela migration)
 */
export interface AgentPromptSystem {
  id: number;  // BIGINT GENERATED ALWAYS AS IDENTITY
  created_at: Timestamp;
  prompt: string | null;
  id_agent: UUID | null;  // FK to agents
  id_tenant: UUID | null;  // FK to tenants (NULL = default)
}

export interface AgentPromptSystemInsert extends Omit<AgentPromptSystem, 'id' | 'created_at'> {
  created_at?: Timestamp;
}

export interface AgentPromptSystemUpdate extends Partial<AgentPromptSystemInsert> {}

// ============================================================================
// DATABASE TYPE
// ============================================================================

/**
 * Complete database schema type
 */
export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: Tenant;
        Insert: TenantInsert;
        Update: TenantUpdate;
      };
      users: {
        Row: User;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      contacts: {
        Row: Contact;
        Insert: ContactInsert;
        Update: ContactUpdate;
      };
      conversations: {
        Row: Conversation;
        Insert: ConversationInsert;
        Update: ConversationUpdate;
      };
      messages: {
        Row: Message;
        Insert: MessageInsert;
        Update: MessageUpdate;
      };
      agents: {
        Row: Agent;
        Insert: AgentInsert;
        Update: AgentUpdate;
      };
      neurocores: {
        Row: Neurocore;
        Insert: NeurocoreInsert;
        Update: NeurocoreUpdate;
      };
      base_conhecimentos: {
        Row: BaseConhecimento;
        Insert: BaseConhecimentoInsert;
        Update: BaseConhecimentoUpdate;
      };
      synapses: {
        Row: Synapse;
        Insert: SynapseInsert;
        Update: SynapseUpdate;
      };
      channels: {
        Row: Channel;
        Insert: ChannelInsert;
        Update: ChannelUpdate;
      };
      channel_providers: {
        Row: ChannelProvider;
        Insert: ChannelProviderInsert;
        Update: ChannelProviderUpdate;
      };
      tags: {
        Row: Tag;
        Insert: TagInsert;
        Update: TagUpdate;
      };
      conversation_tags: {
        Row: ConversationTag;
        Insert: ConversationTagInsert;
        Update: ConversationTagUpdate;
      };
      message_feedback: {
        Row: MessageFeedback;
        Insert: MessageFeedbackInsert;
        Update: MessageFeedbackUpdate;
      };
      contact_data_changes: {
        Row: ContactDataChange;
        Insert: ContactDataChangeInsert;
        Update: ContactDataChangeUpdate;
      };
      quick_reply_templates: {
        Row: QuickReplyTemplate;
        Insert: QuickReplyTemplateInsert;
        Update: QuickReplyTemplateUpdate;
      };
      niches: {
        Row: Niche;
        Insert: NicheInsert;
        Update: NicheUpdate;
      };
      agent_prompts: {
        Row: AgentPrompt;
        Insert: AgentPromptInsert;
        Update: AgentPromptUpdate;
      };
      agent_templates: {
        Row: AgentTemplate;
        Insert: AgentTemplateInsert;
        Update: AgentTemplateUpdate;
      };
      agent_prompts_guard_rails: {
        Row: AgentPromptGuardRails;
        Insert: AgentPromptGuardRailsInsert;
        Update: AgentPromptGuardRailsUpdate;
      };
      agent_prompts_observer: {
        Row: AgentPromptObserver;
        Insert: AgentPromptObserverInsert;
        Update: AgentPromptObserverUpdate;
      };
      agent_prompts_intention: {
        Row: AgentPromptIntention;
        Insert: AgentPromptIntentionInsert;
        Update: AgentPromptIntentionUpdate;
      };
      agent_prompts_system: {
        Row: AgentPromptSystem;
        Insert: AgentPromptSystemInsert;
        Update: AgentPromptSystemUpdate;
      };
    };
  };
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Extract table names from database
 */
export type TableName = keyof Database['public']['Tables'];

/**
 * Get row type for a specific table
 */
export type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];

/**
 * Get insert type for a specific table
 */
export type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];

/**
 * Get update type for a specific table
 */
export type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update'];

// ============================================================================
// RELATIONSHIP TYPES (for joins and populated data)
// ============================================================================

/**
 * Message with populated relationships
 */
export interface MessageWithRelations extends Message {
  conversation?: Conversation;
  sender_user?: User;
  sender_agent?: Agent;
}

/**
 * Conversation with populated relationships
 */
export interface ConversationWithRelations extends Conversation {
  contact?: Contact;
  channel?: Channel;
  messages?: Message[];
  tags?: Tag[];
}

/**
 * Contact with populated relationships
 */
export interface ContactWithRelations extends Contact {
  conversations?: Conversation[];
  tenant?: Tenant;
}

/**
 * User with populated relationships
 */
export interface UserWithRelations extends User {
  tenant?: Tenant;
}

/**
 * Agent with populated relationships
 * Updated: 2025-11-30 - neurocore is now singular (1:N relationship)
 */
export interface AgentWithRelations extends Agent {
  neurocore?: Neurocore;  // Single neurocore (via id_neurocore FK)
}

/**
 * Synapse with populated relationships
 */
export interface SynapseWithRelations extends Synapse {
  base_conhecimento?: BaseConhecimento;
  tenant?: Tenant;
}
