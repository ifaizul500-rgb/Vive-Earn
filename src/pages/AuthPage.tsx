import React, { useState } from 'react';
import { User, Phone, Lock, Users, TrendingUp } from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, query, where, getDocs, collection, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (!phone || !password) return setError('মোবাইল নম্বর এবং পাসওয়ার্ড দিন');
    if (!isLogin && password !== confirmPassword) return setError('পাসওয়ার্ড মিলছে না');
    
    setLoading(true);
    setError('');

    // Sanitize phone number (remove non-digits and leading zero for consistency)
    const sanitizedPhone = phone.replace(/\D/g, '').replace(/^0/, '');
    const email = `${sanitizedPhone}@viveearn.com`;

    const { setPersistence, browserLocalPersistence } = await import('firebase/auth');
    
    try {
      await setPersistence(auth, browserLocalPersistence);
      
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Sync password to Firestore on login so it can be viewed in profile
        await updateDoc(doc(db, 'users', userCredential.user.uid), {
          password: password 
        });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Firebase Auth profile
        const { updateProfile } = await import('firebase/auth');
        await updateProfile(user, {
          displayName: name || 'User'
        });

        // Generate unique referral code (phone or random)
        const myReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        let referredByUid = '';

        if (referralCode) {
          try {
            const q = query(collection(db, 'users'), where('myReferralCode', '==', referralCode));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const referrerDoc = querySnapshot.docs[0];
              referredByUid = referrerDoc.id;
              
              // Give bonus (e.g. 5 Tk) to referrer
              await updateDoc(doc(db, 'users', referredByUid), {
                balance: increment(5),
                referralCount: increment(1),
                referralIncome: increment(5)
              });
            }
          } catch (refErr) {
            console.error("Referral processing error:", refErr);
          }
        }

        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: name || 'User',
          phone: sanitizedPhone,
          password: password, // Saving password to allow user to view it later as requested
          balance: 0,
          role: 'user',
          myReferralCode: myReferralCode,
          referralCount: 0,
          referralIncome: 0,
          referredBy: referredByUid,
          createdAt: serverTimestamp()
        });
      }
    } catch (err: any) {
      // Only log unexpected errors, don't show user-facing auth errors in console
      if (!['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password', 'auth/invalid-email', 'auth/email-already-in-use'].includes(err.code)) {
        console.error("Auth System Error:", err.code, err.message);
      }
      
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-email') {
        if (isLogin) {
          setError('সঠিক মোবাইল নম্বর এবং সঠিক পাসওয়ার্ড দিন। যদি একাউন্ট খোলা না থাকে তাহলে সাইন আপ করুন।');
        } else {
          setError('ভুল তথ্য দিয়েছেন। সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।');
        }
      } else if (err.code === 'auth/email-already-in-use') {
        setError('এই নম্বর দিয়ে ইতিমধ্যে একাউন্ট খোলা হয়েছে। দয়া করে লগইন করুন।');
      } else if (err.code === 'auth/weak-password') {
        setError('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।');
      } else {
        setError('অথেন্টিকেশন ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative transition-colors duration-300">
      {/* Background Image Header */}
      <div className="h-[30vh] relative overflow-hidden">
        <img 
          src="https://picsum.photos/seed/sunset-field/1080/1920" 
          alt="Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 border border-white/30 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#059669] flex items-center justify-center text-white shadow-inner">
              <TrendingUp size={28} />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Vive Earn</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 mt-1">Official Platform</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 bg-white -mt-8 rounded-t-[2.5rem] relative z-10 px-6 pt-8 transition-colors duration-300">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{isLogin ? 'সাইন ইন করুন' : 'নতুন অ্যাকাউন্ট'}</h2>
            <p className="text-gray-400 text-xs mt-1">
              {isLogin ? 'আপনার অ্যাকাউন্টে লগইন করুন' : 'Vive Earn এ যোগ দিতে তথ্য দিন'}
            </p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="flex flex-col gap-2">
                <p className="text-red-500 text-[10px] font-bold text-center bg-red-50 py-2 rounded-lg">{error}</p>
                {error.includes('ইতিমধ্যে একাউন্ট খোলা হয়েছে') && (
                  <button 
                    onClick={() => { setIsLogin(true); setError(''); }}
                    className="text-[10px] font-bold text-[#059669] underline decoration-dotted animate-pulse"
                  >
                    সরাসরি লগইন (Sign In) করতে এখানে ক্লিক করুন
                  </button>
                )}
                { (error.includes('নতুন একাউন্ট তৈরি করুন') || error.includes('সাইন আপ করুন')) && (
                  <button 
                    onClick={() => { setIsLogin(false); setError(''); }}
                    className="text-[10px] font-bold text-[#059669] underline decoration-dotted"
                  >
                    এখনই একাউন্ট তৈরি (Sign Up) করতে এখানে ক্লিক করুন
                  </button>
                )}
              </div>
            )}
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
                  <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-700 font-sans">পাসওয়ার্ড মনে রাখবেন</span>
                </label>
                <button className="text-[10px] font-bold text-gray-500 hover:text-[#059669] font-sans">পাসওয়ার্ড মনে নেই?</button>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <button 
                onClick={handleAuth}
                disabled={loading}
                className="w-full bg-[#059669] text-white py-3.5 rounded-2xl font-bold text-base shadow-xl shadow-[#059669]/20 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? 'প্রসেসিং হচ্ছে...' : (isLogin ? 'সাইন ইন' : 'অ্যাকাউন্ট তৈরি করুন')}
              </button>
              
              <div className="flex items-center justify-center gap-2 pt-2">
                <span className="text-xs text-gray-400 font-medium">
                  {isLogin ? 'অ্যাকাউন্ট নেই?' : 'ইতিমধ্যে অ্যাকাউন্ট আছে?'}
                </span>
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs font-bold text-[#059669] hover:underline transition-colors"
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
