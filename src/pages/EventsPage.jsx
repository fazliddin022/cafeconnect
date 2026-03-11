import { eventsData } from '../data/eventsData'
import { formatDate } from '../utils/formatters'

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#fffdf7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12 text-center">
        <h1 className="section-title">Events</h1>
        <p className="section-subtitle">Something exciting is always happening here.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        {eventsData.map((event) => (
          <article key={event.id} className="card flex flex-col sm:flex-row overflow-hidden">
            {/* Image */}
            <div className="sm:w-48 h-48 sm:h-auto bg-[#fdf0d5] flex-shrink-0 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.src = `https://placehold.co/400x300/fdf0d5/c97830?text=${encodeURIComponent(event.title)}`
                }}
              />
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
        ))}
      </div>
    </div>
  )
}