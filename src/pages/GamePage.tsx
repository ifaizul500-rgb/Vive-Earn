import React from 'react';
import { Play, Clock } from 'lucide-react';

export const GamePage = () => {
  return (
    <div className="flex flex-col gap-3 pb-24 px-4 bg-[#f8f9fa] min-h-screen">
      {/* Daily Task Card */}
      <div className="mt-3 p-5 rounded-[1.5rem] bg-gradient-to-b from-[#1e3a8a] to-[#172554] text-white flex flex-col items-center text-center shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-500/10 blur-[60px] pointer-events-none" />
        
        {/* Play Icon Box */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
          <Play size={24} fill="white" className="text-white ml-0.5" />
        </div>

        <h2 className="text-xl font-bold mb-1 tracking-tight">Daily Task</h2>
        <p className="text-white/80 text-xs font-medium mb-4">Buy a plan to start earning</p>

        <button className="w-full max-w-[160px] py-2.5 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-sm shadow-xl hover:scale-105 transition-transform active:scale-95">
          View Ads
        </button>
      </div>

      {/* Task Rules Section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500">
            <Clock size={16} />
          </div>
          <h3 className="text-base font-bold text-gray-800">Task Rules (নিয়মাবলী)</h3>
        </div>

        <ul className="space-y-2">
          <li className="flex gap-2">
            <div className="w-1 h-1 rounded-full bg-gray-300 mt-1.5 shrink-0" />
            <p className="text-gray-600 text-xs font-bold leading-relaxed">
              You can complete only 1 task per day.
            </p>
          </li>
          <li className="flex gap-2">
            <div className="w-1 h-1 rounded-full bg-gray-300 mt-1.5 shrink-0" />
            <p className="text-gray-600 text-xs font-bold leading-relaxed">
              Reward depends on your active plan.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};
