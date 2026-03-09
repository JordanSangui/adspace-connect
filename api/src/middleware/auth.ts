declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        full_name: string;
        phone: string | null;
        kyc_status: string;
        kyb_status: string | null;
        created_at: string;
        updated_at: string;
      };
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

/**
 * Middleware d'authentification.
 * Vérifie le JWT Supabase et attache le profil complet à req.user.
 */
async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  // 1. Vérifier la présence du header Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: "Token d'authentification manquant." });
    return;
  }

  // 2. Extraire le token
  const token = authHeader.split(' ')[1];

  // 3. Vérifier la validité du JWT via Supabase
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    res.status(401).json({ error: 'Token invalide ou expiré.' });
    return;
  }

  // 4. Récupérer le profil complet depuis la table profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    res.status(403).json({ error: 'Profil utilisateur introuvable.' });
    return;
  }

  // 5. Attacher le profil à la requête
  req.user = profile;

  next();
}

export { requireAuth };
