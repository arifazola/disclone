import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import TestLayout from './components/TestLayout.tsx'
import Page1 from './pages/Page1.tsx'
import Page2 from './pages/Page2.tsx'
import LobbyLayout from './components/LobbyLayout.tsx'
import DirectMessageBarContent from './components/DirectMessageBarContent.tsx'
import ServerBarContent from './components/ServerBarContent.tsx'
import Loading from './components/Loading.tsx'
import LoadingProvider from './components/Loading.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Toast from './contexts/ToastContext.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Toast>
        <Loading />
        <Routes>
          <Route element={<LobbyLayout />}>
            <Route path='/' element={<DirectMessageBarContent />} />
            <Route path='/server/:server/:channel' element={<ServerBarContent />} />
          </Route>


          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route element={<TestLayout />}>
            <Route path='/1' element={<Page1 />} />
            <Route path='/2' element={<Page2 />} />
          </Route>
        </Routes>
      </Toast>
    </BrowserRouter>
  </QueryClientProvider>
)
