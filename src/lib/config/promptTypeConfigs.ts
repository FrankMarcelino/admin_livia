import { Shield, Eye, Target, Settings } from 'lucide-react'
import { PromptTypeConfig } from '@/types/agent-prompts.types'

export const PROMPT_TYPE_CONFIGS: Record<string, PromptTypeConfig> = {
  guard_rails: {
    type: 'guard_rails',
    label: 'Guard Rails',
    description: 'Proteção contra jailbreak e conteúdo NSFW',
    icon: Shield,
    tableName: 'agent_prompts_guard_rails',
    fields: [
      {
        name: 'prompt_jailbreak',
        label: 'Prompt Anti-Jailbreak',
        placeholder: 'Descreva as regras para prevenir tentativas de jailbreak...',
        description: 'Instruções para detectar e bloquear tentativas de manipulação do sistema',
        rows: 8
      },
      {
        name: 'prompt_nsfw',
        label: 'Prompt Anti-NSFW',
        placeholder: 'Descreva as regras para filtrar conteúdo inadequado...',
        description: 'Instruções para detectar conteúdo sexual, violento ou ofensivo',
        rows: 8
      }
    ]
  },
  observer: {
    type: 'observer',
    label: 'Observador',
    description: 'Monitoramento não intrusivo de conversas',
    icon: Eye,
    tableName: 'agent_prompts_observer',
    fields: [
      {
        name: 'prompt',
        label: 'Prompt do Observador',
        placeholder: 'Descreva como o observador deve monitorar e analisar conversas...',
        description: 'Instruções para observação de sentimento, tópicos e sinais de escalação',
        rows: 12
      }
    ]
  },
  intention: {
    type: 'intention',
    label: 'Intenção',
    description: 'Classificação inteligente de intenções do usuário',
    icon: Target,
    tableName: 'agent_prompts_intention',
    fields: [
      {
        name: 'prompt',
        label: 'Prompt de Classificação',
        placeholder: 'Descreva como classificar a intenção do usuário (vendas, suporte, etc)...',
        description: 'Instruções para identificar e categorizar intenções',
        rows: 12
      }
    ]
  },
  system: {
    type: 'system',
    label: 'Sistema',
    description: 'Prompts de sistema e instruções fundamentais',
    icon: Settings,
    tableName: 'agent_prompts_system',
    fields: [
      {
        name: 'prompt',
        label: 'Prompt do Sistema',
        placeholder: 'Descreva as instruções base que todos os agentes devem seguir...',
        description: 'Instruções fundamentais aplicadas a todo o sistema',
        rows: 12
      }
    ]
  }
}
