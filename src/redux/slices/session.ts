import { createSlice } from '@reduxjs/toolkit';
// import { dispatch } from '../store';

// ----------------------------------------------------------------------

type SessionTypes = {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: null | {
    name: string;
    email: string;
  };
  address: null | {
    street?: string;
    district?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    description?: string;
    lat?: number;
    lng?: number;
  },
}

const initialState: SessionTypes = {
  isLoading: false,
  error: null,
  isAuthenticated: false,
  user: null,
  address: null,
};

const slice = createSlice({
  name: 'session',
  initialState,
  reducers: {

    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // SET ADDRESS
    setAddress(state, action) {
      state.address = action.payload;
    },

    // LOGIN
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },

    // LOGOUT
    logout(state) {
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = false;
      state.user = null,
      state.address = null;
    },

  },
});

// Reducer
export default slice.reducer;

// Actions
export const { startLoading, login, logout, setAddress } = slice.actions;
