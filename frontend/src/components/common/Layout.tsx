import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { ToastContainer } from './ToastContainer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // Pages that don't need the dashboard sidebar (e.g. landing, login, register, coding assessment which has its own full split-screen)
  const isFullScreenPage = ['/', '/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/assessment');

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex w-full">
        {!isFullScreenPage && <Sidebar />}
        <main className={`flex-1 ${!isFullScreenPage ? 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full' : 'w-full'}`}>
          {children}
        </main>
      </div>
      {!location.pathname.startsWith('/assessment') && <Footer />}
      <ToastContainer />
    </div>
  );
};
