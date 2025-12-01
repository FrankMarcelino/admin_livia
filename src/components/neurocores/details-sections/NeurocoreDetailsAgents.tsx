/**
 * NeurocoreDetailsAgents Component
 * Lista de agents do neurocore
 */

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Bot, Zap, Clock } from 'lucide-react'
import { NeurocoreWithRelations } from '@/types/neurocore-extended.types'

interface NeurocoreDetailsAgentsProps {
  neurocore: NeurocoreWithRelations
}

export function NeurocoreDetailsAgents({ neurocore }: NeurocoreDetailsAgentsProps) {
  const agents = neurocore.agents || []

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Bot className="h-4 w-4" />
        Agents ({agents.length})
      </h3>

      {agents.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhum agent configurado</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    {/* Nome e Modo */}
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{agent.name}</h4>
                      <Badge variant={agent.reactive ? 'default' : 'secondary'}>
                        {agent.reactive ? (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Reativo
                          </>
                        ) : (
                          <>
                            <Zap className="h-3 w-3 mr-1" />
                            Proativo
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Tipo */}
                    <div>
                      <span className="text-xs text-muted-foreground">Tipo: </span>
                      <span className="text-sm font-mono">{agent.type}</span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
