import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

function AppRouter() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<div className="p-8 text-2xl">🏠 Home Page</div>} />
          <Route path="/menu" element={<div className="p-8 text-2xl">🍽️ Menu Page</div>} />
          <Route path="/reservation" element={<div className="p-8 text-2xl">📅 Reservation Page</div>} />
          <Route path="/gallery" element={<div className="p-8 text-2xl">🖼️ Gallery Page</div>} />
          <Route path="/events" element={<div className="p-8 text-2xl">🎵 Events Page</div>} />
          <Route path="/contact" element={<div className="p-8 text-2xl">📞 Contact Page</div>} />
          <Route path="*" element={<div className="p-8 text-2xl">404 - Not Found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default AppRouter