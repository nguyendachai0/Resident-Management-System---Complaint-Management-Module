import api from './api';
import { Complaint, ApiResponse } from '../types';

export interface ComplaintFilters {
  status?: string;
  category?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateComplaintData {
  title: string;
  description: string;
  category: string;
  priority: string;
  apartmentId: string;
}

export const complaintsService = {
  async getComplaints(filters: ComplaintFilters = {}): Promise<ApiResponse<{
    complaints: Complaint[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    
    const response = await api.get(`/complaints?${params}`);
    return response.data;
  },

  async getComplaint(id: string): Promise<ApiResponse<Complaint>> {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  async createComplaint(data: CreateComplaintData): Promise<ApiResponse<Complaint>> {
    const response = await api.post('/complaints', data);
    return response.data;
  },

  async updateComplaint(id: string, data: Partial<Complaint>): Promise<ApiResponse<Complaint>> {
    const response = await api.put(`/complaints/${id}`, data);
    return response.data;
  },

  async updateComplaintStatus(id: string, status: string): Promise<ApiResponse<Complaint>> {
    const response = await api.put(`/complaints/${id}/status`, { status });
    return response.data;
  },

  async deleteComplaint(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },

  async addComment(complaintId: string, content: string): Promise<ApiResponse<Comment>> {
    const response = await api.post(`/complaints/${complaintId}/comments`, { content });
    return response.data;
  }
};