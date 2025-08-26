import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = process.env.DB_PATH || './data/grow-guard.db';
let dbInstance: sqlite3.Database | null = null;

export function getDatabase(): sqlite3.Database {
  if (!dbInstance) {
    // 确保数据目录存在
    const dataDir = path.dirname(dbPath);
    const fs = require('fs');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    dbInstance = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ 数据库连接失败:', err.message);
        throw err;
      }
      console.log('✅ 数据库连接成功:', dbPath);
    });

    // 启用外键约束
    dbInstance.run('PRAGMA foreign_keys = ON');
  }
  
  return dbInstance;
}

export async function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    // 创建表
    createTables(db)
      .then(() => {
        console.log('✅ 数据库表创建完成');
        resolve();
      })
      .catch((err) => {
        console.error('❌ 数据库表创建失败:', err);
        reject(err);
      });
  });
}

async function createTables(db: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    // 创建投资组合表
    const createPortfolioTable = `
      CREATE TABLE IF NOT EXISTS portfolios (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        total_value REAL DEFAULT 0,
        total_cost REAL DEFAULT 0,
        total_pnl REAL DEFAULT 0,
        total_pnl_percent REAL DEFAULT 0,
        max_drawdown REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 创建持仓表
    const createPositionTable = `
      CREATE TABLE IF NOT EXISTS positions (
        id TEXT PRIMARY KEY,
        portfolio_id TEXT NOT NULL,
        stock_code TEXT NOT NULL,
        stock_name TEXT NOT NULL,
        sector TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        avg_cost REAL NOT NULL,
        current_price REAL NOT NULL,
        market_value REAL NOT NULL,
        unrealized_pnl REAL DEFAULT 0,
        unrealized_pnl_percent REAL DEFAULT 0,
        weight REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (portfolio_id) REFERENCES portfolios (id) ON DELETE CASCADE
      )
    `;

    // 创建交易记录表
    const createTransactionTable = `
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        portfolio_id TEXT NOT NULL,
        stock_code TEXT NOT NULL,
        stock_name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('BUY', 'SELL')),
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        amount REAL NOT NULL,
        commission REAL DEFAULT 0,
        date DATETIME NOT NULL,
        reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (portfolio_id) REFERENCES portfolios (id) ON DELETE CASCADE
      )
    `;

    // 创建纪律设置表
    const createDisciplineTable = `
      CREATE TABLE IF NOT EXISTS discipline_settings (
        id TEXT PRIMARY KEY,
        portfolio_id TEXT NOT NULL,
        stop_loss_percent REAL DEFAULT 0.1,
        take_profit_percent REAL DEFAULT 0.2,
        max_position_weight REAL DEFAULT 0.2,
        max_sector_weight REAL DEFAULT 0.4,
        rebalance_threshold REAL DEFAULT 0.05,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (portfolio_id) REFERENCES portfolios (id) ON DELETE CASCADE
      )
    `;

    // 创建报告表
    const createReportTable = `
      CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        portfolio_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('MORNING', 'CLOSING', 'ALERT')),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        summary TEXT NOT NULL,
        key_metrics TEXT NOT NULL,
        recommendations TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (portfolio_id) REFERENCES portfolios (id) ON DELETE CASCADE
      )
    `;

    const tables = [
      { name: 'portfolios', sql: createPortfolioTable },
      { name: 'positions', sql: createPositionTable },
      { name: 'transactions', sql: createTransactionTable },
      { name: 'discipline_settings', sql: createDisciplineTable },
      { name: 'reports', sql: createReportTable },
    ];

    let completed = 0;
    const total = tables.length;

    tables.forEach(({ name, sql }) => {
      db.run(sql, (err) => {
        if (err) {
          console.error(`❌ 创建表 ${name} 失败:`, err.message);
          reject(err);
          return;
        }

        completed++;
        console.log(`✅ 表 ${name} 创建成功 (${completed}/${total})`);

        if (completed === total) {
          resolve();
        }
      });
    });
  });
}
