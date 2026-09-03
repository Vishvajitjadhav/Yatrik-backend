import { z } from 'zod'

/** One guest on the add-guests form. */
export const guestSchema = z.object({
  name: z.string().trim().min(1, 'Enter a name'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  age: z
    .number({ message: 'Enter an age' })
    .int('Whole number')
    .min(0, 'Invalid age')
    .max(120, 'Invalid age'),
})

export const addGuestsSchema = z.object({
  guests: z.array(guestSchema).min(1, 'Add at least one guest'),
})

export type GuestFormValues = z.infer<typeof guestSchema>
export type AddGuestsValues = z.infer<typeof addGuestsSchema>

/** Occupancy chosen in the guest selector; drives how many guest rows appear. */
export interface Occupancy {
  adults: number
  children: number
  infants: number
}

export const DEFAULT_OCCUPANCY: Occupancy = { adults: 2, children: 0, infants: 0 }

/** People who need their own guest record (infants ride along, no bed). */
export function guestHeadcount(o: Occupancy): number {
  return Math.max(1, o.adults + o.children)
}

/** Short human summary, e.g. "2 adults · 1 child". */
export function occupancyLabel(o: Occupancy): string {
  const parts: string[] = [`${o.adults} adult${o.adults === 1 ? '' : 's'}`]
  if (o.children) parts.push(`${o.children} child${o.children === 1 ? '' : 'ren'}`)
  if (o.infants) parts.push(`${o.infants} infant${o.infants === 1 ? '' : 's'}`)
  return parts.join(' · ')
}
