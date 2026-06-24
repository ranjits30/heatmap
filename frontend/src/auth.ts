export type AuthRole = 'ROLE_EMPLOYEE' | 'ROLE_ADMIN';

const AUTH_TOKEN_KEY = 'authToken';
const AUTH_ROLES_KEY = 'authRoles';

export const storeAuthSession = (token: string, roles: string[]) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_ROLES_KEY, JSON.stringify(roles));
};

export const getAuthToken = (): string => localStorage.getItem(AUTH_TOKEN_KEY) || '';

export const getAuthRoles = (): string[] => {
  try {
    const rawRoles = localStorage.getItem(AUTH_ROLES_KEY);
    return rawRoles ? (JSON.parse(rawRoles) as string[]) : [];
  } catch {
    return [];
  }
};

export const isAuthenticated = (): boolean => Boolean(getAuthToken());

export const hasAdminRole = (): boolean => getAuthRoles().some((role) => role === 'ROLE_ADMIN');

export const getDashboardMode = (): 'educator' | 'manager' => {
  const roles = getAuthRoles();
  return roles.includes('ROLE_ADMIN') ? 'manager' : 'educator';
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_ROLES_KEY);
};
