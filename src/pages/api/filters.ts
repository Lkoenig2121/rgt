import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../server/db/client';

/**
 * GET /api/filters
 *
 * Fetch all filters
 */
const filters = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { category } = req.query;
    const subcategories = (
      await prisma?.category_Level_0.findFirst({
        where: {
          name: category as string,
        },
        include: {
          subcategories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
    )?.subcategories.sort((a, b) => a.name.localeCompare(b.name));
    res.json({
      success: true,
      data: subcategories,
      error: null,
    });
  } catch (err) {
    console.log('Failed to fetch highlights.');
    console.log(err);
    res.status(500).send({ success: false, error: err });
  }
};

export default filters;
