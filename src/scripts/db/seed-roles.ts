import { sequelize } from '../../libs/Db';
import { Model, DataTypes } from 'sequelize';
import { defineRoleModel } from '../../models/user/Role';
import { UserRole } from '../../models/user/Role';

async function seedRoles() {
  try {
    console.log('Starting role seeding...');
    
    // Define the Role model
    const Role = defineRoleModel(sequelize, Model, DataTypes);
    
    // Sync the model to ensure the table exists
    await Role.sync({ force: false });
    
    // Define the roles to seed
    const roles = [
      { name: UserRole.USER },
      { name: UserRole.MANAGER },
      { name: UserRole.ADMIN },
      { name: UserRole.SUPER_ADMIN }
    ];
    
    // Create roles if they don't exist
    for (const role of roles) {
      const [createdRole, created] = await Role.findOrCreate({
        where: { name: role.name },
        defaults: role
      });
      
      if (created) {
        console.log(`Created role: ${role.name}`);
      } else {
        console.log(`Role already exists: ${role.name}`);
      }
    }
    
    console.log('Role seeding completed successfully!');
    
    // List all roles
    const allRoles = await Role.findAll();
    console.log('Available roles:', allRoles.map(r => ({ id: r.id, name: r.name })));
    
  } catch (error) {
    console.error('Error seeding roles:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedRoles()
    .then(() => {
      console.log('Database seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database seeding failed:', error);
      process.exit(1);
    });
}

export { seedRoles };
