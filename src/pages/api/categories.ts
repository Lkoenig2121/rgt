import type { NextApiResponse } from 'next';
import { prisma } from '../../server/db/client';

/**
 * GET /api/categories
 *
 * Fetch all `level-0` categories
 */
const categories = async (req: any, res: NextApiResponse) => {
  try {
    const categories = await prisma.category_Level_0.findMany({
      orderBy: {
        products: {
          _count: 'desc',
        },
      },
    });
    res.json({
      success: true,
      data: categories,
      error: null,
    });
  } catch (err) {
    console.log('Failed to fetch categories.');
    console.log(err);
    res.status(500).send({ success: false, error: err });
  }
};

export default categories;
