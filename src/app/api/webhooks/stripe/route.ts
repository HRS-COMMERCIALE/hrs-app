import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { User, PaymentTransaction, UserLicense } from '../../../../models/associationt.ts/association';
import { getPlanById } from '../../stripe-config/PaymentPlanceConfig';

// Initialize Stripe with secret key (use account's default API version)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Ensure we run on the Node.js runtime for raw-body access required by Stripe signature verification
export const runtime = 'nodejs';

// Webhook endpoint secret for signature verification
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Received Stripe webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.requires_action':
        await handlePaymentIntentRequiresAction(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle successful payment
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Processing successful payment:', paymentIntent.id);

    // Extract metadata
    const { planId, planName, customerEmail, userId } = paymentIntent.metadata;
    
    if (!planId || !customerEmail) {
      console.error('Missing required metadata in payment intent:', paymentIntent.id);
      return;
    }

    // Find user by ID first (from authenticated user), then fallback to email
    let user = null;
    if (userId) {
      user = await User().findByPk(userId);
    }
    
    // Fallback to email lookup if user not found by ID
    if (!user) {
      user = await User().findOne({ where: { email: customerEmail } });
    }
    
    if (!user) {
      console.error('User not found for userId:', userId, 'or email:', customerEmail);
      return;
    }

    // Check if this payment has already been processed
    const existingTransaction = await PaymentTransaction().findOne({
      where: { stripePaymentIntentId: paymentIntent.id }
    });

    if (existingTransaction && (existingTransaction as any).webhookProcessed) {
      console.log('Payment already processed:', paymentIntent.id);
      return;
    }

    // Create or update payment transaction record
    const transactionData = {
      userId: (user as any).id,
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: paymentIntent.customer as string || null,
      planId: planId,
      planName: planName,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency.toUpperCase(),
      status: 'succeeded',
      paymentMethod: paymentIntent.payment_method as string || null,
      customerEmail: customerEmail,
      billingDetails: (paymentIntent as any).charges?.data?.[0]?.billing_details || null,
      metadata: paymentIntent.metadata,
      webhookProcessed: true,
      webhookProcessedAt: new Date(),
    };

    let paymentTransaction;
    if (existingTransaction) {
      // Update existing transaction
      await existingTransaction.update(transactionData);
      paymentTransaction = existingTransaction;
    } else {
      // Create new transaction
      paymentTransaction = await PaymentTransaction().create(transactionData);
    }

    // Update user's plan and set validity for 1 year
    const plan = getPlanById(planId);
    if (plan) {
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      
      await user.update({ 
        plan: plan.name as any,
        planValidUntil: oneYearFromNow
      });
      console.log(`Updated user ${(user as any).id} plan to ${plan.name} valid until ${oneYearFromNow.toISOString()}`);
    }

    // Create user license record
    const licenseData = {
      userId: (user as any).id,
      licenseType: planName,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      isActive: true,
      price: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await UserLicense().create(licenseData);
    console.log(`Created license for user ${(user as any).id}`);

    console.log('Successfully processed payment:', paymentIntent.id);

  } catch (error: any) {
    console.error('Error processing successful payment:', error);
    throw error;
  }
}

// Handle failed payment
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Processing failed payment:', paymentIntent.id);

    // Find existing transaction
    const existingTransaction = await PaymentTransaction().findOne({
      where: { stripePaymentIntentId: paymentIntent.id }
    });

    if (existingTransaction) {
      await existingTransaction.update({
        status: 'failed',
        failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
        webhookProcessed: true,
        webhookProcessedAt: new Date(),
      } as any);
    } else {
      // Create new failed transaction record
      const { planId, planName, customerEmail, userId } = paymentIntent.metadata;
      
      if (customerEmail) {
        // Find user by ID first, then fallback to email
        let user = null;
        if (userId) {
          user = await User().findByPk(userId);
        }
        if (!user) {
          user = await User().findOne({ where: { email: customerEmail } });
        }
        
        if (user) {
          await PaymentTransaction().create({
            userId: (user as any).id,
            stripePaymentIntentId: paymentIntent.id,
            stripeCustomerId: paymentIntent.customer as string || null,
            planId: planId || 'unknown',
            planName: planName || 'Unknown Plan',
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency.toUpperCase(),
            status: 'failed',
            paymentMethod: paymentIntent.payment_method as string || null,
            customerEmail: customerEmail,
            metadata: paymentIntent.metadata,
            webhookProcessed: true,
            webhookProcessedAt: new Date(),
            failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
          });
        }
      }
    }

    console.log('Successfully processed failed payment:', paymentIntent.id);

  } catch (error: any) {
    console.error('Error processing failed payment:', error);
    throw error;
  }
}

// Handle canceled payment
async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Processing canceled payment:', paymentIntent.id);

    const existingTransaction = await PaymentTransaction().findOne({
      where: { stripePaymentIntentId: paymentIntent.id }
    });

    if (existingTransaction) {
      await existingTransaction.update({
        status: 'canceled',
        webhookProcessed: true,
        webhookProcessedAt: new Date(),
      } as any);
    }

    console.log('Successfully processed canceled payment:', paymentIntent.id);

  } catch (error: any) {
    console.error('Error processing canceled payment:', error);
    throw error;
  }
}

// Handle payment requiring action (3D Secure, etc.)
async function handlePaymentIntentRequiresAction(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Processing payment requiring action:', paymentIntent.id);

    const existingTransaction = await PaymentTransaction().findOne({
      where: { stripePaymentIntentId: paymentIntent.id }
    });

    if (existingTransaction) {
      await existingTransaction.update({
        status: 'requires_action',
        webhookProcessed: true,
        webhookProcessedAt: new Date(),
      } as any);
    }

    console.log('Successfully processed payment requiring action:', paymentIntent.id);

  } catch (error: any) {
    console.error('Error processing payment requiring action:', error);
    throw error;
  }
}
