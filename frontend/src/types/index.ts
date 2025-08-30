export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'BUILDING_MANAGER' | 'STAFF' | 'RESIDENT';
  createdAt: string;
  updatedAt: string;
}

export interface Apartment {
  id: string;
  unitNumber: string;
  floor: number;
  areaSqm?: number;
  buildingId: string;
  ownerId?: string;
  owner?: User;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'MAINTENANCE' | 'UTILITIES' | 'NOISE' | 'SECURITY' | 'FACILITIES' | 'OTHER';
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  reporterId: string;
  reporter: User;
  assigneeId?: string;
  assignee?: User;
  apartmentId: string;
  apartment: Apartment;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  complaintId: string;
  authorId: string;
  author: User;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}