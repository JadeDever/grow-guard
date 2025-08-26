import { 
  Portfolio, 
  Position, 
  Transaction, 
  Report, 
  ReportType,
  ReportTemplate,
  PerformanceMetrics,
  RiskMetrics
} from '@shared/types';
import { portfolioService } from './PortfolioService';
import { riskManagementService } from './RiskManagementService';
import { tradingService } from './TradingService';

export class ReportService {
  
  // 生成投资组合报告
  async generatePortfolioReport(
    portfolioId: string, 
    reportType: ReportType = 'comprehensive',
    startDate?: string,
    endDate?: string
  ): Promise<Report> {
    const portfolio = await portfolioService.getPortfolio(portfolioId);
    if (!portfolio) {
      throw new Error('投资组合不存在');
    }

    const positions = await portfolioService.getPositions(portfolioId);
    const transactions = await portfolioService.getTransactions(portfolioId);
    const performanceData = await portfolioService.getPerformanceData(portfolioId);
    const riskMetrics = await portfolioService.getRiskMetrics(portfolioId);
    
    // 计算关键指标
    const metrics = this.calculatePortfolioMetrics(portfolio, positions, transactions);
    
    // 生成报告内容
    const content = await this.generateReportContent(
      portfolio,
      positions,
      transactions,
      performanceData,
      riskMetrics,
      metrics,
      reportType,
      startDate,
      endDate
    );

    const report: Report = {
      id: Date.now().toString(),
      portfolioId,
      portfolioName: portfolio.name,
      reportType,
      title: this.generateReportTitle(reportType, portfolio.name),
      content,
      metrics,
      generatedAt: new Date().toISOString(),
      period: {
        start: startDate || this.getDefaultStartDate(),
        end: endDate || new Date().toISOString().split('T')[0]
      },
      format: 'html'
    };

    return Promise.resolve(report);
  }

  // 计算投资组合关键指标
  private calculatePortfolioMetrics(
    portfolio: Portfolio, 
    positions: Position[], 
    transactions: Transaction[]
  ): PerformanceMetrics {
    // 计算收益率
    const totalReturn = portfolio.totalPnLPercent;
    
    // 计算年化收益率（假设投资期为1年）
    const annualizedReturn = this.calculateAnnualizedReturn(portfolio);
    
    // 计算最大回撤
    const maxDrawdown = this.calculateMaxDrawdown(portfolio, positions);
    
    // 计算夏普比率
    const sharpeRatio = this.calculateSharpeRatio(portfolio, positions);
    
    // 计算波动率
    const volatility = this.calculateVolatility(portfolio, positions);
    
    // 计算贝塔系数
    const beta = this.calculateBeta(portfolio, positions);
    
    // 计算信息比率
    const informationRatio = this.calculateInformationRatio(portfolio, positions);
    
    // 计算跟踪误差
    const trackingError = this.calculateTrackingError(portfolio, positions);

    return {
      totalReturn,
      annualizedReturn,
      maxDrawdown,
      sharpeRatio,
      volatility,
      beta,
      informationRatio,
      trackingError,
      totalValue: portfolio.totalValue,
      totalCost: portfolio.totalCost,
      totalPnL: portfolio.totalPnL,
      totalPnLPercent: portfolio.totalPnLPercent
    };
  }

  // 计算年化收益率
  private calculateAnnualizedReturn(portfolio: Portfolio): number {
    const startDate = new Date(portfolio.createdAt);
    const endDate = new Date(portfolio.updatedAt);
    const days = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (days <= 0) return 0;
    
    const totalReturn = portfolio.totalPnLPercent / 100;
    const annualizedReturn = Math.pow(1 + totalReturn, 365 / days) - 1;
    
    return annualizedReturn * 100;
  }

  // 计算最大回撤
  private calculateMaxDrawdown(portfolio: Portfolio, positions: Position[]): number {
    // 模拟计算最大回撤
    // 实际应用中应该基于历史价格数据计算
    const baseValue = portfolio.totalCost;
    const currentValue = portfolio.totalValue;
    const maxDrawdown = ((baseValue - currentValue) / baseValue) * 100;
    
    return Math.max(0, maxDrawdown);
  }

  // 计算夏普比率
  private calculateSharpeRatio(portfolio: Portfolio, positions: Position[]): number {
    // 模拟计算夏普比率
    // 实际应用中需要基于历史收益率数据计算
    const riskFreeRate = 3.0; // 假设无风险利率为3%
    const excessReturn = portfolio.totalPnLPercent - riskFreeRate;
    const volatility = this.calculateVolatility(portfolio, positions);
    
    return volatility > 0 ? excessReturn / volatility : 0;
  }

