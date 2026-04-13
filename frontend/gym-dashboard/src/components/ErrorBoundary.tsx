import { Component, ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Unhandled dashboard error", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="content">
          <h1>Something went wrong</h1>
          <p>Please refresh or sign in again.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
