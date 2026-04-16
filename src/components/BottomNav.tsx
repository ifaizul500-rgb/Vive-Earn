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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#059669]/30 px-4 py-1 pb-2 flex justify-around items-center z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setPage(item.id as Page)}
          className={`flex flex-col items-center gap-0 transition-colors ${
            activePage === item.id ? 'text-[#059669]' : 'text-gray-400'
          }`}
        >
          <item.icon size={18} strokeWidth={activePage === item.id ? 2.5 : 2} />
          <span className="text-[9px] font-bold">{item.label}</span>
          {activePage === item.id && (
            <motion.div 
              layoutId="nav-indicator"
              className="w-1 h-1 rounded-full bg-[#059669] mt-0.5"
            />
          )}
        </button>
      ))}
    </div>
  );
};
