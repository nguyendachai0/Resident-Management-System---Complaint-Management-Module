import { prisma } from '../config/database';
import { ComplaintFilters } from '../types';
import { ComplaintStatus, Priority } from '@prisma/client';

export class ComplaintService {
  static async createComplaint(data: {
    title: string;
    description: string;
    category: string;
    priority?: string;
    apartmentId: string;
    reporterId: string;
  }) {
    const complaint = await prisma.complaint.create({
      data: {
        ...data,
        priority: data.priority as Priority || 'MEDIUM'
      },
      include: {
        reporter: {
          select: { id: true, fullName: true, email: true }
        },
        apartment: {
          select: { id: true, unitNumber: true, floor: true }
        }
      }
    });

    return complaint;
  }

  static async getComplaints(filters: ComplaintFilters, userId: string, userRole: string) {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 10, 100);
    const skip = (page - 1) * limit;

    let whereClause: any = {};

    // Role-based filtering
    if (userRole === 'RESIDENT') {
      whereClause.reporterId = userId;
    }

    // Apply filters
    if (filters.status) {
      whereClause.status = filters.status;
    }
    if (filters.category) {
      whereClause.category = filters.category;
    }
    if (filters.priority) {
      whereClause.priority = filters.priority;
    }
    if (filters.assigneeId) {
      whereClause.assigneeId = filters.assigneeId;
    }

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc'
        },
        include: {
          reporter: {
            select: { id: true, fullName: true, email: true }
          },
          assignee: {
            select: { id: true, fullName: true, email: true }
          },
          apartment: {
            select: { id: true, unitNumber: true, floor: true }
          },
          _count: {
            select: { comments: true }
          }
        }
      }),
      prisma.complaint.count({ where: whereClause })
    ]);

    return {
      complaints,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getComplaintById(id: string, userId: string, userRole: string) {
    let whereClause: any = { id };

    if (userRole === 'RESIDENT') {
      whereClause.reporterId = userId;
    }

    const complaint = await prisma.complaint.findFirst({
      where: whereClause,
      include: {
        reporter: {
          select: { id: true, fullName: true, email: true, phone: true }
        },
        assignee: {
          select: { id: true, fullName: true, email: true }
        },
        apartment: {
          select: { id: true, unitNumber: true, floor: true }
        },
        comments: {
          include: {
            author: {
              select: { id: true, fullName: true, role: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!complaint) {
      throw new Error('Complaint not found or access denied');
    }

    return complaint;
  }

  static async updateComplaint(
    id: string,
    updates: {
      title?: string;
      description?: string;
      category?: string;
      priority?: string;
      status?: string;
      assigneeId?: string;
    },
    userId: string,
    userRole: string
  ) {
    // Check permissions
    const existingComplaint = await prisma.complaint.findUnique({
      where: { id },
      select: { reporterId: true }
    });

    if (!existingComplaint) {
      throw new Error('Complaint not found');
    }

    // Residents can only update their own complaints and limited fields
    if (userRole === 'RESIDENT') {
      if (existingComplaint.reporterId !== userId) {
        throw new Error('Access denied');
      }
      // Residents cannot change status or assignee
      delete updates.status;
      delete updates.assigneeId;
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        ...updates,
        ...(updates.status === 'RESOLVED' ? { resolvedAt: new Date() } : {})
      },
      include: {
        reporter: {
          select: { id: true, fullName: true, email: true }
        },
        assignee: {
          select: { id: true, fullName: true, email: true }
        },
        apartment: {
          select: { id: true, unitNumber: true, floor: true }
        }
      }
    });

    return updatedComplaint;
  }

  static async deleteComplaint(id: string, userId: string, userRole: string) {
    const complaint = await prisma.complaint.findUnique({
      where: { id },
      select: { reporterId: true }
    });

    if (!complaint) {
      throw new Error('Complaint not found');
    }

    // Only allow deletion by reporter or admin roles
    if (userRole === 'RESIDENT' && complaint.reporterId !== userId) {
      throw new Error('Access denied');
    }

    await prisma.complaint.delete({
      where: { id }
    });

    return true;
  }

  static async addComment(complaintId: string, content: string, authorId: string) {
    const comment = await prisma.comment.create({
      data: {
        content,
        complaintId,
        authorId
      },
      include: {
        author: {
          select: { id: true, fullName: true, role: true }
        }
      }
    });

    return comment;
  }
}