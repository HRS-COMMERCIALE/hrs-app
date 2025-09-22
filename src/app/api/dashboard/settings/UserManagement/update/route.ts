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
      action, // 'changeRole', 'ban', 'unban', 'approve', 'reject'
      newRole,
      banReason,
      banInterval // '1h', '1d', '7d', 'permanent'
    } = body;

    // Validate required fields
    if (!userId || !businessId || !action) {
      return NextResponse.json(
        { error: 'User ID, Business ID, and action are required' },
        { status: 400 }
      );
    }

    // Check if current user has permission to manage users (admin or manager)
    const currentBusinessUser = await BuinessUsers().findOne({
      where: { 
        userId: currentUser.userId,
        businessId: parseInt(businessId),
        status: 'active'
      }
    });

    if (!currentBusinessUser || !['admin', 'manager'].includes(currentBusinessUser.role)) {
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

    // Prevent users from modifying their own account (except for some actions)
    if (targetBusinessUser.userId === currentUser.userId && ['ban', 'changeRole'].includes(action)) {
      return NextResponse.json(
        { error: 'Cannot modify your own account' },
        { status: 400 }
      );
    }

    // Role hierarchy enforcement
    const roleHierarchy = { 'member': 1, 'manager': 2, 'admin': 3 };
    const currentUserRoleLevel = roleHierarchy[currentBusinessUser.role as keyof typeof roleHierarchy];
    const targetUserRoleLevel = roleHierarchy[targetBusinessUser.role as keyof typeof roleHierarchy];

    // Check if current user can modify target user based on role hierarchy
    if (currentUserRoleLevel <= targetUserRoleLevel && ['ban', 'changeRole'].includes(action)) {
      return NextResponse.json(
        { error: `Cannot ${action} users with equal or higher role` },
        { status: 403 }
      );
    }

    // Helper function to calculate ban end date
    const calculateBanEndDate = (interval: string): Date | null => {
      const now = new Date();
      switch (interval) {
        case '1h':
          return new Date(now.getTime() + 60 * 60 * 1000);
        case '1d':
          return new Date(now.getTime() + 24 * 60 * 60 * 1000);
        case '7d':
          return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        case 'permanent':
          return null;
        default:
          return null;
      }
    };

    let updatedUser;

    switch (action) {
      case 'changeRole':
        if (!newRole || !['member', 'manager', 'admin'].includes(newRole)) {
          return NextResponse.json(
            { error: 'Valid role is required (member, manager, admin)' },
            { status: 400 }
          );
        }
        
        // Only admins can promote to admin or manager
        if (['admin', 'manager'].includes(newRole) && currentBusinessUser.role !== 'admin') {
          return NextResponse.json(
            { error: 'Only admins can assign admin or manager roles' },
            { status: 403 }
          );
        }
        
        updatedUser = await targetBusinessUser.update({
          role: newRole
        });
        break;

      case 'ban':
        if (!banInterval || !['1h', '1d', '7d', 'permanent'].includes(banInterval)) {
          return NextResponse.json(
            { error: 'Valid ban interval is required (1h, 1d, 7d, permanent)' },
            { status: 400 }
          );
        }
        
        const bannedUntil = calculateBanEndDate(banInterval);
        
        updatedUser = await targetBusinessUser.update({
          status: 'banned',
          bannedReason: banReason || 'No reason provided',
          bannedAt: new Date(),
          bannedUntil: bannedUntil,
          banInterval: banInterval
        });
        break;

      case 'unban':
        updatedUser = await targetBusinessUser.update({
          status: 'active',
          bannedReason: null,
          bannedAt: null,
          bannedUntil: null,
          banInterval: null
        });
        break;

      case 'approve':
        if (targetBusinessUser.status !== 'pending') {
          return NextResponse.json(
            { error: 'User is not pending approval' },
            { status: 400 }
          );
        }
        
        updatedUser = await targetBusinessUser.update({
          status: 'active',
          joinedAt: new Date()
        });
        break;

      case 'reject':
        if (targetBusinessUser.status !== 'pending') {
          return NextResponse.json(
            { error: 'User is not pending approval' },
            { status: 400 }
          );
        }
        
        // Remove the user from the business
        await targetBusinessUser.destroy();
        
        return NextResponse.json({
          success: true,
          message: 'User request rejected and removed from business'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be changeRole, ban, unban, approve, or reject' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        role: updatedUser.role,
        status: updatedUser.status,
        bannedReason: updatedUser.bannedReason,
        bannedAt: updatedUser.bannedAt,
        bannedUntil: updatedUser.bannedUntil,
        banInterval: updatedUser.banInterval
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
