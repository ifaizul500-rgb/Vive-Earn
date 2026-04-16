import React, { useState } from 'react';
import { User, Phone, Lock, Users } from 'lucide-react';

export const AuthPage = ({ onLogin }: { onLogin: (name: string) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleAuth = () => {
    onLogin(name || 'Rofiq99');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Background Image Header */}
      <div className="h-[30vh] relative overflow-hidden">
        <img 
          src="https://picsum.photos/seed/sunset-field/1080/1920" 
          alt="Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 border border-white/30">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#059669] text-xl font-bold">
              V
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Vive Earn</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 mt-1">Official Platform</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 bg-white -mt-8 rounded-t-[2.5rem] relative z-10 px-6 pt-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{isLogin ? 'সাইন ইন করুন' : 'নতুন অ্যাকাউন্ট'}</h2>
            <p className="text-gray-400 text-xs mt-1">
              {isLogin ? 'আপনার অ্যাকাউন্টে লগইন করুন' : 'Vive Earn এ যোগ দিতে তথ্য দিন'}
            </p>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <div className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${name ? 'border-[#059669] bg-white' : 'border-gray-100 bg-gray-50'}`}>
                  <User size={18} className={name ? 'text-[#059669]' : 'text-gray-400'} />
                  <div className="h-4 w-[1px] bg-gray-200 mx-1" />
                  <input 
                    type="text" 
                    placeholder="আপনার নাম"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-transparent outline-none font-bold text-gray-700 placeholder:text-gray-300 text-sm"
                  />
                </div>
              </div>
            )}

            <div className="relative group">
              <div className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${phone ? 'border-[#059669] bg-white' : 'border-gray-100 bg-gray-50'}`}>
                <Phone size={18} className={phone ? 'text-[#059669]' : 'text-gray-400'} />
                <div className="h-4 w-[1px] bg-gray-200 mx-1" />
                <span className="text-gray-500 font-bold text-xs">+880</span>
                <input 
                  type="tel" 
                  placeholder="মোবাইল নম্বর"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 bg-transparent outline-none font-bold text-gray-700 placeholder:text-gray-300 text-sm"
                />
              </div>
            </div>

            <div className="relative group">
              <div className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${password ? 'border-[#059669] bg-white' : 'border-gray-100 bg-gray-50'}`}>
                <Lock size={18} className={password ? 'text-[#059669]' : 'text-gray-400'} />
                <div className="h-4 w-[1px] bg-gray-200 mx-1" />
                <input 
                  type="password" 
                  placeholder="পাসওয়ার্ড"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent outline-none font-bold text-gray-700 placeholder:text-gray-300 text-sm"
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="relative group">
                  <div className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${confirmPassword ? 'border-[#059669] bg-white' : 'border-gray-100 bg-gray-50'}`}>
                    <Lock size={18} className={confirmPassword ? 'text-[#059669]' : 'text-gray-400'} />
                    <div className="h-4 w-[1px] bg-gray-200 mx-1" />
                    <input 
                      type="password" 
                      placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="flex-1 bg-transparent outline-none font-bold text-gray-700 placeholder:text-gray-300 text-sm"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <div className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${referralCode ? 'border-[#059669] bg-white' : 'border-gray-100 bg-gray-50'}`}>
                    <Users size={18} className={referralCode ? 'text-[#059669]' : 'text-gray-400'} />
                    <div className="h-4 w-[1px] bg-gray-200 mx-1" />
                    <input 
                      type="text" 
                      placeholder="রেফার কোড (ঐচ্ছিক)"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      className="flex-1 bg-transparent outline-none font-bold text-gray-700 placeholder:text-gray-300 text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {isLogin && (
              <div className="flex justify-between items-center px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div 
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-[#059669] border-[#059669]' : 'border-gray-200'}`}
                  >
                    {rememberMe && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-700">পাসওয়ার্ড মনে রাখবেন</span>
                </label>
                <button className="text-[10px] font-bold text-gray-500 hover:text-[#059669]">পাসওয়ার্ড মনে নেই?</button>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <button 
                onClick={handleAuth}
                className="w-full bg-[#059669] text-white py-3.5 rounded-2xl font-bold text-base shadow-xl shadow-[#059669]/20 active:scale-[0.98] transition-all"
              >
                {isLogin ? 'সাইন ইন' : 'অ্যাকাউন্ট তৈরি করুন'}
              </button>
              
              <div className="flex items-center justify-center gap-2 pt-2">
                <span className="text-xs text-gray-400 font-medium">
                  {isLogin ? 'অ্যাকাউন্ট নেই?' : 'ইতিমধ্যে অ্যাকাউন্ট আছে?'}
                </span>
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs font-bold text-[#059669] hover:underline"
                >
                  {isLogin ? 'সাইন আপ করুন' : 'লগইন করুন'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
