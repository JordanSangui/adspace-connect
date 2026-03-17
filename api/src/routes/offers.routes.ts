import { Router, Request, Response, NextFunction } from 'express';
import type { Router as IRouter } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { supabase } from '../lib/supabase';
import { auditLog } from '../services/audit.service';

const router: IRouter = Router();

// ─── Schémas de validation Zod ───────────────────────────────────────────────

const createOfferSchema = z.object({
  venue_id: z.string().uuid(),
  proposed_price: z.number().positive(),
  message: z.string().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const counterOfferSchema = z.object({
  counter_price: z.number().positive(),
  counter_message: z.string().optional(),
});

// ─── POST / — Créer une offre ────────────────────────────────────────────────

async function createOfferHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { venue_id, proposed_price, message, start_date, end_date } =
      createOfferSchema.parse(req.body);

    // 1. Vérifier que la venue existe et est publiée
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .select('id, owner_id, status')
      .eq('id', venue_id)
      .single();

    if (venueError || !venue) {
      res.status(404).json({ error: 'Emplacement introuvable.' });
      return;
    }

    if (venue.status !== 'published') {
      res.status(404).json({ error: 'Emplacement introuvable.' });
      return;
    }

    // 2. Insérer l'offre — owner_id récupéré depuis la venue, jamais depuis le client
    const { data: offer, error: insertError } = await supabase
      .from('offers')
      .insert({
        venue_id,
        agency_id: req.user!.id,
        owner_id: venue.owner_id,
        status: 'open',
        proposed_price,
        message: message ?? null,
        start_date,
        end_date,
      })
      .select()
      .single();

    if (insertError) {
      res.status(400).json({ error: insertError.message });
      return;
    }

    auditLog({
      actorId: req.user!.id,
      action: 'offer.created',
      entityType: 'offer',
      entityId: offer.id,
      payload: { venue_id, proposed_price, start_date, end_date },
      ipAddress: req.ip,
    });

    res.status(201).json(offer);
  } catch (err) {
    next(err);
  }
}

// ─── GET / — Lister les offres ───────────────────────────────────────────────

async function listOffersHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const role = req.user!.role;

    let query = supabase.from('offers').select('*');

    // Filtrage selon le rôle
    if (role === 'agency') {
      query = query.eq('agency_id', req.user!.id);
    } else if (role === 'owner') {
      query = query.eq('owner_id', req.user!.id);
    }
    // moderator et admin → toutes les offres (pas de filtre)

    // Filtres optionnels via query params
    const statusFilter = req.query.status as string | undefined;
    const venueIdFilter = req.query.venue_id as string | undefined;

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }
    if (venueIdFilter) {
      query = query.eq('venue_id', venueIdFilter);
    }

    const { data: offers, error } = await query.order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json(offers);
  } catch (err) {
    next(err);
  }
}

// ─── GET /:id — Détail d'une offre ──────────────────────────────────────────

async function getOfferHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    const { data: offer, error } = await supabase
      .from('offers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !offer) {
      res.status(404).json({ error: 'Offre introuvable.' });
      return;
    }

    // Vérification d'accès : seuls l'agence concernée, le owner concerné, moderator ou admin
    const role = req.user!.role;
    const userId = req.user!.id;

    if (
      role !== 'moderator' &&
      role !== 'admin' &&
      offer.agency_id !== userId &&
      offer.owner_id !== userId
    ) {
      res.status(403).json({ error: 'Accès refusé.' });
      return;
    }

    res.status(200).json(offer);
  } catch (err) {
    next(err);
  }
}

// ─── POST /:id/accept — Accepter une offre ──────────────────────────────────

async function acceptOfferHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    // 1. Récupérer l'offre
    const { data: offer, error: fetchError } = await supabase
      .from('offers')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !offer) {
      res.status(404).json({ error: 'Offre introuvable.' });
      return;
    }

    // 2. Vérifier que le owner est bien le propriétaire de cette offre
    if (offer.owner_id !== req.user!.id) {
      res.status(403).json({ error: 'Accès refusé. Cette offre ne vous concerne pas.' });
      return;
    }

    // 3. Vérifier le statut
    if (!['open', 'countered'].includes(offer.status)) {
      res.status(400).json({ error: 'Seules les offres ouvertes ou contre-offres peuvent être acceptées.' });
      return;
    }

    // 4. Mettre à jour
    const { error: updateError } = await supabase
      .from('offers')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      res.status(400).json({ error: updateError.message });
      return;
    }

    auditLog({
      actorId: req.user!.id,
      action: 'offer.accepted',
      entityType: 'offer',
      entityId: id,
      ipAddress: req.ip,
    });

    res.status(200).json({ message: 'Offre acceptée.' });
  } catch (err) {
    next(err);
  }
}

