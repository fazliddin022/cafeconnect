import { BrowserRouter } from 'react-router-dom'
import { MenuProvider } from './context/MenuContext'
import { ReservationProvider } from './context/ReservationContext'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import AppRouter from './router'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <MenuProvider>
            <ReservationProvider>
              <AppRouter />
            </ReservationProvider>
          </MenuProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}