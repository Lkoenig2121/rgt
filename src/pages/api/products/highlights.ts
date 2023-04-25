import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/db/client';
import { Product } from '@prisma/client';

/**
 * GET /api/products/highlights
 *
 * Fetch Products for Home page display
 */
const Highlights = async (req: NextApiRequest, res: NextApiResponse) => {
  let result = [];
  try {
    const commGasRanges = await prisma.product.findFirst({
      where: {
        categoryLevel1_tx: 'Commercial Gas Ranges',
      },
      include: {
        brand: true,
      },
    });
    result.push(commGasRanges);
    const gasGriddlesAndGrills = await prisma.product.findFirst({
      where: {
        categoryLevel1_tx: 'Gas Griddles & Flat Top Grills',
      },
      include: {
        brand: true,
      },
    });
    result.push(gasGriddlesAndGrills);
    const displayCases = await prisma.product.findFirst({
      where: {
        categoryLevel1_tx: 'Countertop Display Refrigerators',
      },
      include: {
        brand: true,
      },
    });
    result.push(displayCases);
    const commMixers = await prisma.product.findFirst({
      where: {
        categoryLevel1_tx: 'Commercial Mixers',
      },
      include: {
        brand: true,
      },
    });
    result.push(commMixers);
    const warmingHolding = await prisma.product.findFirst({
      where: {
        categoryLevel0_tx: 'Warming, Holding',
      },
      include: {
        brand: true,
      },
    });
    result.push(warmingHolding);
    const walkinCoolerAndFridge = await prisma.product.findFirst({
      where: {
        categoryLevel1_tx: 'Walk In Coolers & Refrigerators',
      },
      include: {
        brand: true,
      },
    });
    result.push(walkinCoolerAndFridge);
    const refridgeAndIce = await prisma.product.findFirst({
      where: {
        categoryLevel0_tx: 'Refrigeration & Ice',
      },
      include: {
        brand: true,
      },
    });
    result.push(refridgeAndIce);
    const gasFryers = await prisma.product.findFirst({
      where: {
        categoryLevel1_tx: 'Gas Floor Fryers',
      },
      include: {
        brand: true,
      },
    });
    result.push(gasFryers);
    const worktables = await prisma.product.findFirst({
      where: {
        categoryLevel1_tx: 'Stainless Steel Worktables',
      },
      include: {
        brand: true,
      },
    });
    result.push(worktables);
    res.json({
      success: true,
      data: result,
      error: null,
    });
  } catch (err) {
    console.log('Failed to fetch Product.');
    console.log(err);
    res.status(500).send({ success: false, error: err });
  }
};

export default Highlights;
