import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
  rides: [],
  rideRequests: [],
  bookings: [],
}

export const addRide = createAsyncThunk(
  'rides/addRide',
  async (input, { rejectWithValue }) => {
    if (!input.pickupLocation.trim()) return rejectWithValue('Pickup location is required.')
    if (!input.destination.trim()) return rejectWithValue('Destination is required.')
    if (!input.departureTime) return rejectWithValue('Departure time is required.')
    if (!input.vehicleType.trim()) return rejectWithValue('Vehicle type is required.')
    if (!input.contactInfo.trim()) return rejectWithValue('Contact information is required.')

    const availableSeats = Number(input.availableSeats)
    if (!Number.isFinite(availableSeats) || availableSeats <= 0) {
      return rejectWithValue('Available seats must be greater than 0.')
    }

    const id = globalThis.crypto?.randomUUID?.() ?? `r_${Math.random().toString(16).slice(2)}_${Date.now()}`
    const ride = {
      id,
      driverUserId: input.driverUserId,
      driverName: input.driverName,
      pickupLocation: input.pickupLocation.trim(),
      destination: input.destination.trim(),
      departureTime: input.departureTime,
      availableSeats,
      vehicleType: input.vehicleType.trim(),
      contactInfo: input.contactInfo.trim(),
      notes: input.notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
    }

    return { ride }
  },
)

export const requestRide = createAsyncThunk(
  'rides/requestRide',
  async (input, { rejectWithValue }) => {
    if (!input.rideId) return rejectWithValue('Ride is required.')
    if (!input.requesterId) return rejectWithValue('You must be logged in.')

    const id = globalThis.crypto?.randomUUID?.() ?? `req_${Math.random().toString(16).slice(2)}_${Date.now()}`
    const request = {
      id,
      rideId: input.rideId,
      requesterId: input.requesterId,
      message: input.message?.trim() || undefined,
      requestedAt: new Date().toISOString(),
    }

    return { request }
  },
)

export const bookSeat = createAsyncThunk(
  'rides/bookSeat',
  async (input, { getState, rejectWithValue }) => {
    const state = getState()
    const ride = state.rides.rides.find((r) => r.id === input.rideId)
    if (!ride) return rejectWithValue('Ride not found.')
    if (ride.availableSeats <= 0) return rejectWithValue('No seats available.')

    const alreadyBooked = state.rides.bookings.some((b) => b.rideId === input.rideId && b.userId === input.userId)
    if (alreadyBooked) return rejectWithValue('You already booked this ride.')

    const id = globalThis.crypto?.randomUUID?.() ?? `b_${Math.random().toString(16).slice(2)}_${Date.now()}`
    const booking = {
      id,
      rideId: input.rideId,
      userId: input.userId,
      bookedAt: new Date().toISOString(),
    }

    return { booking }
  },
)

const ridesSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRide.fulfilled, (state, action) => {
        state.rides.unshift(action.payload.ride)
      })
      .addCase(requestRide.fulfilled, (state, action) => {
        state.rideRequests.unshift(action.payload.request)
      })
      .addCase(bookSeat.fulfilled, (state, action) => {
        const ride = state.rides.find((r) => r.id === action.payload.booking.rideId)
        if (!ride) return
        if (ride.availableSeats <= 0) return
        ride.availableSeats -= 1
        state.bookings.unshift(action.payload.booking)
      })
  },
})

export default ridesSlice.reducer

// Selectors
export const selectRides = (state) => state.rides.rides
export const selectRideById = (state, rideId) => state.rides.rides.find((r) => r.id === rideId) ?? null
export const selectBookingsForUser = (state, userId) => state.rides.bookings.filter((b) => b.userId === userId)
export const selectRideRequestsForUser = (state, userId) =>
  state.rides.rideRequests.filter((r) => r.requesterId === userId)

