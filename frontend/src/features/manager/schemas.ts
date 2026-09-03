import { z } from 'zod'

const optionalEmail = z
  .string()
  .trim()
  .refine((v) => v === '' || z.string().email().safeParse(v).success, 'Enter a valid email')

/** Hotel create/edit form. Photos & amenities are managed as string lists. */
export const hotelSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  city: z.string().trim().min(1, 'City is required'),
  photos: z.array(z.string().trim().min(1)),
  amenities: z.array(z.string().trim().min(1)),
  contactInfo: z.object({
    address: z.string().trim(),
    location: z.string().trim(),
    email: optionalEmail,
    phoneNumber: z.string().trim(),
  }),
})

export type HotelFormValues = z.infer<typeof hotelSchema>

/** Room create form. */
export const roomSchema = z.object({
  type: z.string().trim().min(1, 'Room type is required'),
  basePrice: z
    .number({ message: 'Enter a price' })
    .positive('Price must be greater than 0'),
  totalCount: z
    .number({ message: 'Enter a count' })
    .int('Whole number')
    .min(1, 'At least 1 room'),
  capacity: z
    .number({ message: 'Enter capacity' })
    .int('Whole number')
    .min(1, 'At least 1 guest'),
  photos: z.array(z.string().trim().min(1)),
  amenities: z.array(z.string().trim().min(1)),
})

export type RoomFormValues = z.infer<typeof roomSchema>

export const EMPTY_HOTEL: HotelFormValues = {
  name: '',
  city: '',
  photos: [],
  amenities: [],
  contactInfo: { address: '', location: '', email: '', phoneNumber: '' },
}
