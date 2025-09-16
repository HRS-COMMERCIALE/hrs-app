import { sequelize } from '../../libs/Db';
import { models, modelNames } from '../../models/associationt.ts/association';

async function alterSyncImproved() {
  try {
    console.log('🔄 Starting improved alter sync...');
    
    // First, authenticate the connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Get current database schema
    const [existingTables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    const existingTableNames = (existingTables as any[]).map(row => row.table_name);
    console.log('📋 Existing tables:', existingTableNames);
    
    // Disable foreign key checks temporarily
    await sequelize.query('SET session_replication_role = replica;');
    console.log('🔓 Foreign key constraints temporarily disabled');
    
    // Sync models with better error handling
    const syncResults = [];
    
    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      const modelName = modelNames[i];
      
      try {
        console.log(`🔄 Syncing ${model.name} (${modelName})...`);
        
        // Use alter: true to modify existing tables
        await model.sync({ alter: true });
        syncResults.push({ model: model.name, table: modelName, status: 'success' });
        console.log(`✅ Successfully synced: ${model.name}`);
        
      } catch (modelError) {
        console.warn(`⚠️  Warning syncing ${model.name}:`, (modelError as any).message);
        syncResults.push({ model: model.name, table: modelName, status: 'warning', error: (modelError as any).message });
        
        // Try to create the table if it doesn't exist
        if ((modelError as any).message.includes('relation') && (modelError as any).message.includes('does not exist')) {
          try {
            console.log(`🔄 Attempting to create table for ${model.name}...`);
            await model.sync({ force: false });
            syncResults[syncResults.length - 1].status = 'created';
            console.log(`✅ Created table for: ${model.name}`);
          } catch (createError) {
            console.error(`❌ Failed to create table for ${model.name}:`, (createError as any).message);
            syncResults[syncResults.length - 1].status = 'failed';
            syncResults[syncResults.length - 1].error = (createError as any).message;
          }
        }
      }
    }
    
    // Re-enable foreign key checks
    await sequelize.query('SET session_replication_role = DEFAULT;');
    console.log('🔒 Foreign key constraints re-enabled');
    
    // Get final database schema
    const [finalTables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    const finalTableNames = (finalTables as any[]).map(row => row.table_name);
    
    // Display results
    console.log('\n📊 Sync Results:');
    syncResults.forEach(result => {
      const status = result.status === 'success' ? '✅' : 
                    result.status === 'created' ? '🆕' : 
                    result.status === 'warning' ? '⚠️' : '❌';
      console.log(`  ${status} ${result.model} (${result.table}) - ${result.status}`);
      if (result.error) {
        console.log(`    Error: ${result.error}`);
      }
    });
    
    console.log('\n✅ Database alter sync completed!');
    console.log('📋 Final tables in database:');
    finalTableNames.forEach(name => console.log(`  - ${name}`));
    
    // Check if all expected tables exist
    const missingTables = modelNames.filter(name => !finalTableNames.includes(name));
    if (missingTables.length > 0) {
      console.warn('\n⚠️  Missing tables:', missingTables);
    } else {
      console.log('\n🎉 All expected tables are present!');
    }
    
  } catch (error) {
    console.error('❌ Alter sync failed:', error);
    
    // Try to re-enable foreign key checks even if there was an error
    try {
      await sequelize.query('SET session_replication_role = DEFAULT;');
      console.log('🔒 Foreign key constraints re-enabled after error');
    } catch (fkError) {
      console.error('❌ Failed to re-enable foreign key constraints:', fkError);
    }
    
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the improved alter sync
alterSyncImproved();
