import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { UserService } from '../services/userService';

export class UserController {
  static async getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
      const role = req.query.role as string;
      const search = req.query.search as string;

      const result = await UserService.getUsers({ page, limit, role, search });

      res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.id);

      res.json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);

      res.json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await UserService.deleteUser(req.params.id);

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const stats = await UserService.getUserStats();

      res.json({
        success: true,
        message: 'User statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}