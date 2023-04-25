import Head from 'next/head';
import Link from 'next/link';
import { ReactElement } from 'react';
import Layout from '../components/layout';
import { Navigation, useNavigationContext } from '../context';

const AboutUs = () => {
  const { setCurrentNav } = useNavigationContext();
  return (
    <>
      <Head>
        <title>R.G.T Restaurant Equipment | About Us</title>
      </Head>
      <div className="mx-auto pt-4 w-full justify-start max-w-screen-md">
        <div className="px-4 pt-4 flex flex-col items-center w-full">
          <h1 className="text-center text-4xl md:text-6xl font-bold leading-tighter tracking-tighter mb-8 md:mb-16 font-heading">
            About us
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            <span className="underline decoration-amber-400 text-white">
              R.G.T. Restaurant Equipment
            </span>{' '}
            is a supplier of premium quality commercial cooking, refrigeration
            and food preparation equipment. Our aim is simple. Produce
            industry-leading commercial restaurant equipment at reasonable
            prices, and back it all up with an easy to understand, no nonsense
            warranty that people can count on.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutUs;

AboutUs.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
