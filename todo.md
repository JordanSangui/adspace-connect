Sprint 2 — Routes venues (emplacements)
On attaque maintenant src/routes/venues.routes.ts. C'est le cœur du produit.
Voici le brief complet à envoyer à ton IA.

Contexte:

Je continue le développement du backend AdSpace Connect. Le fichier src/routes/venues.routes.ts est un stub vide. Je dois l'implémenter. Les middlewares requireAuth et requireRole sont importés depuis ../middleware/auth et ../middleware/requireRole. Le client supabase est dans ../lib/supabase. Le service audit est dans ../services/audit.service. Toutes les routes protégées utilisent requireAuth en premier middleware.


Routes à implémenter
POST / — Créer un emplacement

Accessible : owner uniquement (requireRole('owner'))
Validation Zod du body :

typescriptconst createVenueSchema = z.object({
  type: z.enum(['fixed', 'mobile']),
  title: z.string().min(5),
  description: z.string().optional(),
  address: z.string().min(5),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  price_indicative: z.number().positive().optional()
})

Insère dans la table venues avec owner_id = req.user.id et status = 'draft'
Pour le champ location (PostGIS) : \POINT(${longitude} ${latitude})``
Appelle auditLog avec action: 'venue.created'
Retourne 201 avec la venue créée

GET / — Lister les emplacements

Accessible : tout le monde authentifié
Si rôle owner → retourne uniquement ses propres venues (filtre owner_id = req.user.id)
Si rôle agency → retourne uniquement les venues avec status = 'published'
Si rôle moderator ou admin → retourne toutes les venues
Supporte un query param ?status= pour filtrer par statut (optionnel)
Retourne 200 avec le tableau de venues

GET /:id — Détail d'un emplacement

Accessible : tout le monde authentifié
Retourne 404 si non trouvé avec { error: 'Emplacement introuvable.' }
Un owner ne peut voir que ses propres venues ou les publiées
Retourne 200 avec la venue

PATCH /:id — Modifier un emplacement

Accessible : owner uniquement, et seulement sur ses propres venues
Vérifie d'abord que la venue appartient à req.user.id → sinon 403
Seuls les statuts draft et rejected peuvent être modifiés → sinon 400 avec { error: 'Seuls les emplacements en brouillon ou refusés peuvent être modifiés.' }
Champs modifiables : title, description, address, latitude, longitude, price_indicative
Met à jour updated_at = new Date().toISOString()
Appelle auditLog avec action: 'venue.updated'
Retourne 200 avec la venue mise à jour

POST /:id/submit — Soumettre à la modération

Accessible : owner uniquement, sur ses propres venues
Vérifie que le statut actuel est draft ou rejected → sinon 400
Met à jour status = 'in_review'
Appelle auditLog avec action: 'venue.submitted_for_review'
Retourne 200 avec { message: 'Emplacement soumis à la modération.' }

POST /:id/publish — Publier (modérateur)

Accessible : moderator et admin uniquement
Vérifie que le statut est in_review → sinon 400
Met à jour status = 'published'
Appelle auditLog avec action: 'venue.published'
Retourne 200 avec { message: 'Emplacement publié.' }

POST /:id/reject — Refuser (modérateur)

Accessible : moderator et admin uniquement
Validation Zod : body doit contenir reason: z.string().min(10) (motif obligatoire)
Vérifie que le statut est in_review → sinon 400
Met à jour status = 'rejected'
Appelle auditLog avec action: 'venue.rejected' et payload: { reason }
Retourne 200 avec { message: 'Emplacement refusé.' }


Points critiques:

Ne jamais faire confiance au owner_id envoyé par le client — toujours utiliser req.user.id
Chaque route doit avoir son propre try/catch qui appelle next(err) pour que errorHandler gère l'erreur
La vérification de propriété (owner_id = req.user.id) doit se faire côté serveur, pas côté client