import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../server/db/client';
import fetch from 'node-fetch';
import fs from 'fs';
import csv from 'csv-parser';
import puppeteer from 'puppeteer';
import { load } from 'cheerio';
import chrome from 'chrome-aws-lambda';
import { kebabCase } from 'lodash';

const CSV_FILE_PATH = `data/load.csv`;
const DATA_LOAD_DELAY = 10000;

/**
 * GET /api/vendor-data-load
 *
 * Load data from vendor into the system
 */
const dataVendorLoad = async (req: any, res: NextApiResponse) => {
  if (process.env.VENDOR_DATA_LOAD_FF === 'true') {
    try {
      // read csv data and map to products
      readCsvFile<{ sku: string }[]>(CSV_FILE_PATH, mapCsvDataToProducts);

      // backfill brand logo images
      updateBrandsLogo();

      // link categories <> sub categories
      linkCategoriesAndSubcategories();

      // Run several queries to generate the highlights to show on the homepage
      generateHighlights();

      res.send({ success: true });
    } catch (err) {
      console.log(err);
      res.status(500).send({ success: false });
    }
  } else {
    res.send({ success: false });
  }
};

// throttled forEach
function forEachWithDelay<T>(
  array: T[],
  callback: (a: T | undefined, idx: number, b: T[]) => void,
  delay: number
) {
  let i = 0;
  let interval = setInterval(() => {
    callback(array[i], i, array);
    if (++i === array.length) clearInterval(interval);
  }, delay);
}

// read csv data
function readCsvFile<T>(filePath: string, callback: (data: T[]) => void) {
  const results: T[] = [];
  fs.createReadStream(filePath)
    .pipe(
      csv({
        mapHeaders: () => 'sku',
      })
    )
    .on('data', (data) => results.push(data))
    .on('end', () => {
      let res = results.map((r: any) => r.sku);
      callback(res);
    });
}

