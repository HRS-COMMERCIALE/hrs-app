# Webhook Testing Guide

## Overview

This guide explains how to test the Stripe webhook implementation to ensure proper payment processing and user subscription management.

## Prerequisites

1. **Stripe Account**: Test mode enabled
2. **Environment Variables**: Properly configured
3. **Database**: Payment transactions table created
4. **Stripe CLI**: For local webhook testing (optional)

## Environment Setup

### 1. Required Environment Variables

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Database Setup

Run the database migration script:

```bash
# Create payment transactions table
npm run ts-node src/scripts/db/create-payment-transactions-table.ts
```

## Testing Methods

### Method 1: Stripe CLI (Recommended for Development)

#### 1. Install Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
# Download from https://github.com/stripe/stripe-cli/releases
```

#### 2. Login to Stripe
```bash
stripe login
```

#### 3. Forward Webhooks to Local Server
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will output a webhook secret. Update your `.env` file with this secret.

#### 4. Test Payment Flow
1. Start your Next.js application
2. Navigate to payment page
3. Use test card: `4242424242424242`
4. Complete payment
5. Check webhook events in terminal

### Method 2: Stripe Dashboard Testing

#### 1. Configure Webhook Endpoint
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `payment_intent.requires_action`
4. Copy webhook secret to environment variables

#### 2. Test with Stripe Test Cards
- **Success**: `4242424242424242`
- **3D Secure**: `4000002500003155`
- **Declined**: `4000000000000002`
- **Insufficient Funds**: `4000000000009995`

## Test Scenarios

### 1. Successful Payment Flow

#### Test Steps:
1. Navigate to `/businessPlans`
2. Select a plan (e.g., Premium)
3. Click "Subscribe"
4. Fill in billing information
5. Use test card: `4242424242424242`
6. Complete payment

#### Expected Results:
- Payment intent created in Stripe
- PaymentTransaction record created in database
- Webhook received and processed
- User plan updated to selected plan
- UserLicense record created
- Redirect to success page
- Success page shows payment details

#### Verification:
```sql
-- Check payment transaction
SELECT * FROM payment_transactions WHERE stripe_payment_intent_id = 'pi_...';

-- Check user plan update
SELECT id, email, plan FROM users WHERE email = 'test@example.com';

-- Check license creation
SELECT * FROM user_licenses WHERE user_id = (SELECT id FROM users WHERE email = 'test@example.com');
```

### 2. Failed Payment Flow

#### Test Steps:
1. Use declined test card: `4000000000000002`
2. Attempt payment

#### Expected Results:
- Payment intent created with failed status
- PaymentTransaction record created with failed status
- Webhook received and processed
- User plan remains unchanged
- Error message displayed to user

### 3. 3D Secure Authentication

#### Test Steps:
1. Use 3D Secure test card: `4000002500003155`
2. Complete payment with authentication

#### Expected Results:
- Payment requires additional authentication
- User redirected to 3D Secure page
- After authentication, payment succeeds
- Normal success flow continues

### 4. Webhook Processing

#### Test Steps:
1. Complete a successful payment
2. Check webhook delivery in Stripe Dashboard
3. Verify database records

#### Expected Results:
- Webhook delivered successfully (200 response)
- PaymentTransaction.webhookProcessed = true
- User plan updated
- UserLicense created

## Debugging

### 1. Check Application Logs

```bash
# Next.js development server logs
npm run dev

# Look for webhook processing logs
# Example: "Received Stripe webhook event: payment_intent.succeeded"
```

### 2. Check Stripe Dashboard

1. **Payments**: Verify payment intent status
2. **Webhooks**: Check delivery status and response codes
3. **Events**: Review all webhook events

### 3. Check Database

```sql
-- Check all payment transactions
SELECT 
  pt.*,
  u.email,
  u.plan as user_plan
FROM payment_transactions pt
LEFT JOIN users u ON pt.user_id = u.id
ORDER BY pt.created_at DESC;

-- Check webhook processing status
SELECT 
  stripe_payment_intent_id,
  status,
  webhook_processed,
  webhook_processed_at,
  created_at
