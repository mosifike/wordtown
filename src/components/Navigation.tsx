import { Link, useLocation } from 'react-router-dom';
import { Home, RotateCcw, BarChart3, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/home', icon: Home, label: '首页' },
  { path: '/review', icon: RotateCcw, label: '复习' },
  { path: '/stats', icon: BarChart3, label: '数据' },
  { path: '/settings', icon: Settings, label: '设置' },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center w-16 h-full"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 w-12 h-1 bg-indigo-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <item.icon
                size={24}
                className={`transition-colors ${
                  isActive ? 'text-indigo-400' : 'text-slate-400'
                }`}
              />
              <span
                className={`text-xs mt-1 transition-colors ${
                  isActive ? 'text-indigo-400 font-medium' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
