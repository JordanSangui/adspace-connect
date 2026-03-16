import { Router, Request, Response, NextFunction } from 'express';
import type { Router as IRouter } from 'express';
import { z } from 'zod';
import { authLimiter } from '../middleware/rateLimiter';
import { requireAuth } from '../middleware/auth';
import { supabase } from '../lib/supabase';
import { auditLog } from '../services/audit.service';

const router: IRouter = Router();

// ─── Schémas de validation Zod ───────────────────────────────────────────────

const registerSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
  full_name: z.string().min(2, { message: 'Le nom complet est requis' }),
  role: z.enum(['owner', 'agency'], {
    error: "Le rôle doit être 'owner' ou 'agency'",
  }),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: 'Mot de passe requis' }),
});

const refreshSchema = z.object({
  refresh_token: z.string().min(1, { message: 'Le refresh_token est requis' }),
});

// ─── POST /register ──────────────────────────────────────────────────────────

async function registerHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, full_name, role, phone } = registerSchema.parse(req.body);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, role, phone },
      },
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    auditLog({
      action: 'user.registered',
      entityType: 'user',
      entityId: data.user?.id,
      payload: { email, role },
      ipAddress: req.ip,
    });

    res.status(201).json({
      message: 'Inscription réussie. Vérifiez votre email pour confirmer votre compte.',
      userId: data.user?.id,
    });
  } catch (err) {
    next(err);
  }
}

// ─── POST /login ─────────────────────────────────────────────────────────────

async function loginHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Ne jamais retourner le message d'erreur Supabase brut (attaque par énumération)
      res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      return;
    }

    // Récupérer le profil complet
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    if (profileError || !profile) {
      res.status(403).json({ error: 'Profil utilisateur non trouvé.' });
      return;
    }

    

    auditLog({
      actorId: data.user.id,
      action: 'user.login',
      entityType: 'user',
      entityId: data.user.id,
      ipAddress: req.ip,
    });

    res.status(200).json({
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      user: {
        id: profile.id,
        email: data.user.email,
        full_name: profile.full_name,
        role: profile.role,
        kyc_status: profile.kyc_status,
        kyb_status: profile.kyb_status,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ─── POST /refresh ───────────────────────────────────────────────────────────

async function refreshHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refresh_token } = refreshSchema.parse(req.body);

    const { data, error } = await supabase.auth.refreshSession({ refresh_token });

    if (error || !data.session) {
      res.status(401).json({ error: 'Session expirée. Veuillez vous reconnecter.' });
      return;
    }

    res.status(200).json({
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    });
  } catch (err) {
    next(err);
  }
}

// ─── POST /logout ────────────────────────────────────────────────────────────

async function logoutHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await supabase.auth.signOut();

    auditLog({
      actorId: req.user!.id,
      action: 'user.logout',
      entityType: 'user',
      entityId: req.user!.id,
    });

    res.status(200).json({ message: 'Déconnexion réussie.' });
  } catch (err) {
    next(err);
  }
}

// ─── Montage des routes ──────────────────────────────────────────────────────

router.post('/register', authLimiter, registerHandler);
router.post('/login', authLimiter, loginHandler);
router.post('/refresh', authLimiter, refreshHandler);
router.post('/logout', requireAuth, logoutHandler);

export default router;
