import { prisma } from '../config/database';

export class UserService {
  static async getUsers(filters: {
    page: number;
    limit: number;
    role?: string;
    search?: string;
  }) {
    const { page, limit, role, search } = filters;
    const skip = (page - 1) * limit;

    let whereClause: any = {
      isActive: true
    };

    if (role) {
      whereClause.role = role;
    }

    if (search) {
      whereClause.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          phone: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              apartments: true,
              reportedComplaints: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where: whereClause })
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        apartments: {
          select: {
            id: true,
            unitNumber: true,
            floor: true,
            building: {
              select: { name: true }
            }
          }
        },
        reportedComplaints: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true
          },
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  static async updateUser(id: string, updates: {
    fullName?: string;
    phone?: string;
    role?: string;
    isActive?: boolean;
  }) {
    const user = await prisma.user.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        isActive: true,
        updatedAt: true
      }
    });

    return user;
  }

  static async deleteUser(id: string) {
    // Soft delete by setting isActive to false
    await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });

    return true;
  }

  static async getUserStats() {
    const [totalUsers, activeUsers, roleStats, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
        where: { isActive: true }
      }),
      prisma.user.findMany({
        where: { isActive: true },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      roleDistribution: roleStats,
      recentUsers
    };
  }
}