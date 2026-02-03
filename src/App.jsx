import { useState, useEffect } from 'react'
import WelcomePage from './components/WelcomePage'
import FlappyRita from './games/FlappyRita'
import LoveLetter from './components/LoveLetter'
import FloatingDecorations from './components/FloatingDecorations'

const STORAGE_KEY = 'rita-love-progress'

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome')
  const [gameCompleted, setGameCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Carregar progresso
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const { completed, screen } = JSON.parse(saved)
      setGameCompleted(completed || false)
      if (screen) setCurrentScreen(screen)
    }
  }, [])

  // Guardar progresso
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      completed: gameCompleted,
      screen: currentScreen
    }))
  }, [gameCompleted, currentScreen])

  const handleStartGame = () => {
    setCurrentScreen('game')
  }

  const handleGameComplete = () => {
    setGameCompleted(true)
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
      setCurrentScreen('letter')
    }, 2000)
  }

  const handleGoToLetter = () => {
    setCurrentScreen('letter')
  }

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY)
    setGameCompleted(false)
    setCurrentScreen('welcome')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 relative overflow-hidden">
      <FloatingDecorations />

      <div className="fixed inset-0 batik-pattern pointer-events-none" />

      <main className="relative z-10">
        {currentScreen === 'welcome' && (
          <WelcomePage
            onStart={handleStartGame}
            gameCompleted={gameCompleted}
            onGoToLetter={handleGoToLetter}
          />
        )}
        {currentScreen === 'game' && (
          <FlappyRita onComplete={handleGameComplete} />
        )}
        {currentScreen === 'letter' && (
          <LoveLetter onReset={handleReset} />
        )}
      </main>

      {showConfetti && <Confetti />}
    </div>
  )
}

function Confetti() {
  const colors = ['#DC143C', '#FFD700', '#FF69B4', '#228B22', '#FF6B6B']
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 10 + 5
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0'
          }}
        />
      ))}
    </div>
  )
}

export default App
