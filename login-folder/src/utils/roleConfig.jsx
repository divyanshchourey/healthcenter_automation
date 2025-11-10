// utils/roleConfig.js
import { User, Heart, Shield } from 'lucide-react';

export const getRoleConfig = (role) => {
  const roleConfigs = {
    doctor: {
      title: 'Doctor Login',
      subtitle: 'Access your medical practice dashboard',
      registerTitle: 'Doctor Registration',
      registerSubtitle: 'Create your medical practice account',
      dashboardTitle: 'Doctor Dashboard',
      icon: <User className="w-6 h-6"/>,
      color: 'from-blue-500 to-blue-600',
      extraFields: ['specialization', 'licenseNumber']
    },
    patient: {
      title: 'Patient Login',
      subtitle: 'Access your health records and appointments',
      registerTitle: 'Patient Registration',
      registerSubtitle: 'Create your health records account',
      dashboardTitle: 'Patient Dashboard',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      extraFields: ['dateOfBirth', 'gender', 'address']
    },
    staff: {
      title: 'Staff Login',
      subtitle: 'Access administrative dashboard',
      registerTitle: 'Staff Registration',
      registerSubtitle: 'Create your administrative account',
      dashboardTitle: 'Staff Dashboard',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      extraFields: ['licenseNumber']
    },
    admin: {
      title: 'Admin Login',
      subtitle: 'Access system administration dashboard',
      registerTitle: 'Admin Registration',
      registerSubtitle: 'Create your administrator account',
      dashboardTitle: 'Admin Dashboard',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      extraFields: []
    }
  };

  return roleConfigs[role] || roleConfigs.doctor;
};