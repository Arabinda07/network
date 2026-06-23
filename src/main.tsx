// @ts-nocheck
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add a global error handler to capture "Script error." details if possible.
window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.innerHTML = `<div style="padding: 20px; color: red;"><h2>Global Error</h2><pre>${event.error?.stack || event.message || JSON.stringify(event)}</pre></div>`;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.innerHTML = `<div style="padding: 20px; color: red;"><h2>Unhandled Promise Rejection</h2><pre>${event.reason?.stack || event.reason || 'Unknown error'}</pre></div>`;
  }
});

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red', fontFamily: 'sans-serif' }}>
          <h1>Runtime Error:</h1>
          <pre>{this.state.error?.message}</pre>
          <pre style={{ fontSize: '12px' }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
