import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).required(),
  phone: Joi.string().optional(),
  role: Joi.string().valid('RESIDENT', 'STAFF', 'BUILDING_MANAGER', 'SUPER_ADMIN').optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const complaintSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).required(),
  category: Joi.string().valid(
    'MAINTENANCE', 'SECURITY', 'NOISE', 'FACILITIES', 'UTILITIES', 'OTHER'
  ).required(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').optional(),
  apartmentId: Joi.string().required()
});

export const updateComplaintSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  description: Joi.string().min(10).optional(),
  category: Joi.string().valid(
    'MAINTENANCE', 'SECURITY', 'NOISE', 'FACILITIES', 'UTILITIES', 'OTHER'
  ).optional(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').optional(),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED').optional(),
  assigneeId: Joi.string().optional()
});