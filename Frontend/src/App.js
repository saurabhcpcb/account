import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// import Login from './components/login.component'
// import SignUp from './components/signup.component'
import Header from './utils/Header'
import Footer from './utils/Footer'
import Home from './components/Home'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <div className="auth-wrapper">
          {/* <div className="auth-inner"> */}
            <Routes>
              <Route exact path="/" element={<Home />} />
              {/* <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} /> */}
              <Route path="/home" element={<Home />} />
            </Routes>
          </div>
        </div>
      {/* </div> */}
      <Footer />
    </Router>
  )
}

export default App
