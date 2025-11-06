'use client';

import { LayoutDashboard, FileText, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminBottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Menu' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/reports', icon: FileText, label: 'Laporan' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 backdrop-blur-sm bg-white/95 z-50 safe-area-bottom">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-around items-center h-16 md:h-18 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all ${
                  isActive
                    ? 'text-orange-500'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className={`w-5 h-5 md:w-6 md:h-6`} />
                <span className={`text-[11px] md:text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
