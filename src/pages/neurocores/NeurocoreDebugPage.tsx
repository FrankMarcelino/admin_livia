/**
 * NeurocoreDebugPage - Página de debug para diagnosticar problema de agents
 * Acesse em: http://localhost:5173/neurocores/debug
 */

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

export function NeurocoreDebugPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runDiagnostics = async () => {
    setIsLoading(true)
    const diagnostics: any = {}

    try {
      // 1. Buscar neurocores específicos
      const { data: neurocores, error: neurocoreError } = await supabase
        .from('neurocores')
        .select('*')
        .in('name', ['signum cursos', 'neurocore demo'])

      diagnostics.neurocores = {
        success: !neurocoreError,
        error: neurocoreError,
        data: neurocores,
        count: neurocores?.length || 0
      }

      // 2. Para cada neurocore, buscar agents
      if (neurocores && neurocores.length > 0) {
        diagnostics.neurocoreAgents = []

        for (const neurocore of neurocores) {
          // Query direta
          const { data: agents, error: agentError } = await supabase
            .from('agents')
            .select('*')
            .eq('id_neurocore', (neurocore as any).id)

          // Query com JOIN
          const { data: neurocoreWithJoin, error: joinError } = await supabase
            .from('neurocores')
            .select(`
              *,
              agents (*)
            `)
            .eq('id', (neurocore as any).id)
            .single()

          diagnostics.neurocoreAgents.push({
            neurocore_id: (neurocore as any).id,
            neurocore_name: (neurocore as any).name,
            direct_query: {
              success: !agentError,
              error: agentError,
              count: agents?.length || 0,
              agents: agents
            },
            join_query: {
              success: !joinError,
              error: joinError,
              count: (neurocoreWithJoin as any)?.agents?.length || 0,
              agents: (neurocoreWithJoin as any)?.agents
            }
          })
        }
      }

      // 3. Buscar agents órfãos (sem id_neurocore)
      const { data: orphanAgents, error: orphanError } = await supabase
        .from('agents')
        .select('*')
        .is('id_neurocore', null)

      diagnostics.orphanAgents = {
        success: !orphanError,
        error: orphanError,
        count: orphanAgents?.length || 0,
        data: orphanAgents
      }

      // 4. Buscar todos os agents
      const { data: allAgents, error: allAgentsError } = await supabase
        .from('agents')
        .select('*')

      diagnostics.allAgents = {
        success: !allAgentsError,
        error: allAgentsError,
        count: allAgents?.length || 0,
        data: allAgents
      }

      // 5. Buscar tenants que usam esses neurocores
      if (neurocores && neurocores.length > 0) {
        diagnostics.tenantsByNeurocore = []

        for (const neurocore of neurocores) {
          const { data: tenants, error: tenantError } = await supabase
            .from('tenants')
            .select('*')
            .eq('neurocore_id', (neurocore as any).id)

          diagnostics.tenantsByNeurocore.push({
            neurocore_id: (neurocore as any).id,
            neurocore_name: (neurocore as any).name,
            success: !tenantError,
            error: tenantError,
            count: tenants?.length || 0,
            tenants: tenants
          })
        }
      }

      // 6. Buscar todos os tenants
      const { data: allTenants, error: allTenantsError } = await supabase
        .from('tenants')
        .select('*')

      diagnostics.allTenants = {
        success: !allTenantsError,
        error: allTenantsError,
        count: allTenants?.length || 0,
        data: allTenants
      }

      setResults(diagnostics)
    } catch (error) {
      console.error('Erro no diagnóstico:', error)
      diagnostics.criticalError = error
      setResults(diagnostics)
    } finally {
      setIsLoading(false)
    }
  }

  const StatusIcon = ({ success }: { success: boolean }) => {
    return success ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Debug: Neurocores e Agents</h1>
        <p className="text-muted-foreground mt-1">
          Diagnóstico de relacionamento entre neurocores e agents
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Executar Diagnóstico</CardTitle>
          <CardDescription>
            Clique no botão abaixo para executar testes de conexão com o banco de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runDiagnostics} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Executando...' : 'Executar Diagnóstico'}
          </Button>
        </CardContent>
      </Card>

      {/* Resultados */}
      {results && (
        <>
          {/* 1. Neurocores */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <StatusIcon success={results.neurocores?.success} />
                <CardTitle>1. Neurocores Encontrados</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                <Badge>{results.neurocores?.count || 0}</Badge> neurocores encontrados
              </p>
              {results.neurocores?.data?.map((nc: any) => (
                <div key={nc.id} className="mb-2 p-3 border rounded">
                  <p className="font-semibold">{nc.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">ID: {nc.id}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 2. Agents por Neurocore */}
          {results.neurocoreAgents?.map((result: any) => (
            <Card key={result.neurocore_id}>
              <CardHeader>
                <CardTitle>2. Agents de "{result.neurocore_name}"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Query Direta */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <StatusIcon success={result.direct_query.success} />
                    <h3 className="font-semibold">Query Direta (WHERE id_neurocore = ...)</h3>
                  </div>
                  <p className="mb-2">
                    <Badge>{result.direct_query.count}</Badge> agents encontrados
                  </p>
                  {result.direct_query.agents?.map((agent: any) => (
                    <div key={agent.id} className="ml-4 p-2 border rounded text-sm mb-1">
                      <p>{agent.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Type: {agent.type} | Reactive: {agent.reactive ? 'Sim' : 'Não'}
                      </p>
                    </div>
                  ))}
                  {result.direct_query.error && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <code>{JSON.stringify(result.direct_query.error)}</code>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Query com JOIN */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <StatusIcon success={result.join_query.success} />
                    <h3 className="font-semibold">Query com JOIN (agents (*))</h3>
                  </div>
                  <p className="mb-2">
                    <Badge>{result.join_query.count}</Badge> agents encontrados
                  </p>
                  {result.join_query.agents?.map((agent: any) => (
                    <div key={agent.id} className="ml-4 p-2 border rounded text-sm mb-1">
                      <p>{agent.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Type: {agent.type} | Reactive: {agent.reactive ? 'Sim' : 'Não'}
                      </p>
                    </div>
                  ))}
                  {result.join_query.error && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <code>{JSON.stringify(result.join_query.error)}</code>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* 3. Agents Órfãos */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <StatusIcon success={results.orphanAgents?.success} />
                <CardTitle>3. Agents Órfãos (sem id_neurocore)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                <Badge variant={results.orphanAgents?.count > 0 ? 'destructive' : 'default'}>
                  {results.orphanAgents?.count || 0}
                </Badge>{' '}
                agents órfãos encontrados
              </p>
              {results.orphanAgents?.data?.map((agent: any) => (
                <div key={agent.id} className="mb-2 p-3 border rounded">
                  <p className="font-semibold">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">Type: {agent.type}</p>
                  <p className="text-xs text-muted-foreground font-mono">ID: {agent.id}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 4. Todos os Agents */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <StatusIcon success={results.allAgents?.success} />
                <CardTitle>4. Todos os Agents no Banco</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                <Badge>{results.allAgents?.count || 0}</Badge> agents no total
              </p>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {results.allAgents?.data?.map((agent: any) => (
                  <div key={agent.id} className="p-2 border rounded text-sm">
                    <p className="font-semibold">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">
                      id_neurocore: {agent.id_neurocore || '❌ NULL'} | Type: {agent.type}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tenants por Neurocore */}
          {results.tenantsByNeurocore?.map((result: any) => (
            <Card key={`tenant-${result.neurocore_id}`}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <StatusIcon success={result.success} />
                  <CardTitle>5. Tenants usando "{result.neurocore_name}"</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  <Badge variant={result.count > 0 ? 'default' : 'secondary'}>
                    {result.count}
                  </Badge>{' '}
                  tenants encontrados
                </p>
                {result.tenants?.map((tenant: any) => (
                  <div key={tenant.id} className="mb-2 p-3 border rounded">
                    <p className="font-semibold">{tenant.name}</p>
                    <p className="text-xs text-muted-foreground">CNPJ: {tenant.cnpj}</p>
                    <p className="text-xs text-muted-foreground">
                      Plano: {tenant.plan} | Status: {tenant.is_active ? 'Ativo' : 'Inativo'}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      neurocore_id: {tenant.neurocore_id}
                    </p>
                  </div>
                ))}
                {result.error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <code>{JSON.stringify(result.error)}</code>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Todos os Tenants */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <StatusIcon success={results.allTenants?.success} />
                <CardTitle>6. Todos os Tenants no Banco</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                <Badge>{results.allTenants?.count || 0}</Badge> tenants no total
              </p>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {results.allTenants?.data?.map((tenant: any) => (
                  <div key={tenant.id} className="p-2 border rounded text-sm">
                    <p className="font-semibold">{tenant.name}</p>
                    <p className="text-xs text-muted-foreground">
                      neurocore_id: {tenant.neurocore_id || '❌ NULL'} | Plano: {tenant.plan}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Console Output */}
          <Card>
            <CardHeader>
              <CardTitle>7. JSON Completo (Console)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded overflow-x-auto">
                {JSON.stringify(results, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
