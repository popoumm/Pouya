import React from 'react';
import { GlassButton } from '../components/GlassUI';
import { motion } from 'motion/react';
import { useLocation } from 'wouter';
import { Shield, Zap, Globe, ArrowLeft } from 'lucide-react';
import { useTheme } from '../_core/ThemeContext';
import TradingModule from '../components/TradingModule';

export default function Landing() {
  const [, setLocation] = useLocation();
  const { siteName, heroTitle, heroSubtitle, heroDescription } = useTheme();

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FFD700]/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#7C3AED]/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold gold-text">{siteName}</h1>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#" className="hover:text-[#FFD700] transition-colors">بازارها</a>
          <a href="#" className="hover:text-[#FFD700] transition-colors">درباره ما</a>
          <a href="#" className="hover:text-[#FFD700] transition-colors">تماس</a>
        </div>
        <GlassButton variant="outline" className="text-sm" onClick={() => setLocation('/auth')}>
          ورود / ثبت‌نام
        </GlassButton>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-20 pb-20 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#FFD700] mb-6 tracking-widest uppercase">
            State-of-the-art Fintech
          </span>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            {heroTitle} <br />
            <span className="gold-text">{heroSubtitle}</span>
          </h2>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
            {heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <GlassButton className="px-10 py-4 text-lg" onClick={() => setLocation('/auth')}>
              شروع سرمایه‌گذاری
            </GlassButton>
            <GlassButton variant="secondary" className="px-10 py-4 text-lg flex items-center gap-2">
              مشاهده قیمت‌ها <ArrowLeft size={20} />
            </GlassButton>
          </div>
        </motion.div>
      </section>

      {/* Public Trading Activity */}
      <section className="relative z-10 px-6 max-w-7xl mx-auto pb-32">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">فعالیت لحظه‌ای بازار</h3>
          <p className="text-white/40">شفافیت کامل در معاملات و عمق بازار</p>
        </div>
        <TradingModule isPublic={true} />
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-32">
        <FeatureCard 
          icon={<Shield className="text-[#FFD700]" size={32} />}
          title="امنیت تضمین شده"
          desc="استفاده از کیف پول‌های سرد و پروتکل‌های امنیتی چندلایه برای محافظت از دارایی شما."
        />
        <FeatureCard 
          icon={<Zap className="text-[#00FFA3]" size={32} />}
          title="تبادل آنی"
          desc="خرید و فروش طلا و تتر در کمتر از چند ثانیه با بهترین نرخ بازار."
        />
        <FeatureCard 
          icon={<Globe className="text-[#7C3AED]" size={32} />}
          title="دسترسی جهانی"
          desc="مدیریت سبد دارایی‌های خود در هر زمان و هر مکان با اپلیکیشن پیشرفته."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
