export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getUser()?.token;
};

export const getUserRole = () => {
  return getUser()?.role || '';
};

export const isAdmin = () => {
  return getUserRole() === 'ROLE_ADMIN';
};

export const getUserEmail = () => {
  return getUser()?.email || '';
};

export const getUserName = () => {
  return getUser()?.name || '';
};