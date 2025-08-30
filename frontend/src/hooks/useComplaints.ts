import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintsService, ComplaintFilters } from '../services/complaints';
import { toast } from 'sonner';

export const useComplaints = (filters: ComplaintFilters = {}) => {
  return useQuery({
    queryKey: ['complaints', filters],
    queryFn: () => complaintsService.getComplaints(filters),
  });
};

export const useComplaint = (id: string) => {
  return useQuery({
    queryKey: ['complaint', id],
    queryFn: () => complaintsService.getComplaint(id),
    enabled: !!id,
  });
};

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: complaintsService.createComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast.success('Complaint created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create complaint');
    },
  });
};

export const useUpdateComplaintStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      complaintsService.updateComplaintStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint'] });
      toast.success('Complaint status updated!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
};