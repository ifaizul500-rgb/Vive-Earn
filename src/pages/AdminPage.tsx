import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  Search,
  Bell,
  TrendingUp,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { Page } from '../types';
import { collection, query, where, onSnapshot, doc, updateDoc, increment, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const AdminPage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'deposits' | 'withdrawals' | 'settings'>('dashboard');
  const [pendingDeposits, setPendingDeposits] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  useEffect(() => {
    // Listen for pending deposits
    const q = query(collection(db, 'transactions'), where('status', '==', 'pending'));
    const unsubTx = onSnapshot(q, (snapshot) => {
      setPendingDeposits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Transactions snapshot error:", error);
    });

    // Listen for users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setAllUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Users snapshot error:", error);
    });

    return () => {
      unsubTx();
      unsubUsers();
    };
  }, []);

  const handleApprove = async (tx: any) => {
    if (!confirm(`Are you sure you want to approve Tk ${tx.amount} for ${tx.userName}?`)) return;
    
    setLoadingAction(tx.id);
    try {
      await runTransaction(db, async (transaction) => {
        const txRef = doc(db, 'transactions', tx.id);
        const userRef = doc(db, 'users', tx.uid);

        transaction.update(txRef, { status: 'successful', updatedAt: serverTimestamp() });
        
        if (tx.type === 'deposit') {
          transaction.update(userRef, { balance: increment(tx.amount) });
        } else if (tx.type === 'withdraw') {
          // Withdrawal logic usually deducts during request, but if not, logic goes here.
          // Based on user request, balance is only added on deposit approval.
        }
      });
      alert('Approved successfully!');
    } catch (error) {
      console.error(error);
      alert('Approval failed.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async (txId: string) => {
    if (!confirm('Are you sure you want to reject this?')) return;
    try {
      await updateDoc(doc(db, 'transactions', txId), { status: 'failed', updatedAt: serverTimestamp() });
    } catch (error) {
      console.error(error);
    }
  };

  // Stats Grid data
  const stats = [
    { label: 'Total Users', value: allUsers.length.toString(), icon: UsersIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Dept', value: pendingDeposits.filter(d => d.type === 'deposit').length.toString(), icon: ArrowUpCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Withdraw', value: '৳0', icon: ArrowDownCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Active Plans', value: '---', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f9] pb-20 transition-colors duration-300">
      {/* Admin Header */}
      <div className="bg-slate-900 border-b border-slate-800 text-white p-6 rounded-b-[2rem] shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold">Admin Dashboard</h1>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Vive Earn Control Center</p>
            </div>
          </div>
          <button className="relative p-2 bg-slate-800 rounded-full">
            <Bell size={20} className="text-slate-300" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
          </button>
        </div>

        {/* Admin Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'users', label: 'Users', icon: UsersIcon },
            { id: 'deposits', label: 'Deposits', icon: ArrowUpCircle },
            { id: 'withdrawals', label: 'Withdraw', icon: ArrowDownCircle },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 transition-colors">
                  <div className={`w-8 h-8 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                    <stat.icon size={18} />
                  </div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-lg font-black text-slate-800">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Pending Requests Section */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Pending Deposits</h3>
                <span className="px-2 py-1 bg-amber-100 text-amber-600 text-[10px] font-bold rounded-md">2 New</span>
              </div>
              
              <div className="space-y-3">
                {pendingDeposits.map((dep) => (
                   <div key={dep.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-black text-slate-800">{dep.userName}</p>
                        <p className="text-[10px] text-slate-400">
                          {dep.createdAt?.toDate ? dep.createdAt.toDate().toLocaleString() : 'Recent'}
                        </p>
                      </div>
                      <p className="text-sm font-black text-emerald-600">৳{dep.amount}</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded font-bold">{dep.method}</span>
                      <code className="text-slate-500">{dep.trxId}</code>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button 
                        onClick={() => handleApprove(dep)}
                        disabled={loadingAction === dep.id}
                        className="flex-1 bg-emerald-500 text-white py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        {loadingAction === dep.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />} 
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(dep.id)}
                        disabled={loadingAction === dep.id}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
                {pendingDeposits.length === 0 && (
                  <p className="text-center text-slate-400 text-xs py-4">No pending requests</p>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 min-h-[400px] transition-colors">
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
              <Search size={16} className="text-slate-400" />
              <input type="text" placeholder="Search users..." className="bg-transparent border-none focus:ring-0 text-xs w-full font-medium" />
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((u) => (
                <div key={u} className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                      U{u}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">User_Name_{u}</p>
                      <p className="text-[10px] text-slate-400">Balance: ৳540</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">Manage</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-6 transition-colors">
            <h3 className="font-bold text-slate-800">App Configuration</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notice Board Text</label>
                <textarea 
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  rows={3}
                  defaultValue="Welcome to Vive Earn! New investment plans are now active."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Min Deposit</label>
                  <input type="number" defaultValue="500" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Min Withdraw</label>
                  <input type="number" defaultValue="500" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold" />
                </div>
              </div>

              <button className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-lg mt-4 text-sm">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
