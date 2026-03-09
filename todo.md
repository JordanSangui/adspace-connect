# BRIEF COMPLET — Fichiers 3 à 9 — Backend AdSpace Connect

## Contexte global à donner à ton IA en premier

> Je construis le backend d'une plateforme de mise en relation publicitaire appelée AdSpace Connect. Stack : Node.js 20 + Express + TypeScript + Supabase (PostgreSQL). Le projet est dans le dossier `api/`. Les dépendances suivantes sont déjà installées : `express`, `cors`, `helmet`, `express-rate-limit`, `zod`, `@supabase/supabase-js`, `dotenv`, `typescript`, `ts-node`, `nodemon`, `@types/express`, `@types/node`, `@types/cors`. Les fichiers `src/lib/supabase.ts` et `src/config.ts` existent déjà et sont fonctionnels. Le client Supabase est exporté depuis `../lib/supabase` et la config depuis `../config`. Implémente les fichiers suivants exactement comme décrit, sans ajouter de logique non demandée.

---

## Fichier 3 : `src/index.ts`

**Chemin exact :** `api/src/index.ts`

**Description complète :**

Point d'entrée principal du serveur Express. Ce fichier orchestre tous les middlewares et toutes les routes dans le bon ordre.

**Ce qu'il doit faire, dans cet ordre précis :**

1. Importer `config` depuis `./config` en tout premier (avant tout autre import)
2. Importer Express, cors, helmet
3. Importer `globalLimiter` depuis `./middleware/rateLimiter`
4. Importer `errorHandler` depuis `./middleware/errorHandler`
5. Importer tous les routers : `authRouter` depuis `./routes/auth.routes`, `venuesRouter` depuis `./routes/venues.routes`, `offersRouter` depuis `./routes/offers.routes`, `contractsRouter` depuis `./routes/contracts.routes`, `paymentsRouter` depuis `./routes/payments.routes`, `proofsRouter` depuis `./routes/proofs.routes`, `webhooksRouter` depuis `./routes/webhooks.routes`
6. Créer l'app Express
7. Appliquer dans cet ordre : `helmet()`, `cors({ origin: config.FRONTEND_URL, credentials: true })`, `express.json()`, `globalLimiter`
8. Monter les routes avec le préfixe `/api/v1` :
   - `/api/v1/auth` → authRouter
   - `/api/v1/venues` → venuesRouter
   - `/api/v1/offers` → offersRouter
   - `/api/v1/contracts` → contractsRouter
   - `/api/v1/payments` → paymentsRouter
   - `/api/v1/proofs` → proofsRouter
   - `/api/v1/webhooks` → webhooksRouter
