import { Request, Response, NextFunction } from 'express';

/**
 * Génère un middleware de vérification de rôle.
 * Toujours utilisé après requireAuth.
 *
 * @example
 * router.get('/admin/users', requireAuth, requireRole('admin'), handler)
 * router.post('/venues', requireAuth, requireRole('owner'), handler)
 * router.post('/offers', requireAuth, requireRole('agency'), handler)
 */
function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentification requise." });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: "Accès refusé. Vous n'avez pas les permissions nécessaires.",
        required: roles,
        current: req.user.role,
      });
      return;
    }

    next();
  };
}

export { requireRole };
