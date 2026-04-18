import React from 'react';
import { MessageSquare, Send, Mail } from 'lucide-react';
import { Page } from '../types';

export const SupportPage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const supportOptions = [
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, color: 'bg-[#059669]' },
    { id: 'telegram', name: 'Telegram', icon: Send, color: 'bg-blue-400' },
    { id: 'email', name: 'Gmail', icon: Mail, color: 'bg-red-500' },
  ];

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 bg-white min-h-screen transition-colors duration-300">
      <div className="text-center py-4">
        <h2 className="text-xl font-bold text-gray-800">Support Center</h2>
        <p className="text-gray-400 text-xs">আমাদের সাথে যোগাযোগ করুন</p>
      </div>

      <div className="space-y-3">
        {supportOptions.map((opt) => (
          <div key={opt.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between opacity-70 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${opt.color} flex items-center justify-center text-white`}>
                <opt.icon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{opt.name}</h3>
                <p className="text-[10px] text-gray-400">অফিসিয়াল সাপোর্ট চ্যানেল</p>
              </div>
            </div>
            <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Disable</span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
        <p className="text-blue-600 text-xs font-medium text-center">
          সাপোর্ট চ্যানেলগুলো বর্তমানে রক্ষণাবেক্ষণের জন্য বন্ধ আছে। শীঘ্রই চালু করা হবে।
        </p>
      </div>
    </div>
  );
};
