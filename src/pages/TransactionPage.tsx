import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Package, History } from 'lucide-react';

export const TransactionPage = () => {
  const transactions: any[] = [];

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 bg-[#f8f9fa] min-h-screen">
      <div className="text-center py-4">
        <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
        <p className="text-gray-400 text-xs">আপনার সকল লেনদেনের তালিকা</p>
      </div>

      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${tx.color}`}>
                  {tx.type === 'Deposit' ? <ArrowUpRight size={20} /> : tx.type === 'Withdraw' ? <ArrowDownLeft size={20} /> : <Package size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{tx.type}</h3>
                  <p className="text-[10px] text-gray-400">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${tx.color}`}>Tk {tx.amount}</p>
                <p className={`text-[9px] font-bold uppercase ${tx.status === 'Success' ? 'text-[#059669]' : 'text-orange-500'}`}>{tx.status}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
              <History size={32} />
            </div>
            <h3 className="text-gray-800 font-bold mb-1">কোন লেনদেন নেই</h3>
            <p className="text-gray-400 text-xs text-center">আপনি এখনো কোনো লেনদেন করেননি। লেনদেন করলে এখানে তালিকা দেখা যাবে।</p>
          </div>
        )}
      </div>
    </div>
  );
};
