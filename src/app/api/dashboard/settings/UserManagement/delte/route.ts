import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '../../../../_lib/auth';
import { BuinessUsers } from '../../../../../../models/associationt.ts/association';

export async function DELETE(request: NextRequest) {
  try {
    // Authenticate the user
    const authResult = await getAuthPayload(request);
    if (!authResult.ok) {
      return authResult.response;
    }
    const currentUser = authResult.payload;

    // Get user ID from URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const businessId = searchParams.get('businessId');

    if (!userId || !businessId) {
      return NextResponse.json(
        { error: 'User ID and Business ID are required' },
        { status: 400 }
      );
    }

    // Check if current user has permission to delete users (admin only)
    const currentBusinessUser = await BuinessUsers().findOne({
      where: { 
        userId: currentUser.userId,
        businessId: parseInt(businessId)
      }
    });

    if (!currentBusinessUser || currentBusinessUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions to delete users' },
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

    // Prevent admin from deleting themselves
    if (targetBusinessUser.userId === currentUser.userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete the user from business (remove from business_users table)
    await targetBusinessUser.destroy();

    return NextResponse.json({
      success: true,
      message: 'User removed from business successfully'
    });

  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user', details: error.message },
      { status: 500 }
    );
  }
}
