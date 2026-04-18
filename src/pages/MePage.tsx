import React, { useState, useEffect } from 'react';
import { Wallet, EyeOff, Eye, ShieldCheck, Bell, ArrowUpRight, ArrowDownLeft, PlayCircle, Package, Users, RefreshCw, ArrowLeftRight, HelpCircle, Headphones, LogOut, User, Lock, Edit2, X, Check, Loader2 } from 'lucide-react';
import { Page } from '../types';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { signOut, updatePassword } from 'firebase/auth';
import { db, auth } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';

export const MePage = ({ setPage }: { setPage: (p: Page) => void, userName: string }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState("0.00");
  const [userData, setUserData] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast(null);
    setTimeout(() => setToast({ message, type }), 10);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!auth.currentUser) return;
    const unsub = onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserData(data);
        setBalance(Number(data.balance || 0).toFixed(2));
        setEditName(data.name || '');
      }
    }, (error) => {
      console.error("User snapshot error:", error);
    });
    return () => unsub();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    if (!editName.trim()) {
      showToast('নাম অবশ্যই দিতে হবে', 'error');
      return;
    }

    setUpdating(true);
    try {
      const updates: any = {
        name: editName.trim(),
      };

      // update password if provided
      if (newPassword.trim()) {
        if (newPassword.length < 6) {
          showToast('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে', 'error');
          setUpdating(false);
          return;
        }
        
        try {
          await updatePassword(currentUser, newPassword.trim());
          updates.password = newPassword.trim(); // Updatefirestore record to visible later
        } catch (authErr: any) {
          if (authErr.code === 'auth/requires-recent-login') {
            showToast('পাসওয়ার্ড পরিবর্তনের জন্য আবার লগইন করুন', 'error');
            setUpdating(false);
            return;
          }
          throw authErr;
        }
      }

      await updateDoc(doc(db, 'users', currentUser.uid), updates);
      setIsEditModalOpen(false);
      setNewPassword('');
      showToast('প্রোফাইল আপডেট করা হয়েছে');
    } catch (error) {
      console.error("Update profile error:", error);
      showToast('আপডেট করতে সমস্যা হয়েছে', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      setPage('home'); // Reset page state
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      showToast('লগ আউট করতে সমস্যা হয়েছে', 'error');
    }
  };

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
    { id: 'logout', label: 'Logout', icon: LogOut, color: 'bg-red-600' },
  ];

  return (
    <div className="flex flex-col gap-3 pb-24 px-4 bg-white min-h-screen relative transition-colors duration-300">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-24 left-0 right-0 mx-auto z-[100] px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm text-white text-center w-max max-w-[90%] ${
              toast.type === 'success' ? 'bg-[#059669]' : 'bg-red-500'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2rem] p-6 shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="absolute top-0 right-0 p-4">
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#059669]/10 text-[#059669] flex items-center justify-center">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Edit Profile</h3>
                  <p className="text-xs text-gray-500 font-medium">আপনার তথ্য আপডেট করুন</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="আপনার নাম দিন"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#059669]/20 focus:bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-gray-800 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <div className="w-full bg-gray-50 rounded-xl py-3.5 pl-11 pr-12 text-sm font-bold text-gray-800 break-all">
                      {showCurrentPassword ? (userData?.password || 'লগইন করে পাসওয়ার্ড সিঙ্ক করুন') : '••••••••'}
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#059669] transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Password (Optional)</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="নতুন পাসওয়ার্ড দিন"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#059669]/20 focus:bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-gray-800 transition-all outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={updating}
                  className="w-full mt-2 py-3.5 rounded-xl bg-[#059669] text-white font-bold text-sm shadow-lg shadow-[#059669]/20 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {updating ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Balance Card */}
      <div className="p-4 rounded-[1.5rem] bg-gradient-to-br from-[#059669] via-[#064e3b] to-[#059669] text-white relative overflow-hidden shadow-2xl shadow-[#059669]/30 mt-3 transition-all">
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
              <p className="text-[10px] font-bold tracking-wide">@{userData?.name || 'User'}</p>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="ml-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Edit2 size={12} />
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-[#D4AF37]" />
              <p className="text-[9px] font-bold uppercase tracking-wider text-white">Verified Account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Colorful Premium Notification Bar */}
      <div className="mx-0.5 p-2 rounded-[1.2rem] bg-white border border-pink-200 flex items-center gap-3 shadow-lg shadow-purple-500/5 relative overflow-hidden group transition-colors">
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
              if (action.id === 'logout') handleLogout();
            }}
            className="p-3 rounded-2xl bg-white shadow-sm border-2 border-[#059669]/25 flex flex-col items-center gap-1.5 hover:scale-[1.02] transition-all"
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
