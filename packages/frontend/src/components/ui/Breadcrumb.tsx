import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  href?: string;
  icon?: React.ComponentType<any>;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items = [],
  showHome = true,
  className = '',
}) => {
  const location = useLocation();

  // 如果没有提供items，则根据当前路径自动生成
  const autoItems = React.useMemo(() => {
    if (items.length > 0) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems: BreadcrumbItem[] = [];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // 将路径段转换为可读的名称
      const name = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbItems.push({
        name,
        href: index === pathSegments.length - 1 ? undefined : currentPath,
      });
    });

    return breadcrumbItems;
  }, [location.pathname, items]);

  if (autoItems.length === 0 && !showHome) {
    return null;
  }

  return (
    <nav
      className={`flex items-center space-x-1 text-sm text-gray-500 ${className}`}
    >
      {showHome && (
        <>
          <Link
            to='/'
            className='flex items-center hover:text-primary-600 transition-colors'
          >
            <Home className='h-4 w-4' />
          </Link>
          {autoItems.length > 0 && (
            <ChevronRight className='h-4 w-4 text-gray-400' />
          )}
        </>
      )}

      {autoItems.map((item, index) => {
        const isLast = index === autoItems.length - 1;
        const Icon = item.icon;

        return (
          <React.Fragment key={item.name}>
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className='flex items-center hover:text-primary-600 transition-colors'
              >
                {Icon && <Icon className='h-4 w-4 mr-1' />}
                {item.name}
              </Link>
            ) : (
              <span
                className={`flex items-center ${
                  isLast ? 'text-gray-900 font-medium' : ''
                }`}
              >
                {Icon && <Icon className='h-4 w-4 mr-1' />}
                {item.name}
              </span>
            )}

            {!isLast && <ChevronRight className='h-4 w-4 text-gray-400' />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
