import React, { useState } from 'react';

export const ProductsPage = () => {
  const [planType, setPlanType] = useState<'regular' | 'premium'>('regular');

  const regularPlans = [
    { id: 1, name: 'VIP 1', daily: 'Tk 40.00', total: 'Tk 1200.00', price: '500', img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'VIP 2', daily: 'Tk 80.00', total: 'Tk 2400.00', price: '1000', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'VIP 3', daily: 'Tk 120.00', total: 'Tk 3600.00', price: '1500', img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'VIP 4', daily: 'Tk 160.00', total: 'Tk 4800.00', price: '2000', img: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?auto=format&fit=crop&w=400&q=80' },
    { id: 5, name: 'VIP 5', daily: 'Tk 200.00', total: 'Tk 6000.00', price: '2500', img: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=400&q=80' },
    { id: 6, name: 'VIP 6', daily: 'Tk 240.00', total: 'Tk 7200.00', price: '3000', img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=400&q=80' },
  ];

  const premiumPlans = [
    { id: 101, name: 'Bronze', daily: 'Tk ???', total: 'Tk ???', price: '???', img: 'https://picsum.photos/seed/bronze/400/400' },
    { id: 102, name: 'Silver', daily: 'Tk ???', total: 'Tk ???', price: '???', img: 'https://picsum.photos/seed/silver/400/400' },
    { id: 103, name: 'Gold', daily: 'Tk ???', total: 'Tk ???', price: '???', img: 'https://picsum.photos/seed/gold/400/400' },
    { id: 104, name: 'Platinum', daily: 'Tk ???', total: 'Tk ???', price: '???', img: 'https://picsum.photos/seed/platinum/400/400' },
    { id: 105, name: 'Diamond', daily: 'Tk ???', total: 'Tk ???', price: '???', img: 'https://picsum.photos/seed/diamond/400/400' },
  ];

  const activePlans = planType === 'regular' ? regularPlans : premiumPlans;

  return (
    <div className="flex flex-col gap-4 pb-24 px-4">
      <div className="text-center py-2">
        <h2 className="text-xl font-bold text-gray-800">পণ্য তালিকা</h2>
        <p className="text-gray-400 text-xs">আপনার পছন্দের প্ল্যানটি বেছে নিন</p>
      </div>

      {/* Plan Type Tabs */}
      <div className="flex bg-[#f1f2f6] p-1 rounded-2xl mx-2 border border-gray-100 shadow-inner">
        <button 
          onClick={() => setPlanType('regular')}
          className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${
            planType === 'regular' 
              ? 'bg-white text-[#059669] shadow-md border-2 border-[#059669]' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Regular Plans
        </button>
        <button 
          onClick={() => setPlanType('premium')}
          className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${
            planType === 'premium' 
              ? 'bg-white text-[#D4AF37] shadow-md border-2 border-[#D4AF37]' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Premium Plans
        </button>
      </div>

      {activePlans.map((plan) => (
        <div key={plan.id} className={`bg-white rounded-2xl p-3 shadow-sm border-2 flex flex-col gap-3 relative overflow-hidden ${
          planType === 'premium' ? 'border-[#D4AF37]/20' : 'border-[#059669]/20'
        }`}>
          {planType === 'premium' && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full z-10 shadow-lg">
              Coming Soon
            </div>
          )}
          
          <div className="flex gap-3">
            <div className={`w-20 h-20 rounded-lg overflow-hidden shadow-md shrink-0 ${planType === 'premium' ? 'grayscale opacity-60' : ''}`}>
              <img 
                src={plan.img} 
                alt={plan.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <div className="flex-1 flex flex-col justify-between py-0.5">
              <div>
                <h3 className={`text-lg font-bold mb-0.5 ${planType === 'regular' ? 'text-gray-800' : 'text-[#D4AF37]'}`}>{plan.name}</h3>
                <div className="flex items-center gap-1.5">
                  <span className="bg-orange-50 text-orange-500 text-[8px] font-bold px-1 py-0.5 rounded-md">রাজস্ব চক্র</span>
                  <span className="text-gray-400 text-[8px] font-bold">{planType === 'regular' ? '30 দিন' : '60 দিন'}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <p className={`text-[10px] font-bold ${planType === 'regular' ? 'text-[#059669]' : 'text-[#D4AF37]'}`}>{plan.daily}</p>
                  <p className="text-[8px] text-gray-400 font-medium uppercase">দৈনিক আয়</p>
                </div>
                <div>
                  <p className={`text-[10px] font-bold ${planType === 'regular' ? 'text-[#059669]' : 'text-[#D4AF37]'}`}>{plan.total}</p>
                  <p className="text-[8px] text-gray-400 font-medium uppercase">মোট আয়</p>
                </div>
              </div>
            </div>
          </div>
          <button 
            disabled={planType === 'premium'}
            className={`w-full py-2.5 rounded-lg font-bold text-sm shadow-lg transition-all ${
              planType === 'regular' 
                ? 'bg-[#059669] text-white shadow-[#059669]/20 active:scale-[0.98]' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {planType === 'regular' ? `কিনুন Tk ${plan.price}` : 'Coming Soon'}
          </button>
        </div>
      ))}
    </div>
  );
};
