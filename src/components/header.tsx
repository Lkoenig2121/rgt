import Link from 'next/link';
import { NavigationItems } from './navigation-items';
import { Navigation, useNavigationContext } from '../context';

type Props = {
  children?: any;
};

export const Header = ({ children }: Props) => {
  const { navbarOpen, navigationRef, setCurrentNav, setNavbarOpen } =
    useNavigationContext();
  return (
    <header className="fixed top-0 z-40 flex-none mx-auto w-full bg-blue-800 md:backdrop-blur-sm border-b-0">
      <div className="py-3 px-6 mx-auto w-full max-w-screen-lg md:flex md:justify-between md:px-6">
        <div className="flex justify-between">
          <Link
            href="/"
            onClick={() => {
              setNavbarOpen(false);
              setCurrentNav(Navigation.Home);
            }}
            className="font-heading font-bold flex items-center text-amber-400 uppercase"
          >
            <img
              height="800"
              src="images/logo-2.png"
              width="3000"
              className="max-w-[180px] w-auto align-middle"
            />
          </Link>
          <button
            className="md:hidden flex top-0 right-0 z-20 relative w-10 h-10 text-white focus:outline-none"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <div className="absolute w-5 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
              <span
                className={`absolute h-0.5 w-5 bg-white transform transition duration-300 ease-in-out ${
                  navbarOpen ? 'rotate-45 delay-200' : '-translate-y-1.5'
                }`}
              ></span>
              <span
                className={`absolute h-0.5 bg-white transform transition-all duration-200 ease-in-out ${
                  navbarOpen ? 'w-0 opacity-50' : 'w-5 delay-200 opacity-100'
                }`}
              ></span>
              <span
                className={`absolute h-0.5 w-5 bg-white transform transition duration-300 ease-in-out ${
                  navbarOpen ? '-rotate-45 delay-200' : 'translate-y-1.5'
                }`}
              ></span>
            </div>
          </button>
        </div>
        <nav
          ref={navigationRef}
          className="items-center w-full md:w-auto md:flex hidden text-gray-500 dark:text-gray-200 h-screen md:h-auto"
          aria-label="Main navigation"
          id="menu"
        >
          <NavigationItems
            ulClass="flex flex-col pt-8 md:pt-0 md:flex-row md:self-center w-full md:w-auto collapsed text-xl md:text-base"
            aClass="font-sans font-medium text-white px-4 py-3 flex items-center transition duration-150 ease-in-out"
          />
        </nav>
      </div>
      {children}
    </header>
  );
};
