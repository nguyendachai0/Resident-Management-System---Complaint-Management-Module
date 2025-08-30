import React, { useState } from 'react';
import { useComplaints, useUpdateComplaintStatus } from '../../hooks/useComplaints';
import { useAuth } from '../../contexts/AuthContext';
import ComplaintCard from './ComplaintCard';
import ComplaintFilters from './ComplaintFilters';
import LoadingSpinner from '../common/LoadingSpinner';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComplaintList: React.FC = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    category: '',
    priority: '',
    search: ''
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useComplaints(filters);
  const updateStatusMutation = useUpdateComplaintStatus();

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleComplaintClick = (complaintId: string) => {
    navigate(`/complaints/${complaintId}`);
  };

  const canManageComplaints = ['SUPER_ADMIN', 'BUILDING_MANAGER', 'STAFF'].includes(user?.role || '');

  if (isLoading) return <LoadingSpinner text="Loading complaints..." />;
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading complaints. Please try again.</p>
      </div>
    );
  }

  const complaints = response?.data?.complaints || [];
  const pagination = response?.data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and track all resident complaints
          </p>
        </div>
        
        <button
          onClick={() => navigate('/complaints/new')}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Complaint
        </button>
      </div>

      <ComplaintFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {complaints.map((complaint) => (
          <ComplaintCard
            key={complaint.id}
            complaint={complaint}
            onClick={() => handleComplaintClick(complaint.id)}
            showActions={canManageComplaints}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {complaints.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new complaint.
          </p>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page <= 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
              disabled={pagination.page >= pagination.totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setFilters(prev => ({ ...prev, page: pageNum }))}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      pageNum === pagination.page
                        ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintList;