// services/authservices.ts
import axios from 'axios';

interface Credentials {
  username: string;
  password: string;
}

const instance = axios.create({
  baseURL: 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Kijelentkezés funkció
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

// Válasz interceptors: 401-es hibakód kezelése
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout(); // Ha 401-es hiba, kijelentkezés
    }
    return Promise.reject(error);
  },
);

// Bejelentkezés funkció
export const login = async (credentials: Credentials) => {
  try {
    const response = await instance.post('/api/login', {
      username: credentials.username,
      password: credentials.password,
    });
    localStorage.setItem('token', response.data.token); // Token tárolása
    return response; // Visszatérés a válasszal
  } catch (error: any) {
    // Hibaüzenet kezelése
    throw error.response?.data || 'Login failed'; // Visszatér a hibaüzenettel
  }
};

// Authentikációs ellenőrzés
const authApiService = {
  isAuthenticated: () => !!localStorage.getItem('token'),
};

export default authApiService;
