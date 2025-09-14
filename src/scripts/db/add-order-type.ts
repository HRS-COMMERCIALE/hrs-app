import { sequelize } from '@/libs/Db';

async function addOrderTypeColumn() {
  try {
    console.log('Adding type column to orders table...');
    
    // Add the type column with default value 'order'
    await sequelize.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'order' NOT NULL
    `);
    
    // Add check constraint to ensure only valid values
    await sequelize.query(`
      ALTER TABLE orders 
      ADD CONSTRAINT IF NOT EXISTS orders_type_check 
      CHECK (type IN ('order', 'delivery', 'invoice', 'returns'))
    `);
    
    console.log('✅ Successfully added type column to orders table');
    
  } catch (error) {
    console.error('❌ Error adding type column:', error);
    throw error;
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  addOrderTypeColumn()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { addOrderTypeColumn };
