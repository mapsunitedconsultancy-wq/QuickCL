const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');

// GET /api/clients
router.get('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabase.from('clients')
    .select('*').eq('user_id', req.userId).order('client_name');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/clients
router.post('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabase.from('clients')
    .insert({ ...req.body, user_id: req.userId }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PATCH /api/clients/:id
router.patch('/:id', authMiddleware, async (req, res) => {
  const { data, error } = await supabase.from('clients')
    .update({ ...req.body, updated_at: new Date() })
    .eq('id', req.params.id).eq('user_id', req.userId).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /api/clients/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  const { error } = await supabase.from('clients')
    .delete().eq('id', req.params.id).eq('user_id', req.userId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;