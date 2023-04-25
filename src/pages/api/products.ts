import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../server/db/client';

const DEFAULT_PAGE_SIZE = 20;

type Query = {
  brand?: string;
  category?: string;
  subcategory?: string;
  page?: string;
  limit?: string;
  query?: string;
};

/**
 * GET /api/products
 *
 * Fetch all products
 */
const products = async (req: NextApiRequest, res: NextApiResponse) => {
  const { brand, category, subcategory, page, limit, query }: Query = req.query;
  let pg = parseInt(page!);
  if (pg) {
    pg = pg - 1;
  }
  try {
    const products = await prisma.product.findMany({
      skip: (pg && DEFAULT_PAGE_SIZE * pg) || 0,
      take: (limit && parseInt(limit)) || DEFAULT_PAGE_SIZE,
      where: {
        brand_tx: brand,
        categoryLevel0_tx: category,
        categoryLevel1_tx: subcategory,
        name: {
          search: query,
        },
        sku: {
          search: query,
        },
      },
    });
    res.json({
      success: true,
      data: products,
      error: null,
    });
  } catch (err) {
    console.log('Failed to fetch products.');
    console.log(err);
    res.status(500).send({ success: false, error: err });
  }
};

export default products;
