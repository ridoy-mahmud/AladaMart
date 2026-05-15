import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow w-full sm:w-[95%] md:w-[90%] lg:w-[85%] mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
