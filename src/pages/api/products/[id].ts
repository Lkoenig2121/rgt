import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/db/client';

/**
 * GET /api/products/{id}
 *
 * Fetch Product by ID
 */
const ProductByID = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const { id }: any = query;

  try {
    const product = await prisma.product.findFirst({
      where: {
        id: id,
      },
      include: {
        brand: true,
      },
    });
    res.json({
      success: true,
      data: product,
      error: null,
    });
  } catch (err) {
    console.log('Failed to fetch Product.');
    console.log(err);
    res.status(500).send({ success: false, error: err });
  }
};

export default ProductByID;
