import React from 'react';
import { NavigationItems } from './navigation-items';
import { useNavigationContext } from '../context';

const MobileNav = () => {
  const { navbarOpen } = useNavigationContext();
  return (
    <nav
      className={`md:hidden fixed flex top-0 left-0 w-full pt-24 z-30 h-screen bg-blue-800 text-white bg-opacity-100 transform delay-100 transition-all duration-300 ${
        navbarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
      }`}
    >
      <NavigationItems
        ulClass="w-full just flex flex-col space-y-4 items-start text-center"
        liClass="nav-li py-1 w-full"
        aClass="nav-link font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 text-2xl font-bold"
        isMobile={true}
      />
    </nav>
  );
};

export default MobileNav;