  // 计算波动率
  private calculateVolatility(portfolio: Portfolio, positions: Position[]): number {
    // 模拟计算波动率
    // 基于持仓的风险等级和权重计算
    let totalVolatility = 0;
    
    for (const position of positions) {
      let positionVolatility = 0;
      switch (position.riskLevel) {
        case 'high':
          positionVolatility = 25; // 25%年化波动率
          break;
        case 'medium':
          positionVolatility = 18; // 18%年化波动率
          break;
        case 'low':
          positionVolatility = 12; // 12%年化波动率
          break;
      }
      totalVolatility += positionVolatility * position.weight;
    }
    
    return totalVolatility;
  }

  // 计算贝塔系数
  private calculateBeta(portfolio: Portfolio, positions: Position[]): number {
    // 模拟计算贝塔系数
    // 基于持仓的行业特性计算
    let totalBeta = 1.0; // 默认贝塔为1
    
    for (const position of positions) {
      let positionBeta = 1.0; // 默认贝塔为1
      
      // 根据行业调整贝塔
      switch (position.sector) {
        case '新能源':
          positionBeta = 1.2;
          break;
        case 'AI算力':
          positionBeta = 1.5;
          break;
        case '车与智能驾驶':
          positionBeta = 1.3;
          break;
      }
      
      totalBeta += positionBeta * position.weight;
    }
    
    return totalBeta;
  }

  // 计算信息比率
  private calculateInformationRatio(portfolio: Portfolio, positions: Position[]): number {
    // 模拟计算信息比率
    const benchmarkReturn = 8.0; // 假设基准收益率为8%
    const excessReturn = portfolio.totalPnLPercent - benchmarkReturn;
    const trackingError = this.calculateTrackingError(portfolio, positions);
    
    return trackingError > 0 ? excessReturn / trackingError : 0;
  }

  // 计算跟踪误差
  private calculateTrackingError(portfolio: Portfolio, positions: Position[]): number {
    // 模拟计算跟踪误差
    // 基于持仓的分散程度计算
    const positionCount = positions.length;
    if (positionCount <= 1) return 0;
    
    // 持仓越分散，跟踪误差越小
    const concentrationIndex = positions.reduce((sum, pos) => sum + Math.pow(pos.weight, 2), 0);
    const trackingError = Math.sqrt(concentrationIndex) * 15; // 15%基准波动率
    
    return trackingError;
  }

  // 生成报告内容
  private async generateReportContent(
    portfolio: Portfolio,
    positions: Position[],
    transactions: Transaction[],
    performanceData: any[],
    riskMetrics: any[],
    metrics: PerformanceMetrics,
    reportType: ReportType,
    startDate?: string,
    endDate?: string
  ): Promise<string> {
    let content = '';

    // 报告头部
    content += this.generateReportHeader(portfolio, reportType, startDate, endDate);
    
    // 执行摘要
    content += this.generateExecutiveSummary(portfolio, metrics);
    
    // 投资组合概览
    content += this.generatePortfolioOverview(portfolio, positions);
    
    // 表现分析
    content += this.generatePerformanceAnalysis(metrics, performanceData);
    
    // 风险分析
    content += this.generateRiskAnalysis(riskMetrics, positions);
    
    // 持仓分析
    content += this.generatePositionAnalysis(positions);
    
    // 交易分析
    content += this.generateTransactionAnalysis(transactions);
    
    // 建议和展望
    content += this.generateRecommendationsAndOutlook(portfolio, positions, metrics);

    return content;
  }

  // 生成报告头部
  private generateReportHeader(
    portfolio: Portfolio, 
    reportType: ReportType, 
    startDate?: string, 
    endDate?: string
  ): string {
    const reportDate = new Date().toLocaleDateString('zh-CN');
    const period = startDate && endDate ? `${startDate} 至 ${endDate}` : '全期间';
    
    return `
      <div class="report-header">
        <h1>${this.generateReportTitle(reportType, portfolio.name)}</h1>
        <div class="report-meta">
          <p><strong>投资组合:</strong> ${portfolio.name}</p>
          <p><strong>报告类型:</strong> ${this.getReportTypeText(reportType)}</p>
          <p><strong>报告期间:</strong> ${period}</p>
          <p><strong>生成时间:</strong> ${reportDate}</p>
        </div>
      </div>
    `;
  }

