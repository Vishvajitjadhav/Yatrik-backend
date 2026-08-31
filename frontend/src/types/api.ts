/**
 * Shared API types — mirror the backend DTOs in docs/api-contract.md.
 * All backend responses are wrapped in {@link ApiEnvelope}.
 */

export interface ApiError {
  status: string
  message: string
  subErrors?: string[]
}

export interface ApiEnvelope<T> {
  timeStamp: string
  data: T | null
  error: ApiError | null
}

/** Spring Data Page — only the fields the UI uses. */
export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

export type Role = 'GUEST' | 'HOTEL_MANAGER'

export interface User {
  id: number
  name: string
  email: string
  roles: Role[]
}

export interface AuthResponse {
  token: string
  user: User
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER'

export interface HotelContactInfo {
  address?: string
  location?: string
  email?: string
  phoneNumber?: string
}

export interface Hotel {
  id: number
  name: string
  city: string
  photos?: string[]
  amenities?: string[]
  contactInfo?: HotelContactInfo
  active?: boolean
}

export interface Room {
  id: number
  type: string
  basePrice: number
  photos?: string[]
  amenities?: string[]
  totalCount: number
  capacity: number
}

export interface HotelPrice {
  hotel: Hotel
  price: number
}

export interface HotelInfo {
  hotel: Hotel
  rooms: Room[]
}

export type BookingStatus =
  | 'RESERVED'
  | 'GUEST_ADDED'
  | 'PAYMENTS_PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'EXPIRED'

export interface Guest {
  id?: number
  name: string
  gender: Gender
  age: number
}

export interface Booking {
  id: number
  roomsCount: number
  checkInDate: string
  checkOutDate: string
  createdAt: string
  updatedAt?: string
  bookingStatus: BookingStatus
  guests?: Guest[]
  amount: number
}
