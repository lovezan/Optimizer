import express from 'express';
import cors from 'cors';
import { initializeDatabase, saveOptimization, getOptimizationHistory, getAllOptimizations } from './database.js';
import { fetchAmazonProduct } from './scraper.js';
import { optimizeProductListing } from './ai.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

await initializeDatabase();

app.post('/api/optimize', async (req, res) => {
  try {
    const { asin } = req.body;

    if (!asin || !/^[A-Z0-9]{10}$/.test(asin)) {
      return res.status(400).json({
        error: 'Invalid ASIN format. ASIN should be 10 alphanumeric characters.'
      });
    }

    console.log(`📦 Fetching product data for ASIN: ${asin}`);
    const productData = await fetchAmazonProduct(asin);

    console.log(`🤖 Optimizing listing with AI...`);
    const optimized = await optimizeProductListing(productData);

    const optimizationData = {
      asin: productData.asin,
      original_title: productData.title,
      original_bullets: productData.bullets,
      original_description: productData.description,
      optimized_title: optimized.title,
      optimized_bullets: optimized.bullets,
      optimized_description: optimized.description,
      keywords: optimized.keywords
    };

    console.log(`💾 Saving optimization to database...`);
    const id = await saveOptimization(optimizationData);

    res.json({
      id,
      ...optimizationData
    });

  } catch (error) {
    console.error('Error in /api/optimize:', error);
    res.status(500).json({
      error: error.message || 'Failed to optimize product listing'
    });
  }
});

app.get('/api/history/:asin', async (req, res) => {
  try {
    const { asin } = req.params;
    const history = await getOptimizationHistory(asin);
    res.json(history);
  } catch (error) {
    console.error('Error in /api/history:', error);
    res.status(500).json({
      error: 'Failed to fetch optimization history'
    });
  }
});

app.get('/api/optimizations', async (req, res) => {
  try {
    const optimizations = await getAllOptimizations();
    res.json(optimizations);
  } catch (error) {
    console.error('Error in /api/optimizations:', error);
    res.status(500).json({
      error: 'Failed to fetch optimizations'
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health\n`);
});
