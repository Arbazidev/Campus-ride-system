import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice'
import ridesReducer from '../features/rides/rideSlice'

const PERSIST_KEY = 'campus-ride-state-v2'

function seedState() {
  const now = Date.now()
  const days = (n) => new Date(now + n * 24 * 60 * 60 * 1000).toISOString()

  const users = [
    {
      id: 'u_arbaz',
      name: 'Arbaz Khan',
      email: 'arbaz@example.com',
      password: 'Password123!',
      phone: '111-222-3333',
      major: 'Computer Science',
      year: '3',
      bio: 'I like planned routes and timely pickups.',
    },
    {
      id: 'u_ali',
      name: 'Ali Raza',
      email: 'ali@example.com',
      password: 'Password123!',
      phone: '222-333-4444',
      major: 'Business',
      year: '2',
      bio: 'Carpool friendly. Snacks welcome.',
    },
    {
      id: 'u_ahmad',
      name: 'Ahmad Noor',
      email: 'ahmad@example.com',
      password: 'Password123!',
      phone: '333-444-5555',
      major: 'Mechanical Engineering',
      year: '4',
      bio: 'I usually drive to the labs in the evening.',
    },
    {
      id: 'u_sara',
      name: 'Sara Ahmed',
      email: 'sara@example.com',
      password: 'Password123!',
      phone: '444-555-6666',
      major: 'Architecture',
      year: '1',
      bio: 'Friendly and punctual. Happy to coordinate pickup points.',
    },
  ]

  const rides = [
    {
      id: 'r_1001',
      driverUserId: 'u_arbaz',
      driverName: 'Arbaz Khan',
      pickupLocation: 'North Gate',
      destination: 'Library',
      departureTime: days(1),
      availableSeats: 2,
      vehicleType: 'Sedan',
      contactInfo: 'arbaz@example.com',
      notes: 'Quiet ride. Please be on time.',
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'r_1002',
      driverUserId: 'u_ali',
      driverName: 'Ali Raza',
      pickupLocation: 'Student Center',
      destination: 'Gym',
      departureTime: days(2),
      availableSeats: 1,
      vehicleType: 'Hatchback',
      contactInfo: 'ali@example.com',
      notes: 'Bring your water bottle.',
      createdAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'r_1003',
      driverUserId: 'u_ahmad',
      driverName: 'Ahmad Noor',
      pickupLocation: 'Bus Stop A',
      destination: 'Engineering Building',
      departureTime: days(3),
      availableSeats: 3,
      vehicleType: 'SUV',
      contactInfo: 'ahmad@example.com',
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

