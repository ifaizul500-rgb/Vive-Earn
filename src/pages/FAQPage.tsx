import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FAQPage = () => {
  const [openId, setOpenId] = useState<string | null>('1');

  const faqs = [
    { id: '1', q: 'কিভাবে একাউন্ট খুলবো?', a: 'অ্যাপটি ওপেন করে সাইন আপ বাটনে ক্লিক করুন এবং আপনার নাম, ইমেইল ও পাসওয়ার্ড দিয়ে একাউন্ট তৈরি করুন।' },
    { id: '2', q: 'কিভাবে টাকা ডিপোজিট করবো?', a: 'Me পেজ থেকে Deposit অপশনে যান, আপনার পছন্দের পেমেন্ট মেথড সিলেক্ট করুন এবং নির্দেশাবলী অনুসরণ করে টাকা পাঠান।' },
    { id: '3', q: 'উইথড্র করতে কত সময় লাগে?', a: 'সাধারণত উইথড্র রিকোয়েস্ট দেওয়ার ১-২৪ ঘণ্টার মধ্যে পেমেন্ট সম্পন্ন করা হয়।' },
    { id: '4', q: 'রেফারেল কমিশন কিভাবে পাবো?', a: 'আপনার রেফারেল লিঙ্ক ব্যবহার করে কেউ একাউন্ট খুলে প্ল্যান কিনলে আপনি ১০% কমিশন পাবেন।' },
    { id: '5', q: 'প্রতিদিন কয়টি টাস্ক করা যায়?', a: 'প্রতিদিন ১টি টাস্ক সম্পন্ন করা যায় এবং আপনার একটিভ প্ল্যান অনুযায়ী রিওয়ার্ড দেওয়া হয়।' },
  ];

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 bg-white min-h-screen transition-colors duration-300">
      <div className="text-center py-4">
        <h2 className="text-xl font-bold text-gray-800">FAQ (সাধারণ জিজ্ঞাসা)</h2>
        <p className="text-gray-400 text-xs">আপনার প্রশ্নের উত্তর এখানে খুঁজুন</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-colors">
            <button 
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <span className="font-bold text-sm text-gray-800">{faq.q}</span>
              {openId === faq.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
            </button>
            <AnimatePresence>
              {openId === faq.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <p className="text-gray-500 text-xs leading-relaxed border-t border-gray-50 pt-3">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};
