import React, { useState } from 'react';
import { Wallet, EyeOff, Eye, ShieldCheck, Bell, ArrowUpRight, ArrowDownLeft, PlayCircle, Package, Users, RefreshCw, ArrowLeftRight, HelpCircle, Headphones } from 'lucide-react';
import { Page } from '../types';

export const MePage = ({ setPage, userName }: { setPage: (p: Page) => void, userName: string }) => {
  const [showBalance, setShowBalance] = useState(true);
  const balance = "0.00";

  const actions = [
    { id: 'deposit', label: 'Deposit', icon: ArrowUpRight, color: 'bg-[#059669]' },
    { id: 'withdraw', label: 'Withdraw', icon: ArrowDownLeft, color: 'bg-red-500' },
    { id: 'ads', label: 'View Ads', icon: PlayCircle, color: 'bg-blue-500' },
    { id: 'packages', label: 'Packages', icon: Package, color: 'bg-purple-500' },
    { id: 'referral', label: 'Referral', icon: Users, color: 'bg-pink-500' },
    { id: 'history', label: 'History', icon: Wallet, color: 'bg-yellow-500' },
    { id: 'support', label: 'Support', icon: Headphones, color: 'bg-indigo-500' },
    { id: 'update', label: 'Update', icon: RefreshCw, color: 'bg-[#059669]' },
    { id: 'transaction', label: 'Transaction', icon: ArrowLeftRight, color: 'bg-blue-600' },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, color: 'bg-cyan-500' },
  ];

  return (
    <div className="flex flex-col gap-3 pb-24 px-4 bg-[#f8f9fa] min-h-screen">
      {/* Premium Balance Card */}
      <div className="p-4 rounded-[1.5rem] bg-gradient-to-br from-[#059669] via-[#064e3b] to-[#059669] text-white relative overflow-hidden shadow-2xl shadow-[#059669]/30 mt-3">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/5 rounded-full -ml-8 -mb-8 blur-xl" />
        <Wallet size={60} className="absolute -right-1 -bottom-1 text-white/5 rotate-12 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[9px] font-bold tracking-[0.2em] text-white/80 uppercase mb-0.5">Total Balance</p>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  <span className="text-lg mr-1">৳</span>
                  {showBalance ? balance : "****"}
                </h2>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
              <p className="text-[10px] font-bold tracking-wide">@{userName}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-[#D4AF37]" />
              <p className="text-[9px] font-bold uppercase tracking-wider text-white">Verified Account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Colorful Premium Notification Bar */}
      <div className="mx-0.5 p-2 rounded-[1.2rem] bg-white border border-pink-200 flex items-center gap-3 shadow-lg shadow-purple-500/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500" />
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-purple-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
          <Bell size={16} className="relative z-10" />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[7px] font-black text-purple-600 uppercase tracking-widest">Official Notice</span>
              <div className="h-[1px] w-8 bg-gradient-to-r from-purple-500/20 to-transparent" />
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-bold text-gray-800 whitespace-nowrap animate-marquee">
              Welcome to Vive Earn! 💎 Start your journey today and earn daily rewards. 📢 Join our official telegram group for the latest updates and support.
            </p>
          </div>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((action) => (
          <button 
            key={action.id}
            onClick={() => {
              if (action.id === 'deposit') setPage('deposit');
              if (action.id === 'withdraw') setPage('withdraw');
              if (action.id === 'referral') setPage('share');
              if (action.id === 'packages') setPage('products');
              if (action.id === 'support') setPage('support');
              if (action.id === 'update') setPage('update');
              if (action.id === 'transaction') setPage('transaction');
              if (action.id === 'history') setPage('transaction');
              if (action.id === 'faq') setPage('faq');
              if (action.id === 'ads') setPage('game');
            }}
            className="p-3 rounded-2xl bg-white shadow-sm border-2 border-[#059669]/25 flex flex-col items-center gap-1.5 hover:scale-[1.02] transition-transform"
          >
            <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center text-white shadow-lg shadow-gray-100`}>
              <action.icon size={20} />
            </div>
            <span className="font-bold text-xs text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
