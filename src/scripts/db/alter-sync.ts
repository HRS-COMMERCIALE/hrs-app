import { sequelize } from '../../libs/Db';
import { models, modelNames } from '../../models/associationt.ts/association';

async function alterSync() {
  try {
    console.log('🔄 Starting alter sync...');
    
    // First, authenticate the connection
    await sequelize().authenticate();
    console.log('✅ Database connection established');
    
    // Disable foreign key checks temporarily for alter operations
    // await sequelize().query('SET session_replication_role = replica;');
    // console.log('🔓 Foreign key constraints temporarily disabled');
    
    // Alter sync each model individually - this will modify existing tables without dropping them
    for (const model of models()) {
      try {
        await model.sync({ alter: true });
        console.log(`✅ Synced: ${model.name}`);
      } catch (modelError) {
        const errorMessage = modelError instanceof Error ? modelError.message : String(modelError);
        console.warn(`⚠️  Warning syncing ${model.name}:`, errorMessage);
        // Continue with other models even if one fails
      }
    }
    
    // Re-enable foreign key checks
    // await sequelize().query('SET session_replication_role = DEFAULT;');
    // console.log('🔒 Foreign key constraints re-enabled');
    
    // Verify all tables exist
    const [results] = await sequelize().query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('✅ Database tables alter synced successfully!');
    console.log('📋 Tables in database:');
    (results as any[]).forEach((row: any) => console.log(`  - ${row.table_name}`));
    
  } catch (error) {
    console.error('❌ Alter sync failed:', error);
    
    // Try to re-enable foreign key checks even if there was an error
    try {
      await sequelize().query('SET session_replication_role = DEFAULT;');
      console.log('🔒 Foreign key constraints re-enabled after error');
    } catch (fkError) {
      console.error('❌ Failed to re-enable foreign key constraints:', fkError);
    }
    
    process.exit(1);
  } finally {
    await sequelize().close();
  }
}

// Run the alter sync
alterSync();
