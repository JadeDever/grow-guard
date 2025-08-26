import { 
  Position, 
  Portfolio, 
  RiskMetrics,
  StopLossAlert,
  TakeProfitAlert,
  RiskAssessment,
  PositionRisk,
  SectorRisk
} from '@shared/types';

export class RiskManagementService {
  
  // 计算持仓风险等级
  calculatePositionRisk(position: Position): PositionRisk {
    const { avgPrice, currentPrice, stopLoss, takeProfit, weight } = position;
    
    // 计算价格风险
    const priceRisk = this.calculatePriceRisk(currentPrice, avgPrice, stopLoss, takeProfit);
    
    // 计算集中度风险
    const concentrationRisk = this.calculateConcentrationRisk(weight);
    
    // 计算波动性风险（基于历史数据模拟）
    const volatilityRisk = this.calculateVolatilityRisk(position);
    
    // 综合风险评分 (0-100)
    const totalRiskScore = (
      priceRisk.score * 0.4 + 
      concentrationRisk.score * 0.3 + 
      volatilityRisk.score * 0.3
    );
    
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
        riskLevel
      })
    };
  }

  // 计算价格风险
  private calculatePriceRisk(
    currentPrice: number, 
    avgPrice: number, 
    stopLoss: number, 
    takeProfit: number
  ): { score: number; status: string; details: string } {
    const lossDistance = ((currentPrice - stopLoss) / avgPrice) * 100;
    const profitDistance = ((takeProfit - currentPrice) / avgPrice) * 100;
    const currentReturn = ((currentPrice - avgPrice) / avgPrice) * 100;
    
    let score = 0;
    let status = 'safe';
    let details = '';
    
    // 接近止损线
    if (lossDistance <= 5) {
      score += 40;
      status = 'danger';
      details = `当前价格接近止损线，距离止损还有${lossDistance.toFixed(1)}%`;
    } else if (lossDistance <= 10) {
      score += 25;
      status = 'warning';
      details = `当前价格接近止损线，距离止损还有${lossDistance.toFixed(1)}%`;
    }
    
    // 接近止盈线
    if (profitDistance <= 5) {
      score += 20;
      status = profitDistance <= 2 ? 'warning' : 'info';
      details = `当前价格接近止盈线，距离止盈还有${profitDistance.toFixed(1)}%`;
    }
    
    // 亏损状态
    if (currentReturn < 0) {
      score += Math.min(Math.abs(currentReturn) * 2, 30);
      if (status === 'safe') status = 'warning';
      details += `当前亏损${Math.abs(currentReturn).toFixed(1)}%`;
    }
    
    return { score, status, details };
  }

  // 计算集中度风险
  private calculateConcentrationRisk(weight: number): { score: number; status: string; details: string } {
    let score = 0;
    let status = 'safe';
    let details = '';
    
    if (weight > 0.25) {
      score = 50;
      status = 'danger';
      details = `持仓权重过高(${(weight * 100).toFixed(1)}%)，集中度风险较大`;
    } else if (weight > 0.15) {
      score = 30;
      status = 'warning';
      details = `持仓权重较高(${(weight * 100).toFixed(1)}%)，建议适当分散`;
    } else if (weight > 0.10) {
      score = 15;
      status = 'info';
      details = `持仓权重适中(${(weight * 100).toFixed(1)}%)`;
    } else {
      score = 5;
      details = `持仓权重较低(${(weight * 100).toFixed(1)}%)，风险分散良好`;
    }
    
    return { score, status, details };
  }

  // 计算波动性风险
  private calculateVolatilityRisk(position: Position): { score: number; status: string; details: string } {
    // 基于风险等级和持仓时间模拟波动性
    let score = 0;
    let status = 'safe';
    let details = '';
    
    switch (position.riskLevel) {
      case 'high':
        score = 35;
        status = 'warning';
        details = '高风险股票，波动性较大';
        break;
      case 'medium':
        score = 20;
        status = 'info';
        details = '中风险股票，波动性适中';
        break;
      case 'low':
        score = 10;
        details = '低风险股票，波动性较小';
        break;
    }
    
    // 基于持仓时间调整（持仓时间越长，波动性风险相对降低）
    const holdingDays = this.calculateHoldingDays(position.lastUpdate);
    if (holdingDays < 30) {
      score += 10;
      details += '，短期持仓波动性风险较高';
    } else if (holdingDays > 180) {
      score = Math.max(score - 5, 0);
      details += '，长期持仓相对稳定';
    }
    
    return { score, status, details };
  }

  // 计算持仓天数
  private calculateHoldingDays(lastUpdate: string): number {
    const lastUpdateDate = new Date(lastUpdate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastUpdateDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // 生成风险建议
  private generateRiskRecommendations(risks: {
    priceRisk: { score: number; status: string };
    concentrationRisk: { score: number; status: string };
    volatilityRisk: { score: number; status: string };
    riskLevel: string;
  }): string[] {
    const recommendations: string[] = [];
    
    if (risks.priceRisk.status === 'danger') {
      recommendations.push('建议立即设置止损或减仓，控制价格风险');
    } else if (risks.priceRisk.status === 'warning') {
      recommendations.push('密切关注价格走势，准备调整止损止盈设置');
    }
    
    if (risks.concentrationRisk.status === 'danger') {
      recommendations.push('持仓权重过高，建议立即减仓以分散风险');
    } else if (risks.concentrationRisk.status === 'warning') {
      recommendations.push('考虑适当减仓，降低集中度风险');
    }
    
    if (risks.volatilityRisk.status === 'warning') {
      recommendations.push('股票波动性较大，建议设置更严格的止损');
    }
    
    if (risks.riskLevel === 'high') {
      recommendations.push('整体风险等级较高，建议重新评估投资策略');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('当前风险可控，继续保持现有策略');
    }
    
    return recommendations;
  }

  // 计算投资组合整体风险
  calculatePortfolioRisk(portfolio: Portfolio, positions: Position[]): RiskAssessment {
    const positionRisks = positions.map(pos => this.calculatePositionRisk(pos));
    
    // 计算加权平均风险评分
    const totalWeight = positions.reduce((sum, pos) => sum + pos.weight, 0);
    const weightedRiskScore = positions.reduce((sum, pos) => {
      const risk = positionRisks.find(r => r.positionId === pos.id);
      return sum + (risk?.totalRiskScore || 0) * pos.weight;
    }, 0) / totalWeight;
    
    // 计算风险分布
    const riskDistribution = {
      low: positions.filter(pos => pos.riskLevel === 'low').length,
      medium: positions.filter(pos => pos.riskLevel === 'medium').length,
      high: positions.filter(pos => pos.riskLevel === 'high').length
    };
    
    // 计算赛道风险
    const sectorRisks = this.calculateSectorRisks(positions);
    
    // 确定整体风险等级
    let overallRiskLevel: 'low' | 'medium' | 'high' = 'low';
    if (weightedRiskScore > 60) {
      overallRiskLevel = 'high';
    } else if (weightedRiskScore > 35) {
      overallRiskLevel = 'medium';
    }
    
    // 生成组合级别的风险建议
    const portfolioRecommendations = this.generatePortfolioRiskRecommendations({
      weightedRiskScore,
      riskDistribution,
      sectorRisks,
      overallRiskLevel
    });
    
    return {
      portfolioId: portfolio.id,
      portfolioName: portfolio.name,
      overallRiskLevel,
      weightedRiskScore: Math.round(weightedRiskScore),
      riskDistribution,
      sectorRisks,
      positionRisks,
      recommendations: portfolioRecommendations,
      lastUpdated: new Date().toISOString()
    };
  }

  // 计算赛道风险
  private calculateSectorRisks(positions: Position[]): SectorRisk[] {
    const sectorMap = new Map<string, {
      totalWeight: number;
      totalRiskScore: number;
      positionCount: number;
      highRiskCount: number;
    }>();
    
    // 按赛道分组统计
    for (const position of positions) {
      const existing = sectorMap.get(position.sector) || {
        totalWeight: 0,
        totalRiskScore: 0,
        positionCount: 0,
        highRiskCount: 0
      };
      
      existing.totalWeight += position.weight;
      existing.totalRiskScore += position.weight * (position.riskLevel === 'high' ? 80 : position.riskLevel === 'medium' ? 50 : 20);
      existing.positionCount += 1;
      if (position.riskLevel === 'high') {
        existing.highRiskCount += 1;
      }
      
      sectorMap.set(position.sector, existing);
    }
    
    // 转换为数组格式
    return Array.from(sectorMap.entries()).map(([sectorName, data]) => {
      const avgRiskScore = data.totalWeight > 0 ? data.totalRiskScore / data.totalWeight : 0;
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      
      if (avgRiskScore > 60 || data.highRiskCount / data.positionCount > 0.5) {
        riskLevel = 'high';
      } else if (avgRiskScore > 35 || data.highRiskCount / data.positionCount > 0.2) {
        riskLevel = 'medium';
      }
      
      return {
        sector: sectorName,
        riskLevel,
        totalWeight: data.totalWeight,
        positionCount: data.positionCount,
        highRiskCount: data.highRiskCount,
        avgRiskScore: Math.round(avgRiskScore),
        recommendations: this.generateSectorRiskRecommendations(sectorName, data, riskLevel)
      };
    });
  }

  // 生成赛道风险建议
  private generateSectorRiskRecommendations(
    sectorName: string, 
    data: { totalWeight: number; highRiskCount: number; positionCount: number }, 
    riskLevel: string
  ): string[] {
    const recommendations: string[] = [];
    
    if (data.totalWeight > 0.4) {
      recommendations.push(`${sectorName}赛道权重过高(${(data.totalWeight * 100).toFixed(1)}%)，建议适当分散到其他赛道`);
    }
    
    if (data.highRiskCount / data.positionCount > 0.5) {
      recommendations.push(`${sectorName}赛道高风险股票较多，建议减仓或调仓到低风险股票`);
    }
    
    if (riskLevel === 'high') {
      recommendations.push(`${sectorName}赛道整体风险较高，建议重新评估投资策略`);
    }
    
    if (recommendations.length === 0) {
      recommendations.push(`${sectorName}赛道风险可控，继续保持现有配置`);
    }
    
    return recommendations;
  }

  // 生成投资组合风险建议
  private generatePortfolioRiskRecommendations(data: {
    weightedRiskScore: number;
    riskDistribution: { low: number; medium: number; high: number };
    sectorRisks: SectorRisk[];
    overallRiskLevel: string;
  }): string[] {
    const recommendations: string[] = [];
    
    if (data.weightedRiskScore > 60) {
      recommendations.push('整体风险评分较高，建议立即进行风险控制');
    } else if (data.weightedRiskScore > 35) {
      recommendations.push('风险评分中等，建议适当调整持仓结构');
    }
    
    if (data.riskDistribution.high > data.riskDistribution.low) {
      recommendations.push('高风险股票数量较多，建议增加低风险股票配置');
    }
    
    const highRiskSectors = data.sectorRisks.filter(s => s.riskLevel === 'high');
    if (highRiskSectors.length > 0) {
      recommendations.push(`高风险赛道较多，建议重新平衡赛道配置`);
    }
    
    if (recommendations.length === 0) {
      recommendations.push('当前风险配置合理，继续保持');
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
      // 检查止损
      if (position.currentPrice <= position.stopLoss) {
        stopLossAlerts.push({
          positionId: position.id,
          stockCode: position.stockCode,
          stockName: position.stockName,
          currentPrice: position.currentPrice,
          stopLossPrice: position.stopLoss,
          lossPercent: ((position.currentPrice - position.avgPrice) / position.avgPrice) * 100,
          triggeredAt: new Date().toISOString(),
          action: '建议立即卖出或调整止损设置'
        });
      }
      
      // 检查止盈
      if (position.currentPrice >= position.takeProfit) {
        takeProfitAlerts.push({
          positionId: position.id,
          stockCode: position.stockCode,
          stockName: position.stockName,
          currentPrice: position.currentPrice,
          takeProfitPrice: position.takeProfit,
          profitPercent: ((position.currentPrice - position.avgPrice) / position.avgPrice) * 100,
          triggeredAt: new Date().toISOString(),
          action: '建议考虑获利了结或调整止盈设置'
        });
    }
    
    return { stopLossAlerts, takeProfitAlerts };
  }

  // 生成风险报告
  generateRiskReport(riskAssessment: RiskAssessment): string {
    let report = `风险评估报告\n`;
    report += `投资组合: ${riskAssessment.portfolioName}\n`;
    report += `评估时间: ${new Date(riskAssessment.lastUpdated).toLocaleString()}\n`;
    report += `整体风险等级: ${riskAssessment.overallRiskLevel}\n`;
    report += `加权风险评分: ${riskAssessment.weightedRiskScore}/100\n\n`;
    
    report += `风险分布:\n`;
    report += `- 低风险: ${riskAssessment.riskDistribution.low}只\n`;
    report += `- 中风险: ${riskAssessment.riskDistribution.medium}只\n`;
    report += `- 高风险: ${riskAssessment.riskDistribution.high}只\n\n`;
    
    report += `赛道风险分析:\n`;
    for (const sectorRisk of riskAssessment.sectorRisks) {
      report += `- ${sectorRisk.sector}: ${sectorRisk.riskLevel} (${sectorRisk.avgRiskScore}/100)\n`;
      report += `  权重: ${(sectorRisk.totalWeight * 100).toFixed(1)}%, 持仓: ${sectorRisk.positionCount}只\n`;
    }
    
    report += `\n主要风险建议:\n`;
    for (const recommendation of riskAssessment.recommendations) {
      report += `- ${recommendation}\n`;
    }
    
    return report;
  }

  // 模拟实时风险监控
  startRiskMonitoring(portfolioId: string, callback: (alerts: any) => void): () => void {
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
            level: 'info'
          }
        ]
      };
      
      callback(mockAlerts);
    }, 5 * 60 * 1000);
    
    // 返回停止监控的函数
    return () => clearInterval(interval);
  }
}

// 导出单例实例
export const riskManagementService = new RiskManagementService();
