import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../server/db/client';

/**
 * GET /api/brands
 *
 * Fetch all brands
 */
const brands = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const { master } = query;
  const where: any =
    (master && {
      where: {
        master_fg: (master && Boolean(master)) || null,
      },
    }) ||
    {};

  try {
    const brands = await prisma.brand.findMany({
      ...where,
      orderBy: {
        products: {
          _count: 'desc',
        },
      },
    });
    res.json({
      success: true,
      data: brands,
      error: null,
    });
  } catch (err) {
    console.log('Failed to fetch brands.');
    console.log(err);
    res.status(500).send({ success: false, error: err });
  }
};

export default brands;