FROM payment_transactions
WHERE webhook_processed = false;
```

### 4. Test Webhook Endpoint Manually

```bash
# Test webhook endpoint
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: t=1234567890,v1=..." \
  -d '{"type": "payment_intent.succeeded", "data": {...}}'
```

## Common Issues and Solutions

### 1. Webhook Not Receiving Events

**Symptoms:**
- Payment succeeds but user plan not updated
- No webhook events in Stripe Dashboard

**Solutions:**
- Check webhook endpoint URL
- Verify webhook secret in environment variables
- Ensure webhook events are selected in Stripe Dashboard
- Check firewall/network settings

### 2. Signature Verification Failed

**Symptoms:**
- 400 error in webhook logs
- "Invalid signature" error

**Solutions:**
- Verify STRIPE_WEBHOOK_SECRET environment variable
- Check webhook secret in Stripe Dashboard
- Ensure raw request body is used for signature verification

### 3. User Not Found

**Symptoms:**
- "User not found for email" error
- Payment processed but user plan not updated

**Solutions:**
- Verify user exists in database
- Check email matching logic
- Ensure user is logged in during payment

### 4. Duplicate Processing

**Symptoms:**
- Multiple license records created
- User plan updated multiple times

**Solutions:**
- Check webhookProcessed flag logic
- Verify idempotency implementation
- Review webhook delivery logs for duplicates

## Performance Testing

### 1. Load Testing

```bash
# Test multiple concurrent payments
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/payment \
    -H "Content-Type: application/json" \
    -d '{"paymentMethodId": "pm_...", "planId": "premium", "customerEmail": "test'$i'@example.com"}' &
done
```

### 2. Webhook Processing Time

Monitor webhook processing time:
- Should complete within 5 seconds
- Database operations should be fast
- No blocking operations in webhook handler

## Security Testing

### 1. Webhook Signature Verification

```bash
# Test with invalid signature
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Stripe-Signature: invalid_signature" \
  -d '{"type": "payment_intent.succeeded"}'
```

Expected: 400 error with "Invalid signature"

### 2. SQL Injection Testing

Test with malicious input in metadata:
```json
{
  "metadata": {
    "planId": "'; DROP TABLE users; --"
  }
}
```

Expected: No SQL injection, proper parameterized queries

## Monitoring

### 1. Application Metrics

- Webhook processing time
- Payment success rate
- Error rates
- Database query performance

### 2. Stripe Metrics

- Payment success rate
- Webhook delivery success rate
- Failed payment reasons
- Revenue tracking

### 3. Database Metrics

- Payment transaction count
- User plan distribution
- License creation rate
- Failed payment tracking

## Production Deployment

### 1. Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] Database tables created
- [ ] Webhook endpoint configured in Stripe
- [ ] SSL certificate installed
- [ ] Error monitoring set up
- [ ] Logging configured

### 2. Post-deployment Testing

- [ ] Test payment flow end-to-end
- [ ] Verify webhook delivery
- [ ] Check database records
- [ ] Monitor error rates
- [ ] Test error scenarios

### 3. Monitoring Setup

- [ ] Application performance monitoring
- [ ] Database monitoring
- [ ] Stripe webhook monitoring
- [ ] Error alerting
- [ ] Log aggregation

## Troubleshooting Commands

```bash
# Check webhook endpoint
curl -I https://yourdomain.com/api/webhooks/stripe

# Test payment API
curl -X POST https://yourdomain.com/api/auth/payment \
  -H "Content-Type: application/json" \
  -d '{"paymentMethodId": "pm_test", "planId": "premium", "customerEmail": "test@example.com"}'

# Check payment verification
curl "https://yourdomain.com/api/auth/payment/verify?payment_intent=pi_test"

# View recent logs
tail -f /var/log/your-app/webhook.log
```

## Best Practices

1. **Always test in staging first**
2. **Use Stripe test mode for development**
3. **Monitor webhook delivery rates**
4. **Implement proper error handling**
5. **Log all webhook events**
6. **Use idempotency keys**
7. **Test edge cases thoroughly**
8. **Monitor database performance**
9. **Set up alerting for failures**
10. **Regular security audits**