9. Monter `errorHandler` **après** toutes les routes (c'est le dernier middleware)
10. Démarrer le serveur sur `config.PORT`
11. Afficher dans la console : `AdSpace API démarrée sur le port ${config.PORT} [${config.NODE_ENV}]`

**Points critiques :**
- `errorHandler` doit être le tout dernier `app.use()`
- `helmet()` doit être le tout premier middleware
- Les routes des webhooks PSP ne doivent PAS avoir `express.json()` — elles ont besoin du body brut pour vérifier la signature HMAC. Pour ça, utilise `express.raw({ type: 'application/json' })` uniquement sur la route `/api/v1/webhooks` avant `express.json()`. Concrètement : monte `/api/v1/webhooks` AVANT l'appel à `app.use(express.json())`

---

## Fichier 4 : `src/middleware/rateLimiter.ts`

**Chemin exact :** `api/src/middleware/rateLimiter.ts`

**Description complète :**

Deux rate limiters distincts pour protéger l'API contre les abus et les attaques par force brute.

**Ce qu'il doit contenir :**

**`globalLimiter`** : limite générale appliquée à toutes les routes
- 100 requêtes maximum
- Fenêtre de 15 minutes
- Message d'erreur retourné : `{ error: "Trop de requêtes, réessayez dans 15 minutes." }`
- `standardHeaders: true` (expose les headers `RateLimit-*` dans la réponse)
- `legacyHeaders: false`

**`authLimiter`** : limite stricte pour les routes d'authentification (login, register)
- 5 requêtes maximum
- Fenêtre de 15 minutes
- Message d'erreur retourné : `{ error: "Trop de tentatives. Compte temporairement bloqué, réessayez dans 15 minutes." }`
- `standardHeaders: true`
- `legacyHeaders: false`

**Export :** exporte les deux comme des exports nommés : `export { globalLimiter, authLimiter }`

---

## Fichier 5 : `src/middleware/errorHandler.ts`

**Chemin exact :** `api/src/middleware/errorHandler.ts`

**Description complète :**

Middleware de gestion centralisée de toutes les erreurs non catchées dans les routes. C'est le filet de sécurité de toute l'application.

**Ce qu'il doit faire :**

La signature du middleware est obligatoirement à 4 paramètres : `(err: any, req: Request, res: Response, next: NextFunction)` — c'est ce qui dit à Express que c'est un error handler.

**Comportement selon le type d'erreur :**

1. **Erreur de validation Zod** (quand `err.name === 'ZodError'` ou `err instanceof ZodError`) :
   - Status HTTP : `400`
   - Réponse : `{ error: "Données invalides", details: err.errors }` où `err.errors` est le tableau des erreurs Zod formatées

2. **Erreur avec un `statusCode` ou `status` défini** (erreurs personnalisées) :
   - Status HTTP : la valeur de `err.statusCode` ou `err.status`
   - Réponse : `{ error: err.message }`

3. **Toutes les autres erreurs** (erreurs inattendues) :
   - Toujours logger dans la console avec `console.error('[ErrorHandler]', err)`
   - En `NODE_ENV === 'production'` : status `500`, réponse `{ error: "Une erreur interne est survenue." }` — ne jamais exposer `err.message` ni le stack trace
   - En `NODE_ENV === 'development'` : status `500`, réponse `{ error: err.message, stack: err.stack }` pour faciliter le debug

**Export :** `export { errorHandler }` ou `export default errorHandler`

---

## Fichier 6 : `src/middleware/auth.ts`

**Chemin exact :** `api/src/middleware/auth.ts`

**Description complète :**

C'est le gardien de toutes les routes protégées. Chaque route qui nécessite une authentification passe par ce middleware.

**Ce qu'il doit faire :**

**Extension du type Express Request :**
Au tout début du fichier, avant les imports, déclare l'extension de type pour que TypeScript accepte `req.user` dans toutes les routes :

```typescript
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: string
        full_name: string
        phone: string | null
        kyc_status: string
        kyb_status: string | null
        created_at: string
        updated_at: string
      }
    }
  }
}
```

**Logique du middleware `requireAuth` :**

1. Lire le header `Authorization`
2. Si absent ou ne commence pas par `Bearer ` → retourner `401` avec `{ error: "Token d'authentification manquant." }`
3. Extraire le token : `const token = authHeader.split(' ')[1]`
4. Appeler `supabase.auth.getUser(token)` pour vérifier la validité du JWT
5. Si erreur Supabase ou `user` null → retourner `401` avec `{ error: "Token invalide ou expiré." }`
6. Requêter la table `profiles` pour récupérer le profil complet : `select('*').eq('id', user.id).single()`
7. Si le profil n'existe pas → retourner `403` avec `{ error: "Profil utilisateur introuvable." }`
8. Attacher le profil à `req.user = profile`
9. Appeler `next()`

**Export :** `export { requireAuth }`

**Points critiques :**
- Utiliser le client Supabase de `../lib/supabase` — c'est la service role key qui est utilisée ici, ce qui permet de lire les profils même avec RLS
- Ne jamais logger le token JWT dans la console, même en développement
- Le `declare global` doit être dans ce fichier pour que l'extension soit disponible partout dans le projet

---

## Fichier 7 : `src/middleware/requireRole.ts`

**Chemin exact :** `api/src/middleware/requireRole.ts`

**Description complète :**

Une fonction qui génère un middleware de vérification de rôle. Toujours utilisé après `requireAuth`.

**Ce qu'il doit contenir :**

Une fonction `requireRole` qui :
- Prend en paramètre un ou plusieurs rôles : `(...roles: string[])`
- Retourne un middleware Express standard `(req: Request, res: Response, next: NextFunction)`
- Dans le middleware retourné : vérifie que `req.user` existe (sinon 401) et que `req.user.role` est inclus dans le tableau `roles`
- Si le rôle ne correspond pas → retourner `403` avec `{ error: "Accès refusé. Vous n'avez pas les permissions nécessaires.", required: roles, current: req.user.role }`
- Si tout est bon → appeler `next()`

**Utilisation dans les routes (pour que ton IA comprenne le contexte) :**
```typescript
router.get('/admin/users', requireAuth, requireRole('admin'), handler)
router.post('/venues', requireAuth, requireRole('owner'), handler)
router.post('/offers', requireAuth, requireRole('agency'), handler)
```

**Export :** `export { requireRole }`

---

## Fichier 8 : `src/services/audit.service.ts`

**Chemin exact :** `api/src/services/audit.service.ts`

**Description complète :**

Service responsable d'enregistrer toutes les actions importantes dans la table `audit_log`. Cette table est immuable — aucune update ni delete n'est possible dessus.

**Interface du paramètre :**

```typescript
interface AuditLogParams {
  actorId?: string        // UUID de l'utilisateur qui fait l'action (optionnel pour les actions système)
  action: string          // Ex: 'venue.published', 'contract.signed', 'payment.confirmed'
  entityType: string      // Ex: 'venue', 'contract', 'payment', 'offer'
  entityId?: string       // UUID de l'entité concernée
  payload?: object        // Données contextuelles (ex: { amount: 50000, currency: 'XAF' })
  ipAddress?: string      // IP de la requête (req.ip)
}
```

**Convention de nommage des actions à respecter dans tout le projet :**
- `user.registered`, `user.login`
- `venue.created`, `venue.published`, `venue.suspended`
- `offer.submitted`, `offer.accepted`, `offer.rejected`
- `contract.generated`, `contract.signed_owner`, `contract.signed_agency`, `contract.activated`
- `payment.initiated`, `payment.confirmed`, `payment.failed`
- `proof.submitted`, `proof.validated`
- `kyc.submitted`, `kyc.validated`, `kyc.rejected`

**Logique de la fonction `auditLog` :**

1. Construire l'objet à insérer dans `audit_log`
2. Appeler `supabase.from('audit_log').insert({...})`
3. **IMPORTANT** : envelopper tout dans un `try/catch`. En cas d'erreur, faire uniquement `console.error('[AuditLog] Échec enregistrement:', error)` — ne jamais lancer d'exception, ne jamais faire planter l'appelant
4. La fonction est `async` mais l'appelant n'a pas besoin d'`await` — c'est fire-and-forget

**Export :** `export { auditLog }`

---

## Fichier 9 : `src/routes/auth.routes.ts`

**Chemin exact :** `api/src/routes/auth.routes.ts`

**Description complète :**

Router Express qui gère l'inscription et la connexion des utilisateurs. C'est la seule partie de l'API accessible sans token.

**Imports nécessaires :**
- `Router, Request, Response, NextFunction` depuis `express`
- `z` depuis `zod`
- `authLimiter` depuis `../middleware/rateLimiter`
- `supabase` depuis `../lib/supabase`
- `auditLog` depuis `../services/audit.service`

---

### Route 1 : `POST /register`

**Validation Zod du body :**
```typescript
const registerSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  full_name: z.string().min(2, { message: "Le nom complet est requis" }),
  role: z.enum(['owner', 'agency'], { 
    errorMap: () => ({ message: "Le rôle doit être 'owner' ou 'agency'" }) 
  }),
  phone: z.string().optional()
})
```

**Logique :**
1. Parser et valider le body avec `registerSchema.parse(req.body)` dans un try/catch (les erreurs Zod seront catchées par `errorHandler`)
2. Appeler `supabase.auth.signUp({ email, password, options: { data: { full_name, role, phone } } })`
3. Si erreur Supabase (ex: email déjà utilisé) → retourner `400` avec `{ error: error.message }`
4. Si succès → appeler `auditLog({ action: 'user.registered', entityType: 'user', entityId: data.user?.id, payload: { email, role }, ipAddress: req.ip })`
5. Retourner `201` avec `{ message: "Inscription réussie. Vérifiez votre email pour confirmer votre compte.", userId: data.user?.id }`

---

### Route 2 : `POST /login`

**Validation Zod du body :**
```typescript
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Mot de passe requis" })
})
```

**Logique :**
1. Valider le body avec `loginSchema.parse(req.body)`
2. Appeler `supabase.auth.signInWithPassword({ email, password })`
3. Si erreur → retourner `401` avec `{ error: "Email ou mot de passe incorrect." }` — ne jamais retourner le message d'erreur Supabase brut (il peut révéler si l'email existe)
4. Récupérer le profil complet : `supabase.from('profiles').select('*').eq('id', data.user.id).single()`
5. Appeler `auditLog({ actorId: data.user.id, action: 'user.login', entityType: 'user', entityId: data.user.id, ipAddress: req.ip })`
6. Retourner `200` avec :
```typescript
{
  token: data.session.access_token,
  refresh_token: data.session.refresh_token,
  expires_at: data.session.expires_at,
  user: {
    id: profile.id,
    email: data.user.email,
    full_name: profile.full_name,
    role: profile.role,
    kyc_status: profile.kyc_status,
    kyb_status: profile.kyb_status
  }
}
```

