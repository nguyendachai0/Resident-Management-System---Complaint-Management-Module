import React from 'react';
import { Complaint } from '../../types';
import { 
  Clock, 
  User, 
  MapPin, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';
import { format } from 'date-fns';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick?: () => void;
  showActions?: boolean;
  onStatusChange?: (id: string, status: string) => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ 
  complaint, 
  onClick, 
  showActions = false,
  onStatusChange 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'IN_PROGRESS': return <Loader className="h-4 w-4" />;
      case 'RESOLVED': return <CheckCircle className="h-4 w-4" />;
      case 'CLOSED': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: