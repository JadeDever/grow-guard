import React from 'react';
import { LucideIcon } from 'lucide-react';
import Card from './Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-primary-600',
  trend,
  className = '',
}) => {
  return (
    <Card className={`animate-fade-in ${className}`}>
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-gray-600 mb-1'>{title}</p>
          <div className='flex items-baseline space-x-2'>
            <p className='text-2xl font-bold text-gray-900'>{value}</p>
            {trend && (
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
            )}
          </div>
          {subtitle && <p className='text-sm text-gray-500 mt-1'>{subtitle}</p>}
          {trend && <p className='text-xs text-gray-400 mt-1'>{trend.label}</p>}
        </div>

        {Icon && (
          <div
            className={`flex-shrink-0 p-3 rounded-full bg-gray-50 ${iconColor}`}
          >
            <Icon className='h-6 w-6' />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
