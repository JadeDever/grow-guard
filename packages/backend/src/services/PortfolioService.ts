import { Database } from 'sqlite3';
import {
  Portfolio,
  Position,
  Transaction,
  DisciplineSettings,
} from '@shared/types';
import {
  PortfolioSchema,
  PositionSchema,
  TransactionSchema,
  DisciplineSettingsSchema,
} from '@shared/types';

export class PortfolioService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // 投资组合相关方法
  async createPortfolio(
    portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Portfolio> {
    const id = crypto.randomUUID();
    const now = new Date();

    const portfolioData = {
      ...portfolio,
      id,
      createdAt: now,
      updatedAt: now,
    };

    const validatedPortfolio = PortfolioSchema.parse(portfolioData);

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO portfolios (id, name, description, total_value, total_cost, total_pnl, total_pnl_percent, max_drawdown, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          validatedPortfolio.id,
          validatedPortfolio.name,
          validatedPortfolio.description || '',
          validatedPortfolio.totalValue,
          validatedPortfolio.totalCost,
          validatedPortfolio.totalPnL,
          validatedPortfolio.totalPnLPercent,
          validatedPortfolio.maxDrawdown,
          validatedPortfolio.createdAt.toISOString(),
          validatedPortfolio.updatedAt.toISOString(),
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(validatedPortfolio);
          }
        }
      );
    });
  }

  async getPortfolio(id: string): Promise<Portfolio | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM portfolios WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          const portfolio = {
            ...row,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
            totalValue: row.total_value,
            totalCost: row.total_cost,
            totalPnL: row.total_pnl,
            totalPnLPercent: row.total_pnl_percent,
            maxDrawdown: row.max_drawdown,
          };
          resolve(PortfolioSchema.parse(portfolio));
        } else {
          resolve(null);
        }
      });
    });
  }

  async getAllPortfolios(): Promise<Portfolio[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM portfolios ORDER BY created_at DESC',
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const portfolios = rows.map((row) => ({
              ...row,
              createdAt: new Date(row.created_at),
              updatedAt: new Date(row.updated_at),
              totalValue: row.total_value,
              totalCost: row.total_cost,
              totalPnL: row.total_pnl,
              totalPnLPercent: row.total_pnl_percent,
              maxDrawdown: row.max_drawdown,
            }));
            resolve(portfolios.map((p) => PortfolioSchema.parse(p)));
          }
        }
      );
    });
  }

  async updatePortfolio(
    id: string,
    updates: Partial<Portfolio>
  ): Promise<Portfolio | null> {
    const existing = await this.getPortfolio(id);
    if (!existing) return null;

    const updatedPortfolio = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    const validatedPortfolio = PortfolioSchema.parse(updatedPortfolio);

    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE portfolios 
         SET name = ?, description = ?, total_value = ?, total_cost = ?, total_pnl = ?, total_pnl_percent = ?, max_drawdown = ?, updated_at = ?
         WHERE id = ?`,
        [
          validatedPortfolio.name,
          validatedPortfolio.description || '',
          validatedPortfolio.totalValue,
          validatedPortfolio.totalCost,
          validatedPortfolio.totalPnL,
          validatedPortfolio.totalPnLPercent,
          validatedPortfolio.maxDrawdown,
          validatedPortfolio.updatedAt.toISOString(),
          id,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(validatedPortfolio);
          }
        }
      );
    });
  }

  async deletePortfolio(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM portfolios WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  // 持仓相关方法
  async createPosition(
    position: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Position> {
    const id = crypto.randomUUID();
    const now = new Date();

    const positionData = {
      ...position,
      id,
      createdAt: now,
      updatedAt: now,
    };

    const validatedPosition = PositionSchema.parse(positionData);

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO positions (id, stock_code, stock_name, sector, quantity, avg_cost, current_price, market_value, unrealized_pnl, unrealized_pnl_percent, weight, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          validatedPosition.id,
          validatedPosition.stockCode,
          validatedPosition.stockName,
          validatedPosition.sector,
          validatedPosition.quantity,
          validatedPosition.avgCost,
          validatedPosition.currentPrice,
          validatedPosition.marketValue,
          validatedPosition.unrealizedPnL,
          validatedPosition.unrealizedPnLPercent,
          validatedPosition.weight,
          validatedPosition.createdAt.toISOString(),
          validatedPosition.updatedAt.toISOString(),
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(validatedPosition);
          }
        }
      );
    });
  }

  async getPositions(portfolioId?: string): Promise<Position[]> {
    const query = portfolioId
      ? 'SELECT * FROM positions WHERE portfolio_id = ? ORDER BY created_at DESC'
      : 'SELECT * FROM positions ORDER BY created_at DESC';
    const params = portfolioId ? [portfolioId] : [];

    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const positions = rows.map((row) => ({
            ...row,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
            stockCode: row.stock_code,
            stockName: row.stock_name,
            avgCost: row.avg_cost,
            currentPrice: row.current_price,
            marketValue: row.market_value,
            unrealizedPnL: row.unrealized_pnl,
            unrealizedPnLPercent: row.unrealized_pnl_percent,
          }));
          resolve(positions.map((p) => PositionSchema.parse(p)));
        }
      });
    });
  }

  async updatePosition(
    id: string,
    updates: Partial<Position>
  ): Promise<Position | null> {
    const existing = await this.getPositions().then((positions) =>
      positions.find((p) => p.id === id)
    );
    if (!existing) return null;

    const updatedPosition = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    const validatedPosition = PositionSchema.parse(updatedPosition);

    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE positions 
         SET stock_code = ?, stock_name = ?, sector = ?, quantity = ?, avg_cost = ?, current_price = ?, market_value = ?, unrealized_pnl = ?, unrealized_pnl_percent = ?, weight = ?, updated_at = ?
         WHERE id = ?`,
        [
          validatedPosition.stockCode,
          validatedPosition.stockName,
          validatedPosition.sector,
          validatedPosition.quantity,
          validatedPosition.avgCost,
          validatedPosition.currentPrice,
          validatedPosition.marketValue,
          validatedPosition.unrealizedPnL,
          validatedPosition.unrealizedPnLPercent,
          validatedPosition.weight,
          validatedPosition.updatedAt.toISOString(),
          id,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(validatedPosition);
          }
        }
      );
    });
  }

  async deletePosition(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM positions WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  // 交易记录相关方法
  async createTransaction(
    transaction: Omit<Transaction, 'id' | 'createdAt'>
  ): Promise<Transaction> {
    const id = crypto.randomUUID();
    const now = new Date();

    const transactionData = {
      ...transaction,
      id,
      createdAt: now,
    };

    const validatedTransaction = TransactionSchema.parse(transactionData);

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO transactions (id, portfolio_id, stock_code, stock_name, type, quantity, price, amount, commission, date, reason, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          validatedTransaction.id,
          validatedTransaction.portfolioId,
          validatedTransaction.stockCode,
          validatedTransaction.stockName,
          validatedTransaction.type,
          validatedTransaction.quantity,
          validatedTransaction.price,
          validatedTransaction.amount,
          validatedTransaction.commission,
          validatedTransaction.date.toISOString(),
          validatedTransaction.reason || '',
          validatedTransaction.createdAt.toISOString(),
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(validatedTransaction);
          }
        }
      );
    });
  }

  async getTransactions(portfolioId?: string): Promise<Transaction[]> {
    const query = portfolioId
      ? 'SELECT * FROM transactions WHERE portfolio_id = ? ORDER BY date DESC'
      : 'SELECT * FROM transactions ORDER BY date DESC';
    const params = portfolioId ? [portfolioId] : [];

    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const transactions = rows.map((row) => ({
            ...row,
            portfolioId: row.portfolio_id,
            stockCode: row.stock_code,
            stockName: row.stock_name,
            date: new Date(row.date),
            createdAt: new Date(row.created_at),
          }));
          resolve(transactions.map((t) => TransactionSchema.parse(t)));
        }
      });
    });
  }

  // 纪律设置相关方法
  async getDisciplineSettings(
    portfolioId: string
  ): Promise<DisciplineSettings | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM discipline_settings WHERE portfolio_id = ?',
        [portfolioId],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            const settings = {
              ...row,
              portfolioId: row.portfolio_id,
              stopLossPercent: row.stop_loss_percent,
              takeProfitPercent: row.take_profit_percent,
              maxPositionWeight: row.max_position_weight,
              maxSectorWeight: row.max_sector_weight,
              rebalanceThreshold: row.rebalance_threshold,
              createdAt: new Date(row.created_at),
              updatedAt: new Date(row.updated_at),
            };
            resolve(DisciplineSettingsSchema.parse(settings));
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  async updateDisciplineSettings(
    portfolioId: string,
    settings: Partial<DisciplineSettings>
  ): Promise<DisciplineSettings> {
    const existing = await this.getDisciplineSettings(portfolioId);
    const now = new Date();

    if (existing) {
      const updatedSettings = {
        ...existing,
        ...settings,
        updatedAt: now,
      };

      const validatedSettings = DisciplineSettingsSchema.parse(updatedSettings);

      return new Promise((resolve, reject) => {
        this.db.run(
          `UPDATE discipline_settings 
           SET stop_loss_percent = ?, take_profit_percent = ?, max_position_weight = ?, max_sector_weight = ?, rebalance_threshold = ?, updated_at = ?
           WHERE portfolio_id = ?`,
          [
            validatedSettings.stopLossPercent,
            validatedSettings.takeProfitPercent,
            validatedSettings.maxPositionWeight,
            validatedSettings.maxSectorWeight,
            validatedSettings.rebalanceThreshold,
            validatedSettings.updatedAt.toISOString(),
            portfolioId,
          ],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(validatedSettings);
            }
          }
        );
      });
    } else {
      const newSettings = {
        id: crypto.randomUUID(),
        portfolioId,
        stopLossPercent: 0.1,
        takeProfitPercent: 0.2,
        maxPositionWeight: 0.1,
        maxSectorWeight: 0.3,
        rebalanceThreshold: 0.05,
        createdAt: now,
        updatedAt: now,
        ...settings,
      };

      const validatedSettings = DisciplineSettingsSchema.parse(newSettings);

      return new Promise((resolve, reject) => {
        this.db.run(
          `INSERT INTO discipline_settings (id, portfolio_id, stop_loss_percent, take_profit_percent, max_position_weight, max_sector_weight, rebalance_threshold, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            validatedSettings.id,
            validatedSettings.portfolioId,
            validatedSettings.stopLossPercent,
            validatedSettings.takeProfitPercent,
            validatedSettings.maxPositionWeight,
            validatedSettings.maxSectorWeight,
            validatedSettings.rebalanceThreshold,
            validatedSettings.createdAt.toISOString(),
            validatedSettings.updatedAt.toISOString(),
          ],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(validatedSettings);
            }
          }
        );
      });
    }
  }
}
