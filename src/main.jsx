import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

const SESSION_KEY = 'rita-session-active'
if (!sessionStorage.getItem(SESSION_KEY)) {
  localStorage.removeItem('rita-love-progress')
  localStorage.removeItem('flappy-rita-story-hs')
  localStorage.removeItem('flappy-rita-infinite-hs')
  localStorage.removeItem('flappy-rita-letter-unlocked')
  sessionStorage.setItem(SESSION_KEY, 'true')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
