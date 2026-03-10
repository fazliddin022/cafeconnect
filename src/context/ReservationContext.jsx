import { createContext, useContext, useState } from 'react'

const ReservationContext = createContext(null)

export function ReservationProvider({ children }) {
  const [lastReservation, setLastReservation] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const confirmReservation = (data) => {
    setLastReservation(data)
    setShowConfirmation(true)
  }

  const closeConfirmation = () => setShowConfirmation(false)

  return (
    <ReservationContext.Provider
      value={{ lastReservation, showConfirmation, confirmReservation, closeConfirmation }}
    >
      {children}
    </ReservationContext.Provider>
  )
}

export const useReservationContext = () => {
  const ctx = useContext(ReservationContext)
  if (!ctx) throw new Error('useReservationContext must be used within <ReservationProvider>')
  return ctx
}