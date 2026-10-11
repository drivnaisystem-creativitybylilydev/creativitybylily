/** Private checkout alerts for the developer. Deliberately separate from the shop-owner order emails. */
const DEFAULT_ALERT_TO = 'drivn.ai.system@gmail.com';

export type CheckoutAlert = {
  level: 'success' | 'failure' | 'critical';
  stage: string;
  summary: string;
  details?: Record<string, unknown>;
};

const ICON = { success: '✅', failure: '❌', critical: '🚨' } as const;

/** Fire-and-forget safe: never throws and gives up after a few seconds so it can't slow checkout. */
export async function sendCheckoutAlert(alert: CheckoutAlert): Promise<void> {
  try {
    const key = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (!key || !from) return;
    const to = (process.env.CHECKOUT_ALERT_EMAIL || DEFAULT_ALERT_TO).split(',').map((s) => s.trim()).filter(Boolean);
    const env = process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown';
    const rows = Object.entries({ stage: alert.stage, environment: env, time: new Date().toISOString(), ...alert.details })
      .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
      .join('\n');
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        subject: `${ICON[alert.level]} Lily checkout${env === 'production' ? '' : ` [${env}]`}: ${alert.summary}`.slice(0, 200),
        text: `${alert.summary}\n\n${rows}\n`,
      }),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) console.error('Checkout alert not delivered:', res.status);
  } catch (e) {
    console.error('Checkout alert failed:', (e as Error)?.message);
  }
}
