import { sequelize } from '../../libs/Db';
import { models, modelNames } from '../../models/associationt.ts/association';

async function alterSync() {
  try {
    console.log('🔄 Starting alter sync...');
    
    // Alter sync each model individually - this will modify existing tables without dropping them
    for (const model of models) {
      await model.sync({ alter: true });
      console.log(`✅ Synced: ${model.name}`);
    }
    
    console.log('✅ Database tables alter synced successfully!');
    console.log('📋 Tables updated:');
    modelNames.forEach(name => console.log(`  - ${name}`));
    
  } catch (error) {
    console.error('❌ Alter sync failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the alter sync
alterSync();
