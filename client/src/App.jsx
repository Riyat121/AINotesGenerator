import React, { useEffect } from 'react'
import Home from './pages/Home'
import Auth from './pages/Auth'
import History from './pages/History'
import Pricing from './pages/Pricing'
import Notes from './pages/Notes'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import { getCurrentUser } from './services/api'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'

export const serverUrl = "https://ainotesgeneratorserver-pwzu.onrender.com"

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    getCurrentUser(dispatch)
  }, [dispatch])

  const { userData } = useSelector((state) => state.user)

  return (
    <>
      <Routes>
        <Route path='/' element={userData ? <Home /> : <Navigate to="/auth" replace />} />
        <Route path='/auth' element={userData ? <Navigate to="/" replace /> : <Auth />} />
        <Route path='/history' element={userData ? <History /> : <Navigate to="/auth" replace />} />
        <Route path='/notes' element={userData ? <Notes /> : <Navigate to="/auth" replace />} />
        {/* pricing page abhi ban raha hai, tab tak Home placeholder */}
        <Route path='/pricing' element={userData ? <Pricing /> : <Navigate to="/auth" replace />} />
        <Route path="/payment-success" element = {<PaymentSuccess />} />
        <Route path ="/payment-failure" element={<PaymentFailed />} />
      </Routes>
    </>
  )
}

export default App
