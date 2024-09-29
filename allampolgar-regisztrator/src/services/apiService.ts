// services/apiServices.ts
import axios, { AxiosInstance } from 'axios';

interface Credentials {
  username: string;
  password: string;
}

const instance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
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
/*
export const deleteUserById = async (id: number) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await instance.delete(`/api/users/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Token hozzáadása az Authorization headerhez
      },
    });
    
    return response;
  } catch (error) {
    throw error;
  }
};
*/

export const manageUser = async (
  operation: 'create' | 'update' | 'delete' | 'get',
  id: number | null,
  data: any = null
) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    let url: string;
    let method: 'post' | 'put' | 'delete' | 'get';

    switch (operation) {
      case 'create':
        url = '/api/users/register';
        method = 'post';
        break;
      case 'update':
        if (id === null) throw new Error('ID is required for update');
        url = `/api/users/update/${id}`;
        method = 'put';
        break;
      case 'delete':
        if (id === null) throw new Error('ID is required for delete');
        url = `/api/users/delete/${id}`;
        method = 'delete';
        break;
      case 'get':
        if (id === null) throw new Error('ID is required for get');
        url = `/api/users/${id}`;
        method = 'get';
        break;
      default:
        throw new Error('Invalid operation');
    }

    // Használjuk a konkrét metódust
    const response = await instance[method](url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};


export default authApiService;