// ─── POST /:id/reject — Rejeter une offre ───────────────────────────────────

async function rejectOfferHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    // 1. Récupérer l'offre
    const { data: offer, error: fetchError } = await supabase
      .from('offers')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !offer) {
      res.status(404).json({ error: 'Offre introuvable.' });
      return;
    }

    // 2. Vérifier que le owner est bien le propriétaire de cette offre
    if (offer.owner_id !== req.user!.id) {
      res.status(403).json({ error: 'Accès refusé. Cette offre ne vous concerne pas.' });
      return;
    }

    // 3. Vérifier le statut
    if (!['open', 'countered'].includes(offer.status)) {
      res.status(400).json({ error: 'Seules les offres ouvertes ou contre-offres peuvent être rejetées.' });
      return;
    }

    // 4. Mettre à jour
    const { error: updateError } = await supabase
      .from('offers')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      res.status(400).json({ error: updateError.message });
      return;
    }

    auditLog({
      actorId: req.user!.id,
      action: 'offer.rejected',
      entityType: 'offer',
      entityId: id,
      ipAddress: req.ip,
    });

    res.status(200).json({ message: 'Offre rejetée.' });
  } catch (err) {
    next(err);
  }
}

// ─── POST /:id/counter — Contre-offre ───────────────────────────────────────

async function counterOfferHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const { counter_price, counter_message } = counterOfferSchema.parse(req.body);

    // 1. Récupérer l'offre
    const { data: offer, error: fetchError } = await supabase
      .from('offers')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !offer) {
      res.status(404).json({ error: 'Offre introuvable.' });
      return;
    }

    // 2. Vérifier que le owner est bien le propriétaire de cette offre
    if (offer.owner_id !== req.user!.id) {
      res.status(403).json({ error: 'Accès refusé. Cette offre ne vous concerne pas.' });
      return;
    }

    // 3. Vérifier le statut — seule une offre ouverte peut recevoir une contre-offre
    if (offer.status !== 'open') {
      res.status(400).json({ error: 'Seules les offres ouvertes peuvent recevoir une contre-offre.' });
      return;
    }

    // 4. Mettre à jour
    const { data: updatedOffer, error: updateError } = await supabase
      .from('offers')
      .update({
        status: 'countered',
        counter_price,
        counter_message: counter_message ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      res.status(400).json({ error: updateError.message });
      return;
    }

    auditLog({
      actorId: req.user!.id,
      action: 'offer.countered',
      entityType: 'offer',
      entityId: id,
      payload: { counter_price },
      ipAddress: req.ip,
    });

    res.status(200).json(updatedOffer);
  } catch (err) {
    next(err);
  }
}

// ─── POST /:id/cancel — Annuler une offre ───────────────────────────────────

async function cancelOfferHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    // 1. Récupérer l'offre
    const { data: offer, error: fetchError } = await supabase
      .from('offers')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !offer) {
      res.status(404).json({ error: 'Offre introuvable.' });
      return;
    }

    // 2. Vérifier que l'agence est bien celle qui a créé l'offre
    if (offer.agency_id !== req.user!.id) {
      res.status(403).json({ error: 'Accès refusé. Cette offre ne vous appartient pas.' });
      return;
    }

    // 3. Vérifier le statut
    if (!['open', 'countered'].includes(offer.status)) {
      res.status(400).json({ error: 'Seules les offres ouvertes ou contre-offres peuvent être annulées.' });
      return;
    }

    // 4. Mettre à jour
    const { error: updateError } = await supabase
      .from('offers')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      res.status(400).json({ error: updateError.message });
      return;
    }

    auditLog({
      actorId: req.user!.id,
      action: 'offer.cancelled',
      entityType: 'offer',
      entityId: id,
      ipAddress: req.ip,
    });

    res.status(200).json({ message: 'Offre annulée.' });
  } catch (err) {
    next(err);
  }
}

// ─── Montage des routes ──────────────────────────────────────────────────────

router.post('/', requireAuth, requireRole('agency'), createOfferHandler);
router.get('/', requireAuth, listOffersHandler);
router.get('/:id', requireAuth, getOfferHandler);
router.post('/:id/accept', requireAuth, requireRole('owner'), acceptOfferHandler);
router.post('/:id/reject', requireAuth, requireRole('owner'), rejectOfferHandler);
router.post('/:id/counter', requireAuth, requireRole('owner'), counterOfferHandler);
router.post('/:id/cancel', requireAuth, requireRole('agency'), cancelOfferHandler);

export default router;
