import { api } from '@/lib/apiClient'
import type { Booking, BookingStatus, Guest } from '@/types/api'

/** Payload for `POST /bookings/init`. Dates are `yyyy-MM-dd` strings. */
export interface InitBookingRequest {
  hotelId: number
  roomId: number
  checkInDate: string
  checkOutDate: string
  roomsCount: number
}

/** A guest to register on a reservation (`POST /bookings/{id}/addGuests`). */
export type GuestPayload = Pick<Guest, 'name' | 'gender' | 'age'>

export const bookingApi = {
  /** Reserve inventory and get a draft booking (status `RESERVED`, amount priced). */
  init: (body: InitBookingRequest) => api.post<Booking>('/bookings/init', body),

  /** Attach guests to a reserved booking (→ `GUEST_ADDED`). */
  addGuests: (bookingId: number, guests: GuestPayload[]) =>
    api.post<Booking>(`/bookings/${bookingId}/addGuests`, guests),

  /** Start payment; returns the Stripe (or dev no-op) redirect URL. */
  pay: (bookingId: number) =>
    api.post<{ sessionUrl: string }>(`/bookings/${bookingId}/payments`),

  /** Cancel a confirmed booking (triggers a refund). */
  cancel: (bookingId: number) => api.post<void>(`/bookings/${bookingId}/cancel`),

  /** Current lifecycle status of a booking. */
  status: (bookingId: number) =>
    api.get<{ bookingStatus: BookingStatus }>(`/bookings/${bookingId}/status`),

  /** The signed-in guest's bookings, newest first. */
  myBookings: () => api.get<Booking[]>('/bookings'),
}
