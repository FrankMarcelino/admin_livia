import { z } from 'zod'

/**
 * Valida CNPJ usando algoritmo oficial
 * @param cnpj - CNPJ com ou sem formatação
 * @returns true se CNPJ válido, false caso contrário
 */
export function validateCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '')

  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) return false

  // Verifica CNPJs inválidos conhecidos (todos os dígitos iguais)
  if (/^(\d)\1+$/.test(cnpj)) return false

  // Validação dos dígitos verificadores
  let length = cnpj.length - 2
  let numbers = cnpj.substring(0, length)
  const digits = cnpj.substring(length)
  let sum = 0
  let pos = length - 7

  // Valida primeiro dígito verificador
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false

  // Valida segundo dígito verificador
  length = length + 1
  numbers = cnpj.substring(0, length)
  sum = 0
  pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(1))) return false

  return true
}

/**
 * Formata CNPJ para exibição (XX.XXX.XXX/XXXX-XX)
 * @param cnpj - CNPJ com ou sem formatação
 * @returns CNPJ formatado
 */
export function formatCNPJ(cnpj: string): string {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '')

  // Aplica formatação se tiver 14 dígitos
  if (cnpj.length === 14) {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  }

  return cnpj
}

/**
 * Remove formatação do CNPJ (apenas números)
 * @param cnpj - CNPJ formatado
 * @returns CNPJ sem formatação
 */
export function unformatCNPJ(cnpj: string): string {
  return cnpj.replace(/[^\d]/g, '')
}

/**
 * Valida e formata telefone WhatsApp (+5511999999999)
 * @param phone - Telefone com ou sem formatação
 * @returns true se válido
 */
export function validatePhone(phone: string): boolean {
  const unformatted = phone.replace(/[^\d+]/g, '')
  return /^\+\d{13}$/.test(unformatted)
}

/**
 * Formata telefone para exibição (+55 11 99999-9999)
 * @param phone - Telefone no formato +5511999999999
 * @returns Telefone formatado
 */
export function formatPhone(phone: string): string {
  const numbers = phone.replace(/[^\d]/g, '')

  if (numbers.length === 13) {
    return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 9)}-${numbers.slice(9)}`
  }

  return phone
}

/**
 * Schema Zod para criação de tenant
 */
export const tenantCreateSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  cnpj: z.string()
    .refine(validateCNPJ, 'CNPJ inválido'),

  phone: z.string()
    .regex(/^\+\d{13}$/, 'Telefone deve estar no formato +5511999999999'),

  responsible_tech_name: z.string()
    .min(3, 'Nome do responsável técnico é obrigatório'),

  responsible_tech_whatsapp: z.string()
    .regex(/^\+\d{13}$/, 'WhatsApp deve estar no formato +5511999999999'),

  responsible_tech_email: z.string()
    .email('Email do responsável técnico inválido'),

  responsible_finance_name: z.string()
    .min(3, 'Nome do responsável financeiro é obrigatório'),

  responsible_finance_whatsapp: z.string()
    .regex(/^\+\d{13}$/, 'WhatsApp deve estar no formato +5511999999999'),

  responsible_finance_email: z.string()
    .email('Email do responsável financeiro inválido'),

  neurocore_id: z.string()
    .uuid('Selecione um Neurocore válido'),

  niche_id: z.string()
    .uuid('Selecione um Nicho válido')
    .optional()
    .nullable(),

  plan: z.enum(['basic', 'pro', 'enterprise'], {
    message: 'Selecione um plano válido'
  })
})

/**
 * Schema Zod para atualização de tenant (todos os campos opcionais)
 */
export const tenantUpdateSchema = tenantCreateSchema.partial()

/**
 * Tipo inferido do schema de criação
 */
export type TenantCreateInput = z.infer<typeof tenantCreateSchema>

/**
 * Tipo inferido do schema de atualização
 */
export type TenantUpdateInput = z.infer<typeof tenantUpdateSchema>
