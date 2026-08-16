const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

// GET /api/exchange-rate?c=USD
router.get('/', async (req, res) => {
  const currency = req.query.c || 'USD';

  // For now: hardcoded rates (replace with RBI scraper or API)
  const rates = {
    USD: 85.45, EUR: 93.20, GBP: 108.50,
    AED: 23.27, JPY: 0.55, CNY: 11.85
  };

  res.json({
    currency,
    rate: rates[currency] || null,
    date: new Date().toISOString().split('T')[0],
    source: 'RBI Reference Rate'
  });
});

module.exports = router;