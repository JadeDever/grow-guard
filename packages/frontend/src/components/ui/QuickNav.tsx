import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import Card from './Card';

export interface QuickNavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
  badge?: string;
  badgeColor?: 'primary' | 'success' | 'warning' | 'danger';
  variant?: 'default' | 'primary' | 'secondary';
}

interface QuickNavProps {
  title?: string;
  items: QuickNavItem[];
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const QuickNav: React.FC<QuickNavProps> = ({
  title = '快速导航',
  items,
  columns = 4,
  className = '',
}) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  const getVariantClasses = (variant: string = 'default') => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-lg hover:shadow-xl';
      default:
        return 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md';
    }
  };

  const getBadgeClasses = (color: string = 'primary') => {
    switch (color) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'danger':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-primary-100 text-primary-800';
    }
  };

  return (
    <Card className={className}>
      {title && (
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
        </div>
      )}

      <div className={`grid ${gridCols[columns]} gap-4`}>
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.href}
              className={`group flex flex-col items-center p-4 rounded-xl transition-all duration-200 hover:transform hover:-translate-y-1 ${getVariantClasses(
                item.variant
              )}`}
            >
              <div className='relative mb-3'>
                <Icon className='h-8 w-8' />
                {item.badge && (
                  <span
                    className={`absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium rounded-full ${getBadgeClasses(
                      item.badgeColor
                    )}`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <h4 className='text-sm font-medium text-center mb-1 group-hover:text-primary-600 transition-colors'>
                {item.name}
              </h4>

              <p className='text-xs text-center opacity-75 line-clamp-2'>
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickNav;
