export const COMPLAINT_CATEGORIES = {
  MAINTENANCE: 'Maintenance',
  UTILITIES: 'Utilities', 
  NOISE: 'Noise',
  SECURITY: 'Security',
  FACILITIES: 'Facilities',
  OTHER: 'Other'
} as const;

export const COMPLAINT_STATUSES = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed'
} as const;

export const PRIORITY_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent'
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'Super Admin',
  BUILDING_MANAGER: 'Building Manager',
  STAFF: 'Staff',
  RESIDENT: 'Resident'
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';