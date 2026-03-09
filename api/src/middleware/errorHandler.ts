import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { config } from '../config';

/**
 * Middleware de gestion centralisée des erreurs.
 * Doit être monté en dernier app.use() après toutes les routes.
 * La signature à 4 paramètres indique à Express qu'il s'agit d'un error handler.
 */
function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  // 1. Erreur de validation Zod
  if (err instanceof ZodError || err.name === 'ZodError') {
    res.status(400).json({
      error: 'Données invalides',
      details: err.errors,
    });
    return;
  }

  // 2. Erreur avec un statusCode ou status défini (erreurs personnalisées)
  if (err.statusCode || err.status) {
    const status = err.statusCode || err.status;
    res.status(status).json({ error: err.message });
    return;
  }

  // 3. Toutes les autres erreurs (erreurs inattendues)
  console.error('[ErrorHandler]', err);

  if (config.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Une erreur interne est survenue.' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
}

export { errorHandler };
