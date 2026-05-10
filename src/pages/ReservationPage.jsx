import ReservationForm from '../components/reservation/ReservationForm'
import ConfirmationModal from '../components/reservation/ConfirmationModal'
import { OPENING_HOURS } from '../utils/constants'

export default function ReservationPage() {
  return (
    <div className="min-h-screen bg-[#fffdf7]">
      <ConfirmationModal />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12 text-center">
        <h1 className="section-title">Reserve a Table</h1>
        <p className="section-subtitle">We'll have everything ready for your arrival.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3
              className="font-semibold text-lg mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Opening Hours
            </h3>
            <ul className="space-y-2 text-sm">
              {OPENING_HOURS.map(({ day, hours }) => (
                <li key={day} className="flex justify-between gap-3">
                  <span className="text-gray-500">{day}</span>
                  <span className="font-medium text-[#c97830]">{hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3 text-sm text-gray-500">
            <p>📞 +1 (555) 123-4567</p>
            <p>📧 hello@cafeconnect.com</p>
            <p>📍 123 Coffee Lane, Downtown</p>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-sm">
          <ReservationForm />
        </div>

      </div>
    </div>
  )
}