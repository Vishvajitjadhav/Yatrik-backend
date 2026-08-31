import { z } from 'zod'

/** Hero / results search form. Dates are `yyyy-MM-dd` strings from native date inputs. */
export const searchSchema = z
  .object({
    city: z.string().trim().min(1, 'Where are you going?'),
    startDate: z.string().min(1, 'Add a check-in date'),
    endDate: z.string().min(1, 'Add a check-out date'),
    roomsCount: z.number().int().min(1).max(10),
  })
  .refine((v) => v.endDate > v.startDate, {
    message: 'Check-out must be after check-in',
    path: ['endDate'],
  })

export type SearchValues = z.infer<typeof searchSchema>
