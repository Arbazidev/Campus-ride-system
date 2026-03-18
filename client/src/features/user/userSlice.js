import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [],
  currentUserId: null,
}

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (input, { getState, rejectWithValue }) => {
    const state = getState()
    const email = normalizeEmail(input.email)

    if (!input.name.trim()) return rejectWithValue('Name is required.')
    if (!email) return rejectWithValue('Email is required.')
    if (input.password.length < 6) return rejectWithValue('Password must be at least 6 characters.')

    if (state.user.users.some((u) => normalizeEmail(u.email) === email)) {
      return rejectWithValue('An account with this email already exists.')
    }

    const id = globalThis.crypto?.randomUUID?.() ?? `u_${Math.random().toString(16).slice(2)}_${Date.now()}`
    const user = {
      id,
      name: input.name.trim(),
      email,
      password: input.password,
      phone: input.phone?.trim(),
      major: input.major?.trim(),
      year: input.year?.trim(),
      bio: input.bio?.trim(),
    }

    return { user }
  },
)

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (input, { getState, rejectWithValue }) => {
    const state = getState()
    const email = normalizeEmail(input.email)
    const user = state.user.users.find((u) => normalizeEmail(u.email) === email)

    if (!user) return rejectWithValue('Invalid email or password.')
    if (user.password !== input.password) return rejectWithValue('Invalid email or password.')

    return { userId: user.id }
  },
)

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (input, { getState, rejectWithValue }) => {
    const state = getState()
    if (!state.user.currentUserId) return rejectWithValue('You must be logged in.')

    const user = state.user.users.find((u) => u.id === state.user.currentUserId)
    if (!user) return rejectWithValue('User not found.')
    if (user.password !== input.oldPassword) return rejectWithValue('Old password is incorrect.')
    if (input.newPassword.length < 6) return rejectWithValue('New password must be at least 6 characters.')

    return { newPassword: input.newPassword }
  },
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.currentUserId = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.users.push(action.payload.user)
        state.currentUserId = action.payload.user.id
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUserId = action.payload.userId
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        if (!state.currentUserId) return
        const user = state.users.find((u) => u.id === state.currentUserId)
        if (!user) return
        user.password = action.payload.newPassword
      })
  },
})

export const { logout } = userSlice.actions
export default userSlice.reducer

// Selectors
export const selectCurrentUser = (state) =>
  state.user.currentUserId ? state.user.users.find((u) => u.id === state.user.currentUserId) ?? null : null

export const selectUserById = (state, userId) => state.user.users.find((u) => u.id === userId) ?? null

export const selectUsers = (state) => state.user.users

