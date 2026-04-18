import React from 'react';
import { Home as HomeIcon, ClipboardList, Gamepad2, Share2, User } from 'lucide-react';
import { motion } from 'motion/react';
import { Page } from '../types';

export const BottomNav = ({ activePage, setPage }: { activePage: Page, setPage: (p: Page) => void }) => {
  const navItems = [
    { id: 'home', label: 'হোম', icon: HomeIcon },
    { id: 'products', label: 'পণ্য', icon: ClipboardList },
    { id: 'game', label: 'খেলা', icon: Gamepad2 },
    { id: 'share', label: 'শেয়ার', icon: Share2 },
    { id: 'me', label: 'আমার', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t-[0.5px] border-emerald-50 z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.03)] px-4 font-sans transition-colors duration-300">
      <div className="max-w-[500px] mx-auto py-1 pb-4 flex justify-around items-center relative">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id as Page)}
              className={`relative flex flex-col items-center gap-0.5 transition-all duration-500 z-10 ${
                isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              <div className="relative pt-1">
                <motion.div
                  animate={{ 
                    scale: isActive ? 1.05 : 1,
                    y: isActive ? -1 : 0
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <item.icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
                </motion.div>
                
                {isActive && (
                  <motion.div
                    layoutId="active-glow"
                    className="absolute inset-0 bg-emerald-400/15 blur-lg rounded-full -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>

              <span className={`text-[8px] font-extrabold tracking-[0.08em] transition-all uppercase ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                {item.label}
              </span>

              {isActive && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute -top-1 w-7 h-[1.5px] bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
