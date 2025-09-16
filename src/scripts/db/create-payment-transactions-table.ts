import { sequelize } from '../../libs/Db';
import { PaymentTransaction } from '../../models/associationt.ts/association';

/**
 * Script to create the payment_transactions table
 * Run this script to set up the payment tracking system
 */
async function createPaymentTransactionsTable() {
  try {
    console.log('Creating payment_transactions table...');
    
    // Sync the PaymentTransaction model to create the table
    await PaymentTransaction.sync({ force: false }); // force: false means don't drop existing table
    
    console.log('✅ Payment transactions table created successfully!');
    console.log('Table structure:');
    console.log('- id: Primary key');
    console.log('- user_id: Foreign key to users table');
    console.log('- stripe_payment_intent_id: Unique Stripe payment intent ID');
    console.log('- stripe_customer_id: Stripe customer ID');
    console.log('- plan_id: Plan identifier');
    console.log('- plan_name: Plan name');
    console.log('- amount: Payment amount');
    console.log('- currency: Payment currency');
    console.log('- status: Payment status (pending, succeeded, failed, canceled, requires_action)');
    console.log('- payment_method: Payment method used');
    console.log('- customer_email: Customer email');
    console.log('- billing_details: JSON billing information');
    console.log('- metadata: JSON metadata from Stripe');
    console.log('- webhook_processed: Boolean flag for webhook processing');
    console.log('- webhook_processed_at: Timestamp of webhook processing');
    console.log('- failure_reason: Reason for payment failure');
    console.log('- created_at: Record creation timestamp');
    console.log('- updated_at: Record update timestamp');
    
  } catch (error) {
    console.error('❌ Error creating payment transactions table:', error);
    throw error;
  }
}

// Run the script if called directly
if (require.main === module) {
  createPaymentTransactionsTable()
    .then(() => {
      console.log('Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

export { createPaymentTransactionsTable };
