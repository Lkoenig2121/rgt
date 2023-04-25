import Link from 'next/link';
import { Navigation, useNavigationContext } from '../context';
import { IoIosMail, IoIosCall, IoIosHome } from 'react-icons/io';
import { HiBuildingOffice } from 'react-icons/hi2';
import {
  FaTiktok,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from 'react-icons/fa';

type Props = {
  children?: any;
};

export const Footer = ({ children }: Props) => {
  const { setCurrentNav } = useNavigationContext();
  return (
    <footer className="text-center lg:text-left bg-gray-100 text-gray-500 w-full">
      <div className="text-center py-3 px-3 mx-auto w-full md:px-6 pt-0 max-w-screen-lg">
        <div className="py-10 text-center md:text-left">
          <div className="grid grid-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="">
              <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">
                Site Map
              </h6>
              <p className="mb-4">
                <Link
                  href="/about"
                  onClick={() => setCurrentNav(Navigation.AboutUs)}
                  className="text-gray-500 hover:text-amber-500 hover:underline"
                >
                  About
                </Link>
              </p>
              <p className="mb-4">
                <Link
                  href="/contact"
                  onClick={() => setCurrentNav(Navigation.ContactUs)}
                  className="text-gray-500 hover:text-amber-500 hover:underline"
                >
                  Contact
                </Link>
              </p>
            </div>
            <div className="">
              <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">
                Contact
              </h6>
              <a
                href="tel:908-235-8986"
                className="flex items-center justify-center md:justify-start mb-4 hover:text-amber-500 hover:underline cursor-pointer"
              >
                <IoIosCall className="mr-4" />
                +1 (908) 235-8986
              </a>
              <a
                href="RGT_Equip@yahoo.com"
                className="flex items-center justify-center md:justify-start mb-4 hover:text-amber-500 hover:underline cursor-pointer"
              >
                <IoIosMail className="mr-4" />
                RGT_Equip@yahoo.com
              </a>
              <a
                href="https://goo.gl/maps/4RspwGkEVzNsSosQ6"
                className="flex items-center justify-center md:justify-start mb-4 hover:text-amber-500 hover:underline cursor-pointer"
              >
                <HiBuildingOffice className="mr-4" />5 Executive Dr, Toms River,
                NJ, United States
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center p-6 bg-gray-200">
        <span>&copy;&nbsp;{new Date().getFullYear()} Copyright&nbsp;</span>
        <Link
          href="/"
          className="text-gray-500 font-semibold"
          onClick={() => setCurrentNav(Navigation.Home)}
        >
          R.G.T Restaurant Equipment
        </Link>
      </div>
    </footer>
  );
};
