import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users as UsersIcon, ArrowUpCircle, ArrowDownCircle, Settings, Save, LogOut, ChevronRight, Trash2, DollarSign, Gift, ShieldAlert } from 'lucide-react';
import { collection, query, onSnapshot, doc, updateDoc, increment, runTransaction, serverTimestamp, setDoc, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingDeposits, setPendingDeposits] = useState<any[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [appConfig, setAppConfig] = useState<any>({
    bkashNumber: '',
    nagadNumber: '',
    minDeposit: 500,
    minWithdraw: 500,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editBalanceValue, setEditBalanceValue] = useState<number>(0);
  const [referralBonusValue, setReferralBonusValue] = useState<number>(0);

  useEffect(() => {
    const unsubTx = onSnapshot(query(collection(db, 'transactions'), orderBy('createdAt', 'desc')), (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      setPendingDeposits(txs.filter(t => t.type === 'deposit' && t.status === 'pending'));
      setPendingWithdrawals(txs.filter(t => t.type === 'withdraw' && t.status === 'pending'));
    });

    const unsubUsers = onSnapshot(query(collection(db, 'users'), orderBy('createdAt', 'desc')), (snapshot) => {
      setAllUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    onSnapshot(doc(db, 'settings', 'config'), (docSnap) => {
      if (docSnap.exists()) setAppConfig(docSnap.data());
    });
    return () => { unsubTx(); unsubUsers(); };
  }, []);

  const handleUpdateConfig = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'config'), appConfig, { merge: true });
      alert('সফলভাবে সেভ হয়েছে!');
    } catch (e) { alert('সেভ করতে সমস্যা হয়েছে'); }
    finally { setIsSaving(false); }
  };

  const handleUpdateBalance = async (userId: string, val: number) => {
    try {
      await updateDoc(doc(db, 'users', userId), { balance: val });
      alert('ব্যালেন্স আপডেট হয়েছে');
    } catch (e) { alert('ব্যর্থ হয়েছে'); }
  };

  const filteredUsers = allUsers.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.phone?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-slate-900 text-white p-5 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center"><LayoutDashboard size={18} /></div>
            <h1 className="font-black text-sm tracking-widest uppercase">Admin Central</h1>
        </div>
        <button onClick={() => window.location.reload()} className="p-2 bg-slate-800 rounded-lg"><LogOut size={18} /></button>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full p-4 flex flex-col md:flex-row gap-6">
        <nav className="w-full md:w-64 flex md:flex-col gap-2 overflow-x-auto no-scrollbar">
           {['dashboard', 'users', 'deposits', 'withdrawals', 'settings'].map(t => (
             <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-tight flex items-center gap-2 whitespace-nowrap ${activeTab === t ? 'bg-slate-900 text-white' : 'bg-white text-slate-500'}`}>
               {t === 'dashboard' && <LayoutDashboard size={16} />}
               {t === 'users' && <UsersIcon size={16} />}
               {t === 'deposits' && <ArrowUpCircle size={16} />}
               {t === 'withdrawals' && <ArrowDownCircle size={16} />}
               {t === 'settings' && <Settings size={16} />}
               {t}
             </button>
           ))}
        </nav>

        <main className="flex-1">
           {activeTab === 'settings' && (
             <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                <div><h3 className="font-black text-lg">Global Config</h3><p className="text-xs text-slate-400">বিকাশ/নগদ নম্বর এখানে আপডেট করুন</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Bkash (Personal)</label>
                      <input type="text" className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={appConfig.bkashNumber} onChange={e => setAppConfig({...appConfig, bkashNumber: e.target.value})} />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nagad (Personal)</label>
                      <input type="text" className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={appConfig.nagadNumber} onChange={e => setAppConfig({...appConfig, nagadNumber: e.target.value})} />
                   </div>
                </div>
                <button onClick={handleUpdateConfig} disabled={isSaving} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2">
                   {isSaving ? 'Saving...' : <><Save size={18} /> Save Config</>}
                </button>
             </div>
           )}

           {activeTab === 'users' && !selectedUser && (
             <div className="space-y-4">
                <input type="text" placeholder="Search users..." className="w-full p-4 bg-white rounded-2xl border font-bold" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <div className="bg-white rounded-[2rem] border overflow-hidden">
                   {filteredUsers.map(u => (
                     <div key={u.id} onClick={() => setSelectedUser(u)} className="p-4 flex justify-between items-center border-b hover:bg-slate-50 pointer">
                        <div><p className="font-black text-sm">{u.name}</p><p className="text-xs text-slate-400">{u.phone}</p></div>
                        <p className="font-black text-emerald-600">৳{u.balance || 0}</p>
                     </div>
                   ))}
                </div>
             </div>
           )}
           {/* বাকি ট্যাবগুলোর UI আপনি আগের ডিজাইন থেকে কপি করে নিতে পারেন */}
        </main>
      </div>
    </div>
  );
};
