const jwt = require('jsonwebtoken');

function auth(requiredRole = null) {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) throw { status: 401, message: 'Unauthorized' };
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = payload;
      if (requiredRole && payload.role !== requiredRole) {
        throw { status: 403, message: 'Forbidden' };
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { auth };


