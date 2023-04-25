import Layout from '../components/layout';
import { ReactElement, useEffect } from 'react';
import { HomeHero } from '../components/home-hero';
import Head from 'next/head';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Brand, Category_Level_1, Product } from '@prisma/client';
import nodefetch from 'node-fetch';
import axios from 'axios';
import Link from 'next/link';
import { Navigation, useNavigationContext } from '../context';
import { startCase } from 'lodash';
import { useInView } from 'react-intersection-observer';
import { RotatingLines } from 'react-loader-spinner';

declare global {
  var Router: any;
}

type Props = {
  data: Product[] | null;
  title?: string;
  category?: any;
  breadcrumbs: string;
};

const Search = ({ title, breadcrumbs, category }: Props) => {
  const LIMIT = 20;
  const { ref, inView } = useInView();
  const { setNavbarOpen, setCurrentNav } = useNavigationContext();
  const { data: subcategories } = useQuery<Brand[]>(
    ['subcategories', category],
    async () => {
      const subcategories = (
        await (
          await fetch(
            `api/filters?category=${encodeURI(category!).replaceAll(
              `&`,
              `%26`
            )}`
          )
        ).json()
      ).data;
      return subcategories;
    },
    {
      enabled: !!category,
      refetchOnWindowFocus: false,
    }
  );
  const {
    data,
    isLoading,
    isInitialLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Product[]>(
    ['products'],
    async ({ pageParam = 1 }) => {
      let queryString = window.location.search;
      const prevPage = getSubstring(queryString, 'page', '&');
      const nextPage =
        getSubstring(queryString, 'page', '&').slice(0, -1) + pageParam;
      queryString = queryString.replace(prevPage, nextPage);
      window.history.replaceState(null, '', queryString);
      const products = (
        await (await fetch(`api/products${queryString}`)).json()
      ).data;
      return products;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          lastPage.length === LIMIT ? allPages.length + 1 : undefined;
        return nextPage;
      },
    }
  );
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const content = isSuccess && (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.pages.map((page) =>
          page.map((p, i) => {
            return (
              <Link
                ref={(page.length === i + 1 && ref) || null}
                href={`products/${p.id}`}
                key={i}
                className="text-center cursor-pointer text-black flex justify-center"
                onClick={(e) => {
                  setNavbarOpen(false);
                  setCurrentNav(Navigation.Detail);
                }}
              >
                <div className="flex flex-col bg-white rounded">
                  <img
                    alt="logo"
                    src={p.imageUrl || ''}
                    width="100"
                    height="100"
                    decoding="async"
                    data-nimg="1"
                    className="px-4 py-8 h-[300px] max-w-full object-contain w-full"
                    loading="lazy"
                  />
                  <p className="text-xl text-left px-4 pt-4 pb-2">{p.name}</p>
                  <p className="text-xl text-left px-4 pt-2 pb-4 font-bold">
                    {p.price_tx}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );

  return (
    <>
      <Head>
        <title>R.G.T Restaurant Equipment | Search Products</title>
      </Head>
      <div className="relative h-auto w-full">
        <div className="px-4 pt-8 w-full justify-start relative">
          <div className="px-14 pt-4 flex flex-col items-center w-full">
            <h1 className="z-20 text-center text-4xl md:text-5xl font-bold leading-tighter tracking-tighter mb-2 font-heading">
              {title}
            </h1>
          </div>
        </div>
      </div>
      <main className="px-6 pt-4 md:pt-8 pb-24 w-full">
        {subcategories && (
          <div className="w-full mx-auto mb-4 md:mb-8">
            {subcategories.map((sc: any, idx: number) => (
              <div
                key={idx}
                className="text-xs md:text-sm inline-block bg-blue-500 rounded-xl px-4 py-2 mr-2.5 mb-2.5 cursor-pointer"
                onClick={(e) => {
                  setNavbarOpen(false);
                  setCurrentNav(Navigation.Search);
                  setTimeout(() => {
                    window.location.href = `search?page=1&subcategory=${encodeURI(
                      sc.name!
                    ).replaceAll(`&`, `%26`)}`;
                  });
                }}
              >
                {sc.name}
              </div>
            ))}
          </div>
        )}
        {isInitialLoading && (
          <div className="flex justify-center mt-16 mb-24">
            <RotatingLines
              strokeColor="white"
              strokeWidth="3"
              animationDuration="0.75"
              width="40"
              visible={true}
            />
          </div>
        )}
        {category ? subcategories && content : content}
        {isFetchingNextPage && (
          <div className="flex justify-center mt-24">
            <RotatingLines
              strokeColor="white"
              strokeWidth="3"
              animationDuration="0.75"
              width="40"
              visible={true}
            />
          </div>
        )}
        {!isLoading && !data?.pages[0]?.length && (
          <p className="text-xl text-white py-4">No results.</p>
        )}
      </main>
    </>
  );
};

Search.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context: any) {
  let data = null;
  let { page, query, brand, category, subcategory } = context.query;
  let incoming: any = {
    page: page || 1,
    query: query,
    brand: brand,
    subcategory: subcategory,
    category: category,
  };
  let params: any = {};
  let breadcrumbs = '';
  let title: string = query
    ? `Search results`
    : brand
    ? brand
    : subcategory
    ? subcategory
    : category
    ? category
    : `Products`;

  Object.keys(incoming).forEach((item) => {
    if (incoming[item]) {
      params[item] = incoming[item];

      if (item === 'query') {
        breadcrumbs += ` ${startCase(params[item])}`;
      } else if (item === 'subcategory') {
        breadcrumbs += `${startCase(params['category'])} > ${startCase(
          params[item]
        )}`;
      } else if (item !== 'page') {
        breadcrumbs += ` > ${startCase(params[item])}`;
      }
    }
  });

  return {
    props: {
      data,
      title,
      category: category || null,
      breadcrumbs,
    },
  };
}

function getSubstring(string: string, char1: string, char2: string) {
  return string.slice(string.indexOf(char1), string.lastIndexOf(char2));
}

export default Search;
