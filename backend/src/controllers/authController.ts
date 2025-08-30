import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { registerSchema, loginSchema } from '../utils/validators';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const result = await AuthService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error: any) {
      if (error.message === 'Email already registered') {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  static async getProfile(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const user = await AuthService.getUserProfile(userId);

      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const updates = req.body;
      
      const user = await AuthService.updateProfile(userId, updates);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response) {
    // With JWT, logout is handled on the client side
    // But we can add token blacklisting here if needed
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }
}