import { Container, EmptyState } from '@/components/ui'

/** Temporary stand-in for pages built in later phases. */
export function PagePlaceholder({ title, phase }: { title: string; phase: string }) {
  return (
    <Container className="py-16">
      <EmptyState
        title={title}
        message={`Coming in ${phase}. The route, layout and access rules are already wired.`}
      />
    </Container>
  )
}
