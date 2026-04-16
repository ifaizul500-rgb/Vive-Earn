import React, { useState } from 'react';
import { ArrowDownLeft } from 'lucide-react';
import { Page } from '../types';

export const WithdrawPage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad' | null>(null);

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 bg-[#f8f9fa] min-h-screen">
      <div className="flex items-center gap-3 py-3">
        <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-200">
          <ArrowDownLeft size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">টাকা উত্তোলন (Withdraw)</h2>
      </div>

      {/* Method Selection at Top */}
      <div className="grid grid-cols-2 gap-4 mb-2 max-w-[340px] mx-auto">
        {[
          { 
            id: 'bKash', 
            name: 'bKash', 
            color: 'border-[#e2136e]', 
            img: 'https://raw.githubusercontent.com/S-M-A-K-A-S-H/bKash-Nagad-Rocket-Logo/main/bkash.png',
            bg: 'bg-[#e2136e]/5'
          },
          { 
            id: 'Nagad', 
            name: 'Nagad', 
            color: 'border-[#f7941d]', 
            img: 'https://raw.githubusercontent.com/S-M-A-K-A-S-H/bKash-Nagad-Rocket-Logo/main/nagad.png',
            bg: 'bg-[#f7941d]/5'
          },
        ].map((method) => (
          <button 
            key={method.id} 
            onClick={() => setSelectedMethod(method.id as any)}
            className={`p-4 rounded-2xl bg-white border-2 transition-all flex flex-col items-center gap-2 shadow-sm ${
              selectedMethod === method.id ? `${method.color} scale-[1.05] shadow-md` : 'border-transparent'
            }`}
          >
            <div className={`w-24 h-16 rounded-xl ${method.bg} flex items-center justify-center p-2 overflow-hidden`}>
              <img 
                src={method.img} 
                alt={method.name} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `<span class="text-xs font-black ${method.id === 'bKash' ? 'text-[#e2136e]' : 'text-[#f7941d]'}">${method.name}</span>`;
                }}
              />
            </div>
            <span className={`text-[11px] font-bold ${selectedMethod === method.id ? 'text-gray-900' : 'text-gray-500'}`}>
              {method.name}
            </span>
          </button>
        ))}
      </div>

      {selectedMethod ? (
        <div className="p-6 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${selectedMethod === 'bKash' ? 'bg-[#e2136e]' : 'bg-[#f7941d]'}`} />
            {selectedMethod} উত্তোলন ফর্ম:
          </h3>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase tracking-wider">উত্তোলনের পরিমাণ</label>
            <input 
              type="number" 
              placeholder="পরিমাণ লিখুন (সর্বনিম্ন ৫০০)" 
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#059669] transition-all text-sm font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase tracking-wider">একাউন্ট নম্বর ({selectedMethod})</label>
            <input 
              type="text" 
              placeholder={`আপনার ${selectedMethod} নম্বর লিখুন`} 
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#059669] transition-all text-sm font-bold"
            />
          </div>

          <button className="w-full bg-[#059669] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-[#059669]/20 mt-2 text-base active:scale-[0.98] transition-all">
            উত্তোলন করুন
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-6 bg-white rounded-[2rem] border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
            <ArrowDownLeft size={32} />
          </div>
          <h3 className="text-gray-800 font-bold mb-1">পেমেন্ট মেথড সিলেক্ট করুন</h3>
          <p className="text-gray-400 text-[10px] text-center">টাকা উত্তোলন করতে উপরে বিকাশ অথবা নগদ সিলেক্ট করুন</p>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
        <p className="text-orange-600 text-[10px] font-medium leading-relaxed">
          দ্রষ্টব্য: উত্তোলন অনুমোদনে ২৪-৪৮ ঘণ্টা সময় লাগতে পারে। সঠিক তথ্য প্রদান নিশ্চিত করুন।
        </p>
      </div>
    </div>
  );
};
