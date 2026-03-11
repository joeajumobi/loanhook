import jwt from 'jsonwebtoken';

// Acts as security for protected routes that access mock/user data.
// After signup or login, the frontend stores a JWT token.
// When the frontend makes a request, it sends that token in the Authorization header.
// This middleware verifies the token exists and is valid before allowing access.
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;