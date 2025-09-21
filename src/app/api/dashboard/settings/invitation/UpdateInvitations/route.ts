import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '../../../../_lib/auth';
import { BuinessInvitation, BuinessUsers } from '../../../../../../models/associationt.ts/association';

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
      invitationId, 
      action, // 'cancel', 'resend', 'expire'
      expiresInDays = 7 
    } = body;

    // Validate required fields
    if (!invitationId || !action) {
      return NextResponse.json(
        { error: 'Invitation ID and action are required' },
        { status: 400 }
      );
    }

    // Get the invitation
    const invitation = await BuinessInvitation().findByPk(invitationId);
    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Check if the current user has permission to manage invitations (admin only)
    const currentBusinessUser = await BuinessUsers().findOne({
      where: { 
        userId: currentUser.userId,
        businessId: (await BuinessUsers().findByPk(invitation.businessUserId))?.businessId
      }
    });

    if (!currentBusinessUser || currentBusinessUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions to manage invitations' },
        { status: 403 }
      );
    }

    let updatedInvitation;

    switch (action) {
      case 'cancel':
        updatedInvitation = await invitation.update({
          status: 'cancelled'
        });
        break;

      case 'resend':
        // Generate new expiration date
        const expiredAt = new Date();
        expiredAt.setDate(expiredAt.getDate() + expiresInDays);
        
        updatedInvitation = await invitation.update({
          status: 'pending',
          expiredAt: expiredAt,
          isUsed: false,
          usedAt: null,
          usedBy: null
        });
        break;

      case 'expire':
        updatedInvitation = await invitation.update({
          status: 'expired',
          expiredAt: new Date() // Set to current time to expire immediately
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be cancel, resend, or expire' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      invitation: {
        id: updatedInvitation.id,
        invitationCode: updatedInvitation.invitationCode,
        role: updatedInvitation.role,
        status: updatedInvitation.status,
        isUsed: updatedInvitation.isUsed,
        usedAt: updatedInvitation.usedAt,
        expiredAt: updatedInvitation.expiredAt,
        createdAt: updatedInvitation.createdAt,
        inviteUrl: `${updatedInvitation.invitationCode}`
      }
    });

  } catch (error: any) {
    console.error('Error updating invitation:', error);
    return NextResponse.json(
      { error: 'Failed to update invitation', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Authenticate the user
    const authResult = await getAuthPayload(request);
    if (!authResult.ok) {
      return authResult.response;
    }
    const currentUser = authResult.payload;

    // Get invitation ID from URL
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('id');

    if (!invitationId) {
      return NextResponse.json(
        { error: 'Invitation ID is required' },
        { status: 400 }
      );
    }

    // Get the invitation
    const invitation = await BuinessInvitation().findByPk(invitationId);
    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Check if the current user has permission to delete invitations (admin only)
    const currentBusinessUser = await BuinessUsers().findOne({
      where: { 
        userId: currentUser.userId,
        businessId: (await BuinessUsers().findByPk(invitation.businessUserId))?.businessId
      }
    });

    if (!currentBusinessUser || currentBusinessUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions to delete invitations' },
        { status: 403 }
      );
    }

    // Delete the invitation
    await invitation.destroy();

    return NextResponse.json({
      success: true,
      message: 'Invitation deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting invitation:', error);
    return NextResponse.json(
      { error: 'Failed to delete invitation', details: error.message },
      { status: 500 }
    );
  }
}
