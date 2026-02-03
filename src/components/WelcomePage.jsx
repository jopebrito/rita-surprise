import { useState, useEffect } from 'react'
import { Heart, Sparkles, ArrowRight, Star, Gift, Gamepad2 } from 'lucide-react'

// ============================================
// FOTO DA RITA
// ============================================
import ritaPhoto from '../assets/rita-festival.jpg'
// ============================================

export default function WelcomePage({ onStart, gameCompleted, onGoToLetter }) {
  const [isVisible, setIsVisible] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setTimeout(() => setShowButton(true), 800)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
      {/* Floating hearts */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-20 pointer-events-none"
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.5}s`
          }}
        >
          <Heart size={24 + i * 8} className="text-malaysia-red fill-malaysia-red" />
        </div>
      ))}

      <div className={`text-center max-w-lg mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

        {/* Foto da Rita com decorações */}
        <div className="relative mb-6 inline-block">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-malaysia-gold shadow-2xl mx-auto relative bg-gradient-to-br from-malaysia-red to-malaysia-pink flex items-center justify-center">
            {ritaPhoto && !imageError ? (
              <img
                src={ritaPhoto}
                alt="Rita"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-6xl">👸</span>
            )}
          </div>

          {/* Coroa animada */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-5xl animate-bounce-slow filter drop-shadow-lg">
            👑
          </div>

          {/* Sparkles */}
          <Sparkles className="absolute -right-3 top-2 w-8 h-8 text-malaysia-gold animate-pulse" />
          <Sparkles className="absolute -left-3 bottom-6 w-6 h-6 text-malaysia-gold animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Heart className="absolute right-0 bottom-0 w-6 h-6 text-malaysia-red fill-malaysia-red animate-heart-beat" />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
          <span className="gradient-text">Olá, Rita!</span>
        </h1>

        <p className="text-xl text-gray-600 mb-1">
          A minha princesa favorita 💕
        </p>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Star className="w-4 h-4 text-malaysia-gold fill-malaysia-gold" />
          <p className="text-malaysia-coral font-medium text-sm">
            Preparei uma surpresa especial para ti...
          </p>
          <Star className="w-4 h-4 text-malaysia-gold fill-malaysia-gold" />
        </div>

        {/* Game info card */}
        <div className="glass rounded-3xl p-5 mb-6 text-left border border-white/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-malaysia-red to-malaysia-pink flex items-center justify-center shadow-lg">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">🐦 Flappy Rita</h3>
              <p className="text-xs text-gray-500">Um jogo feito só para ti!</p>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3">
            Completa o desafio para desbloquear a tua surpresa! 🎁
          </p>

          <div className="bg-rose-50 rounded-xl p-3 text-sm">
            <p className="text-malaysia-red font-medium mb-1">
              😂 Spoiler Alert:
            </p>
            <p className="text-gray-600 text-xs">
              Tu és a personagem principal! Vais ver-te a voar pelo ecrã a evitar... Milkshakes! 🍺
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className={`space-y-3 transition-all duration-700 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>

          <button onClick={onStart} className="btn-primary w-full text-lg flex items-center justify-center gap-2 group">
            <Gamepad2 className="w-5 h-5" />
            <span>{gameCompleted ? 'Jogar Outra Vez 🎮' : 'Começar Jogo! 🚀'}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {gameCompleted && (
            <button onClick={onGoToLetter} className="btn-gold w-full flex items-center justify-center gap-2 animate-glow">
              <Gift className="w-5 h-5" />
              <span>Ver Surpresa Desbloqueada! 🎁💌</span>
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-6">
          ✨ Feito com muito amor para ti ✨
        </p>
      </div>
    </div>
  )
}
