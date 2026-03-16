import { Router, Request, Response, NextFunction } from 'express';
import type { Router as IRouter } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { supabase } from '../lib/supabase';
import { auditLog } from '../services/audit.service';

const router: IRouter = Router();

// ─── Schémas de validation Zod ───────────────────────────────────────────────

const createVenueSchema = z.object({
  type: z.enum(['fixed', 'mobile']),
  title: z.string().min(5),
  description: z.string().optional(),
  address: z.string().min(5),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  price_indicative: z.number().positive().optional(),
});

const updateVenueSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().optional(),
  address: z.string().min(5).optional(),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
  price_indicative: z.number().positive().optional(),
});

const rejectSchema = z.object({
  reason: z.string().min(10, { message: 'Le motif de refus doit contenir au moins 10 caractères.' }),
});

// ─── POST / — Créer un emplacement ──────────────────────────────────────────

async function createVenueHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { type, title, description, address, coordinates, price_indicative } =
      createVenueSchema.parse(req.body);

     const { data: venue, error } = await supabase
      .rpc('create_venue', {
        p_owner_id: req.user!.id,
        p_type: type,
        p_title: title,
        p_description: description ?? null,
        p_address: address,
        p_longitude: coordinates.longitude,
        p_latitude: coordinates.latitude,
        p_price_indicative: price_indicative ?? null,
      });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    // rpc retourne un tableau, on prend le premier élément
    const createdVenue = Array.isArray(venue) ? venue[0] : venue;

    if (!createdVenue) {
      res.status(500).json({ error: 'Échec création emplacement.' });
      return;
    }

    auditLog({
      actorId: req.user!.id,
      action: 'venue.created',
      entityType: 'venue',
      entityId: createdVenue.id,
      payload: { type, title },
      ipAddress: Array.isArray(req.ip) ? req.ip[0] : req.ip,
    });

    res.status(201).json(createdVenue);
  } catch (err) {
    next(err);
  }
}

// ─── GET / — Lister les emplacements ────────────────────────────────────────

async function listVenuesHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const role = req.user!.role;
    const statusFilter = req.query.status as string | undefined;

    let query = supabase.from('venues').select('*');

    // Filtrage selon le rôle
    if (role === 'owner') {
      query = query.eq('owner_id', req.user!.id);
    } else if (role === 'agency') {
      query = query.eq('status', 'published');
    }
    // moderator et admin → toutes les venues (pas de filtre)

    // Filtre optionnel par statut (query param ?status=)
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data: venues, error } = await query.order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json(venues);
  } catch (err) {
    next(err);
  }
}

// ─── GET /:id — Détail d'un emplacement ─────────────────────────────────────

async function getVenueHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const { data: venue, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !venue) {
      res.status(404).json({ error: 'Emplacement introuvable.' });
      return;
    }

    // Un owner ne peut voir que ses propres venues ou les publiées
    if (req.user!.role === 'owner' && venue.owner_id !== req.user!.id && venue.status !== 'published') {
      res.status(404).json({ error: 'Emplacement introuvable.' });
      return;
    }

    res.status(200).json(venue);
  } catch (err) {
    next(err);
  }
}

// ─── PATCH /:id — Modifier un emplacement ───────────────────────────────────

async function updateVenueHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    // 1. Récupérer la venue
    const { data: venue, error: fetchError } = await supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !venue) {
      res.status(404).json({ error: 'Emplacement introuvable.' });
      return;
    }

    // 2. Vérifier la propriété
    if (venue.owner_id !== req.user!.id) {
      res.status(403).json({ error: 'Accès refusé. Cet emplacement ne vous appartient pas.' });
      return;
    }

    // 3. Vérifier le statut
    if (!['draft', 'rejected'].includes(venue.status)) {
      res.status(400).json({ error: 'Seuls les emplacements en brouillon ou refusés peuvent être modifiés.' });
      return;
    }

    // 4. Valider et appliquer les modifications
    const updates = updateVenueSchema.parse(req.body);

    // Construire l'objet de mise à jour
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.address) updateData.address = updates.address;
    if (updates.price_indicative !== undefined) updateData.price_indicative = updates.price_indicative;

    if (updates.coordinates) {
      updateData.location = `POINT(${updates.coordinates.longitude} ${updates.coordinates.latitude})`;
    }

    const { data: updatedVenue, error: updateError } = await supabase
      .from('venues')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      res.status(400).json({ error: updateError.message });
      return;
    }

    auditLog({
      actorId: req.user!.id,
      action: 'venue.updated',
      entityType: 'venue',
      entityId: id,
      payload: updates,
      ipAddress: Array.isArray(req.ip) ? req.ip[0] : req.ip,
    });

    res.status(200).json(updatedVenue);
  } catch (err) {
    next(err);
  }
}

