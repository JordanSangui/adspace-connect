import rateLimit from 'express-rate-limit';

/**
 * Limite générale appliquée à toutes les routes.
 * 100 requêtes max par fenêtre de 15 minutes.
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: { error: 'Trop de requêtes, réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Limite stricte pour les routes d'authentification (login, register).
 * 5 requêtes max par fenêtre de 15 minutes.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { error: 'Trop de tentatives. Compte temporairement bloqué, réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export { globalLimiter, authLimiter };
