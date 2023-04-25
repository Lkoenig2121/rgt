import Head from 'next/head';
import React, { ReactElement } from 'react';
import Layout from '../components/layout';

const FourOhFour = () => {
  return (
    <>
      <Head>
        <title>Not Found</title>
      </Head>
      <div className="my-16 mx-auto w-full max-w-3xl md:min-w-[750px] md:max-w-[750px] text-center">
        <h1>Oops! Page not found</h1>
      </div>
    </>
  );
};

FourOhFour.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default FourOhFour;
