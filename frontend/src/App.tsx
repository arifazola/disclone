import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ServerIcon from './components/ServerIcon'
import ButtonPrimary from './components/ButtonPrimary'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Lobby from './pages/Lobby'

const queryClient = new QueryClient()

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Lobby />
      </QueryClientProvider>
    </>
  )
}

export default App
