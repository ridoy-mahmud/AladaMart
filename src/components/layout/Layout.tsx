import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow pt-[126px] md:pt-[138px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
