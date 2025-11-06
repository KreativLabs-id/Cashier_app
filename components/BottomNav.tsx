'use client';

import { Home, ShoppingCart, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', icon: Home, label: 'POS' },
    { href: '/cart', icon: ShoppingCart, label: 'Cart' },
    { href: '/reports', icon: FileText, label: 'Laporan' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50 safe-area-bottom">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-around items-center h-16 md:h-20 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all transform ${
                  isActive
                    ? 'text-orange-500 scale-110'
                    : 'text-gray-500 hover:text-orange-400 active:scale-95'
                }`}
              >
                <Icon className={`w-6 h-6 md:w-7 md:h-7 ${isActive ? 'drop-shadow-lg' : ''}`} />
                <span className={`text-xs md:text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-t-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
