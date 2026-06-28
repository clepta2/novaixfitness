// src/middleware/audit.js
// Middleware de auditoria para operações importantes - NOVAIX FITNESS

const supabase = require('../config/supabase');

const logAudit = async (userId, action, details = {}) => {
  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      details,
      ip_address: details.ip || 'unknown',
      user_agent: details.userAgent || 'unknown',
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Erro ao registrar auditoria:', err.message);
  }
};

const audit = (action) => (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(body) {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      const userId = req.user?.id || 'anonymous';
      logAudit(userId, action, {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        ip: req.ip || req.connection?.remoteAddress,
        userAgent: req.get('user-agent'),
        body: req.method !== 'GET' ? req.body : undefined,
      });
    }
    originalSend.call(this, body);
  };
  
  next();
};

const auditAuth = audit('auth_action');
const auditProfile = audit('profile_update');
const auditPayment = audit('payment_action');
const auditWorkout = audit('workout_action');
const auditAdmin = audit('admin_action');
const auditDataExport = audit('data_export');
const auditDataDeletion = audit('data_deletion');

module.exports = {
  logAudit,
  audit,
  auditAuth,
  auditProfile,
  auditPayment,
  auditWorkout,
  auditAdmin,
  auditDataExport,
  auditDataDeletion,
};
