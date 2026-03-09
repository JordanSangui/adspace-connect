// 1. Charger et valider la config en tout premier
import { config } from './config';

// 2. Imports Express et middlewares de sécurité
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// 3. Imports des middlewares applicatifs
import { globalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

// 4. Imports des routers
import authRouter from './routes/auth.routes';
import venuesRouter from './routes/venues.routes';
import offersRouter from './routes/offers.routes';
import contractsRouter from './routes/contracts.routes';
import paymentsRouter from './routes/payments.routes';
import proofsRouter from './routes/proofs.routes';
import webhooksRouter from './routes/webhooks.routes';

// 5. Création de l'app Express
const app = express();

// 6. Middlewares globaux (dans l'ordre)
app.use(helmet());
app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));

// 7. Monter les webhooks AVANT express.json()
//    Les webhooks PSP ont besoin du body brut pour vérifier la signature HMAC
app.use('/api/v1/webhooks', express.raw({ type: 'application/json' }), webhooksRouter);

// 8. Parser JSON pour toutes les autres routes
app.use(express.json());

// 9. Rate limiter global
app.use(globalLimiter);

// 10. Montage des routes avec le préfixe /api/v1
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/venues', venuesRouter);
app.use('/api/v1/offers', offersRouter);
app.use('/api/v1/contracts', contractsRouter);
app.use('/api/v1/payments', paymentsRouter);
app.use('/api/v1/proofs', proofsRouter);

// 11. Error handler — TOUJOURS en dernier
app.use(errorHandler);

// 12. Démarrage du serveur
app.listen(config.PORT, () => {
  console.log(`AdSpace API démarrée sur le port ${config.PORT} [${config.NODE_ENV}]`);
});
