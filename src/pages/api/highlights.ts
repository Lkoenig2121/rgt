import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../server/db/client';

/**
 * GET /api/highlights
 *
 * Fetch all highlights
 */
const highlights = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const highlights = await prisma.highlight.findMany();
    res.json({
      success: true,
      data: highlights,
      error: null,
    });
  } catch (err) {
    console.log('Failed to fetch highlights.');
    console.log(err);
    res.status(500).send({ success: false, error: err });
  }
};

export default highlights;
