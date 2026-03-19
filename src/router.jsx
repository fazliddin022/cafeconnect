import { Routes, Route, Navigate, useLocation} from 'react-router-dom'
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

function PublicLayout({ children }) {
  const { user } = useAuth()
  if (user?.email === 'admin@cafeconnect.com') {
    return <Navigate to="/admin" replace />
  }
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (user.email === 'admin@cafeconnect.com') return <Navigate to="/admin" replace />
  return children
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (user.email !== 'admin@cafeconnect.com') return <Navigate to="/" />
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

      <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
    </Routes>
  )
}