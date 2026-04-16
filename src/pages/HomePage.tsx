import React from 'react';
import { TrendingUp, ArrowUpRight, Gift, CheckCircle2, Leaf, Shield, Zap, Award, Clock, Headphones, MessageCircle, Lock } from 'lucide-react';
import { Page } from '../types';

export const HomePage = ({ setPage, userName }: { setPage: (p: Page) => void, userName: string }) => {
  return (
    <div className="flex flex-col gap-3 pb-24">
      {/* Welcome Banner */}
      <div className="mx-4 p-3.5 rounded-[1.5rem] bg-gradient-to-br from-[#059669] to-[#064e3b] text-white relative overflow-hidden shadow-lg shadow-[#059669]/20">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[8px] font-bold uppercase tracking-wider mb-2 border border-white/20">
            <div className="w-1.5 h-1.5 rounded-full border border-white/40 flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-white animate-pulse" />
            </div>
            Official Platform
          </div>
          <h2 className="text-lg font-bold mb-1">স্বাগতম, {userName}!</h2>
          <p className="text-white/90 text-[10px] leading-relaxed mb-3 max-w-[85%]">
            Vive Earn এ আপনার আয়ের যাত্রা শুরু করুন। বিশ্বের অন্যতম বিশ্বস্ত প্ল্যাটফর্ম। আমাদের সাথে বিশ্বাসের সাথে কাজ করার জন্য ধন্যবাদ।
          </p>
          <button 
            onClick={() => setPage('products')}
            className="bg-white text-[#059669] px-3.5 py-1.5 rounded-lg font-bold text-[10px] flex items-center gap-1.5 shadow-xl shadow-black/5 hover:scale-105 transition-transform"
          >
            প্ল্যান দেখুন <ArrowUpRight size={12} />
          </button>
        </div>
        <TrendingUp size={50} className="absolute -right-1 -bottom-1 text-white/10 rotate-12" />
      </div>

      {/* Bonus Section */}
      <div className="mx-4 p-4 rounded-[2rem] bg-gradient-to-b from-[#fff5f8] to-[#fdf2ff] border-2 border-pink-100/50 shadow-xl shadow-pink-100/20 relative animate-border-color">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff3d71] to-[#d633ff] flex items-center justify-center text-white shadow-lg shadow-pink-200 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Gift size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 leading-tight">আপনার প্রথম ডিপোজিটে -</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-pink-300" />
              <p className="text-pink-500 font-bold text-[9px] tracking-wider uppercase">স্পেশাল বোনাস অফার</p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {[
            { deposit: '১০০০ টাকা', bonus: '৳৫০০ ফ্রি', gradient: 'from-[#ff0055] to-[#ff4d88]' },
            { deposit: '২০০০ টাকা', bonus: '৳১০০০ ফ্রি', gradient: 'from-[#9d00ff] to-[#cc66ff]' },
            { deposit: '৫০০০ টাকা', bonus: '৳৩০০০ ফ্রি', gradient: 'from-[#3366ff] to-[#6699ff]' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-[1.2rem] bg-white shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shrink-0 shadow-lg shadow-black/5`}>
                <CheckCircle2 size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[8px] text-gray-400 font-bold mb-0.5">ডিপোজিট</p>
                <p className="text-xs font-bold text-gray-800">{item.deposit}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] text-pink-500 font-bold mb-0.5">বোনাস পাবেন</p>
                <p className="text-xs font-bold text-[#ff0055]">{item.bonus}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <div className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100">
            <p className="text-[8px] text-gray-400 font-bold tracking-widest uppercase">
              শুধুমাত্র প্রথম ডিপোজিটের জন্য প্রযোজ্য
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-4 space-y-3 mt-1">
        {[
          { title: 'পরিবেশ রক্ষার জন্য', desc: 'সবুজ পৃথিবী গড়তে আমাদের বিশেষ উদ্যোগ।', icon: Leaf, color: 'text-[#059669]', bgColor: 'bg-[#059669]/10' },
          { title: 'নিরাপদ পেমেন্ট', desc: 'বিকাশ এবং নগদের মাধ্যমে দ্রুত পেমেন্ট।', icon: Shield, color: 'text-[#059669]', bgColor: 'bg-[#059669]/10' },
          { title: 'সহজ কাজ', desc: 'প্রতিদিন মাত্র কয়েক মিনিট সময় দিন।', icon: Zap, color: 'text-[#6c5ce7]', bgColor: 'bg-[#f0eeff]' },
          { title: 'দৈনিক বোনাস', desc: 'প্রতিদিন লগইন করে জিতে নিন আকর্ষণীয় পুরস্কার।', icon: Award, color: 'text-[#f1c40f]', bgColor: 'bg-[#fef9e7]' },
          { title: 'দ্রুত উইথড্র', desc: '১-১২ ঘণ্টার মধ্যে পেমেন্ট নিশ্চিত।', icon: Clock, color: 'text-[#0984e3]', bgColor: 'bg-[#e1f5fe]' },
          { title: '২৪/৭ কাস্টমার সাপোর্ট', desc: 'যেকোনো সমস্যায় আমরা আছি আপনার পাশে।', icon: Headphones, color: 'text-[#e84393]', bgColor: 'bg-[#fff0f6]' },
          { title: 'অফিসিয়াল গ্রুপ', desc: 'আমাদের টেলিগ্রাম গ্রুপে যোগ দিন সব খবরের জন্য।', icon: MessageCircle, color: 'text-[#3498db]', bgColor: 'bg-[#e3f2fd]' },
          { title: 'বিশ্বস্ত প্ল্যাটফর্ম', desc: 'হাজারো ব্যবহারকারীর আস্থার প্রতীক।', icon: CheckCircle2, color: 'text-[#e67e22]', bgColor: 'bg-[#fdf2e9]' },
          { title: 'রেফারেল কমিশন', desc: 'বন্ধুদের আমন্ত্রণ জানিয়ে আজীবন কমিশন পান।', icon: Gift, color: 'text-[#2d3436]', bgColor: 'bg-[#fff9db]' },
          { title: 'উন্নত নিরাপত্তা', desc: 'আপনার তথ্য এবং ব্যালেন্স সম্পূর্ণ নিরাপদ।', icon: Lock, color: 'text-[#2d3436]', bgColor: 'bg-[#f1f2f6]' },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-4 p-3.5 rounded-[1.5rem] bg-white border-2 border-[#059669]/25 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-2xl ${f.bgColor} flex items-center justify-center ${f.color} shrink-0 border border-white/50`}>
              <f.icon size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-800">{f.title}</h4>
              <p className="text-[10px] text-gray-400 font-medium">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
