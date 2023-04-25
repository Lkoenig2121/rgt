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
      <div className="mx-auto pt-4 w-full justify-start">
        <div className="px-4 pt-4 flex flex-col items-center w-full">
          <h1 className="text-center text-4xl md:text-6xl font-bold leading-tighter tracking-tighter mb-8 md:mb-16 font-heading">
            Contact us
          </h1>
          <a
            href="tel:908-235-8986"
            className="text-xl flex items-center justify-center md:justify-start mb-4 hover:text-amber-500 hover:underline cursor-pointer"
          >
            +1 (908) 235-8986
          </a>
          <a
            href="RGT_Equip@yahoo.com"
            className="text-xl flex items-center justify-center md:justify-start mb-4 hover:text-amber-500 hover:underline cursor-pointer"
          >
            RGT_Equip@yahoo.com
          </a>
          <a
            href="https://goo.gl/maps/gEhJT8be7nKajsJ7A"
            className="text-xl flex items-center justify-center md:justify-start mb-4 hover:text-amber-500 hover:underline cursor-pointer"
          >
            5 Executive Dr, Toms River, NJ, United States
          </a>
        </div>
      </div>
    </>
  );
};

export default AboutUs;

AboutUs.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
