import { useState } from 'react'
import React from 'react'
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import Home from './Pages/Home'

function AppRoutes() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
