import type {
  Portfolio,
  Position,
  Transaction,
  DisciplineSettings,
} from '@shared/types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '请求失败');
      }

      return data.data;
    } catch (error) {
      console.error(`API请求失败 ${endpoint}:`, error);
      throw error;
    }
  }

  // 投资组合相关API
  async getPortfolios(): Promise<Portfolio[]> {
    return this.request<Portfolio[]>('/portfolios');
  }

  async getPortfolio(id: string): Promise<Portfolio> {
    return this.request<Portfolio>(`/portfolios/${id}`);
  }

  async createPortfolio(
    portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Portfolio> {
    return this.request<Portfolio>('/portfolios', {
      method: 'POST',
      body: JSON.stringify(portfolio),
    });
  }

  async updatePortfolio(
    id: string,
    updates: Partial<Portfolio>
  ): Promise<Portfolio> {
    return this.request<Portfolio>(`/portfolios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deletePortfolio(id: string): Promise<boolean> {
    return this.request<boolean>(`/portfolios/${id}`, {
      method: 'DELETE',
    });
  }

  // 持仓相关API
  async getPositions(portfolioId?: string): Promise<Position[]> {
    const endpoint = portfolioId
      ? `/positions?portfolioId=${portfolioId}`
      : '/positions';
    return this.request<Position[]>(endpoint);
  }

  async createPosition(
    position: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Position> {
    return this.request<Position>('/positions', {
      method: 'POST',
      body: JSON.stringify(position),
    });
  }

  async updatePosition(
    id: string,
    updates: Partial<Position>
  ): Promise<Position> {
    return this.request<Position>(`/positions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deletePosition(id: string): Promise<boolean> {
    return this.request<boolean>(`/positions/${id}`, {
      method: 'DELETE',
    });
  }

  // 交易记录相关API
  async getTransactions(portfolioId?: string): Promise<Transaction[]> {
    const endpoint = portfolioId
      ? `/transactions?portfolioId=${portfolioId}`
      : '/transactions';
    return this.request<Transaction[]>(endpoint);
  }

  async createTransaction(
    transaction: Omit<Transaction, 'id' | 'createdAt'>
  ): Promise<Transaction> {
    return this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  // 纪律设置相关API
  async getDisciplineSettings(
    portfolioId: string
  ): Promise<DisciplineSettings | null> {
    return this.request<DisciplineSettings | null>(
      `/discipline/${portfolioId}`
    );
  }

  async updateDisciplineSettings(
    portfolioId: string,
    settings: Partial<DisciplineSettings>
  ): Promise<DisciplineSettings> {
    return this.request<DisciplineSettings>(`/discipline/${portfolioId}`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Dashboard相关API
  async getDashboardOverview(): Promise<any> {
    return this.request<any>('/dashboard/overview');
  }

  async getRiskAnalysis(portfolioId?: string): Promise<any> {
    const endpoint = portfolioId
      ? `/dashboard/risk-analysis?portfolioId=${portfolioId}`
      : '/dashboard/risk-analysis';
    return this.request<any>(endpoint);
  }
}

export const apiService = new ApiService();
