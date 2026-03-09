import { Router } from 'express';
import type { Router as IRouter } from 'express';

const router: IRouter = Router();

// TODO: Implémenter les webhooks PSP (F-06)
// Note : ce router reçoit le body brut (express.raw) pour la vérification HMAC

export default router;
