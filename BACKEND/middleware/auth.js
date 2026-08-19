const supabase = require('../lib/supabase.js');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is missing.');
}

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer xxx"

  if (!token) {
    return res.status(401).json({ error: 'No token provided. Please login.' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
    }

    req.userId = user.id;  // Syncs to the UUID from auth.users
    req.userEmail = user.email;
    next();  // Continue to the actual route
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
  }
}

module.exports = { authMiddleware, JWT_SECRET };