import React, { useState } from 'react';
import { Gift, CheckCircle2, Copy, Share2 } from 'lucide-react';

export const SharePage = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = "OLOEH";
  const referralLink = "https://ais-dev-hqgzmpmvaicldbqfil4a6y-6292...";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 pb-24 px-4 bg-[#f8f9fa] min-h-screen">
      {/* Top Green Card */}
      <div className="p-6 rounded-[1.5rem] bg-[#059669] text-white text-center relative overflow-hidden shadow-lg shadow-[#059669]/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/20">
            <Gift size={24} className="text-[#ff9ff3]" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-lg font-bold mb-2 tracking-tight">রেফার করে আয় করুন</h2>
          
          <p className="text-white/90 text-[10px] leading-relaxed max-w-[85%] mx-auto font-medium">
            আপনার বন্ধুদের আমন্ত্রণ জানান এবং তাদের প্ল্যান ক্রয়ের ওপর <span className="border-b border-white/50 pb-0.5">১০% কমিশন</span> পান!
          </p>
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="bg-white rounded-[1.25rem] p-4 shadow-sm border border-gray-50 -mt-6 mx-2 relative z-20">
        <div className="bg-[#f1f2f6] rounded-xl p-4 border border-gray-100 flex flex-col items-center gap-2">
          <p className="text-[9px] font-bold text-[#059669] uppercase tracking-[0.2em]">আপনার রেফার কোড</p>
          <p className="text-2xl font-bold text-[#2f3542] tracking-[0.3em]">{referralCode}</p>
        </div>

        <div className="mt-6 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 ml-1 uppercase">রেফারেল লিংক</p>
          <div className="flex gap-2">
            <div className="flex-1 p-3 rounded-lg bg-[#f1f2f6] border border-gray-100 text-gray-500 text-[10px] truncate font-medium flex items-center">
              {referralLink}
            </div>
            <button 
              onClick={copyLink} 
              className="w-10 h-10 rounded-lg bg-[#2f3542] text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform shrink-0"
            >
              {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        <button className="w-full bg-[#059669] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#059669]/20 mt-6 active:scale-[0.98] transition-all text-sm">
          <Share2 size={18} /> বন্ধুদের সাথে শেয়ার করুন
        </button>

        {/* Referral Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
            <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">মোট রেফার</p>
            <p className="text-lg font-bold text-[#2f3542]">০</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
            <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">রেফার ইনকাম</p>
            <p className="text-lg font-bold text-[#059669]">৳০.০০</p>
          </div>
        </div>
      </div>
    </div>
  );
};
