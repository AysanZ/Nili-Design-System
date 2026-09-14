import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  component: string;
  children: ReactNode;
}

interface State {
  message: string | null;
}

/**
 * A component that throws — usually because it expects a parent context the
 * canvas has not given it — must not take the editor down with it. The node
 * reports itself instead, and everything around it keeps working.
 */
export class NodeBoundary extends Component<Props, State> {
  override state: State = { message: null };

  static getDerivedStateFromError(error: unknown): State {
    return { message: error instanceof Error ? error.message : 'Failed to render.' };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[studio] ${this.props.component} failed to render`, error, info.componentStack);
  }

  override componentDidUpdate(previous: Props): void {
    if (previous.children !== this.props.children && this.state.message) this.setState({ message: null });
  }

  override render(): ReactNode {
    if (this.state.message === null) return this.props.children;
    return (
      <p className="node__failed">
        <strong>{this.props.component}</strong>
        {this.state.message}
      </p>
    );
  }
}
