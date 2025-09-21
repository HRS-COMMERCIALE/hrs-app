import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '../../../../_lib/auth';
import { BuinessUsers } from '../../../../../../models/associationt.ts/association';

export async function PUT(request: NextRequest) {
  try {
    // Authenticate the user
    const authResult = await getAuthPayload(request);
    if (!authResult.ok) {
      return authResult.response;
    }
    const currentUser = authResult.payload;

    // Parse request body
    const body = await request.json();
    const { 
      userId, 
      businessId,
      action, // 'changeRole', 'ban', 'unban'
      newRole,
      banReason
    } = body;

    // Validate required fields
    if (!userId || !businessId || !action) {
      return NextResponse.json(
        { error: 'User ID, Business ID, and action are required' },
        { status: 400 }
      );
    }

    // Check if current user has permission to manage users (admin only)
    const currentBusinessUser = await BuinessUsers().findOne({
      where: { 
        userId: currentUser.userId,
        businessId: parseInt(businessId)
      }
    });

    if (!currentBusinessUser || currentBusinessUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions to manage users' },
        { status: 403 }
      );
    }

    // Get the target user
    const targetBusinessUser = await BuinessUsers().findOne({
      where: { 
        id: parseInt(userId),
        businessId: parseInt(businessId)
      }
    });

    if (!targetBusinessUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent admin from modifying their own role or banning themselves
    if (targetBusinessUser.userId === currentUser.userId) {
      return NextResponse.json(
        { error: 'Cannot modify your own account' },
        { status: 400 }
      );
    }

    let updatedUser;

    switch (action) {
      case 'changeRole':
        if (!newRole || !['member', 'manager', 'admin'].includes(newRole)) {
          return NextResponse.json(
            { error: 'Valid role is required (member, manager, admin)' },
            { status: 400 }
          );
        }
        
        updatedUser = await targetBusinessUser.update({
          role: newRole
        });
        break;

      case 'ban':
        updatedUser = await targetBusinessUser.update({
          isBanned: true,
          bannedReason: banReason || 'No reason provided',
          bannedAt: new Date()
        });
        break;

      case 'unban':
        updatedUser = await targetBusinessUser.update({
          isBanned: false,
          bannedReason: null,
          bannedAt: null
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be changeRole, ban, or unban' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        role: updatedUser.role,
        isBanned: updatedUser.isBanned,
        bannedReason: updatedUser.bannedReason,
        bannedAt: updatedUser.bannedAt
      }
    });

  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user', details: error.message },
      { status: 500 }
    );
  }
}
