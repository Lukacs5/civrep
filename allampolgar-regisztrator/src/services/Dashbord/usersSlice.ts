// src/pages/dashboardSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../types/User.ts'; 
import { manageUser } from '../apiService';

export const fetchUsers = createAsyncThunk<User[]>(
  'dashboard/fetchUsers',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get<User[]>(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);


export const createUser = createAsyncThunk(
  'dashboard/createUser',
  async (user: User) => {
    const response = await manageUser('create', null, user);
    return response.data; // assuming the response contains the created user
  }
);

export const updateUser = createAsyncThunk(
  'dashboard/updateUser',
  async (user: User) => {
    const response = await manageUser('update', user.id, user);
    return response.data; // assuming the response contains the updated user
  }
);

const dashboardSlice = createSlice({
  name: 'users',
  initialState: {
    users: [] as User[],
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        // Handle the updated user
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload; // Update the user in the state
        }
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload); // Add the new user to the state
      });
  },
});

export default dashboardSlice.reducer;
