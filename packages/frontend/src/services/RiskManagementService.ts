import {
  Position,
  Portfolio,
  StopLossAlert,
  TakeProfitAlert,
  RiskAssessment,
} from '@shared/types';

export class RiskManagementService {
  // 计算持仓风险等级
  calculatePositionRisk(position: Position): {
    positionId: string;
    stockCode: string;
    stockName: string;
    riskLevel: 'low' | 'medium' | 'high';
    totalRiskScore: number;
    priceRisk: { score: number; status: string; details: string };
    concentrationRisk: { score: number; status: string; details: string };
    volatilityRisk: { score: number; status: string; details: string };
    recommendations: string[];
  } {
    const { avgCost, currentPrice, weight } = position;

    // 计算价格风险
    const priceRisk = this.calculatePriceRisk(currentPrice, avgCost);

    // 计算集中度风险
    const concentrationRisk = this.calculateConcentrationRisk(weight);

    // 计算波动性风险（基于历史数据模拟）
    const volatilityRisk = this.calculateVolatilityRisk(position);

    // 综合风险评分 (0-100)
    const totalRiskScore =
      priceRisk.score * 0.4 +
      concentrationRisk.score * 0.3 +
      volatilityRisk.score * 0.3;

    // 确定风险等级
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (totalRiskScore > 70) {
      riskLevel = 'high';
    } else if (totalRiskScore > 40) {
      riskLevel = 'medium';
    }

    return {
      positionId: position.id,
      stockCode: position.stockCode,
      stockName: position.stockName,
      riskLevel,
      totalRiskScore: Math.round(totalRiskScore),
      priceRisk,
      concentrationRisk,
      volatilityRisk,
      recommendations: this.generateRiskRecommendations({
        priceRisk,
        concentrationRisk,
        volatilityRisk,
        riskLevel,
      }),
    };
  }

  // 计算价格风险
  private calculatePriceRisk(
    currentPrice: number,
    avgCost: number
  ): { score: number; status: string; details: string } {
    const currentReturn = ((currentPrice - avgCost) / avgCost) * 100;

    let score = 0;
    let status = 'safe';
    let details = '';

    // 亏损状态
    if (currentReturn < 0) {
      score += Math.min(Math.abs(currentReturn) * 2, 30);
      if (status === 'safe') status = 'warning';
      details += `当前亏损${Math.abs(currentReturn).toFixed(1)}%`;
    }

    // 盈利状态
    if (currentReturn > 0) {
      if (currentReturn > 20) {
        score += 15;
        status = 'info';
        details += `当前盈利${currentReturn.toFixed(1)}%，考虑获利了结`;
      }
    }

    return { score, status, details };
  }

  // 计算集中度风险
  private calculateConcentrationRisk(weight: number): {
    score: number;
    status: string;
    details: string;
  } {
    let score = 0;
    let status = 'safe';
    let details = '';

    if (weight > 0.3) {
      score = 80;
      status = 'danger';
      details = `仓位过重，占比${(weight * 100).toFixed(1)}%，建议分散投资`;
    } else if (weight > 0.2) {
      score = 50;
      status = 'warning';
      details = `仓位较重，占比${(weight * 100).toFixed(1)}%，注意风险控制`;
    } else if (weight > 0.1) {
      score = 20;
      status = 'info';
      details = `仓位适中，占比${(weight * 100).toFixed(1)}%`;
    }

    return { score, status, details };
  }

  // 计算波动性风险
  private calculateVolatilityRisk(position: Position): {
    score: number;
    status: string;
    details: string;
  } {
    // 模拟波动性计算，实际项目中应该基于历史数据
    const baseScore = 20;
    const sectorMultiplier = this.getSectorVolatilityMultiplier(
      position.sector
    );
    const score = Math.min(baseScore * sectorMultiplier, 100);

    return {
      score: Math.round(score),
      status: score > 60 ? 'warning' : 'safe',
      details: `${position.sector}赛道波动性风险评分${Math.round(score)}`,
    };
  }

  // 获取赛道波动性倍数
  private getSectorVolatilityMultiplier(sector: string): number {
    const multipliers: Record<string, number> = {
      AI算力: 1.5,
      新能源: 1.3,
      车与智能驾驶: 1.2,
      军工: 1.1,
      高端制造: 1.0,
      机器人: 1.4,
    };
    return multipliers[sector] || 1.0;
  }

