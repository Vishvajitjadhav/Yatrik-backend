import { Logo } from '@/components/brand/Logo'
import { Container } from '@/components/ui'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <Logo size={26} />
        <p className="text-sm text-ink-500">
          © {new Date().getFullYear()} YATRIK — the traveler's way to stay.
        </p>
      </Container>
    </footer>
  )
}
