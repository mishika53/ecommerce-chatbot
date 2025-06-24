export const login = (email: string) => {
  localStorage.setItem('user', JSON.stringify({ email, loginTime: new Date().toISOString() }));
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => !!getUser();
