// src/pages/dashboardSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../types/User.ts'; 

// Aszinkron művelet a felhasználók lekéréséhez
export const fetchUsers = createAsyncThunk<User[]>(
  'dashboard/fetchUsers',
  async () => {
    const response = await axios.get<User[]>(`${import.meta.env.VITE_API_URL}/api/users`);
    return response.data;
  },
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
      });
  },
});

export default dashboardSlice.reducer;
