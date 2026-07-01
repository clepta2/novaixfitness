const supabase = require('../config/supabase');

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const userRole = req.user.app_metadata?.role || 'user';

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Acesso negado. Privilégios insuficientes.' });
    }

    req.userRole = userRole;
    next();
  };
};

module.exports = { requireRole };
