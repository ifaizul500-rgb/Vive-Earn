import React from 'react';
import { Users } from 'lucide-react';

export const UpdatePage = () => {
  return (
    <div className="flex flex-col gap-4 pb-24 px-4 bg-[#f8f9fa] min-h-screen">
      <div className="text-center py-4">
        <h2 className="text-xl font-bold text-gray-800">Latest Updates</h2>
        <p className="text-gray-400 text-xs">অ্যাপের নতুন খবরগুলো জানুন</p>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[#059669] text-white text-[8px] font-bold px-3 py-1 rounded-bl-xl">NEW</div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#059669]/10 flex items-center justify-center text-[#059669]">
            <Users size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">রেফারেল কমিশন আপডেট</h3>
            <p className="text-[10px] text-gray-400">১০ এপ্রিল, ২০২৬</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed font-medium">
          আমাদের সকল ব্যবহারকারীদের জন্য একটি খুশির খবর! এখন থেকে প্রতিটি সফল রেফারেলের জন্য আপনি পাবেন <span className="text-[#059669] font-bold">১০% রেফারেল কমিশন</span>। আপনার বন্ধুদের আমন্ত্রণ জানান এবং আরও বেশি আয় করুন।
        </p>
      </div>
    </div>
  );
};
