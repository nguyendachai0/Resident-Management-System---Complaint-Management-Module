import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateComplaint } from '../../hooks/useComplaints';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const complaintSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(['MAINTENANCE', 'UTILITIES', 'NOISE', 'SECURITY', 'FACILITIES', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  apartmentId: z.string().min(1, 'Please select an apartment'),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

const ComplaintForm: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateComplaint();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      priority: 'MEDIUM',
      category: 'OTHER',
    }
  });

  const onSubmit = async (data: ComplaintFormData) => {
    try {
      await createMutation.mutateAsync(data);
      reset();
      navigate('/complaints');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/complaints')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Complaints
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900">Create New Complaint</h1>
        <p className="mt-1 text-sm text-gray-600">
          Report an issue or request maintenance for your apartment
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              {...register('title')}
              type="text"
              className="input-field mt-1"
              placeholder="Brief description of the issue"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="input-field mt-1"
              placeholder="Detailed description of the issue, including any relevant details..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select {...register('category')} className="input-field mt-1">
                <option value="MAINTENANCE">Maintenance</option>
                <option value="UTILITIES">Utilities</option>
                <option value="NOISE">Noise</option>
                <option value="SECURITY">Security</option>
                <option value="FACILITIES">Facilities</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority *
              </label>
              <select {...register('priority')} className="input-field mt-1">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="apartmentId" className="block text-sm font-medium text-gray-700">
              Apartment *
            </label>
            <select {...register('apartmentId')} className="input-field mt-1">
              <option value="">Select your apartment</option>
              {/* This would be populated from an API call to get user's apartments */}
              <option value="apartment-1">A101 - Floor 1</option>
              <option value="apartment-2">A102 - Floor 1</option>
              <option value="apartment-3">B205 - Floor 2</option>
            </select>
            {errors.apartmentId && (
              <p className="mt-1 text-sm text-red-600">{errors.apartmentId.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/complaints')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Complaint'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;