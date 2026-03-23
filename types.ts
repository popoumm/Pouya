import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { GlassCard, GlassButton, GlassInput } from '../components/GlassUI';
import Sidebar from '../components/Sidebar';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  CreditCard, 
  ChevronRight,
  Camera,
  CheckCircle2,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  Plus,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion'; // ✅ اینو درست کردم

import { useTheme } from '../_core/ThemeContext';
import { UserRole } from '../types';

// ✅ انیمیشن‌ها
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Settings() {
  const [location] = useLocation();
  const queryParams = new URLSearchParams(window.location.search);
  const initialSection = queryParams.get('section') || 'profile';
  
  const [activeSection, setActiveSection] = useState(initialSection);
  const [showPassword, setShowPassword] = useState(false);

  const { userRole, setUserRole } = useTheme(); // ✅ ساده‌ترش کردم

  const sections = [
    { id: 'profile', label: 'پروفایل کاربری', icon: <User size={20} /> },
    { id: 'appearance', label: 'ظاهر وبسایت', icon: <SettingsIcon size={20} /> },
    { id: 'identity', label: 'هویت برند', icon: <Globe size={20} /> },
    { id: 'security', label: 'امنیت', icon: <Shield size={20} /> },
    { id: 'demo', label: 'نقش‌ها', icon: <TrendingUp size={20} /> },
  ];

  return (
    <div className="min-h-screen flex p-4 lg:p-8 gap-8">
      <Sidebar />

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 max-w-7xl mx-auto"
      >
        <motion.header variants={itemVariants} className="mb-12 text-right">
          <h1 className="text-3xl font-bold mb-2">تنظیمات</h1>
          <p className="text-white/50 text-lg">مدیریت حساب</p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-4 space-y-2">
              {sections.map((section) => (
                <button 
                  key={section.id} 
                  onClick={() => setActiveSection(section.id)}
                  className="w-full flex justify-between p-3 text-sm"
                >
                  {section.label}
                </button>
              ))}
            </GlassCard>
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <GlassCard className="p-10">

              {activeSection === 'demo' && (
                <div className="space-y-8">
                  <h2 className="text-xl font-bold">نقش کاربری</h2>

                  <div className="grid grid-cols-3 gap-4">

                    <GlassCard onClick={() => setUserRole(UserRole.SUPER_ADMIN)}>
                      SUPER ADMIN
                    </GlassCard>

                    <GlassCard onClick={() => setUserRole(UserRole.ADMIN)}>
                      ADMIN
                    </GlassCard>

                    <GlassCard onClick={() => setUserRole(UserRole.TRADER)}>
                      TRADER
                    </GlassCard>

                  </div>
                </div>
              )}

            </GlassCard>
          </motion.div>

        </div>
      </motion.main>
    </div>
  );
}
