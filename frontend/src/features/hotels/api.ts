import { api } from '@/lib/apiClient'
import type { HotelInfo, HotelPrice, Page } from '@/types/api'

export interface HotelSearchParams {
  city: string
  startDate: string
  endDate: string
  roomsCount: number
  page?: number
  size?: number
}

export const hotelsApi = {
  search: (params: HotelSearchParams) =>
    api.post<Page<HotelPrice>>('/hotels/search', params),
  info: (hotelId: number) => api.get<HotelInfo>(`/hotels/${hotelId}/info`),
}
