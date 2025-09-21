import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '../../../../_lib/auth';
import { BuinessUsers, User } from '../../../../../../models/associationt.ts/association';

export async function GET(request: NextRequest) {
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

    // Check if user has permission to view users (admin or manager)
    const currentBusinessUser = await BuinessUsers().findOne({
      where: { 
        userId: currentUser.userId,
        businessId: parseInt(businessId)
      }
    });

    if (!currentBusinessUser || !['admin', 'manager'].includes(currentBusinessUser.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to view users' },
        { status: 403 }
      );
    }

    // Get the specific user
    const businessUser = await BuinessUsers().findOne({
      where: { 
        id: parseInt(userId),
        businessId: parseInt(businessId)
      },
      include: [
        {
          model: User(),
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!businessUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Transform data for frontend
    const user = {
      id: businessUser.id.toString(),
      name: `${businessUser.user.firstName} ${businessUser.user.lastName}`,
      email: businessUser.user.email,
      role: businessUser.role,
      status: businessUser.isBanned ? 'banned' : 'active',
      isOnline: businessUser.isOnline,
      lastSeen: businessUser.lastActiveAt ? new Date(businessUser.lastActiveAt).toLocaleString() : 'Never',
      joinDate: businessUser.joinedAt ? new Date(businessUser.joinedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      department: 'General',
      isBanned: businessUser.isBanned,
      bannedReason: businessUser.bannedReason,
      bannedAt: businessUser.bannedAt
    };

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user', details: error.message },
      { status: 500 }
    );
  }
}
