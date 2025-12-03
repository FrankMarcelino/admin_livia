/**
 * ErrorBoundary Component
 * Componente para capturar e exibir erros de forma amigável
 */

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <Card className="p-8 max-w-md w-full">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-10 w-10 text-destructive" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Algo deu errado</h2>
                <p className="text-sm text-muted-foreground">
                  Ocorreu um erro inesperado ao carregar este componente.
                </p>
              </div>

              {this.state.error && import.meta.env.DEV && (
                <Card className="p-3 w-full bg-muted">
                  <p className="text-xs font-mono text-left break-words">
                    {this.state.error.toString()}
                  </p>
                </Card>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Recarregar página
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={this.handleReset}
                >
                  Tentar novamente
                </Button>
              </div>

              <p className="text-xs text-muted-foreground pt-2">
                Se o problema persistir, contate o suporte técnico.
              </p>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
