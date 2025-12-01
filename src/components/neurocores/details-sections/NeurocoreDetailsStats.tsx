/**
 * NeurocoreDetailsStats Component
 * Cards com estatísticas do neurocore (agents, tenants)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Bot } from 'lucide-react'
import { NeurocoreWithRelations } from '@/types/neurocore-extended.types'

interface NeurocoreDetailsStatsProps {
  neurocore: NeurocoreWithRelations
}

export function NeurocoreDetailsStats({ neurocore }: NeurocoreDetailsStatsProps) {
  const totalAgents = neurocore.stats?.total_agents || neurocore.agents?.length || 0
  const totalTenants = neurocore.stats?.total_tenants || 0

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Estatísticas</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Agents */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalAgents === 1 ? 'agent configurado' : 'agents configurados'}
            </p>
          </CardContent>
        </Card>

        {/* Tenants */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Tenants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTenants}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalTenants === 1 ? 'empresa usando' : 'empresas usando'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
