import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPlanById, isValidPlanId } from '../../stripe-config/PaymentPlanceConfig';
import { User } from '../../../../models/associationt.ts/association';
import { requireAuth } from '../../_lib/auth';

// Initialize Stripe with secret key (use account's default API version)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    // Require authentication first
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return auth error
    }

    const userId = authResult.userId;
    const body = await request.json();
    const { paymentMethodId, planId, idempotencyKey } = body;

    // Validate required fields
    if (!paymentMethodId || !planId) {
      return NextResponse.json(
        { error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    // Validate plan ID and get plan details
    if (!isValidPlanId(planId)) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      );
    }

    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 400 }
      );
    }

    // Handle custom plan separately (no payment processing)
    if (planId === 'custom') {
      return NextResponse.json({
        success: true,
        message: 'Custom plan request received. Our team will contact you soon.',
        planName: plan.name,
        planId: plan.id,
        requiresContact: true
      });
    }

    // Convert price to cents (Stripe expects amounts in cents)
    const amountInCents = Math.round(plan.price * 100);

    // Get authenticated user data
    const user = await User.findByPk(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const customerEmail = (user as any).email;

    // Create payment intent (initiation only; do not confirm here)
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountInCents,
        currency: plan.currency.toLowerCase(),
        // Do NOT confirm server-side. We will confirm on the client with client_secret.
        confirmation_method: 'automatic',
        confirm: false,
        metadata: {
          planId: plan.id,
          planName: plan.name,
          customerEmail: customerEmail || '',
          userId: userId?.toString() || '',
        },
      },
      // Optional Stripe idempotency key to avoid duplicate PaymentIntents on retries
      idempotencyKey ? { idempotencyKey } : undefined
    );

    // Return client secret for client-side confirmation
    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      planName: plan.name,
      planId: plan.id,
    });

  } catch (error: any) {
    console.error('Payment processing error:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return NextResponse.json({
        success: false,
        error: error.message || 'Your card was declined.',
      }, { status: 400 });
    } else if (error.type === 'StripeRateLimitError') {
      return NextResponse.json({
        success: false,
        error: 'Too many requests. Please try again later.',
      }, { status: 429 });
    } else if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({
        success: false,
        error: 'Invalid payment request.',
      }, { status: 400 });
    } else if (error.type === 'StripeAPIError') {
      return NextResponse.json({
        success: false,
        error: 'Payment service error. Please try again.',
      }, { status: 500 });
    } else if (error.type === 'StripeConnectionError') {
      return NextResponse.json({
        success: false,
        error: 'Network error. Please check your connection.',
      }, { status: 500 });
    } else if (error.type === 'StripeAuthenticationError') {
      return NextResponse.json({
        success: false,
        error: 'Authentication error.',
      }, { status: 500 });
    }

    // Generic error
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }, { status: 500 });
  }
}
