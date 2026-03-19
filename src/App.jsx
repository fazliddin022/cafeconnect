import { BrowserRouter } from 'react-router-dom'
import { MenuProvider } from './context/MenuContext'
import { ReservationProvider } from './context/ReservationContext'
import { AuthProvider } from './context/AuthContext'
import AppRouter from './router'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MenuProvider>
          <ReservationProvider>
            <AppRouter />
          </ReservationProvider>
        </MenuProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}