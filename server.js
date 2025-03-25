// Importing the required modules
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { JSDOM } from 'jsdom';

// Server Configuration
const app = express();
const PORT = 3000;

app.use(cors());

// Creating an Amazon Search URL
const scrapeAmazon = async (keyword) => {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

  // Defining Custom Headers
  const customHeaders = {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    Host: 'www.amazon.com',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:88.0) Gecko/20100101 Firefox/88.0',
    Pragma: 'no-cache',
    TE: 'Trailers',
    'Upgrade-Insecure-Requests': 1,
  };
  // Request to amazon
  try {
    const { data: html, status } = await axios.get(url, { headers: customHeaders });

    if (status !== 200) {
      throw new Error('Failed to fetch the Amazon page, status code: ' + status);
    }

    // Creating the DOM with JSDOM
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Selecting product elements
    const productElements = document.querySelectorAll('[role="listitem"]');
    // Product data collection
    const products = Array.from(productElements)
      .map((item) => {
        const title = item.querySelector('h2')?.textContent || '';
        const rating = item.querySelector('.a-popover-trigger .a-icon-star-small .a-icon-alt')?.textContent.trim() || undefined;
        const reviews = item.querySelector('.a-declarative a span.a-size-base')?.textContent.trim() || undefined;
        const image = item.querySelector('.s-image')?.getAttribute('src') || '';
        const link = item.querySelector('.a-link-normal')?.getAttribute('href') || '';
        // Filtering invalid products
        if (!title || !image || !reviews || !rating || !link) {
          return null;
        }

        return { title, image, link, rating, reviews };
      })
      .filter(Boolean);

    return products;
  } catch (error) {
    console.error('Error scraping Amazon:', error.message);
    throw new Error('Failed to scrape data');
  }
};

// API route for scraping
app.get('/api/scrape', async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }
  // Calls the scrape function and returns the products
  try {
    const products = await scrapeAmazon(keyword);
    res.json({ keyword, products });
  } catch (error) {
    console.error('Error scraping Amazon:', error.message);
    res.status(500).json({ error: 'Failed to fetch the page', details: error.message });
  }
});

// Simple Home Page
app.get('/', (req, res) => {
  res.send('API is running! Use /api/scrape?keyword=yourKeyword');
});

// Start the server on port 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});