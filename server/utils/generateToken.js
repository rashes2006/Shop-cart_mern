const jwt = require('jsonwebtoken');

const generateToken = (res, customerId) => {
  const token = jwt.sign({ id: customerId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true, // Prevents client-side XSS attacks from reading the cookie
    secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
    sameSite: 'lax', // 'lax' needed for cross-port dev, use 'strict' in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

module.exports = generateToken;
