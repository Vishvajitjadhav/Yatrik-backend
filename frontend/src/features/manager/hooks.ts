import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { managerApi, type HotelInput, type RoomInput } from './api'

const HOTELS = ['manager', 'hotels'] as const
const rooms = (hotelId: number) => ['manager', 'rooms', hotelId] as const

/** All hotels owned by the signed-in manager. */
export function useMyHotels() {
  return useQuery({ queryKey: HOTELS, queryFn: () => managerApi.listHotels() })
}

/** A single owned hotel. */
export function useManagerHotel(hotelId: number | undefined) {
  return useQuery({
    queryKey: ['manager', 'hotel', hotelId],
    queryFn: () => managerApi.getHotel(hotelId as number),
    enabled: hotelId != null && !Number.isNaN(hotelId),
  })
}

export function useCreateHotel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: HotelInput) => managerApi.createHotel(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: HOTELS }),
  })
}

export function useUpdateHotel(hotelId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: HotelInput) => managerApi.updateHotel(hotelId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: HOTELS })
      qc.invalidateQueries({ queryKey: ['manager', 'hotel', hotelId] })
    },
  })
}

export function useDeleteHotel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (hotelId: number) => managerApi.deleteHotel(hotelId),
    onSuccess: () => qc.invalidateQueries({ queryKey: HOTELS }),
  })
}

export function useActivateHotel(hotelId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => managerApi.activateHotel(hotelId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: HOTELS })
      qc.invalidateQueries({ queryKey: ['manager', 'hotel', hotelId] })
    },
  })
}

/** Rooms belonging to an owned hotel. */
export function useHotelRooms(hotelId: number | undefined) {
  return useQuery({
    queryKey: hotelId != null ? rooms(hotelId) : ['manager', 'rooms', 'none'],
    queryFn: () => managerApi.listRooms(hotelId as number),
    enabled: hotelId != null && !Number.isNaN(hotelId),
  })
}

export function useCreateRoom(hotelId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: RoomInput) => managerApi.createRoom(hotelId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: rooms(hotelId) }),
  })
}

export function useDeleteRoom(hotelId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (roomId: number) => managerApi.deleteRoom(hotelId, roomId),
    onSuccess: () => qc.invalidateQueries({ queryKey: rooms(hotelId) }),
  })
}
