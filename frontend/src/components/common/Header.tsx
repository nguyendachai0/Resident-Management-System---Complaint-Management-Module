import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';
import { toast } from 'sonner';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'BUILDING_MANAGER': return 'Building Manager';
      case 'STAFF': return 'Staff';
      case 'RESIDENT': return 'Resident';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {complaint.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {complaint.description}
          </p>
        </div>
        
        <div className="flex flex-col space-y-2 ml-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
            {getStatusIcon(complaint.status)}
            <span className="ml-1">{complaint.status.replace('_', ' ')}</span>
          </span>
          
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
            {complaint.priority}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{complaint.reporter.fullName}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>Unit {complaint.apartment.unitNumber}</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{format(new Date(complaint.createdAt), 'MMM dd, yyyy')}</span>
        </div>
      </div>

      {complaint.assignee && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Assigned to:</span>
            <span className="ml-1">{complaint.assignee.fullName}</span>
          </div>
        </div>
      )}

      {showActions && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            {complaint.status === 'PENDING' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange?.(complaint.id, 'IN_PROGRESS');
                }}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Start Progress
              </button>
            )}
            
            {complaint.status === 'IN_PROGRESS' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange?.(complaint.id, 'RESOLVED');
                }}
                className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Mark Resolved
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;