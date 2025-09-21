import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '../../../../_lib/auth';
import { BuinessInvitation, BuinessUsers } from '../../../../../../models/associationt.ts/association';

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
