// utils/routing.js

// Route constants
export const ROUTES = {
  ROLE_SELECTION: 'role-selection',
  LOGIN: 'login',
  REGISTER: 'register',
  DASHBOARD: 'dashboard'
};

// Navigation helper functions
export class NavigationHelper {
  constructor(setCurrentPage, setSelectedRole) {
    this.setCurrentPage = setCurrentPage;
    this.setSelectedRole = setSelectedRole;
  }

  navigateTo(page, role = null) {
    this.setCurrentPage(page);
    if (role) {
      this.setSelectedRole(role);
    }
  }

  goToRoleSelection() {
    this.navigateTo(ROUTES.ROLE_SELECTION);
  }

  goToLogin(role) {
    this.navigateTo(ROUTES.LOGIN, role);
  }

  goToRegister(role) {
    this.navigateTo(ROUTES.REGISTER, role);
  }

  goToDashboard() {
    this.navigateTo(ROUTES.DASHBOARD);
  }
}

// Route validation
export const isValidRoute = (route) => {
  return Object.values(ROUTES).includes(route);
};

// Get default route
export const getDefaultRoute = () => {
  return ROUTES.ROLE_SELECTION;
};