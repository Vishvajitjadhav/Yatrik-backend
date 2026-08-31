import { useQuery } from '@tanstack/react-query'
import { hotelsApi, type HotelSearchParams } from './api'

/**
 * Search hotels for a city + date range. Disabled until a city is present so
 * the home page can mount the hook without firing a request.
 */
export function useHotelSearch(params: HotelSearchParams | null) {
  return useQuery({
    queryKey: ['hotels', 'search', params],
    queryFn: () => hotelsApi.search(params as HotelSearchParams),
    enabled: Boolean(params?.city),
    placeholderData: (prev) => prev, // keep the old page visible while paging
  })
}

export function useHotelInfo(hotelId: number | undefined) {
  return useQuery({
    queryKey: ['hotels', 'info', hotelId],
    queryFn: () => hotelsApi.info(hotelId as number),
    enabled: hotelId != null && !Number.isNaN(hotelId),
  })
}
