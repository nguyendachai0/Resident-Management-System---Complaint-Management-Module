import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { ComplaintService } from '../services/complaintService';
import { complaintSchema, updateComplaintSchema } from '../utils/validators';

export class ComplaintController {
  static async createComplaint(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { error } = complaintSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const complaint = await ComplaintService.createComplaint({
        ...req.body,
        reporterId: req.user!.id
      });

      res.status(201).json({
        success: true,
        message: 'Complaint created successfully',
        data: complaint
      });
    } catch (error) {
      next(error);
    }
  }

  static async getComplaints(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        status: req.query.status as string,
        category: req.query.category as string,
        priority: req.query.priority as string,
        assigneeId: req.query.assigneeId as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      const result = await ComplaintService.getComplaints(
        filters,
        req.user!.id,
        req.user!.role
      );

      res.json({
        success: true,
        message: 'Complaints retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getComplaintById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const complaint = await ComplaintService.getComplaintById(
        req.params.id,
        req.user!.id,
        req.user!.role
      );

      res.json({
        success: true,
        message: 'Complaint retrieved successfully',
        data: complaint
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateComplaint(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { error } = updateComplaintSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const complaint = await ComplaintService.updateComplaint(
        req.params.id,
        req.body,
        req.user!.id,
        req.user!.role
      );

      res.json({
        success: true,
        message: 'Complaint updated successfully',
        data: complaint
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteComplaint(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await ComplaintService.deleteComplaint(
        req.params.id,
        req.user!.id,
        req.user!.role
      );

      res.json({
        success: true,
        message: 'Complaint deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async addComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { content } = req.body;
      
      if (!content || content.trim().length < 1) {
        return res.status(400).json({
          success: false,
          message: 'Comment content is required'
        });
      }

      const comment = await ComplaintService.addComment(
        req.params.id,
        content,
        req.user!.id
      );

      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: comment
      });
    } catch (error) {
      next(error);
    }
  }
}