# R.G.T Restaurant Equipment

## Website

The website is built using Next.js 13, React, Typescript, Prisma and Tailwind.

## Database

The database is MySQL hosted in the Cloud via Planetscale

## Data Pipeline

The raw unstructured data comes in as a PDF doc from the vendor. Then it is converted to a CSV via https://www.zamzar.com. Next the CSV is manually cleaned up and trimmed down to a single column containing only the SKU's for each item from the vendor. Then, a script will map over each item in the CSV and query the search index for details for each SKU, e.g. Brand, Description, Category, Price, Images. Then, the script will navigate to a detail webpage and scrape more information for a given product. Last the data will be inserted into the database.
