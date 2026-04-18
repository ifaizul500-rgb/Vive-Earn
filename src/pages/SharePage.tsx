import React, { useState, useEffect } from 'react';
import { Gift, CheckCircle2, Copy, Share2, Download, Smartphone, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const SharePage = () => {
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsub = onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      }
    });

    return () => unsub();
  }, []);

  const referralCode = userData?.myReferralCode || "------";
  const referralCount = userData?.referralCount || 0;
  const referralIncome = userData?.referralIncome || 0;
  
  // Create a realistic referral link using the app's current domain
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast('লিংক কপি করা হয়েছে!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = async () => {
    const shareData = {
      title: 'Vive Earn - অ্যাপটি ডাউনলোড করুন',
      text: `Vive Earn অ্যাপটি ডাউনলোড করুন এবং প্রতিদিন ইনকাম শুরু করুন! 💰\n\nআমার রেফার কোড: ${referralCode}\nনিচের লিংক থেকে অ্যাপটি ইনস্টল করুন:`,
      url: referralLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err.name !== 'AbortError') copyLink();
      }
    } else {
      copyLink();
    }
  };

  const shareVia = (platform: 'whatsapp' | 'telegram') => {
    const text = `Vive Earn অ্যাপটি ডাউনলোড করুন এবং প্রতিদিন ইনকাম শুরু করুন! 💰\n\nআমার রেফার কোড: ${referralCode}\nডাউনলোড লিংক: ${referralLink}`;
    let url = '';
    
    if (platform === 'whatsapp') {
      url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    } else {
      url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;
    }
    
    window.open(url, '_blank');
  };

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

      {/* Top Green Card */}
      <div className="p-6 rounded-[1.5rem] bg-[#059669] text-white text-center relative overflow-hidden shadow-lg shadow-[#059669]/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/20">
            <Gift size={24} className="text-[#ff9ff3]" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-lg font-bold mb-2 tracking-tight">রেফার করে আয় করুন</h2>
          
          <p className="text-white/90 text-[10px] leading-relaxed max-w-[85%] mx-auto font-medium">
            আপনার বন্ধুদের আমন্ত্রণ জানান and প্রতিটি রেফারে নিশ্চিত বোনাস পান!
          </p>
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="bg-white rounded-[1.25rem] p-4 shadow-sm border border-gray-50 -mt-6 mx-2 relative z-20 transition-colors">
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

        <button 
          onClick={shareOnSocial}
          className="w-full bg-[#059669] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#059669]/20 mt-6 active:scale-[0.98] transition-all text-sm"
        >
          <Share2 size={18} /> বন্ধুদের সাথে শেয়ার করুন
        </button>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <button 
            onClick={() => shareVia('whatsapp')}
            className="py-2.5 rounded-xl bg-[#25D366] text-white text-[10px] font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            WhatsApp-এ পাঠান
          </button>
          <button 
            onClick={() => shareVia('telegram')}
            className="py-2.5 rounded-xl bg-[#0088cc] text-white text-[10px] font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            Telegram-এ পাঠান
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
            <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">মোট রেফার</p>
            <p className="text-lg font-bold text-[#2f3542]">{referralCount}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
            <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">রেফার ইনকাম</p>
            <p className="text-lg font-bold text-[#059669]">৳{referralIncome.toFixed(2)}</p>
          </div>
        </div>

        {/* Download Section */}
        <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
          <button 
            onClick={() => setShowInstallHelp(true)}
            className="w-full bg-[#f1f2f6] text-[#2f3542] py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-blue-100 active:scale-[0.98] transition-all text-xs"
          >
            <Download size={16} className="text-blue-500" /> অ্যাপটি ডাউনলোড করবেন কিভাবে?
          </button>
        </div>
      </div>

      {/* Install Instructions Modal */}
      <AnimatePresence>
        {showInstallHelp && (
          <div className="fixed inset-0 z-[150] flex items-end justify-center px-4 pb-20 sm:pb-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInstallHelp(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative bg-white w-full max-w-md rounded-t-[2rem] p-6 shadow-2xl overflow-hidden border-t border-gray-100"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">অ্যাপটি ডাউনলোড করার নিয়ম</h3>
                  <p className="text-[10px] text-gray-400 font-medium">নিচের ধাপগুলো অনুসরণ করুন</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0 font-bold text-sm">১</div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-1">লিংকটি ওপেন করুন</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed">যেকোনো ব্রাউজার (Chrome সুপারিশকৃত) দিয়ে লিংকটি ওপেন করুন।</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0 font-bold text-sm">২</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-700 mb-1">মেনু বাটনে ক্লিক করুন</p>
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100 mt-2">
                       <Chrome size={14} className="text-gray-400" />
                       <p className="text-[9px] text-gray-500 font-medium">ব্রাউজারের উপরে ডানে থাকা তিন ডট (⋮) এ ক্লিক করুন।</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0 font-bold text-sm">৩</div>
                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-1">Add to Home Screen</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed">মেনু থেকে <span className="font-bold text-[#059669]">"Install App"</span> অথবা <span className="font-bold text-[#059669]">"Add to Home Screen"</span> এ ক্লিক করুন।</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInstallHelp(false)}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm mt-8 active:scale-95 transition-all"
              >
                বুঝেছি
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
