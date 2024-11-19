"use client"

import { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="max-w-md p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <AlertTriangle className="h-10 w-10 text-destructive" />
                <h2 className="text-xl font-bold">Something went wrong</h2>
                <p className="text-muted-foreground">
                  We apologize for the inconvenience. Please try again later.
                </p>
                <Button
                  onClick={() => {
                    this.setState({ hasError: false })
                    window.location.reload()
                  }}
                >
                  Try again
                </Button>
              </div>
            </Card>
          </div>
        )
      )
    }

    return this.props.children
  }
}