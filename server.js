import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { JSDOM } from 'jsdom';

const app = express();
const PORT = 3000;

app.use(cors());

// Função para fazer scraping no Amazon
const scrapeAmazon = async (keyword) => {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

  const customHeaders = {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    Host: 'www.amazon.com',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:88.0) Gecko/20100101 Firefox/88.0',
    Pragma: 'no-cache',
    TE: 'Trailers',
    'Upgrade-Insecure-Requests': 1,
  };

  try {
    // Enviando a requisição com cabeçalhos customizados
    const { data: html, status } = await axios.get(url, { headers: customHeaders });

    if (status !== 200) {
      throw new Error('Failed to fetch the Amazon page, status code: ' + status);
    }

    // Criando o DOM com jsdom
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Buscando os produtos na página
    const productElements = document.querySelectorAll('[role="listitem"]');
    const products = Array.from(productElements)
      .map((item) => {
        const title = item.querySelector('h2')?.textContent || '';
        const rating = item.querySelector('.a-popover-trigger .a-icon-star-small .a-icon-alt')?.textContent.trim() || undefined;
        const reviews = item.querySelector('.a-declarative a span.a-size-base')?.textContent.trim() || undefined;
        const image = item.querySelector('.s-image')?.getAttribute('src') || '';
        const link = item.querySelector('.a-link-normal')?.getAttribute('href') || '';

        if (!title || !image || !reviews || !rating || !link) {
          return null; // Retorna null para os produtos que não tem título ou imagem
        }

        return { title, image, link, rating, reviews };
      })
      .filter(Boolean); // Remover produtos sem título

    return products;
  } catch (error) {
    console.error('Error scraping Amazon:', error.message);
    throw new Error('Failed to scrape data');
  }
};

// Rota da API para fazer scraping
app.get('/api/scrape', async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  try {
    const products = await scrapeAmazon(keyword);
    res.json({ keyword, products });
  } catch (error) {
    console.error('Error scraping Amazon:', error.message);
    res.status(500).json({ error: 'Failed to fetch the page', details: error.message });
  }
});

// Rota principal
app.get('/', (req, res) => {
  res.send('API is running! Use /api/scrape?keyword=yourKeyword');
});

// Inicializando o servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});