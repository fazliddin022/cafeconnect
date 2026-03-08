import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import ReservationPage from './pages/ReservationPage'
import GalleryPage from './pages/GalleryPage'
import EventsPage from './pages/EventsPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'

function AppRouter() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/menu"        element={<MenuPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/gallery"     element={<GalleryPage />} />
          <Route path="/events"      element={<EventsPage />} />
          <Route path="/contact"     element={<ContactPage />} />
          <Route path="*"            element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default AppRouter