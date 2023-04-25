import Link from 'next/link';
import { underline } from './layout';
import { useNavigationContext, Navigation } from '../context';

type Props = {
  children?: any;
  ulClass?: string;
  liClass?: string;
  aClass?: string;
  isMobile?: boolean;
};

export const NavigationItems = ({
  ulClass,
  liClass,
  aClass,
  isMobile,
}: Props) => {
  const {
    currentNav,
    subNavOpen,
    setSubNavOpen,
    setNavbarOpen,
    setCurrentNav,
  } = useNavigationContext();
  return (
    <ul className={ulClass}>
      <li className={liClass}>
        <Link
          href="/about"
          className={`${aClass} ${
            currentNav === Navigation.AboutUs && underline
          }`}
          onClick={(e) => {
            setNavbarOpen(false);
            setCurrentNav(Navigation.AboutUs);
          }}
        >
          About
        </Link>
      </li>
      <li className={liClass}>
        <Link
          href="/contact"
          className={`${aClass} ${
            currentNav === Navigation.ContactUs && underline
          }`}
          onClick={(e) => {
            setNavbarOpen(false);
            setCurrentNav(Navigation.ContactUs);
          }}
        >
          Contact
        </Link>
      </li>
    </ul>
  );
};
