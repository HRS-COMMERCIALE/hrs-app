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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const roleFilter = searchParams.get('role') || 'all';
    const statusFilter = searchParams.get('status') || 'all';
    const searchTerm = searchParams.get('search') || '';

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
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

    // Build where clause
    const whereClause: any = {
      businessId: parseInt(businessId)
    };

    if (roleFilter !== 'all') {
      whereClause.role = roleFilter;
    }

    if (statusFilter === 'banned') {
      whereClause.isBanned = true;
    } else if (statusFilter === 'active') {
      whereClause.isBanned = false;
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Get users with related data
    const { count, rows: businessUsers } = await BuinessUsers().findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User(),
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          where: searchTerm ? {
            [require('sequelize').Op.or]: [
              { firstName: { [require('sequelize').Op.iLike]: `%${searchTerm}%` } },
              { lastName: { [require('sequelize').Op.iLike]: `%${searchTerm}%` } },
              { email: { [require('sequelize').Op.iLike]: `%${searchTerm}%` } }
            ]
          } : undefined,
          required: true
        }
      ],
      order: [['joinedAt', 'DESC']],
      limit: limit,
      offset: offset
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Transform data for frontend
    const users = businessUsers.map((bu: any) => ({
      id: bu.id.toString(),
      name: `${bu.user.firstName} ${bu.user.lastName}`,
      email: bu.user.email,
      role: bu.role,
      status: bu.isBanned ? 'banned' : 'active',
      isOnline: bu.isOnline,
      lastSeen: bu.lastActiveAt ? new Date(bu.lastActiveAt).toLocaleString() : 'Never',
      joinDate: bu.joinedAt ? new Date(bu.joinedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      department: 'General', // You can add department field to BuinessUsers if needed
      isBanned: bu.isBanned,
      bannedReason: bu.bannedReason,
      bannedAt: bu.bannedAt
    }));

    return NextResponse.json({
      success: true,
      users,
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
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}
