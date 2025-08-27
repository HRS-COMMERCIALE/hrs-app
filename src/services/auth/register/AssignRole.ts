import { Role } from '@/models/associationt.ts/association';
import { UserRole } from '@/models/user/Role';

export async function assignRole(roleName: UserRole = UserRole.MANAGER): Promise<{ id: number; name: string }> {
  try {
    // Find existing role
    let role = await Role.findOne({
      where: { name: roleName }
    });

    // If role doesn't exist, create it
    if (!role) {
      role = await Role.create({
        name: roleName
      });
    }

    return { id: role.get('id') as number, name: role.get('name') as string };
  } catch (error) {
    console.error('Error assigning role:', error);
    throw new Error(`Failed to assign role: ${roleName}`);
  }
}
