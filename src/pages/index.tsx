import Layout from '../components/layout';
import { ReactElement } from 'react';
import { HomeHero } from '../components/home-hero';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';
import {
  Brand,
  Category_Level_0,
  Category_Level_1,
  Product,
} from '@prisma/client';
import Link from 'next/link';
import { Navigation, useNavigationContext } from '../context';
import { MdOutlineSearch } from 'react-icons/md';
import { RotatingLines, ThreeDots, Triangle } from 'react-loader-spinner';
import { IoIosStar } from 'react-icons/io';

const Home = () => {
  const { setNavbarOpen, setCurrentNav } = useNavigationContext();
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<
    Category_Level_0[]
  >(
    ['categories'],
    async () => {
      const categories = (await (await fetch(`api/categories`)).json()).data;
      return categories;
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const { data: subcategories, isLoading: isSubcategoriesLoading } = useQuery<
    Category_Level_1[]
  >(
    ['subcategories'],
    async () => {
      const subcategories = (await (await fetch(`api/sub-categories`)).json())
        .data;
      return subcategories;
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const { data: brands, isLoading: isBrandsLoading } = useQuery<Brand[]>(
    ['brands'],
    async () => {
      const brands = (await (await fetch(`api/brands?master=true`)).json())
        .data;
      return brands;
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const { data: highlights, isLoading: isHighlightsLoading } = useQuery<
    Product[]
  >(
    ['highlights'],
    async () => {
      const highlights = (await (await fetch(`api/highlights`)).json()).data;
      return highlights;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const handleSearch = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      window.location.href = `search?page=1&query=${encodeURI(
        event.target.value
      ).replaceAll(`&`, `%26`)}`;
    }
  };

  return (
    <>
      <Head>
        <title>R.G.T Restaurant Equipment</title>
      </Head>
      <HomeHero />
      <main className="px-6 pb-24 w-full mx-auto">
        <div className="relative w-full pb-4">
          <input
            type="search"
            onKeyDown={handleSearch}
            className="text-xl bg-purple-white shadow rounded border-0 outline-0 p-4 w-full text-gray-500"
            placeholder="Search by name..."
          />
          <MdOutlineSearch className="text-2xl absolute top-0 right-0 mt-4 mr-4 text-gray-500" />
        </div>
        <p className="text-2xl text-white py-4 font-bold leading-tighter tracking-tighter font-heading">
          Restaurant Equipment & Supply Categories
        </p>
        {isCategoriesLoading && (
          <div className="flex justify-center mt-8 mb-24">
            <RotatingLines
              strokeColor="white"
              strokeWidth="3"
              animationDuration="0.75"
              width="40"
              visible={true}
            />
          </div>
        )}
        {categories && (
          <div className="sm:flex justify-center items-center flex-wrap bg-white rounded py-4 mb-4">
            {categories &&
              categories.map((c, idx) => (
                <Link
                  key={idx}
                  href={`search?page=1&category=${encodeURI(c.name).replaceAll(
                    `&`,
                    `%26`
                  )}`}
                  className="flex justify-center px-4 py-4 text-xl font-semibold text-center cursor-pointer text-blue-600 hover:text-blue-800 underline"
                  onClick={(e) => {
                    setNavbarOpen(false);
                    setCurrentNav(Navigation.Search);
                  }}
                >
                  {c.name}
                </Link>
              ))}
          </div>
        )}
        <p className="text-2xl text-white py-4 font-bold leading-tighter tracking-tighter font-heading">
          Our Favorite Equipment Brands
        </p>
        {isBrandsLoading && (
          <div className="flex justify-center mt-8 mb-24">
            <RotatingLines
              strokeColor="white"
              strokeWidth="3"
              animationDuration="0.75"
              width="40"
              visible={true}
            />
          </div>
        )}
        {brands && (
          <div className="sm:flex justify-center items-center flex-wrap bg-white rounded py-4 mb-4">
            {brands &&
              brands.map((b, idx) => (
                <Link
                  key={idx}
                  href={`search?page=1&brand=${encodeURI(b.name).replaceAll(
                    `&`,
                    `%26`
                  )}`}
                  className="flex justify-start items-center"
                  onClick={(e) => {
                    setNavbarOpen(false);
                    setCurrentNav(Navigation.Search);
                  }}
                >
                  <img
                    alt="logo"
                    src={b.logoUrl || ''}
                    width="100"
                    height="100"
                    decoding="async"
                    className="p-4 h-[60px] max-w-full object-contain bg-white w-full"
                    loading="lazy"
                  />
                </Link>
              ))}
          </div>
        )}
        <p className="text-2xl text-white py-4 font-bold leading-tighter tracking-tighter font-heading">
          Best Selling Restaurant Equipment
        </p>
        {isHighlightsLoading && (
          <div className="flex justify-center mt-8 mb-24">
            <RotatingLines
              strokeColor="white"
              strokeWidth="3"
              animationDuration="0.75"
              width="40"
              visible={true}
            />
          </div>
        )}
        {highlights && (
          <div className="bg-white rounded py-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {highlights &&
                highlights.map((h, idx) => (
                  <Link
                    key={idx}
                    href={`search?page=1&subcategory=${encodeURI(
                      h.categoryLevel1_tx!
                    ).replaceAll(`&`, `%26`)}`}
                    className="flex flex-col justify-start items-center"
                    onClick={(e) => {
                      setNavbarOpen(false);
                      setCurrentNav(Navigation.Search);
                    }}
                  >
                    <img
                      alt="logo"
                      src={h.imageUrl || ''}
                      width="100"
                      height="100"
                      decoding="async"
                      className="p-4 h-[150px] max-w-full object-contain bg-white w-full"
                      loading="lazy"
                    />
                    <div className="flex justify-start sm:justify-center items-center">
                      <IoIosStar className="mr-1 text-amber-500 text-base" />
                      <IoIosStar className="mx-1 text-amber-500 text-base" />
                      <IoIosStar className="mx-1 text-amber-500 text-base" />
                      <IoIosStar className="mx-1 text-amber-500 text-base" />
                      <IoIosStar className="ml-1 text-amber-500 text-base" />
                    </div>
                    <p className="text-xl text-center p-4 font-bold text-black">
                      {h?.categoryLevel1_tx}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        )}
        <p className="text-2xl text-white py-4 font-bold leading-tighter tracking-tighter font-heading">
          Restaurant Equipment & Supply Subcategories
        </p>
        {isSubcategoriesLoading && (
          <div className="flex justify-center mt-8 mb-24">
            <RotatingLines
              strokeColor="white"
              strokeWidth="3"
              animationDuration="0.75"
              width="40"
              visible={true}
            />
          </div>
        )}
        {subcategories && (
          <div className="sm:flex justify-center items-center flex-wrap bg-white rounded py-4 mb-4">
            {subcategories &&
              subcategories
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((c, idx) => (
                  <Link
                    key={idx}
                    href={`search?page=1&subcategory=${encodeURI(
                      c.name
                    ).replaceAll(`&`, `%26`)}`}
                    className="flex justify-center px-2 py-2 text-base font-semibold text-center cursor-pointer text-blue-600 hover:text-blue-800 underline"
                    onClick={(e) => {
                      setNavbarOpen(false);
                      setCurrentNav(Navigation.Search);
                    }}
                  >
                    {c.name}
                  </Link>
                ))}
          </div>
        )}
      </main>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