  // 生成风险建议
  private generateRiskRecommendations(params: {
    priceRisk: { score: number; status: string };
    concentrationRisk: { score: number; status: string };
    volatilityRisk: { score: number; status: string };
    riskLevel: string;
  }): string[] {
    const recommendations: string[] = [];

    if (params.priceRisk.status === 'danger') {
      recommendations.push('价格风险较高，建议及时止损或调整策略');
    }

    if (params.concentrationRisk.status === 'danger') {
      recommendations.push('集中度风险较高，建议适当减仓分散投资');
    }

    if (params.volatilityRisk.status === 'warning') {
      recommendations.push('波动性较大，建议设置合理的止损止盈点');
    }

    if (params.riskLevel === 'high') {
      recommendations.push('整体风险较高，建议谨慎操作，控制仓位');
    }

    if (recommendations.length === 0) {
      recommendations.push('风险可控，保持当前策略');
    }

    return recommendations;
  }

  // 计算投资组合整体风险
  calculatePortfolioRisk(portfolio: Portfolio): RiskAssessment {
    const positions = portfolio.positions;
    const positionRisks = positions.map((pos) =>
      this.calculatePositionRisk(pos)
    );

    // 计算加权风险评分
    const totalRiskScore = positionRisks.reduce((sum, risk) => {
      const position = positions.find((p) => p.id === risk.positionId);
      return sum + risk.totalRiskScore * (position?.weight || 0);
    }, 0);

    // 计算各维度风险
    const marketRisk = this.calculateMarketRisk(positions);
    const concentrationRisk =
      this.calculatePortfolioConcentrationRisk(portfolio);
    const liquidityRisk = this.calculateLiquidityRisk(positions);
    const volatilityRisk = this.calculatePortfolioVolatilityRisk(positionRisks);

    // 总体风险评分 (0-10)
    const totalRisk = Math.min(Math.round(totalRiskScore / 10), 10);

    // 生成风险因素和建议
    const riskFactors = this.identifyRiskFactors(positionRisks, portfolio);
    const recommendations = this.generatePortfolioRecommendations({
      totalRisk,
      marketRisk,
      concentrationRisk,
      liquidityRisk,
      volatilityRisk,
    });

    return {
      id: crypto.randomUUID(),
      portfolioId: portfolio.id,
      totalRisk,
      marketRisk,
      concentrationRisk,
      liquidityRisk,
      volatilityRisk,
      riskFactors,
      recommendations,
      lastUpdated: new Date(),
    };
  }

  // 计算市场风险
  private calculateMarketRisk(positions: Position[]): number {
    // 模拟市场风险计算
    const avgReturn =
      positions.reduce((sum, pos) => {
        return sum + (pos.currentPrice - pos.avgCost) / pos.avgCost;
      }, 0) / positions.length;

    if (avgReturn < -0.1) return 8; // 大幅亏损
    if (avgReturn < -0.05) return 6; // 小幅亏损
    if (avgReturn < 0.05) return 4; // 小幅盈利
    return 2; // 大幅盈利
  }

  // 计算投资组合集中度风险
  private calculatePortfolioConcentrationRisk(portfolio: Portfolio): number {
    const { sectorWeights } = portfolio;
    const maxSectorWeight = Math.max(...Object.values(sectorWeights));

    if (maxSectorWeight > 0.5) return 9; // 单一赛道占比过高
    if (maxSectorWeight > 0.3) return 7; // 单一赛道占比较高
    if (maxSectorWeight > 0.2) return 5; // 单一赛道占比适中
    return 3; // 赛道分布均匀
  }

  // 计算流动性风险
  private calculateLiquidityRisk(positions: Position[]): number {
    // 模拟流动性风险计算
    const smallCapPositions = positions.filter(
      (pos) => pos.marketValue < 1000000
    );
    const liquidityRisk = (smallCapPositions.length / positions.length) * 10;

    return Math.round(liquidityRisk);
  }

  // 计算投资组合波动性风险
  private calculatePortfolioVolatilityRisk(positionRisks: any[]): number {
    const avgVolatilityRisk =
      positionRisks.reduce((sum, risk) => {
        return sum + risk.volatilityRisk.score;
      }, 0) / positionRisks.length;

    return Math.round(avgVolatilityRisk / 10);
  }

  // 识别风险因素
  private identifyRiskFactors(
    positionRisks: any[],
    portfolio: Portfolio
  ): string[] {
    const factors: string[] = [];

    // 检查高风险持仓
    const highRiskPositions = positionRisks.filter(
      (risk) => risk.riskLevel === 'high'
    );
    if (highRiskPositions.length > 0) {
      factors.push(`存在${highRiskPositions.length}只高风险股票`);
    }

    // 检查赛道集中度
    const { sectorWeights } = portfolio;
    const maxSectorWeight = Math.max(...Object.values(sectorWeights));
    if (maxSectorWeight > 0.4) {
      factors.push('单一赛道权重过高');
    }

    // 检查整体亏损
    if (portfolio.totalPnL < 0) {
      factors.push('投资组合整体亏损');
    }

    return factors;
  }

