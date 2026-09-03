import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { BookingStatus } from '@/types/api'
import { bookingApi, type GuestPayload, type InitBookingRequest } from './api'

/** Reserve inventory for a room + date range. */
export function useInitBooking() {
  return useMutation({
    mutationFn: (body: InitBookingRequest) => bookingApi.init(body),
  })
}

/** Attach guests to a reservation. */
export function useAddGuests() {
  return useMutation({
    mutationFn: ({ bookingId, guests }: { bookingId: number; guests: GuestPayload[] }) =>
      bookingApi.addGuests(bookingId, guests),
  })
}

/** Kick off payment; resolves to the Stripe (or dev) redirect URL. */
export function useInitiatePayment() {
  return useMutation({
    mutationFn: (bookingId: number) => bookingApi.pay(bookingId),
  })
}

/** Cancel a confirmed booking (refund) and refresh the trips list. */
export function useCancelBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (bookingId: number) => bookingApi.cancel(bookingId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings', 'mine'] }),
  })
}

const TERMINAL: BookingStatus[] = ['CONFIRMED', 'CANCELLED', 'EXPIRED']

/**
 * Poll a booking's status until it reaches a terminal state (confirmed/
 * cancelled/expired). Polling stops automatically once settled.
 */
export function useBookingStatus(bookingId: number | undefined, enabled = true) {
  return useQuery({
    queryKey: ['bookings', 'status', bookingId],
    queryFn: () => bookingApi.status(bookingId as number),
    enabled: enabled && bookingId != null && !Number.isNaN(bookingId),
    refetchInterval: (query) => {
      const status = query.state.data?.bookingStatus
      return status && TERMINAL.includes(status) ? false : 2500
    },
    refetchOnWindowFocus: true,
  })
}

/** The signed-in guest's bookings. */
export function useMyBookings() {
  return useQuery({
    queryKey: ['bookings', 'mine'],
    queryFn: () => bookingApi.myBookings(),
  })
}
