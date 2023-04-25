import Head from 'next/head';
import config from '../config';

type Props = {
  pageTitle?: string;
  children?: any;
};

const NextHead = ({ pageTitle, children }: Props) => {
  let title = pageTitle ? `${config.appName} | ${pageTitle}` : config.appName;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="RGT app" />
      <link rel="icon" href="/favicon.ico" />
      {children}
    </Head>
  );
};

export default NextHead;
