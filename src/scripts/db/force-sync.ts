import { sequelize } from '../../libs/Db';
import { models, modelNames } from '../../models/associationt.ts/association';

async function forceSync() {
  try {
    console.log('🔄 Starting force sync...');
    
    // Force sync each model individually - this will drop all tables and recreate them
    for (const model of models) {
      await model.sync({ force: true });
      console.log(`✅ Synced: ${model.name}`);
    }
    
    console.log('✅ Database tables force synced successfully!');
    console.log('📋 Tables created:');
    modelNames.forEach(name => console.log(`  - ${name}`));
    
  } catch (error) {
    console.error('❌ Force sync failed:', error);
    process.exit(1);
  } finally {
    await sequelize().close();
  }
}

// Run the force sync
forceSync();
