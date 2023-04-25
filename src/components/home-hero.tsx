import React from 'react';
import Link from 'next/link';
import { Navigation, useNavigationContext } from '../context';

export const HomeHero = () => {
  const { setCurrentNav } = useNavigationContext();
  return (
    <div className="relative h-auto w-full">
      <div className="px-4 w-full justify-start relative">
        <div className="px-14 pt-4 pb-6 md:pt-10 md:pb-12 flex flex-col items-center w-full">
          <h1 className="z-20 text-center text-4xl md:text-6xl font-bold leading-tighter tracking-tighter mb-4 md:mb-8 font-heading">
            High Quality, Affordable
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-400 to-amber-400 pr-[0.025em] mr-[-0.025em]">
              &nbsp;Restaurant Equipment
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};
