import { z } from 'zod';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env en développement
dotenv.config();

// Définition du schéma de validation avec Zod
const envSchema = z.object({
  SUPABASE_URL: z.string().min(1, 'La variable SUPABASE_URL est manquante').url('La variable SUPABASE_URL doit être une URL valide (ex: https://xyz.supabase.co)'),
  
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'La variable SUPABASE_SERVICE_ROLE_KEY ne peut pas être vide'),

  FRONTEND_URL: z.string().min(1, 'La variable FRONTEND_URL est manquante').url('La variable FRONTEND_URL doit être une URL valide (ex: http://localhost:3000)'),

  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  PORT: z.string().optional().default('4000').transform((val) => parseInt(val, 10)),
});

// Types inférés depuis le schéma
export type Config = z.infer<typeof envSchema>;

// Parsing et validation
const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('❌ Erreur de configuration (Variables d\'environnement) :\n');
  parseResult.error.issues.forEach((issue) => {
    console.error(`- [${issue.path.join('.')}] : ${issue.message}`);
  });
  console.error('\nLe processus va se terminer car la configuration est invalide.');
  process.exit(1);
}

// Export de la configuration validée et typée
export const config: Config = parseResult.data;
