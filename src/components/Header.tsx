import React, { useState } from 'react';
import { MoreVertical, Info, ShieldCheck, Headphones, LogOut, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Page } from '../types';

export const Header = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = [
    { id: 'about', label: 'আমাদের সম্পর্কে', icon: Info },
    { id: 'privacy', label: 'প্রাইভেসি পলিসি', icon: ShieldCheck },
    { id: 'support', label: 'সাপোর্ট সেন্টার', icon: Headphones },
    { id: 'logout', label: 'লগ আউট', icon: LogOut, color: 'text-red-500', action: () => window.location.reload() },
  ];

  return (
    <header className="flex justify-between items-center px-5 py-3 bg-white sticky top-0 z-50 border-b border-[#059669]/20">
      <div className="flex items-center gap-2" onClick={() => setPage('home')}>
        <div className="bg-[#059669] p-1 rounded-lg text-white">
          <TrendingUp size={18} />
        </div>
        <h1 className="text-xl font-bold text-[#059669]">Vive Earn</h1>
      </div>
      
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
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50"
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
    </header>
  );
};
