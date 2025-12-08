import { z } from 'zod'

/**
 * Valida formato de telefone WhatsApp (+55 11 98989-9999)
 * Aceita com ou sem formatação
 * @param phone - Telefone com ou sem formatação
 * @returns true se válido
 */
export function validateWhatsAppNumber(phone: string): boolean {
  // Remove formatação
  const unformatted = phone.replace(/[^\d+]/g, '')
  // Valida formato: +55 (2 dígitos país) + 11 (2 dígitos DDD) + 9 dígitos
  return /^\+\d{2}\d{2}\d{8,9}$/.test(unformatted)
}

/**
 * Formata número WhatsApp para exibição (+55 11 98989-9999)
 * @param phone - Telefone no formato +5511989899999
 * @returns Telefone formatado
 */
export function formatWhatsAppNumber(phone: string): string {
  const numbers = phone.replace(/[^\d]/g, '')

  if (numbers.length === 13) {
    // Com 9 dígitos: +55 11 98989-9999
    return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 9)}-${numbers.slice(9)}`
  } else if (numbers.length === 12) {
    // Com 8 dígitos (fixo): +55 11 3333-3333
    return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 8)}-${numbers.slice(8)}`
  }

  return phone
}

/**
 * Remove formatação do número WhatsApp (apenas números + código país)
 * @param phone - Telefone formatado
 * @returns Telefone sem formatação no formato +5511989899999
 */
export function unformatWhatsAppNumber(phone: string): string {
  const numbers = phone.replace(/[^\d]/g, '')
  return `+${numbers}`
}

/**
 * Schema Zod para criação de canal
 */
export const channelCreateSchema = z.object({
  tenant_id: z.string()
    .uuid('ID do tenant inválido'),

  channel_provider_id: z.string()
    .uuid('Selecione um provedor'),

  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  identification_number: z.string()
    .refine(validateWhatsAppNumber, 'Formato inválido. Use: +55 11 98989-9999'),

  instance_company_name: z.string()
    .min(3, 'Nome da instância deve ter no mínimo 3 caracteres')
    .max(100, 'Nome da instância deve ter no máximo 100 caracteres'),

  is_active: z.boolean(),

  is_receiving_messages: z.boolean(),

  is_sending_messages: z.boolean(),

  observations: z.string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional(),

  external_api_url: z.string()
    .url('URL inválida')
    .min(1, 'URL da API é obrigatória'),

  provider_external_channel_id: z.string()
    .min(1, 'ID externo do provedor é obrigatório')
    .max(200, 'ID externo muito longo'),

  identification_channel_client_descriptions: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),

  message_wait_time_fragments: z.number()
    .int('Deve ser um número inteiro')
    .min(1, 'Mínimo 1 segundo')
    .max(60, 'Máximo 60 segundos')
    .optional()
})

/**
 * Schema Zod para atualização de canal (todos os campos opcionais exceto tenant_id)
 */
export const channelUpdateSchema = channelCreateSchema.partial().required({
  tenant_id: true
})

/**
 * Tipo inferido do schema de criação
 */
export type ChannelCreateInput = z.infer<typeof channelCreateSchema>

/**
 * Tipo inferido do schema de atualização
 */
export type ChannelUpdateInput = z.infer<typeof channelUpdateSchema>
