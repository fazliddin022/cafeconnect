import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router'
import { MenuProvider } from './context/MenuContext'

function App() {
  return (
    <BrowserRouter>
      <MenuProvider>
        <AppRouter />
      </MenuProvider>
    </BrowserRouter>
  )
}

export default App