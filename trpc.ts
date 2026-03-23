import React from 'react';
import { useLocation, Link } from 'wouter';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  TrendingUp, 
  Settings, 
  LogOut,
  ShieldCheck,
  RefreshCcw,
  ShoppingBag,
  Wallet,
  Palette,
  Zap,
  Newspaper,
  LineChart,
  Gift
} from 'lucide-react';
import { cn } from './GlassUI';
import { useTheme } from '../_core/ThemeContext';
import { UserRole } from '../types';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

function SidebarItem({ icon, label, href, active }: SidebarItemProps) {
  return (
    <Link href={href}>
      <div className={cn(
        "flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer transition-all group",
        active 
          ? "bg-[#FFD700] text-black font-bold shadow-lg shadow-[#FFD700]/20" 
          : "text-white/40 hover:bg-white/5 hover:text-white"
      )}>
        <div className={cn(
          "transition-transform group-hover:scale-110",
          active ? "text-black" : "text-white/40 group-hover:text-[#FFD700]"
        )}>
          {icon}
        </div>
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  );
}

export default function Sidebar() {
  const [location] = useLocation();
  const { siteName, userRole } = useTheme();

  return (
    <aside className="w-72 h-[calc(100vh-2rem)] glass-panel p-6 flex flex-col sticky top-4">
      <div className="mb-12 px-4">
        <h1 className="text-2xl font-bold gold-text tracking-tight">{siteName}</h1>
        <p className="text-[10px] text-white/30 font-medium tracking-widest mt-1 uppercase">Exchange Platform</p>
      </div>

      <nav className="flex-1 space-y-3 overflow-y-auto no-scrollbar pr-2">
        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest px-4 mb-4">اصلی</div>
        <SidebarItem 
          icon={<LayoutDashboard size={20} />} 
          label="داشبورد کاربر" 
          href="/dashboard" 
          active={location === '/dashboard'} 
        />
        <SidebarItem 
          icon={<Wallet size={20} />} 
          label="کیف پول من" 
          href="/wallet" 
          active={location === '/wallet'} 
        />
        <SidebarItem 
          icon={<RefreshCcw size={20} />} 
          label="تبادل آنی" 
          href="/exchange" 
          active={location === '/exchange'} 
        />
        <SidebarItem 
          icon={<ShoppingBag size={20} />} 
          label="لیست محصولات" 
          href="/shop" 
          active={location === '/shop'} 
        />
        <SidebarItem 
          icon={<Zap size={20} />} 
          label="ترمینال معاملاتی" 
          href="/trade" 
          active={location === '/trade'} 
        />
        <SidebarItem 
          icon={<LineChart size={20} />} 
          label="قیمت لحظه‌ای" 
          href="/prices" 
          active={location === '/prices'} 
        />
        <SidebarItem 
          icon={<Newspaper size={20} />} 
          label="اخبار و تحلیل" 
          href="/news" 
          active={location === '/news'} 
        />
        <SidebarItem 
          icon={<Gift size={20} />} 
          label="کسب درآمد (رفرال)" 
          href="/referral" 
          active={location === '/referral'} 
        />
        <SidebarItem 
          icon={<Palette size={20} />} 
          label="ظاهر وبسایت" 
          href="/settings?section=appearance" 
          active={location === '/settings?section=appearance'} 
        />

        {(userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN) && (
          <>
            <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest px-4 mt-8 mb-4">مدیریت</div>
            <SidebarItem 
              icon={<ShieldCheck size={20} />} 
              label={userRole === UserRole.SUPER_ADMIN ? "مدیریت کل" : "پنل مدیریت"} 
              href="/admin" 
              active={location === '/admin'} 
            />
          </>
        )}
      </nav>

      <div className="mt-auto space-y-3">
        <SidebarItem 
          icon={<Settings size={20} />} 
          label="تنظیمات" 
          href="/settings" 
          active={location === '/settings'} 
        />
        <Link href="/auth">
          <div className="flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer text-[#FF4D4D] hover:bg-[#FF4D4D]/10 transition-all group">
            <LogOut size={20} className="group-hover:translate-x-[-4px] transition-transform" />
            <span className="text-sm font-bold">خروج از حساب</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
