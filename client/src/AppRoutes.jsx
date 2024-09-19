import { useState } from 'react'
import React from 'react'
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import Home from './Pages/Home'
import store from './store/store'
import { Provider } from 'react-redux'
import Meeting from './Pages/Meeting'

function AppRoutes() {

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/room/:roomId' element={<Meeting/>}  />
        </Routes>
      </Router>
    </Provider>
  )
}

export default AppRoutes