// ─── POST /:id/submit — Soumettre à la modération ──────────────────────────

async function submitVenueHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    // 1. Récupérer la venue
    const { data: venue, error: fetchError } = await supabase
      .from('venues')
      .select('id, owner_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !venue) {
      res.status(404).json({ error: 'Emplacement introuvable.' });
      return;
    }

    // 2. Vérifier la propriété
    if (venue.owner_id !== req.user!.id) {
      res.status(403).json({ error: 'Accès refusé. Cet emplacement ne vous appartient pas.' });
      return;
    }

    // 3. Vérifier le statut
    if (!['draft', 'rejected'].includes(venue.status)) {
      res.status(400).json({ error: 'Seuls les emplacements en brouillon ou refusés peuvent être soumis.' });
      return;
    }

    // 4. Mettre à jour le statut
    const { error: updateError } = await supabase
      .from('venues')
      .update({ status: 'in_review', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      res.status(400).json({ error: updateError.message });
      return;
    }

    auditLog({
      actorId: req.user!.id,
      action: 'venue.submitted_for_review',
      entityType: 'venue',
      entityId: id,
      ipAddress: Array.isArray(req.ip) ? req.ip[0] : req.ip,
    });

    res.status(200).json({ message: 'Emplacement soumis à la modération.' });
  } catch (err) {
    next(err);
  }
}

// ─── POST /:id/publish — Publier (modérateur) ──────────────────────────────

async function publishVenueHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    // 1. Récupérer la venue
    const { data: venue, error: fetchError } = await supabase
      .from('venues')
      .select('id, status')
      .eq('id', id)
      .single();

    if (fetchError || !venue) {
      res.status(404).json({ error: 'Emplacement introuvable.' });
      return;
    }

    // 2. Vérifier le statut
    if (venue.status !== 'in_review') {
      res.status(400).json({ error: 'Seuls les emplacements en révision peuvent être publiés.' });
      return;
    }

    // 3. Publier
    const { error: updateError } = await supabase
      .from('venues')
      .update({ status: 'published', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      res.status(400).json({ error: updateError.message });
      return;
    }

    auditLog({
      actorId: req.user!.id,
      action: 'venue.published',
      entityType: 'venue',
      entityId: id,
      ipAddress: Array.isArray(req.ip) ? req.ip[0] : req.ip,
    });

    res.status(200).json({ message: 'Emplacement publié.' });
  } catch (err) {
    next(err);
  }
}

// ─── POST /:id/reject — Refuser (modérateur) ───────────────────────────────

async function rejectVenueHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const { reason } = rejectSchema.parse(req.body);

    // 1. Récupérer la venue
    const { data: venue, error: fetchError } = await supabase
      .from('venues')
      .select('id, status')
      .eq('id', id)
      .single();

    if (fetchError || !venue) {
      res.status(404).json({ error: 'Emplacement introuvable.' });
      return;
    }

    // 2. Vérifier le statut
    if (venue.status !== 'in_review') {
      res.status(400).json({ error: 'Seuls les emplacements en révision peuvent être refusés.' });
      return;
    }

    // 3. Refuser
    const { error: updateError } = await supabase
      .from('venues')
      .update({ status: 'rejected', rejection_reason: reason, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      res.status(400).json({ error: updateError.message });
      return;
    }

    auditLog({
      actorId: req.user!.id,
      action: 'venue.rejected',
      entityType: 'venue',
      entityId: id,
      payload: { reason },
      ipAddress: Array.isArray(req.ip) ? req.ip[0] : req.ip,
    });

    res.status(200).json({ message: 'Emplacement refusé.' });
  } catch (err) {
    next(err);
  }
}

// ─── Montage des routes ──────────────────────────────────────────────────────

router.post('/', requireAuth, requireRole('owner'), createVenueHandler);
router.get('/', requireAuth, listVenuesHandler);
router.get('/:id', requireAuth, getVenueHandler);
router.patch('/:id', requireAuth, requireRole('owner'), updateVenueHandler);
router.post('/:id/submit', requireAuth, requireRole('owner'), submitVenueHandler);
router.post('/:id/publish', requireAuth, requireRole('moderator', 'admin'), publishVenueHandler);
router.post('/:id/reject', requireAuth, requireRole('moderator', 'admin'), rejectVenueHandler);

export default router;
