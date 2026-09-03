import { lazy, Suspense, type ComponentType } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { RouteError } from './RouteError'
import { RouteFallback } from './RouteFallback'

/** Wrap a code-split page in its own Suspense boundary. */
function route(factory: () => Promise<{ default: ComponentType }>) {
  const Component = lazy(factory)
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  )
}

// Each page ships in its own chunk, downloaded on first navigation.
const home = () => route(() => import('@/features/home/HomePage').then((m) => ({ default: m.HomePage })))
const login = () => route(() => import('@/features/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
const signup = () => route(() => import('@/features/auth/SignupPage').then((m) => ({ default: m.SignupPage })))
const search = () => route(() => import('@/features/hotels/SearchResultsPage').then((m) => ({ default: m.SearchResultsPage })))
const hotelDetail = () => route(() => import('@/features/hotels/HotelDetailPage').then((m) => ({ default: m.HotelDetailPage })))
const checkout = () => route(() => import('@/features/booking/BookingCheckoutPage').then((m) => ({ default: m.BookingCheckoutPage })))
const paymentStatus = () => route(() => import('@/features/booking/PaymentStatusPage').then((m) => ({ default: m.PaymentStatusPage })))
const myBookings = () => route(() => import('@/features/booking/MyBookingsPage').then((m) => ({ default: m.MyBookingsPage })))
const managerLayout = () => route(() => import('@/features/manager/ManagerLayout').then((m) => ({ default: m.ManagerLayout })))
const managerOverview = () => route(() => import('@/features/manager/ManagerOverviewPage').then((m) => ({ default: m.ManagerOverviewPage })))
const myHotels = () => route(() => import('@/features/manager/MyHotelsPage').then((m) => ({ default: m.MyHotelsPage })))
const hotelForm = () => route(() => import('@/features/manager/HotelFormPage').then((m) => ({ default: m.HotelFormPage })))
const hotelManage = () => route(() => import('@/features/manager/HotelManagePage').then((m) => ({ default: m.HotelManagePage })))

export const router = createBrowserRouter([
  { path: '/login', element: login(), errorElement: <RouteError /> },
  { path: '/signup', element: signup(), errorElement: <RouteError /> },
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: home() },
      { path: 'search', element: search() },
      { path: 'hotels/:hotelId', element: hotelDetail() },
      {
        path: 'book',
        element: <ProtectedRoute role="GUEST">{checkout()}</ProtectedRoute>,
      },
      {
        path: 'payments/:bookingId/status',
        element: <ProtectedRoute role="GUEST">{paymentStatus()}</ProtectedRoute>,
      },
      {
        path: 'bookings',
        element: <ProtectedRoute role="GUEST">{myBookings()}</ProtectedRoute>,
      },
      {
        path: 'manager',
        element: <ProtectedRoute role="HOTEL_MANAGER">{managerLayout()}</ProtectedRoute>,
        children: [
          { index: true, element: managerOverview() },
          { path: 'hotels', element: myHotels() },
          { path: 'hotels/new', element: hotelForm() },
          { path: 'hotels/:hotelId', element: hotelManage() },
        ],
      },
      { path: '*', element: <RouteError /> },
    ],
  },
])
