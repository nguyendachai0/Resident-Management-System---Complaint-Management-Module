import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  MessageSquare, 
  Users, 
  Building, 
  BarChart3,
  Settings,
  User
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['SUPER_ADMIN', 'BUILDING_MANAGER', 'STAFF', 'RESIDENT'] },
    { name: 'Complaints', href: '/complaints', icon: MessageSquare, roles: ['SUPER_ADMIN', 'BUILDING_MANAGER', 'STAFF', 'RESIDENT'] },
    { name: 'Users', href: '/users', icon: Users, roles: ['SUPER_ADMIN', 'BUILDING_MANAGER'] },
    { name: 'Apartments', href: '/apartments', icon: Building, roles: ['SUPER_ADMIN', 'BUILDING_MANAGER'] },
    { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['SUPER_ADMIN', 'BUILDING_MANAGER'] },
    { name: 'Profile', href: '/profile', icon: User, roles: ['SUPER_ADMIN', 'BUILDING_MANAGER', 'STAFF', 'RESIDENT'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['SUPER_ADMIN'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="w-64 bg-white h-screen shadow-sm border-r border-gray-200">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon
                className="mr-3 h-5 w-5"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;