import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { RouteError } from './RouteError'
import { HomePage } from '@/features/home/HomePage'
import { LoginPage } from '@/features/auth/LoginPage'
import { SignupPage } from '@/features/auth/SignupPage'
import { SearchResultsPage } from '@/features/hotels/SearchResultsPage'
import { HotelDetailPage } from '@/features/hotels/HotelDetailPage'
import { PagePlaceholder } from '@/components/PagePlaceholder'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage />, errorElement: <RouteError /> },
  { path: '/signup', element: <SignupPage />, errorElement: <RouteError /> },
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchResultsPage /> },
      { path: 'hotels/:hotelId', element: <HotelDetailPage /> },
      {
        path: 'bookings',
        element: (
          <ProtectedRoute role="GUEST">
            <PagePlaceholder title="My trips" phase="Phase 3" />
          </ProtectedRoute>
        ),
      },
      {
        path: 'manager/hotels',
        element: (
          <ProtectedRoute role="HOTEL_MANAGER">
            <PagePlaceholder title="My hotels" phase="Phase 4" />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <RouteError /> },
    ],
  },
])
