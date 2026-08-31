import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { Logo } from '@/components/brand/Logo'

/** Router errorElement + 404 fallback. */
export function RouteError() {
  const error = useRouteError()
  const is404 = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo size={40} />
      <div>
        <p className="text-6xl font-bold text-primary-500">{is404 ? '404' : 'Oops'}</p>
        <h1 className="mt-4 text-2xl font-bold text-ink-900">
          {is404 ? 'This page has wandered off' : 'Something went wrong'}
        </h1>
        <p className="mt-2 max-w-md text-ink-500">
          {is404
            ? "The page you're looking for doesn't exist or has moved."
            : 'An unexpected error occurred. Please try again.'}
        </p>
      </div>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  )
}
