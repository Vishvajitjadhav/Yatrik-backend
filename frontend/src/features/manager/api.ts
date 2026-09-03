import { api } from '@/lib/apiClient'
import type { Hotel, HotelContactInfo, Room } from '@/types/api'

/** Editable fields of a hotel (create + update share this shape). */
export interface HotelInput {
  name: string
  city: string
  photos: string[]
  amenities: string[]
  contactInfo: HotelContactInfo
  active?: boolean
}

/** Editable fields of a room. */
export interface RoomInput {
  type: string
  basePrice: number
  photos: string[]
  amenities: string[]
  totalCount: number
  capacity: number
}

export const managerApi = {
  // Hotels (owner-scoped) — base path /admin/hotels
  listHotels: () => api.get<Hotel[]>('/admin/hotels'),
  getHotel: (hotelId: number) => api.get<Hotel>(`/admin/hotels/${hotelId}`),
  createHotel: (body: HotelInput) => api.post<Hotel>('/admin/hotels', body),
  updateHotel: (hotelId: number, body: HotelInput) =>
    api.put<Hotel>(`/admin/hotels/${hotelId}`, body),
  deleteHotel: (hotelId: number) => api.delete<void>(`/admin/hotels/${hotelId}`),

  /** Publish a hotel: sets `active=true` and generates a year of inventory. */
  activateHotel: (hotelId: number) =>
    api.patch<void>(`/admin/hotels/${hotelId}/activate`),

  // Rooms
  listRooms: (hotelId: number) => api.get<Room[]>(`/admin/hotels/${hotelId}/rooms`),
  createRoom: (hotelId: number, body: RoomInput) =>
    api.post<Room>(`/admin/hotels/${hotelId}/rooms`, body),
  deleteRoom: (hotelId: number, roomId: number) =>
    api.delete<void>(`/admin/hotels/${hotelId}/rooms/${roomId}`),
}
