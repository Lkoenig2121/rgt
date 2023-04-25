import { ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import { RotatingLines } from 'react-loader-spinner';
import config from '../../config';
import Layout from '../../components/layout';
import Link from 'next/link';
import { Navigation, useNavigationContext } from '../../context';
import Head from 'next/head';
import { Product } from '@prisma/client';
import { BsFillCheckCircleFill } from 'react-icons/bs';

type Props = {
  data: Product | null;
};

const ProductDetails = ({ data: product }: Props) => {
  const { setNavbarOpen, setCurrentNav } = useNavigationContext();
  return (
    <>
      <Head>
        <title>R.G.T Restaurant Equipment | Product Details</title>
      </Head>
      <main className="px-6 pb-24 w-full mx-auto">
        <p className="text-sm text-white py-4">
          {`${product?.categoryLevel0_tx} > ${product?.categoryLevel1_tx}`}
        </p>
        <div className="flex flex-col bg-white rounded pb-8 mx-auto">
          <p className="text-sm text-left px-4 pt-4 text-blue-500 font-semibold">
            {product?.brand_tx}
          </p>
          <p className="text-xl text-left px-4 pt-2 pb-2 text-black font-semibold">
            {product?.name}
          </p>
          <img
            alt="logo"
            src={product?.imageUrl || ''}
            width="100"
            height="100"
            decoding="async"
            data-nimg="1"
            className="px-4 pt-4 pb-4 h-[350px] max-w-full object-contain w-full"
            loading="lazy"
          />
          <p className="text-3xl text-left p-4 font-bold text-black">
            {product?.price_tx}
          </p>
          {product?.features && (
            <div className="pb-4">
              {(product.features as any).map((f: any, idx: number) => (
                <div key={idx} className="flex flex-row items-center px-4">
                  <BsFillCheckCircleFill className="text-green-500 text-xl" />
                  <p className="flex text-lg text-left px-4 py-2 text-black">
                    {f}
                  </p>
                </div>
              ))}
            </div>
          )}
          {product?.description && (
            <>
              <p className="text-xl text-left px-4 pt-2 pb-2 font-bold text-black">
                Description
              </p>
              <p className="text-xl text-left px-4 pt-2 pb-4 text-black">
                {product.description}
              </p>
            </>
          )}
          {product?.specs && (
            <>
              <p className="text-xl text-left px-4 pt-2 pb-2 font-bold text-black">
                Specification
              </p>
              <div className="px-4 py-2">
                <table className="w-full">
                  <tbody>
                    {(product?.specs as any)?.map((s: any, idx: number) => (
                      <tr key={idx} className="even:bg-gray-100">
                        <th className="text-black text-left px-4 py-2">
                          {Object.keys(s)[0]}
                        </th>
                        <td className="text-black text-left px-4 py-2">
                          {s[Object.keys(s)[0] as any]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {product?.specSheetUrl && (
            <>
              <p className="text-xl text-left px-4 pt-4 pb-2 font-bold text-black">
                View Spec Sheet
              </p>
              <a
                target="_blank"
                rel="noreferrer"
                href={product?.specSheetUrl}
                className="px-4 underline text-blue-500"
              >
                Download Spec Sheet
              </a>
            </>
          )}
          {product?.warranty && (
            <>
              <p className="text-xl text-left px-4 pt-4 pb-2 font-bold text-black">
                Warranty
              </p>
              <p className="text-xl text-left px-4 pt-2 pb-2 text-black">
                {product?.warranty}
              </p>
            </>
          )}

          {product?.approval && (
            <>
              <p className="text-xl text-left px-4 pt-2 pb-2 font-bold text-black">
                Approval
              </p>
              <p className="text-xl text-left px-4 pt-2 pb-4 text-black">
                {product?.approval}
              </p>
            </>
          )}

          {product?.brand_tx && (
            <>
              <p className="text-xl text-left px-4 pt-2 pb-2 font-bold text-black">
                View more from {product.brand_tx}
              </p>

              <Link
                href={`/search?page=1&brand=${encodeURI(
                  product.brand_tx
                ).replaceAll(`&`, `%26`)}`}
                className="text-center cursor-pointer text-black flex justify-center"
                onClick={(e) => {
                  setNavbarOpen(false);
                  setCurrentNav(Navigation.Detail);
                }}
              >
                <img
                  alt="logo"
                  src={(product as any).brand?.logoUrl || ''}
                  width="100"
                  height="100"
                  decoding="async"
                  data-nimg="1"
                  className="px-4 pt-4 pb-4 h-[100px] max-w-full object-contain w-full"
                  loading="lazy"
                />
              </Link>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default ProductDetails;

ProductDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context: any) {
  let data = null;
  let { query } = context;
  let { productId } = query;
  const url = `${process.env.PUBLIC_DOMAIN}/api/products/${productId}`;
  try {
    const response: any = await (await fetch(url)).json();
    if (response && response.data) {
      data = response.data;
    }
  } catch (error: any) {
    return { props: {} };
  }

  return {
    props: {
      data,
    },
  };
}
