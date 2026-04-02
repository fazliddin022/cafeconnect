import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { OPENING_HOURS } from '../utils/constants'
import { formatPrice } from '../utils/formatters'
import { useAuth } from '../context/AuthContext'
import { fetchReviews } from '../services/reviewService'
import ReviewCard from '../components/reviews/ReviewCard'
import { useMenuContext } from '../context/MenuContext'
import { fetchEvents } from '../services/eventService'

export default function HomePage() {
  const { user, openAuthModal } = useAuth()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const { menuItems } = useMenuContext()
  const featuredMenu = menuItems.filter((item) => item.isPopular).slice(0, 3)

  useEffect(() => {
    loadReviews()
    loadEvents()
  }, [])

  const loadReviews = async () => {
    try {
      const data = await fetchReviews()
      const top = data
        .sort((a, b) => b.rating - a.rating || new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
      setReviews(top)
    } catch (err) {
      console.error(err)
    }
  }

  const loadEvents = async () => {
    try {
      const data = await fetchEvents()
      const upcoming = data
        .filter((e) => new Date(e.date) >= new Date())
        .filter((e) => e.isFeatured)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 2)
      setUpcomingEvents(upcoming)
    } catch (err) {
      console.error(err)
    }
  }

  const handleReserveClick = () => {
    if (user) {
      navigate('/reservation')
    } else {
      openAuthModal()
    }
  }

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center bg-gray-900">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center w-full">
          <p className="text-[#e9ae6b] font-medium tracking-widest uppercase text-sm mb-4">
            Welcome to CaféConnect
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Where Every Cup
            <br />
            <span className="text-[#e9ae6b]">Tells a Story</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto mb-10">
            Explore our handcrafted menu, reserve your perfect table, and join us for unforgettable events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="btn-primary text-base">Explore Menu</Link>
            <button
              onClick={handleReserveClick}
              className="btn-outline text-base"
              style={{ borderColor: 'white', color: 'white' }}
            >
              Reserve a Table
            </button>
          </div>
        </div>
      </section>

      {/* ── Opening Hours ─────────────────────────────────────── */}
      <section className="bg-[#c97830] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap gap-6 justify-center md:justify-between items-center">
          <p className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>We're Open</p>
          <div className="flex flex-wrap gap-8 justify-center">
            {OPENING_HOURS.map(({ day, hours }) => (
              <div key={day} className="text-center">
                <p className="text-orange-100 text-sm">{day}</p>
                <p className="font-semibold">{hours}</p>
              </div>
            ))}
          </div>
          <button
            onClick={handleReserveClick}
            className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
          >
            Book Now →
          </button>
        </div>
      </section>

      {/* ── Featured Menu ─────────────────────────────────────── */}
      <section className="py-20 bg-[#fffdf7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">Customer Favourites</h2>
            <p className="section-subtitle">Our most loved items, handpicked for you.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMenu.map((item) => (
              <div key={item.id} className="card">
                <div className="h-48 bg-[#fdf0d5] flex items-center justify-center relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/400x300/fdf0d5/c97830?text=${encodeURIComponent(item.name)}`
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-[#c97830] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    Popular
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {item.name}
                    </h3>
                    <span className="text-[#c97830] font-semibold whitespace-nowrap">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/menu" className="btn-outline">View Full Menu →</Link>
          </div>
        </div>
      </section>

      {/* ── Events Preview ────────────────────────────────────── */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="section-title">Upcoming Events</h2>
              <p className="section-subtitle">Join us for something special.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="card flex gap-4 p-5">
                  <div className="text-center min-w-[60px]">
                    <p className="text-[#c97830] font-bold text-3xl">
                      {new Date(event.date).getDate()}
                    </p>
                    <p className="text-gray-400 text-xs uppercase">
                      {new Date(event.date).toLocaleString('default', { month: 'short' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#c97830] font-semibold uppercase tracking-wide mb-1">
                      {event.category}
                    </p>
                    <h3 className="font-bold text-lg text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {event.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {event.time} · {event.description.slice(0, 80)}…
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/events" className="btn-outline">All Events →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Reviews ───────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <section className="py-20 bg-[#fffdf7]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="section-title">What Our Guests Say</h2>
              <p className="section-subtitle">Real experiences from real customers.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="bg-gray-900 py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready for an Unforgettable Experience?
          </h2>
          <p className="text-gray-400 mb-8">Reserve your table today and let us take care of the rest.</p>
          <button onClick={handleReserveClick} className="btn-primary text-base">
            Make a Reservation
          </button>
        </div>
      </section>
    </div>
  )
}