// map csv data to products
// 1. parse CSV, map over each SKU
// 2. fetch product details from source 1 via API, for each SKU, and insert into DB
// 3. fetch more product details from source 2 via web scraping, for each SKU, and insert into DB
function mapCsvDataToProducts<T>(results: T[]) {
  const algoliaAgent = `Algolia%20for%20vanilla%20JavaScript%203.30.0%3BMagento2%20integration%20(2.0.2)%3Bautocomplete.js%200.26.0`;
  const algoliaApplicationId = `DM5Y0YPDV5`;
  const algoliaApiKey = `ZjYxMGQwZmY2Y2MyMTkxNTI2ZTBkMDUyZDMzZmYzZTkzOWQ2NDVlNTczYzZiNzFlNDAwNzUwMmE2N2UxYTNmMnRhZ0ZpbHRlcnM9`;
  const algoliaQueryParams = `query?x-algolia-agent=${algoliaAgent}&x-algolia-application-id=${algoliaApplicationId}&x-algolia-api-key=${algoliaApiKey}`;
  const algoliaApiUrl = `https://dm5y0ypdv5-dsn.algolia.net`;

  forEachWithDelay(
    results,
    async (row: any, i: number) => {
      // query search and get some details
      const { hits } = (await (
        await fetch(
          `${algoliaApiUrl}/1/indexes/live_kitchenall_default_products/${algoliaQueryParams}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              params: `query=${row}&hitsPerPage=1&analyticsTags=autocomplete&clickAnalytics=true&facets=%5B%22categories.level0%22%5D&numericFilters=visibility_search%3D1&ruleContexts=%5B%22magento_filters%22%2C%22%22%5D`,
            }),
          }
        )
      ).json()) as any;
      const rawDetails: any = hits[0];

      // scrape web page to get more details
      let scrapeData: any = {};
      const detailsPage = rawDetails?.url;
      const exePath =
        process.platform === 'win32'
          ? 'C:Program Files (x86)GoogleChromeApplicationchrome.exe'
          : process.platform === 'linux'
          ? '/usr/bin/google-chrome'
          : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
      const getPuppeteerOptions = async () => {
        let options;
        if (process.env.NODE_ENV === 'production') {
          options = {
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
          };
        } else {
          options = {
            args: [],
            executablePath: exePath,
            headless: true,
          };
        }
        return options;
      };
      try {
        // selectors
        const descriptionSelector = `.product.description > div.value > p`;
        const warrantySelector = `.product.product_warranty_select > div.value`;
        const specSheetSelector = `.product.product_spec_sheet > a`;
        const featuresSelector = `.product.bullet-points-description li`;
        const specsSelector = `#product-attribute-specs-table > tbody > tr`;
        const approvalsSelector = `.product.approval > div.value`;
        // setup puppeteer
        const puppeteerOptions = await getPuppeteerOptions();
        const browser = await puppeteer.launch(puppeteerOptions);
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (request) => {
          if (request.resourceType() === `document`) {
            request.continue();
          } else {
            request.abort();
          }
        });
        // navigate to details page
        await page
          .goto(detailsPage, { timeout: 0 })
          .then(async (response) => {});
        const html = await page.evaluate(() => {
          return document && document.querySelector('body')?.innerHTML;
        });
        // load html content
        const $ = load(html!);
        // parse data via cheerio selectors
        // description
        $(descriptionSelector).each((i, elem) => {
          scrapeData['description'] = $(elem).text();
        });
        // warranty
        $(warrantySelector).each((i, elem) => {
          scrapeData['warranty'] = $(elem).text();
        });
        // Approval
        $(approvalsSelector).each((i, elem) => {
          scrapeData['approval'] = $(elem).text();
        });
        // spec sheet url
        $(specSheetSelector).each((i, elem) => {
          scrapeData['specSheet'] = $(elem).attr('href');
        });
        // features
        scrapeData['features'] = [];
        $(featuresSelector)
          .each((i, el) => {
            scrapeData['features'].push($(el).text().trim());
          })
          .get();
        // specs table
        const specsTableData: any = [];
        $(specsSelector).each((index, element) => {
          const th = $(element).find('th');
          const key = $(th).text();
          const td = $(element).find('td');
          const tableRow: any = {};
          tableRow[key] = $(td).text();
          specsTableData.push(tableRow);
        });
        scrapeData['specs'] = specsTableData;

        await browser.close();
      } catch (error) {
        return console.error(error);
      }

      // insert into DB

      // check if brand exists otherwise create
      let brand = await prisma.brand.findUnique({
        where: {
          name: rawDetails?.shopbybrand,
        },
      });
      if (!brand) {
        brand = await prisma.brand.create({
          data: {
            name: rawDetails?.shopbybrand,
          },
        });
      }

      // check if categoryLevel0 exists otherwise create
      let categoryLevel0 = await prisma.category_Level_0.findUnique({
        where: {
          name: rawDetails?.categories?.level0[0],
        },
      });
      if (!categoryLevel0) {
        categoryLevel0 = await prisma.category_Level_0.create({
          data: {
            name: rawDetails?.categories?.level0[0],
          },
        });
      }

      // check if categoryLevel1 exists otherwise create
      let categoryLevel1;
      if (rawDetails?.categories_without_path[0]) {
      }
      categoryLevel1 = await prisma.category_Level_1.findUnique({
        where: {
          name: rawDetails?.categories_without_path[0],
        },
      });
      if (!categoryLevel1) {
        categoryLevel1 = await prisma.category_Level_1.create({
          data: {
            name: rawDetails?.categories_without_path[0],
          },
        });
      }

      // create Product
      const product = await prisma.product.create({
        data: {
          name: rawDetails?.name,
          categoryLevel0_tx: rawDetails?.categories?.level0[0],
          categoryLevel1_tx: rawDetails?.categories_without_path[0],
          thumbnailUrl: rawDetails?.thumbnail_url,
          imageUrl: rawDetails?.image_url,
          sku: rawDetails?.sku,
          price: rawDetails?.price?.USD?.default,
          price_tx: rawDetails?.price?.USD?.default_formated,
          brand_tx: rawDetails?.shopbybrand,
          description: scrapeData?.description,
          approval: scrapeData?.approval,
          warranty: scrapeData?.warranty,
          specSheetUrl: scrapeData?.specSheet,
          specs: scrapeData?.specs,
          features: scrapeData?.features,
        },
      });

      // if not null update relationship with product

      if (brand) {
        await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            brand: {
              connect: {
                id: brand.id,
              },
            },
          },
        });
      }

      if (categoryLevel0) {
        await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            categoryLevel0: {
              connect: {
                id: categoryLevel0.id,
              },
            },
          },
        });
      }

      if (categoryLevel1) {
        await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            categoryLevel1: {
              connect: {
                id: categoryLevel1.id,
              },
            },
          },
        });
      }
    },
    DATA_LOAD_DELAY
  );
}

