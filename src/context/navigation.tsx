import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDetectOutsideClick } from '../helpers/use-detect-outside-click';
import { createProviderContext } from '../helpers/provider-context';

type NavigationState = {
  readonly navigationRef: React.MutableRefObject<any>;
  readonly navbarOpen: boolean;
  readonly currentNav: Navigation;
  readonly subNavOpen: boolean;
  setNavbarOpen: (value: boolean) => void;
  setCurrentNav: (value: Navigation) => void;
  setSubNavOpen: (value: boolean) => void;
};

export enum Navigation {
  Home,
  Search,
  Detail,
  AboutUs,
  ContactUs,
  Terms,
  Privacy,
  Signin,
  Signup,
  Settings,
  Purchases,
  StudyGuides,
  Certificates,
  Dashboard,
  ForgotPassword,
  CodeOfConduct,
  Jobs,
  FinancingOptions,
  Regulatory,
}

const useHook = () => {
  const navigationRef = useRef<any>(null);
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);
  const [subNavOpen, setSubNavOpen] = useState<boolean>(false);
  const [currentNav, setCurrentNav] = useState<Navigation>(Navigation.Home);

  useDetectOutsideClick(navigationRef, () => {
    setSubNavOpen(false);
  });

  useEffect(() => {
    setSubNavOpen(false);
  }, [currentNav]);

  useEffect(() => {
    switch (window.location.pathname) {
      case '/':
        setCurrentNav(Navigation.Home);
        break;
      case '/about':
        setCurrentNav(Navigation.AboutUs);
        break;
      case '/contact':
        setCurrentNav(Navigation.ContactUs);
        break;
      case '/search':
        setCurrentNav(Navigation.Search);
        break;
    }
  }, []);

  const state = useMemo(
    () => ({
      navigationRef,
      navbarOpen,
      currentNav,
      subNavOpen,
      setNavbarOpen,
      setCurrentNav,
      setSubNavOpen,
    }),
    [navbarOpen, currentNav, subNavOpen]
  );

  return state;
};

export const {
  useHookContext: useNavigationContext,
  Provider: NavigationProvider,
} = createProviderContext<NavigationState>({ useHook });
