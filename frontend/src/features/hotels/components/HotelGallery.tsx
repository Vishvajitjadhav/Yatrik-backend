import { cn } from '@/lib/cn'

/** Bundled placeholder so a photoless hotel still looks complete. */
const PLACEHOLDER = '/placeholder-hotel.svg'

/**
 * Airbnb-style photo mosaic: one large lead image + up to four supporting
 * tiles on desktop, collapsing to a single image on mobile.
 */
export function HotelGallery({ photos }: { photos?: string[] }) {
  const source = photos && photos.length > 0 ? photos : []
  const images = Array.from({ length: 5 }, (_, i) => source[i] || PLACEHOLDER)

  return (
    <div className="grid gap-2 overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          loading={i === 0 ? 'eager' : 'lazy'}
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER
          }}
          className={cn(
            'h-full w-full object-cover',
            // Lead image takes the left half (2×2) on large screens.
            i === 0
              ? 'aspect-[4/3] sm:col-span-2 sm:aspect-[16/10] lg:col-span-2 lg:row-span-2 lg:aspect-auto'
              : 'hidden aspect-[4/3] sm:block',
          )}
        />
      ))}
    </div>
  )
}