---

### Route 3 : `POST /refresh`

**Logique :**
1. Valider que `refresh_token` est présent dans le body
2. Appeler `supabase.auth.refreshSession({ refresh_token })`
3. Si erreur → `401` avec `{ error: "Session expirée. Veuillez vous reconnecter." }`
4. Retourner le nouveau `access_token` et `expires_at`

---

### Route 4 : `POST /logout`

**Logique :**
1. Appliquer `requireAuth` sur cette route
2. Appeler `supabase.auth.signOut()`
3. Appeler `auditLog({ actorId: req.user.id, action: 'user.logout', entityType: 'user', entityId: req.user.id })`
4. Retourner `200` avec `{ message: "Déconnexion réussie." }`

---

### Configuration finale du router :

```typescript
router.post('/register', authLimiter, registerHandler)
router.post('/login', authLimiter, loginHandler)
router.post('/refresh', authLimiter, refreshHandler)
router.post('/logout', requireAuth, logoutHandler)

export default router
```

**Point critique global sur ce fichier :**
Le message d'erreur du login doit toujours être `"Email ou mot de passe incorrect."` — jamais `"Email introuvable"` ou `"Mot de passe incorrect"` séparément. Donner cette information séparément aide les attaquants à confirmer si un email est enregistré sur la plateforme (attaque par énumération).


```http
### Test register
POST http://localhost:4000/api/v1/auth/register
Content-Type: application/json

{
  "email": "test@adspace.cm",
  "password": "motdepasse123",
  "full_name": "Jean Test",
  "role": "owner"
}

### Test login
POST http://localhost:4000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@adspace.cm",
  "password": "motdepasse123"
}
```

**Les résultats attendus :**
- Register → `201` + message de confirmation
- Login → `200` + token JWT
- Login avec mauvais mot de passe → `401` + `"Email ou mot de passe incorrect."`
- Route inexistante → `404`
- Body invalide (ex: email mal formé) → `400` + détails Zod