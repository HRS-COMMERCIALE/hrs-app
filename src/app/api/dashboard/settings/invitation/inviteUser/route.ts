import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '../../../../_lib/auth';
import { BuinessInvitation, BuinessUsers } from '../../../../../../models/associationt.ts/association';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
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
      role = 'member', 
      businessUserId, 
      expiresInDays = 1
    } = body;

    // Validate required fields
    if (!businessUserId) {
      return NextResponse.json(
        { error: 'Business user ID is required' },
        { status: 400 }
      );
    }

    // Check if the current user has permission to invite (admin or moderator)
    const currentBusinessUser = await BuinessUsers().findOne({
      where: { 
        userId: currentUser.userId,
        businessId: (await BuinessUsers().findByPk(businessUserId))?.businessId
      }
    });

    if (!currentBusinessUser || !['admin'].includes(currentBusinessUser.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create invitations' },
        { status: 403 }
      );
    }

    // Generate unique invitation code
    const invitationCode = uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase();
    
    // Set expiration date
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + expiresInDays);

    // Create invitation record
    const invitation = await BuinessInvitation().create({
      businessUserId: businessUserId,
      role: role,
      invitationCode: invitationCode,
      invitedBy: currentUser.userId,
      isUsed: false,
      usedAt: null,
      usedBy: null,
      expiredAt: expiredAt,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      invitationCode: invitation.invitationCode,
      expiresAt: invitation.expiredAt,
      inviteUrl: `${invitation.invitationCode}`
    });

  } catch (error: any) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { error: 'Failed to create invitation', details: error.message },
      { status: 500 }
    );
  }
}