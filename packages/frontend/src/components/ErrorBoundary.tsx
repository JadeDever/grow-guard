import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4'>
          <div className='max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center'>
            <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <AlertTriangle className='h-8 w-8 text-red-600' />
            </div>

            <h1 className='text-xl font-bold text-gray-900 mb-2'>
              出现了一些问题
            </h1>

            <p className='text-gray-600 mb-6'>
              抱歉，页面遇到了一个错误。我们已经记录了这个问题，并将尽快修复。
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='text-left mb-6 p-4 bg-gray-50 rounded-lg'>
                <summary className='cursor-pointer text-sm font-medium text-gray-700 mb-2'>
                  错误详情 (开发模式)
                </summary>
                <pre className='text-xs text-red-600 overflow-auto'>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className='flex flex-col sm:flex-row gap-3'>
              <Button
                variant='primary'
                onClick={this.handleRetry}
                icon={RefreshCw}
                className='flex-1'
              >
                重试
              </Button>

              <Button
                variant='secondary'
                onClick={this.handleGoHome}
                icon={Home}
                className='flex-1'
              >
                返回首页
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
