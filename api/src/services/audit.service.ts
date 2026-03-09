import { supabase } from '../lib/supabase';

interface AuditLogParams {
  actorId?: string;       // UUID de l'utilisateur qui fait l'action (optionnel pour les actions système)
  action: string;         // Ex: 'venue.published', 'contract.signed', 'payment.confirmed'
  entityType: string;     // Ex: 'venue', 'contract', 'payment', 'offer'
  entityId?: string;      // UUID de l'entité concernée
  payload?: object;       // Données contextuelles (ex: { amount: 50000, currency: 'XAF' })
  ipAddress?: string;     // IP de la requête (req.ip)
}

/**
 * Enregistre une action dans la table audit_log.
 * Fire-and-forget : l'appelant n'a pas besoin d'await.
 * Ne lance jamais d'exception — ne fait jamais planter l'appelant.
 */
async function auditLog(params: AuditLogParams): Promise<void> {
  try {
    const { error } = await supabase.from('audit_log').insert({
      actor_id: params.actorId ?? null,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId ?? null,
      payload: params.payload ?? null,
      ip_address: params.ipAddress ?? null,
    });

    if (error) {
      console.error('[AuditLog] Échec enregistrement:', error);
    }
  } catch (error) {
    console.error('[AuditLog] Échec enregistrement:', error);
  }
}

export { auditLog, AuditLogParams };
