import { useState } from 'react'
import { useReservationContext } from '../../context/ReservationContext'
import { formatDate } from '../../utils/formatters'
import { updateReservationStatus } from '../../services/reservationService'

const PRICE_PER_GUEST = 5

function PaymentModal({ reservation, onSuccess, onClose }) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const total = reservation.guests * PRICE_PER_GUEST

  const formatCardNumber = (val) => {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 4)
    if (clean.length >= 2) return clean.slice(0, 2) + '/' + clean.slice(2)
    return clean
  }

  const handlePay = async () => {
    const cleanCard = cardNumber.replace(/\s/g, '')
    if (cleanCard.length !== 16) {
      setError('Please enter a valid 16-digit card number.')
      return
    }
    if (expiry.length !== 5) {
      setError('Please enter a valid expiry date (MM/YY).')
      return
    }
    if (cvv.length !== 3) {
      setError('Please enter a valid 3-digit CVV.')
      return
    }

    setError(null)
    setProcessing(true)

    // Mock payment — wait 2 second
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      await updateReservationStatus(reservation.id, 'confirmed')
    } catch (err) {
      console.error(err)
    }

    setProcessing(false)
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Payment
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {/* Amount */}
        <div className="bg-[#fdf0d5] rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-gray-500 mb-1">Total Amount</p>
          <p className="text-3xl font-bold text-[#c97830]">${total.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">{reservation.guests} guests × ${PRICE_PER_GUEST}.00</p>
        </div>

        {/* Card Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              className="input-field"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                className="input-field"
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                className="input-field"
                placeholder="•••"
                maxLength={3}
              />
            </div>
          </div>
        </div>

        {error && <p className="error-msg text-center mt-3">{error}</p>}

        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full btn-primary mt-6 disabled:opacity-60"
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Processing...
            </span>
          ) : (
            `Pay $${total.toFixed(2)}`
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">🔒 Secure mock payment — no real charge</p>
      </div>
    </div>
  )
}

export default function ConfirmationModal() {
  const { showConfirmation, lastReservation, closeConfirmation } = useReservationContext()
  const [showPayment, setShowPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  if (!showConfirmation || !lastReservation) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">

          {paymentSuccess ? (
            <>
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Payment Successful!
              </h2>
              <p className="text-gray-500 mb-6">
                Your reservation is confirmed. We look forward to seeing you!
              </p>
              <div className="bg-green-50 rounded-xl p-3 mb-6">
                <p className="text-green-700 text-sm font-medium">✓ Reservation Confirmed</p>
              </div>
              <button onClick={closeConfirmation} className="w-full btn-primary">
                Done
              </button>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                You're all set!
              </h2>
              <p className="text-gray-500 mb-6">
                Your reservation has been received. Complete payment to confirm.
              </p>

              {/* Reservation Details */}
              <div className="bg-[#fffdf7] rounded-xl p-4 text-left space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium">{lastReservation.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{formatDate(lastReservation.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium">{lastReservation.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Guests</span>
                  <span className="font-medium">{lastReservation.guests}</span>
                </div>
                {lastReservation.notes && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Notes</span>
                    <span className="font-medium text-right max-w-[60%]">{lastReservation.notes}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-gray-500">Total</span>
                  <span className="font-bold text-[#c97830]">
                    ${(lastReservation.guests * PRICE_PER_GUEST).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowPayment(true)}
                className="w-full btn-primary mb-3"
              >
                💳 Pay Now — ${(lastReservation.guests * PRICE_PER_GUEST).toFixed(2)}
              </button>
              <button
                onClick={closeConfirmation}
                className="w-full btn-outline text-sm"
              >
                Pay Later
              </button>
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          reservation={lastReservation}
          onSuccess={() => {
            setShowPayment(false)
            setPaymentSuccess(true)
          }}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  )
}