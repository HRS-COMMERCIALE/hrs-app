import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '../../../../_lib/auth';
import { BuinessInvitation, BuinessUsers, User } from '../../../../../../models/associationt.ts/association';

export async function GET(request: NextRequest) {
  try {
    // Authenticate the user
    const authResult = await getAuthPayload(request);
    if (!authResult.ok) {
      return authResult.response;
    }
    const currentUser = authResult.payload;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Check if user has permission to view invitations (admin only)
    const currentBusinessUser = await BuinessUsers().findOne({
      where: { 
        userId: currentUser.userId,
        businessId: parseInt(businessId)
      }
    });

    if (!currentBusinessUser || currentBusinessUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions to view invitations' },
        { status: 403 }
      );
    }

    // Build where clause
    const whereClause: any = {
      businessUserId: {
        [require('sequelize').Op.in]: await BuinessUsers().findAll({
          where: { businessId: parseInt(businessId) },
          attributes: ['id']
        }).then((users: any[]) => users.map((u: any) => u.id))
      }
    };

    if (status !== 'all') {
      whereClause.status = status;
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Get invitations with related data
    const { count, rows: invitations } = await BuinessInvitation().findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User(),
          as: 'inviter',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User(),
          as: 'usedByUser',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: BuinessUsers(),
          as: 'businessUser',
          attributes: ['id', 'role', 'businessId']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      invitations: invitations.map((inv: any) => ({
        id: inv.id,
        invitationCode: inv.invitationCode,
        role: inv.role,
        status: inv.status,
        isUsed: inv.isUsed,
        usedAt: inv.usedAt,
        expiredAt: inv.expiredAt,
        createdAt: inv.createdAt,
        inviter: inv.inviter,
        usedByUser: inv.usedByUser,
        businessUser: inv.businessUser,
        inviteUrl: `${inv.invitationCode}`,
        isExpired: new Date(inv.expiredAt) < new Date()
      })),
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage
      }
    });

  } catch (error: any) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitations', details: error.message },
      { status: 500 }
    );
  }
}
