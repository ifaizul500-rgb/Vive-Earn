import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Package, History, Loader2 } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';

export const TransactionPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'transactions'), 
      where('uid', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Transactions list error:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const filteredTransactions = transactions.filter(tx => tx.type === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful': return 'text-emerald-500';
      case 'pending': return 'text-amber-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'successful': return 'Success';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      default: return status;
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 bg-white min-h-screen transition-colors duration-300">
      <div className="text-center py-4">
        <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
        <p className="text-gray-400 text-xs">আপনার সকল লেনদেনের তালিকা</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 transition-colors">
        <button 
          onClick={() => setActiveTab('deposit')}
          className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'deposit' ? 'bg-[#059669] text-white shadow-lg shadow-[#059669]/20' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <ArrowUpRight size={16} />
          Deposit
        </button>
        <button 
          onClick={() => setActiveTab('withdraw')}
          className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'withdraw' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <ArrowDownLeft size={16} />
          Withdraw
        </button>
      </div>

      <div className="space-y-3">
        {!loading && filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-inner ${tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {tx.type === 'deposit' ? <ArrowUpRight size={22} /> : <ArrowDownLeft size={22} />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    {tx.type === 'deposit' ? 'Deposit Amount' : 'Withdraw Amount'}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${getStatusColor(tx.status).replace('text-', 'bg-')}`} />
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${getStatusColor(tx.status)}`}>
                      {getStatusLabel(tx.status)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-sm ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {tx.type === 'deposit' ? '+' : '-'} ৳{tx.amount}
                </p>
                <div className="mt-1 px-2 py-0.5 rounded-lg bg-gray-50 inline-block border border-gray-100">
                  <p className="text-[8px] font-bold text-gray-400">ID: {tx.id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
            </div>
          ))
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#059669] mb-2" size={32} />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading Records...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm transition-colors">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-gray-100 ${activeTab === 'deposit' ? 'bg-emerald-50 text-emerald-200' : 'bg-red-50 text-red-200'}`}>
              <History size={32} />
            </div>
            <h3 className="text-gray-800 font-bold mb-1">কোন ডাটা পাওয়া যায়নি</h3>
            <p className="text-gray-400 text-[10px] font-medium text-center max-w-[200px] leading-relaxed">
              আপনার কাছে বর্তমানে কোনো {activeTab === 'deposit' ? 'ডিপোজিট' : 'উত্তোলন'} রেকর্ড নেই।
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
