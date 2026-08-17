const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../lib/supabase.js');
const { JWT_SECRET, authMiddleware } = require('../middleware/auth.js');

// POST /api/auth/register (Deprecated - use Supabase Auth client-side)
router.post('/register', async (req, res) => {
  res.status(410).json({ error: 'Endpoint deprecated. Please register directly using Supabase Auth on the frontend.' });
});

// POST /api/auth/login (Deprecated - use Supabase Auth client-side)
router.post('/login', async (req, res) => {
  res.status(410).json({ error: 'Endpoint deprecated. Please login directly using Supabase Auth on the frontend.' });
});

// POST /api/auth/check-email - Check if email is registered
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firmName: user.firm_name,
      phone: user.phone,
      plan: user.plan,
      extractionsUsed: user.extractions_used,
      gstNumber: user.gst_number,
      chaLicenceNo: user.cha_licence_no,
      contactPerson: user.contact_person
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/auth/upgrade - Upgrade user plan
router.patch('/upgrade', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!['demo', 'pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    if (['pro', 'enterprise'].includes(plan)) {
      return res.status(403).json({ error: 'Instant automatic upgrade is disabled. Please contact support/WhatsApp for manual verification.' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({ plan })
      .eq('id', req.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      id: user.id, email: user.email,
      firmName: user.firm_name, phone: user.phone,
      plan: user.plan, extractionsUsed: user.extractions_used,
      gstNumber: user.gst_number
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/auth/profile - Update user profile details during/after registration
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const { firmName, phone, chaLicenceNo, contactPerson, gstNumber } = req.body;

    // Check if user exists in public.users
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', req.userId)
      .maybeSingle();

    let query;
    if (existingUser) {
      query = supabase
        .from('users')
        .update({
          firm_name: firmName,
          gst_number: gstNumber,
          phone: phone,
          cha_licence_no: chaLicenceNo || null,
          contact_person: contactPerson || null,
        })
        .eq('id', req.userId);
    } else {
      query = supabase
        .from('users')
        .insert({
          id: req.userId,
          email: req.userEmail,
          firm_name: firmName,
          gst_number: gstNumber,
          phone: phone,
          cha_licence_no: chaLicenceNo || null,
          contact_person: contactPerson || null,
          plan: 'demo',
          extractions_used: 0
        });
    }

    const { data: user, error } = await query.select().single();
    if (error) throw error;

    res.json({
      id: user.id,
      email: user.email,
      firmName: user.firm_name,
      phone: user.phone,
      plan: user.plan,
      extractionsUsed: user.extractions_used,
      gstNumber: user.gst_number,
      chaLicenceNo: user.cha_licence_no,
      contactPerson: user.contact_person
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;