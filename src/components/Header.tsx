import React, { useState } from 'react';
import { MoreVertical, Info, ShieldCheck, Headphones, LogOut, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Page } from '../types';

interface HeaderProps {
  setPage: (p: Page) => void;
}

export const Header = ({ setPage }: HeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = [
    { id: 'about', label: 'আমাদের সম্পর্কে', icon: Info },
    { id: 'privacy', label: 'প্রাইভেসি পলিসি', icon: ShieldCheck },
    { id: 'support', label: 'সাপোর্ট সেন্টার', icon: Headphones },
    { id: 'logout', label: 'লগ আউট', icon: LogOut, color: 'text-red-500', action: () => window.location.reload() },
  ];

  return (
    <header className="flex justify-between items-center px-5 py-3 bg-white sticky top-0 z-50 border-b border-[#059669]/20 transition-colors duration-300">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('home')}>
        <div className="bg-[#059669] w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#059669]/20">
          <TrendingUp size={18} strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#059669]">Vive Earn</h1>
      </div>
      
      <div className="flex items-center gap-1">
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical size={20} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMenu(false)}
                  className="fixed inset-0 z-40"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                >
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setShowMenu(false);
                        if (item.action) item.action();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${item.color || 'text-gray-700'}`}
                    >
                      <item.icon size={18} />
                      <span className="text-sm font-bold">{item.label}</span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
