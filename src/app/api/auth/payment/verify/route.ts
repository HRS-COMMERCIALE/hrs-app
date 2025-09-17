import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PaymentTransaction } from '../../../../../models/associationt.ts/association';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Force this route to be server-side only
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Verifies a payment by PaymentIntent ID using both Stripe and DB (webhook result)
// GET /api/auth/payment/verify?payment_intent=pi_...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('payment_intent');

    if (!paymentIntentId) {
      return NextResponse.json({ ok: false, error: 'payment_intent is required' }, { status: 400 });
    }

    // 1) Check our DB to see if webhook processed this payment already (source of truth)
    const tx = await PaymentTransaction().findOne({ where: { stripePaymentIntentId: paymentIntentId } });

    // 2) Also check Stripe directly to reflect current state
    let stripeStatus: string | null = null;
    try {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      stripeStatus = pi.status;
    } catch (err) {
      // Ignore retrieval errors here; DB may still have the truth
    }

    const webhookProcessed = Boolean((tx as any)?.webhookProcessed);
    const status = ((tx as any)?.status as string | undefined) || stripeStatus || 'unknown';

    return NextResponse.json({
      ok: true,
      // Consider payment verified if Stripe reports succeeded, even if webhook hasn't persisted yet
      // This avoids a race condition where the user lands on success before the webhook updates DB
      verified: status === 'succeeded' || (webhookProcessed && status === 'succeeded'),
      webhookProcessed,
      status,
      transaction: tx ? {
        id: (tx as any).id,
        userId: (tx as any).userId,
        amount: (tx as any).amount,
        currency: (tx as any).currency,
        planId: (tx as any).planId,
        planName: (tx as any).planName,
        updatedAt: (tx as any).updatedAt,
      } : null,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Verification failed' }, { status: 500 });
  }
}
