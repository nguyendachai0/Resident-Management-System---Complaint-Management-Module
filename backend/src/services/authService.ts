import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { UserRole } from '@prisma/client';

export class AuthService {
  static async register(userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: UserRole;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const passwordHash = await bcrypt.hash(userData.password, 12);

    const user = await prisma.user.create({
      data: {
        ...userData,
        passwordHash,
        role: userData.role || 'RESIDENT'
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        createdAt: true
      }
    });

    const token = this.generateToken(user.id);
    
    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        fullName: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);
    
    const { passwordHash, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword, token };
  }

  static async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
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
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  static async updateProfile(userId: string, updates: {
    fullName?: string;
    phone?: string;
  }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: updates,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        updatedAt: true
      }
    });

    return user;
  }

  static generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }
}