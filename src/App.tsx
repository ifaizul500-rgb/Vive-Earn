import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
import { Page } from './types';

// --- Components ---
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';

// --- Pages ---
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { MePage } from './pages/MePage';
import { SupportPage } from './pages/SupportPage';
import { UpdatePage } from './pages/UpdatePage';
import { TransactionPage } from './pages/TransactionPage';
import { FAQPage } from './pages/FAQPage';
import { DepositPage } from './pages/DepositPage';
import { WithdrawPage } from './pages/WithdrawPage';
import { GamePage } from './pages/GamePage';
import { SharePage } from './pages/SharePage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Rofiq99');
  const [activePage, setActivePage] = useState<Page>('home');

  if (!isLoggedIn) {
    return <AuthPage onLogin={(name) => {
      setUserName(name);
      setIsLoggedIn(true);
    }} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <HomePage setPage={setActivePage} userName={userName} />;
      case 'products': return <ProductsPage />;
      case 'game': return <GamePage />;
      case 'share': return <SharePage />;
      case 'me': return <MePage setPage={setActivePage} userName={userName} />;
      case 'deposit': return <DepositPage setPage={setActivePage} />;
      case 'withdraw': return <WithdrawPage setPage={setActivePage} />;
      case 'support': return <SupportPage setPage={setActivePage} />;
      case 'update': return <UpdatePage />;
      case 'transaction': return <TransactionPage />;
      case 'faq': return <FAQPage />;
      default: return <HomePage setPage={setActivePage} userName={userName} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-900">
      <Header setPage={setActivePage} />
      
      <main className="max-w-md mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activePage={activePage} setPage={setActivePage} />
    </div>
  );
}
