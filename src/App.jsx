import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router'
import { MenuProvider } from './context/MenuContext'
import { ReservationProvider } from './context/ReservationContext'

function App() {
  return (
    <BrowserRouter>
      <MenuProvider>
        <ReservationProvider>
          <AppRouter />
        </ReservationProvider>
      </MenuProvider>
    </BrowserRouter>
  )
}

export default App