  // 生成执行摘要
  private generateExecutiveSummary(portfolio: Portfolio, metrics: PerformanceMetrics): string {
    const performanceStatus = metrics.totalReturn >= 0 ? 'positive' : 'negative';
    const performanceText = metrics.totalReturn >= 0 ? '盈利' : '亏损';
    
    return `
      <div class="executive-summary">
        <h2>执行摘要</h2>
        <div class="summary-highlights">
          <div class="highlight-item ${performanceStatus}">
            <h3>${performanceText}</h3>
            <p class="highlight-value">${metrics.totalReturn.toFixed(2)}%</p>
            <p class="highlight-label">总收益率</p>
          </div>
          <div class="highlight-item">
            <h3>总市值</h3>
            <p class="highlight-value">¥${(metrics.totalValue / 10000).toFixed(1)}万</p>
            <p class="highlight-label">当前市值</p>
          </div>
          <div class="highlight-item">
            <h3>风险等级</h3>
            <p class="highlight-value">${this.getRiskLevelText(metrics.volatility)}</p>
            <p class="highlight-label">波动率 ${metrics.volatility.toFixed(1)}%</p>
          </div>
        </div>
        <div class="summary-description">
          <p>本投资组合在报告期间实现了${performanceText}，总收益率为${metrics.totalReturn.toFixed(2)}%，
             年化收益率为${metrics.annualizedReturn.toFixed(2)}%。组合整体风险控制良好，
             夏普比率为${metrics.sharpeRatio.toFixed(2)}，最大回撤为${metrics.maxDrawdown.toFixed(2)}%。</p>
        </div>
      </div>
    `;
  }

  // 生成投资组合概览
  private generatePortfolioOverview(portfolio: Portfolio, positions: Position[]): string {
    const sectorDistribution = this.calculateSectorDistribution(positions);
    const topHoldings = positions
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);

