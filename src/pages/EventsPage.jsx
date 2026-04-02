import { useEffect, useState } from 'react'
import { fetchEvents } from '../services/eventService'
import { formatDate } from '../utils/formatters'

const CATEGORIES = ['All', 'Music', 'Workshop', 'Dining']

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const data = await fetchEvents()
      const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date))
      setEvents(sorted)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = activeCategory === 'All'
    ? events
    : events.filter((e) => e.category === activeCategory)

  const upcomingEvents = filteredEvents.filter((e) => new Date(e.date) >= new Date())
  const pastEvents = filteredEvents.filter((e) => new Date(e.date) < new Date())

  return (
    <div className="min-h-screen bg-[#fffdf7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12 text-center">
        <h1 className="section-title">Events</h1>
        <p className="section-subtitle">Something exciting is always happening here.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${activeCategory === cat
                  ? 'bg-[#c97830] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#c97830] hover:text-[#c97830]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-gray-500">No events in this category.</p>
          </div>
        ) : (
          <>
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Upcoming Events ({upcomingEvents.length})
                </h2>
                <div className="space-y-6">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-400 mb-4">
                  Past Events ({pastEvents.length})
                </h2>
                <div className="space-y-6 opacity-60">
                  {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} past />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function EventCard({ event, past }) {
  return (
    <article className="card flex flex-col sm:flex-row overflow-hidden">
      {/* Image */}
      <div className="sm:w-48 h-48 sm:h-auto bg-[#fdf0d5] flex-shrink-0 overflow-hidden relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x300/fdf0d5/c97830?text=${encodeURIComponent(event.title)}`
          }}
        />
        {event.isFeatured && !past && (
          <span className="absolute top-2 left-2 bg-[#c97830] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            Featured
          </span>
        )}
        {past && (
          <span className="absolute top-2 left-2 bg-gray-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            Past
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col justify-between">
        <div>
          <span className="text-xs text-[#c97830] font-semibold uppercase tracking-widest">
            {event.category}
          </span>
          <h2
            className="text-xl font-bold text-gray-900 mt-1"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {event.title}
          </h2>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            {event.description}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
          <span>📅 {formatDate(event.date)}</span>
          <span>🕐 {event.time}</span>
        </div>
      </div>
    </article>
  )
}