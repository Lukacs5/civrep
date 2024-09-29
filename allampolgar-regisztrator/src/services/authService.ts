// services/authService.ts
const apiAuthService = {
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return token ? true : false;
  },
  login: (username: string, password: string) => {
    if (username === 'test' && password === 'password') {
      localStorage.setItem('token', 'fake-jwt-token');
      return Promise.resolve(true);
    } else {
      return Promise.reject('Invalid credentials');
    }
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

export default apiAuthService;
