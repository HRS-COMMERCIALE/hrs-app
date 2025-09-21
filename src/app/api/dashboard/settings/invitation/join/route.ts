import { NextRequest, NextResponse } from 'next/server';
import { BuinessInvitation, BuinessUsers, User } from '../../../../../../models/associationt.ts/association';
import { getAuthPayload } from '../../../../_lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Authenticate the user using cookies
    const authResult = await getAuthPayload(request);
    if (!authResult.ok) {
      return authResult.response;
    }
    const currentUser = authResult.payload;

    // Parse request body
    const body = await request.json();
    const { 
      invitationCode, 
      acceptTerms = false
    } = body;

    // Validate required fields
    if (!invitationCode) {
      return NextResponse.json(
        { error: 'Invitation code is required' },
        { status: 400 }
      );
    }

    if (!acceptTerms) {
      return NextResponse.json(
        { error: 'You must accept the terms and conditions' },
        { status: 400 }
      );
    }

    // Find the invitation
    const invitation = await BuinessInvitation().findOne({
      where: { 
        invitationCode: invitationCode.toUpperCase(),
        status: 'pending'
      },
      include: [
        {
          model: BuinessUsers(),
          as: 'businessUser',
          attributes: ['id', 'businessId', 'role']
        }
      ]
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation code' },
        { status: 404 }
      );
    }

    // Check if invitation is expired
    if (new Date() > invitation.expiredAt) {
      // Update invitation status to expired
      await invitation.update({ status: 'expired' });
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 410 }
      );
    }

    // Check if invitation is already used
    if (invitation.isUsed) {
      return NextResponse.json(
        { error: 'Invitation has already been used' },
        { status: 409 }
      );
    }

    // Check if user is already part of this business
    const existingBusinessUser = await BuinessUsers().findOne({
      where: {
        userId: currentUser.userId,
        businessId: invitation.businessUser.businessId
      }
    });

    if (existingBusinessUser) {
      return NextResponse.json(
        { error: 'User is already a member of this business' },
        { status: 409 }
      );
    }

    // Create business user relationship with pending status
    const businessUser = await BuinessUsers().create({
      userId: currentUser.userId,
      businessId: invitation.businessUser.businessId,
      role: invitation.role,
      status: 'pending', // Set as pending instead of active
      isOnline: false,
      joinedAt: new Date()
    });

    // Update invitation as used
    await invitation.update({
      userId: currentUser.userId,
      isUsed: true,
      usedAt: new Date(),
      usedBy: currentUser.userId,
      status: 'accepted',
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      userAgent: request.headers.get('user-agent') || null
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the business! Your membership is pending approval.',
      user: {
        id: currentUser.userId,
        businessRole: invitation.role,
        businessId: invitation.businessUser.businessId,
        status: 'pending'
      }
    });

  } catch (error: any) {
    console.error('Error joining with invitation:', error);
    return NextResponse.json(
      { error: 'Failed to join with invitation', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Invitation code is required' },
        { status: 400 }
      );
    }

    // Find the invitation
    const invitation = await BuinessInvitation().findOne({
      where: { 
        invitationCode: code.toUpperCase(),
        status: 'pending'
      },
      include: [
        {
          model: BuinessUsers(),
          as: 'businessUser',
          attributes: ['id', 'businessId', 'role']
        },
        {
          model: User(),
          as: 'inviter',
          attributes: ['firstName', 'lastName', 'email']
        }
      ]
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid invitation code' },
        { status: 404 }
      );
    }

    // Check if invitation is expired
    if (new Date() > invitation.expiredAt) {
      // Update invitation status to expired
      await invitation.update({ status: 'expired' });
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 410 }
      );
    }

    // Check if invitation is already used
    if (invitation.isUsed) {
      return NextResponse.json(
        { error: 'Invitation has already been used' },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        invitationCode: invitation.invitationCode,
        role: invitation.role,
        email: invitation.email,
        message: invitation.message,
        expiresAt: invitation.expiredAt,
        inviter: invitation.inviter,
        businessId: invitation.businessUser.businessId
      }
    });

  } catch (error: any) {
    console.error('Error validating invitation:', error);
    return NextResponse.json(
      { error: 'Failed to validate invitation', details: error.message },
      { status: 500 }
    );
  }
}



