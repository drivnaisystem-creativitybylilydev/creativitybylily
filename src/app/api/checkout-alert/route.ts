import { NextResponse } from 'next/server';
import { sendCheckoutAlert } from '@/lib/checkout-alerts';

/* Browser-side checkout failures (the payment form never loaded, tokenizing failed) never reach the
   payment routes, so the checkout page reports them here. Fixed stages and short text only, throttled. */
const STAGES = new Set(['sdk_load', 'sdk_init', 'tokenize']);
const hits = new Map<string, number[]>();

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 3) return NextResponse.json({ ok: true });
  hits.set(ip, [...recent, now]);

  const body = await request.json().catch(() => null);
  const stage = typeof body?.stage === 'string' ? body.stage : '';
  if (!STAGES.has(stage)) return NextResponse.json({ ok: false }, { status: 400 });

  await sendCheckoutAlert({
    level: 'failure',
    stage,
    summary: stage === 'tokenize' ? 'card could not be read in the browser' : 'payment form failed to load',
    details: {
      message: String(body?.message ?? '').slice(0, 200),
      code: String(body?.code ?? '').slice(0, 60),
      userAgent: (request.headers.get('user-agent') ?? '').slice(0, 160),
    },
  });
  return NextResponse.json({ ok: true });
}