  // 生成投资组合建议
  private generatePortfolioRecommendations(params: {
    totalRisk: number;
    marketRisk: number;
    concentrationRisk: number;
    liquidityRisk: number;
    volatilityRisk: number;
  }): string[] {
    const recommendations: string[] = [];

    if (params.totalRisk > 7) {
      recommendations.push('整体风险较高，建议降低仓位或调整配置');
    }

    if (params.concentrationRisk > 7) {
      recommendations.push('集中度风险较高，建议分散投资到不同赛道');
    }

    if (params.liquidityRisk > 7) {
      recommendations.push('流动性风险较高，建议增加大盘股配置');
    }

    if (params.volatilityRisk > 7) {
      recommendations.push('波动性风险较高，建议设置合理的止损止盈点');
    }

    if (recommendations.length === 0) {
      recommendations.push('风险可控，保持当前配置策略');
    }

    return recommendations;
  }

  // 检查止损止盈触发
  checkStopLossAndTakeProfit(positions: Position[]): {
    stopLossAlerts: StopLossAlert[];
    takeProfitAlerts: TakeProfitAlert[];
  } {
    const stopLossAlerts: StopLossAlert[] = [];
    const takeProfitAlerts: TakeProfitAlert[] = [];

    for (const position of positions) {
      // 模拟止损检查（基于成本价的10%）
      const stopLossPrice = position.avgCost * 0.9;
      if (position.currentPrice <= stopLossPrice) {
        stopLossAlerts.push({
          id: crypto.randomUUID(),
          portfolioId: '', // 需要从外部传入
          stockCode: position.stockCode,
          stockName: position.stockName,
          currentPrice: position.currentPrice,
          stopLossPrice,
          unrealizedLoss: position.unrealizedPnL,
          lossPercent: Math.abs(position.unrealizedPnLPercent),
          alertLevel: 'CRITICAL',
          createdAt: new Date(),
        });
      }

      // 模拟止盈检查（基于成本价的20%）
      const takeProfitPrice = position.avgCost * 1.2;
      if (position.currentPrice >= takeProfitPrice) {
        takeProfitAlerts.push({
          id: crypto.randomUUID(),
          portfolioId: '', // 需要从外部传入
          stockCode: position.stockCode,
          stockName: position.stockName,
          currentPrice: position.currentPrice,
          takeProfitPrice,
          unrealizedProfit: position.unrealizedPnL,
          profitPercent: position.unrealizedPnLPercent,
          alertLevel: 'STRONG',
          createdAt: new Date(),
        });
      }
    }

    return { stopLossAlerts, takeProfitAlerts };
  }

  // 生成风险报告
  generateRiskReport(riskAssessment: RiskAssessment): string {
    let report = `风险评估报告\n`;
    report += `评估时间: ${new Date(
      riskAssessment.lastUpdated
    ).toLocaleString()}\n`;
    report += `总体风险评分: ${riskAssessment.totalRisk}/10\n\n`;

    report += `各维度风险:\n`;
    report += `- 市场风险: ${riskAssessment.marketRisk}/10\n`;
    report += `- 集中度风险: ${riskAssessment.concentrationRisk}/10\n`;
    report += `- 流动性风险: ${riskAssessment.liquidityRisk}/10\n`;
    report += `- 波动性风险: ${riskAssessment.volatilityRisk}/10\n\n`;

    report += `主要风险因素:\n`;
    for (const factor of riskAssessment.riskFactors) {
      report += `- ${factor}\n`;
    }

    report += `\n风险控制建议:\n`;
    for (const recommendation of riskAssessment.recommendations) {
      report += `- ${recommendation}\n`;
    }

    return report;
  }

  // 模拟实时风险监控
  startRiskMonitoring(
    portfolioId: string,
    callback: (alerts: any) => void
  ): () => void {
    // 模拟每5分钟检查一次风险
    const interval = setInterval(() => {
      // 这里应该从实际数据源获取最新数据
      // 目前返回模拟数据
      const mockAlerts = {
        timestamp: new Date().toISOString(),
        portfolioId,
        alerts: [
          {
            type: 'risk_change',
            message: '风险评分发生变化，建议查看最新风险评估',
            level: 'info',
          },
        ],
      };

      callback(mockAlerts);
    }, 5 * 60 * 1000);

    // 返回停止监控的函数
    return () => clearInterval(interval);
  }
}

// 导出单例实例
export const riskManagementService = new RiskManagementService();
