import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice'
import ridesReducer from '../features/rides/rideSlice'

const PERSIST_KEY = 'campus-ride-state-v1'

function seedState() {
  const now = Date.now()
  const days = (n) => new Date(now + n * 24 * 60 * 60 * 1000).toISOString()

  const users = [
    {
      id: 'u_alex',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: 'Password123!',
      phone: '111-222-3333',
      major: 'Computer Science',
      year: '3',
      bio: 'I like short detours and arriving a bit early.',
    },
    {
      id: 'u_sam',
      name: 'Sam Lee',
      email: 'sam@example.com',
      password: 'Password123!',
      phone: '222-333-4444',
      major: 'Business',
      year: '2',
      bio: 'Carpool friendly. Snacks welcome.',
    },
  ]

  const rides = [
    {
      id: 'r_1001',
      driverUserId: 'u_alex',
      driverName: 'Alex Johnson',
      pickupLocation: 'North Gate',
      destination: 'Library',
      departureTime: days(1),
      availableSeats: 2,
      vehicleType: 'Sedan',
      contactInfo: 'alex@example.com',
      notes: 'Quiet ride. Please be on time.',
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'r_1002',
      driverUserId: 'u_sam',
      driverName: 'Sam Lee',
      pickupLocation: 'Student Center',
      destination: 'Gym',
      departureTime: days(2),
      availableSeats: 1,
      vehicleType: 'Hatchback',
      contactInfo: 'sam@example.com',
      notes: 'Bring your water bottle.',
      createdAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'r_1003',
      driverUserId: 'u_alex',
      driverName: 'Alex Johnson',
      pickupLocation: 'Bus Stop A',
      destination: 'Engineering Building',
      departureTime: days(3),
      availableSeats: 3,
      vehicleType: 'SUV',
      contactInfo: 'alex@example.com',
      notes: 'If it rains, we’ll coordinate pickup closer to the entrance.',
      createdAt: new Date(now - 10 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return {
    user: { users, currentUserId: null },
    rides: { rides, rideRequests: [], bookings: [] },
  }
}

function loadPersistedState() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(PERSIST_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.user || !parsed?.rides) return null
    return parsed
  } catch {
    return null
  }
}

const preloadedState = loadPersistedState() ?? seedState()

export const store = configureStore({
  reducer: {
    user: userReducer,
    rides: ridesReducer,
  },
  preloadedState,
})

// Persist “app data” between refreshes.
store.subscribe(() => {
  if (typeof window === 'undefined') return
  try {
    const state = store.getState()
    window.localStorage.setItem(
      PERSIST_KEY,
      JSON.stringify({
        user: state.user,
        rides: state.rides,
      }),
    )
  } catch {
    // Ignore persistence errors (private mode, quota, etc.).
  }
})

