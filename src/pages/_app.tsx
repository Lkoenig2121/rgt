import React from 'react';
import type { AppContext, AppProps, AppInitialProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FormProvider } from '../context';
import '../styles/globals.css';
import config from '../config';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import App from 'next/app';
import { NavigationProvider } from '../context';

if (typeof document === 'undefined') {
  React.useLayoutEffect = React.useEffect;
}

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppInitialProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const { plausibleAnalyticsDomain, environment } = config;
  // create react query client
  const queryClient = new QueryClient();

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <NavigationProvider>
      <QueryClientProvider client={queryClient}>
        <FormProvider>
          {getLayout(
            <>
              <Component {...pageProps} />
            </>
          )}
        </FormProvider>
      </QueryClientProvider>
    </NavigationProvider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default MyApp;