    return `
      <div class="portfolio-overview">
        <h2>投资组合概览</h2>
        <div class="overview-grid">
          <div class="overview-card">
            <h3>基本信息</h3>
            <ul>
              <li><strong>组合名称:</strong> ${portfolio.name}</li>
              <li><strong>总市值:</strong> ¥${(portfolio.totalValue / 10000).toFixed(1)}万</li>
              <li><strong>总成本:</strong> ¥${(portfolio.totalCost / 10000).toFixed(1)}万</li>
              <li><strong>持仓数量:</strong> ${positions.length}只</li>
            </ul>
          </div>
          <div class="overview-card">
            <h3>赛道分布</h3>
            <ul>
              ${sectorDistribution.map(sector => 
                `<li><strong>${sector.name}:</strong> ${(sector.weight * 100).toFixed(1)}%</li>`
              ).join('')}
            </ul>
          </div>
          <div class="overview-card">
            <h3>前五大持仓</h3>
            <ul>
              ${topHoldings.map(position => 
                `<li><strong>${position.stockName}:</strong> ${(position.weight * 100).toFixed(1)}%</li>`
              ).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  // 计算赛道分布
  private calculateSectorDistribution(positions: Position[]): Array<{ name: string; weight: number }> {
    const sectorMap = new Map<string, number>();
    
    for (const position of positions) {
      const existingWeight = sectorMap.get(position.sector) || 0;
      sectorMap.set(position.sector, existingWeight + position.weight);
    }
    
    return Array.from(sectorMap.entries())
      .map(([name, weight]) => ({ name, weight }))
      .sort((a, b) => b.weight - a.weight);
  }

  // 生成表现分析
  private generatePerformanceAnalysis(metrics: PerformanceMetrics, performanceData: any[]): string {
    return `
      <div class="performance-analysis">
        <h2>表现分析</h2>
        <div class="performance-metrics">
          <div class="metric-row">
            <div class="metric-item">
              <span class="metric-label">总收益率</span>
              <span class="metric-value ${metrics.totalReturn >= 0 ? 'positive' : 'negative'}">
                ${metrics.totalReturn >= 0 ? '+' : ''}${metrics.totalReturn.toFixed(2)}%
              </span>
            </div>
            <div class="metric-item">
              <span class="metric-label">年化收益率</span>
              <span class="metric-value ${metrics.annualizedReturn >= 0 ? 'positive' : 'negative'}">
                ${metrics.annualizedReturn >= 0 ? '+' : ''}${metrics.annualizedReturn.toFixed(2)}%
              </span>
            </div>
            <div class="metric-item">
              <span class="metric-label">夏普比率</span>
              <span class="metric-value">${metrics.sharpeRatio.toFixed(2)}</span>
            </div>
          </div>
          <div class="metric-row">
            <div class="metric-item">
              <span class="metric-label">最大回撤</span>
              <span class="metric-value">${metrics.maxDrawdown.toFixed(2)}%</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">波动率</span>
              <span class="metric-value">${metrics.volatility.toFixed(2)}%</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">贝塔系数</span>
              <span class="metric-value">${metrics.beta.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 生成风险分析
  private generateRiskAnalysis(riskMetrics: any[], positions: Position[]): string {
    const riskLevels = this.calculateRiskLevels(positions);
    
    return `
      <div class="risk-analysis">
        <h2>风险分析</h2>
        <div class="risk-overview">
          <div class="risk-distribution">
            <h3>风险分布</h3>
            <ul>
              <li><strong>低风险:</strong> ${riskLevels.low}只 (${((riskLevels.low / positions.length) * 100).toFixed(1)}%)</li>
              <li><strong>中风险:</strong> ${riskLevels.medium}只 (${((riskLevels.medium / positions.length) * 100).toFixed(1)}%)</li>
              <li><strong>高风险:</strong> ${riskLevels.high}只 (${((riskLevels.high / positions.length) * 100).toFixed(1)}%)</li>
            </ul>
          </div>
          <div class="risk-metrics">
            <h3>风险指标</h3>
            <ul>
              ${riskMetrics.map(metric => 
                `<li><strong>${metric.metric}:</strong> ${metric.value.toFixed(2)} (目标: ${metric.target.toFixed(2)})</li>`
              ).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  // 计算风险等级分布
  private calculateRiskLevels(positions: Position[]): { low: number; medium: number; high: number } {
    return {
      low: positions.filter(p => p.riskLevel === 'low').length,
      medium: positions.filter(p => p.riskLevel === 'medium').length,
      high: positions.filter(p => p.riskLevel === 'high').length
    };
  }

  // 生成持仓分析
  private generatePositionAnalysis(positions: Position[]): string {
    const topPerformers = positions
      .sort((a, b) => b.pnlPercent - a.pnlPercent)
      .slice(0, 5);
    
    const worstPerformers = positions
      .sort((a, b) => a.pnlPercent - b.pnlPercent)
      .slice(0, 5);

    return `
      <div class="position-analysis">
        <h2>持仓分析</h2>
        <div class="position-performance">
          <div class="top-performers">
            <h3>表现最佳持仓</h3>
            <table>
              <thead>
                <tr><th>股票名称</th><th>收益率</th><th>权重</th></tr>
              </thead>
              <tbody>
                ${topPerformers.map(position => 
                  `<tr>
                    <td>${position.stockName}</td>
                    <td class="positive">+${position.pnlPercent.toFixed(2)}%</td>
                    <td>${(position.weight * 100).toFixed(1)}%</td>
                  </tr>`
                ).join('')}
              </tbody>
            </table>
          </div>
          <div class="worst-performers">
            <h3>表现最差持仓</h3>
            <table>
              <thead>
                <tr><th>股票名称</th><th>收益率</th><th>权重</th></tr>
              </thead>
              <tbody>
                ${worstPerformers.map(position => 
                  `<tr>
                    <td>${position.stockName}</td>
                    <td class="negative">${position.pnlPercent.toFixed(2)}%</td>
                    <td>${(position.weight * 100).toFixed(1)}%</td>
                  </tr>`
                ).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // 生成交易分析
  private generateTransactionAnalysis(transactions: Transaction[]): string {
    const buyTransactions = transactions.filter(t => t.type === 'buy');
    const sellTransactions = transactions.filter(t => t.type === 'sell');
    
    const totalBuyAmount = buyTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalSellAmount = sellTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalCommission = transactions.reduce((sum, t) => sum + t.commission, 0);

    return `
      <div class="transaction-analysis">
        <h2>交易分析</h2>
        <div class="transaction-summary">
          <div class="transaction-stat">
            <h3>交易统计</h3>
            <ul>
              <li><strong>总交易次数:</strong> ${transactions.length}</li>
              <li><strong>买入交易:</strong> ${buyTransactions.length}次</li>
              <li><strong>卖出交易:</strong> ${sellTransactions.length}次</li>
              <li><strong>总买入金额:</strong> ¥${(totalBuyAmount / 10000).toFixed(1)}万</li>
              <li><strong>总卖出金额:</strong> ¥${(totalSellAmount / 10000).toFixed(1)}万</li>
              <li><strong>总手续费:</strong> ¥${totalCommission}</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  // 生成建议和展望
  private generateRecommendationsAndOutlook(
    portfolio: Portfolio, 
    positions: Position[], 
    metrics: PerformanceMetrics
  ): string {
    const recommendations = this.generateRecommendations(portfolio, positions, metrics);
    
    return `
      <div class="recommendations-outlook">
        <h2>投资建议与展望</h2>
        <div class="recommendations">
          <h3>主要建议</h3>
          <ul>
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        <div class="outlook">
          <h3>市场展望</h3>
          <p>基于当前市场环境和投资组合表现，建议投资者：</p>
          <ul>
            <li>密切关注市场波动，适时调整持仓结构</li>
            <li>保持风险分散，避免过度集中</li>
            <li>定期评估投资策略，优化资产配置</li>
            <li>关注宏观经济变化，把握投资机会</li>
          </ul>
        </div>
      </div>
    `;
  }

  // 生成投资建议
  private generateRecommendations(
    portfolio: Portfolio, 
    positions: Position[], 
    metrics: PerformanceMetrics
  ): string[] {
    const recommendations: string[] = [];
    
    // 基于收益率
    if (metrics.totalReturn < 0) {
      recommendations.push('当前组合处于亏损状态，建议重新评估投资策略和持仓结构');
    } else if (metrics.totalReturn < 5) {
      recommendations.push('收益率偏低，建议优化选股策略，关注高成长性标的');
    }
    
    // 基于风险
    if (metrics.volatility > 20) {
      recommendations.push('组合波动率较高，建议增加防御性资产配置');
    }
    
    // 基于集中度
    const maxWeight = Math.max(...positions.map(p => p.weight));
    if (maxWeight > 0.2) {
      recommendations.push('存在权重过高的持仓，建议适当分散以降低集中度风险');
    }
    
    // 基于夏普比率
    if (metrics.sharpeRatio < 1.0) {
      recommendations.push('风险调整后收益偏低，建议优化风险控制措施');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('当前投资组合配置合理，建议继续保持现有策略');
    }
    
    return recommendations;
  }

  // 生成报告标题
  private generateReportTitle(reportType: ReportType, portfolioName: string): string {
    const typeText = this.getReportTypeText(reportType);
    return `${portfolioName} - ${typeText}`;
  }

  // 获取报告类型文本
  private getReportTypeText(reportType: ReportType): string {
    switch (reportType) {
      case 'comprehensive':
        return '综合报告';
      case 'performance':
        return '表现报告';
      case 'risk':
        return '风险报告';
      case 'transaction':
        return '交易报告';
      default:
        return '投资报告';
    }
  }

  // 获取风险等级文本
  private getRiskLevelText(volatility: number): string {
    if (volatility < 15) return '低';
    if (volatility < 25) return '中';
    return '高';
  }

  // 获取默认开始日期
  private getDefaultStartDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  }

  // 导出报告为不同格式
  async exportReport(report: Report, format: 'html' | 'pdf' | 'csv'): Promise<string> {
    switch (format) {
      case 'html':
        return this.exportAsHTML(report);
      case 'csv':
        return this.exportAsCSV(report);
      case 'pdf':
        return this.exportAsPDF(report);
      default:
        throw new Error('不支持的导出格式');
    }
  }

  // 导出为HTML
  private exportAsHTML(report: Report): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${report.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .report-header { text-align: center; margin-bottom: 30px; }
          .report-meta { background: #f5f5f5; padding: 15px; border-radius: 5px; }
          .report-meta p { margin: 5px 0; }
          h1, h2, h3 { color: #333; }
          .highlight-item { display: inline-block; margin: 10px; padding: 15px; border-radius: 5px; text-align: center; }
          .positive { color: #28a745; }
          .negative { color: #dc3545; }
          .overview-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
          .overview-card { background: #f9f9f9; padding: 15px; border-radius: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        ${report.content}
      </body>
      </html>
    `;
  }

  // 导出为CSV
  private exportAsCSV(report: Report): string {
    // 简化的CSV导出
    let csv = `报告标题,${report.title}\n`;
    csv += `投资组合,${report.portfolioName}\n`;
    csv += `报告类型,${report.reportType}\n`;
    csv += `生成时间,${report.generatedAt}\n`;
    csv += `总市值,${report.metrics.totalValue}\n`;
    csv += `总收益率,${report.metrics.totalReturn}%\n`;
    
    return csv;
  }

  // 导出为PDF
  private exportAsPDF(report: Report): string {
    // 简化的PDF导出（实际应用中需要使用专门的PDF库）
    return `PDF格式的${report.title}报告内容`;
  }
}

// 导出单例实例
export const reportService = new ReportService();
