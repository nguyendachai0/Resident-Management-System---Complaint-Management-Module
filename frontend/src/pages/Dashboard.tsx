import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useComplaints } from '../hooks/useComplaints';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Building,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: complaintsResponse } = useComplaints({ limit: 5 });

  const complaints = complaintsResponse?.data?.complaints || [];
  
  // Calculate stats
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'PENDING').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'RESOLVED').length;
  const urgentComplaints = complaints.filter(c => c.priority === 'URGENT').length;

  const stats = [
    {
      name: 'Total Complaints',
      value: totalComplaints,
      icon: MessageSquare,
      color: 'bg-blue-500',
    },
    {
      name: 'Pending',
      value: pendingComplaints,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      name: 'Resolved',
      value: resolvedComplaints,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      name: 'Urgent',
      value: urgentComplaints,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's what's happening in your building today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-md p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Complaints */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Complaints</h3>
        </div>
        <div className="p-6">
          {complaints.length > 0 ? (
            <div className="space-y-4">
              {complaints.slice(0, 5).map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{complaint.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {complaint.reporter.fullName} • Unit {complaint.apartment.unitNumber}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      complaint.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      complaint.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      complaint.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                      complaint.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      complaint.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {complaint.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Complaints will appear here once they are submitted.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/complaints/new')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                New Complaint
              </span>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="text-center">
              <Users className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Update Profile
              </span>
            </div>
          </button>
          
          {['SUPER_ADMIN', 'BUILDING_MANAGER'].includes(user?.role || '') && (
            <button 
              onClick={() => navigate('/reports')}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="text-center">
                <Building className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  View Reports
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;