// backfill brand logo images
// 1. iterate through each brand in our DB
// 2. scrape a brand web page to fetch logo image for each brand
// 3. save to DB
async function updateBrandsLogo() {
  const brands = await prisma.brand.findMany();
  forEachWithDelay(
    brands,
    async (row: any, i: number) => {
      // scrape web page to get more details
      let scrapeData: any = {};
      const webpage = `https://www.kitchenall.com/${kebabCase(row.name)}`;
      const exePath =
        process.platform === 'win32'
          ? 'C:Program Files (x86)GoogleChromeApplicationchrome.exe'
          : process.platform === 'linux'
          ? '/usr/bin/google-chrome'
          : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
      const getPuppeteerOptions = async () => {
        let options;
        if (process.env.NODE_ENV === 'production') {
          options = {
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
          };
        } else {
          options = {
            args: [],
            executablePath: exePath,
            headless: true,
          };
        }
        return options;
      };
      try {
        // selectors
        const logoSelector = `.product-brend-photo > img`;
        // setup puppeteer
        const puppeteerOptions = await getPuppeteerOptions();
        const browser = await puppeteer.launch(puppeteerOptions);
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (request) => {
          if (request.resourceType() === `document`) {
            request.continue();
          } else {
            request.abort();
          }
        });
        // navigate to details page
        await page.goto(webpage, { timeout: 0 }).then(async (response) => {});
        const html = await page.evaluate(() => {
          return document && document.querySelector('body')?.innerHTML;
        });
        // load html content
        const $ = load(html!);
        // parse data via cheerio selectors
        // logo url
        $(logoSelector).each((i, elem) => {
          scrapeData['logo'] = $(elem).attr('src');
        });
        await browser.close();
      } catch (error) {
        return console.error(error);
      }

      // insert into DB

      // update Brand
      await prisma.brand.update({
        where: {
          id: row.id,
        },
        data: {
          logoUrl: scrapeData['logo'],
        },
      });
    },
    DATA_LOAD_DELAY
  );
}

// link categories <> sub categories
// 1. iterate through each subcategory in our DB
// 2. get the parent category for the current subcategory
// 3. add the relation to the Category in our DB
async function linkCategoriesAndSubcategories() {
  const subcategories = await prisma.category_Level_1.findMany();
  forEachWithDelay(
    subcategories,
    async (sc, i: number) => {
      // get the Category ID for the current subcategory
      const categoryId = (
        await prisma.product.findFirst({
          where: {
            categoryLevel1Id: sc?.id,
          },
        })
      )?.categoryLevel0Id;

      // update Category
      if (categoryId) {
        await prisma.category_Level_0.update({
          where: {
            id: categoryId,
          },
          data: {
            subcategories: {
              connect: {
                id: sc?.id,
              },
            },
          },
        });
      }
    },
    DATA_LOAD_DELAY
  );
}

// Run several queries to generate the highlights to show on the homepage
async function generateHighlights() {
  const { data: highlights }: any = await (
    await fetch(
      `http://${process.env.HOST}:${process.env.PORT}/api/products/highlights`
    )
  ).json();
  await prisma.highlight.createMany({
    data: highlights,
  });
}

export default dataVendorLoad;
