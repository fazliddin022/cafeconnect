import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import ReservationPage from './pages/ReservationPage'
import GalleryPage from './pages/GalleryPage'
import EventsPage from './pages/EventsPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminPage from './pages/AdminPage'
import MyReservationsPage from './pages/MyReservationsPage'
import StaffPage from './pages/StaffPage'

function PublicLayout({ children }) {
  const { role } = useAuth()
  if (role === 'admin') return <Navigate to="/admin" replace />
  if (role === 'staff') return <Navigate to="/staff" replace />
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

function ProtectedRoute({ children }) {
  const { user, role } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (role === 'admin') return <Navigate to="/admin" replace />
  if (role === 'staff') return <Navigate to="/staff" replace />
  return children
}

function AdminRoute({ children }) {
  const { user, role } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role !== 'admin') return <Navigate to="/" replace />
  return children
}

function StaffRoute({ children }) {
  const { user, role } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role !== 'staff') return <Navigate to="/" replace />
  return children
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin route */}
      <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

      {/* Staff route */}
      <Route path="/staff" element={<StaffRoute><StaffPage /></StaffRoute>} />

      {/* Public routes */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/menu" element={<PublicLayout><MenuPage /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
      <Route path="/events" element={<PublicLayout><EventsPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

      {/* Protected routes */}
      <Route path="/reservation" element={
        <ProtectedRoute>
          <PublicLayout><ReservationPage /></PublicLayout>
        </ProtectedRoute>
      } />

      <Route path="/my-reservations" element={
        <ProtectedRoute>
          <PublicLayout><MyReservationsPage /></PublicLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
    </Routes>
  )
}