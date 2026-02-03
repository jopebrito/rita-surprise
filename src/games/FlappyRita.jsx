import { useState, useEffect, useCallback, useRef } from 'react'
import { Heart, Star, RefreshCw, Gift, Infinity, Trophy, ArrowLeft, Volume2, VolumeX } from 'lucide-react'
import { useSounds } from '../hooks/useSounds'
import ritaPhoto from '../assets/rita-japan.jpg'

const BASE_GRAVITY = 0.3
const BASE_JUMP_FORCE = -7.5
const BASE_PIPE_SPEED = 1.8
const BASE_PIPE_GAP = 240
const PIPE_WIDTH = 55
const PLAYER_SIZE = 55
const STORY_TARGET = 10

const MAX_GRAVITY = 0.45
const MAX_PIPE_SPEED = 3.2
const MIN_PIPE_GAP = 160

const DIFFICULTY_INCREASE_EVERY = 2

const getAttemptsBonus = (attempts) => {
  if (attempts <= 1) return { extraLives: 0, gapBonus: 0, speedReduction: 0 }
  if (attempts <= 3) return { extraLives: 1, gapBonus: 20, speedReduction: 0.1 }
  if (attempts <= 5) return { extraLives: 1, gapBonus: 30, speedReduction: 0.15 }
  if (attempts <= 8) return { extraLives: 2, gapBonus: 40, speedReduction: 0.2 }
  return { extraLives: 2, gapBonus: 50, speedReduction: 0.25 }
}

const DEATH_MESSAGES = [
  "Eu apanho-te sempre que caíres 💕",
  "O amor também tem turbulência! ✈️💕",
  "Caíste, mas eu estou aqui para ti 🤗",
  "Ups! Mas juntos tentamos outra vez! 💪",
  "Não faz mal amor, eu espero por ti ❤️",
  "O milkshake foi mais forte... desta vez! 🥤😂",
  "Até a voar és adorável 😍",
  "Cair faz parte, levantar é amor! 💕",
]

const DEATH_MESSAGES_INFINITE = [
  "Nada mau! Mas consegues mais! 💪",
  "O milkshake venceu esta ronda! 🥤",
  "Boa tentativa, amor! 🎮",
  "Quase! Mais uma vez? 😏",
  "O recorde está à tua espera! 🏆",
]

const ENCOURAGEMENT = [
  "Tu consegues, pequenina! 💪❤️",
  "Estou a torcer por ti, princesa! 👸",
  "Cada tentativa é uma prova de amor! 💕",
  "O nosso amor não desiste! 💪",
  "Vá lá meu amor, eu acredito em ti! ✨",
  "Lembra-te: estou sempre contigo! 💕",
  "Respira fundo e tenta outra vez! 🧘‍♀️❤️",
]

const WIN_MESSAGES = {
  title: "O Nosso Amor Venceu! 💕",
  subtitle: "Sabia que ias conseguir, meu bem!",
  description: "Tal como no amor, não desististe. E é por isso que te amo tanto. ❤️",
}

export default function FlappyRita({ onComplete }) {
  const [screen, setScreen] = useState('menu')
  const [gameMode, setGameMode] = useState(null)
  const [playerY, setPlayerY] = useState(250)
  const [velocity, setVelocity] = useState(0)
  const [pipes, setPipes] = useState([])
  const [score, setScore] = useState(0)
  const [highScoreStory, setHighScoreStory] = useState(0)
  const [highScoreInfinite, setHighScoreInfinite] = useState(0)
  const [deathMessage, setDeathMessage] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [lives, setLives] = useState(0)
  const [showHeartCollect, setShowHeartCollect] = useState(false)
  const [difficulty, setDifficulty] = useState(0)
  const [letterUnlocked, setLetterUnlocked] = useState(false)

  const gameLoopRef = useRef(null)
  const pipeIdRef = useRef(0)
  const playerYRef = useRef(playerY)
  const velocityRef = useRef(velocity)
  const scoreRef = useRef(score)

  const { playSound, stopAllSounds, isMuted, toggleMute } = useSounds()

  useEffect(() => {
    const storyHS = localStorage.getItem('flappy-rita-story-hs')
    const infiniteHS = localStorage.getItem('flappy-rita-infinite-hs')
    const unlocked = localStorage.getItem('flappy-rita-letter-unlocked')
    if (storyHS) setHighScoreStory(parseInt(storyHS))
    if (infiniteHS) setHighScoreInfinite(parseInt(infiniteHS))
    if (unlocked) setLetterUnlocked(true)
  }, [])

  const getCurrentDifficulty = useCallback((currentScore) => {
    const level = Math.floor(currentScore / DIFFICULTY_INCREASE_EVERY)
    const maxLevel = gameMode === 'infinite' ? 8 : 4
    return Math.min(level, maxLevel)
  }, [gameMode])

  const getGameSettings = useCallback((diffLevel) => {
    const maxLevel = gameMode === 'infinite' ? 8 : 4
    const progress = diffLevel / maxLevel
    const bonus = getAttemptsBonus(attempts)

    return {
      gravity: BASE_GRAVITY + (MAX_GRAVITY - BASE_GRAVITY) * progress,
      pipeSpeed: Math.max(1.2, BASE_PIPE_SPEED + (MAX_PIPE_SPEED - BASE_PIPE_SPEED) * progress - bonus.speedReduction),
      pipeGap: BASE_PIPE_GAP - (BASE_PIPE_GAP - MIN_PIPE_GAP) * progress + bonus.gapBonus,
    }
  }, [gameMode, attempts])

  useEffect(() => { playerYRef.current = playerY }, [playerY])
  useEffect(() => { velocityRef.current = velocity }, [velocity])
  useEffect(() => {
    scoreRef.current = score
    setDifficulty(getCurrentDifficulty(score))
  }, [score, getCurrentDifficulty])

  const handleDeath = useCallback(() => {
    if (lives > 0) {
      playSound('hit')
      setLives(l => l - 1)
      setPlayerY(250)
      playerYRef.current = 250
      setVelocity(0)
      velocityRef.current = 0
      setPipes(prev => prev.slice(1))
      return false
    }

    stopAllSounds()
    playSound('gameOver')
    const messages = gameMode === 'infinite' ? DEATH_MESSAGES_INFINITE : DEATH_MESSAGES
    setScreen('dead')
    setDeathMessage(messages[Math.floor(Math.random() * messages.length)])
    setAttempts(a => a + 1)
    clearInterval(gameLoopRef.current)

    if (gameMode === 'story' && score > highScoreStory) {
      setHighScoreStory(score)
      localStorage.setItem('flappy-rita-story-hs', score.toString())
    }
    if (gameMode === 'infinite' && score > highScoreInfinite) {
      setHighScoreInfinite(score)
      localStorage.setItem('flappy-rita-infinite-hs', score.toString())
    }

    return true
  }, [lives, gameMode, score, highScoreStory, highScoreInfinite, playSound, stopAllSounds])

  useEffect(() => {
    if (screen !== 'playing') return

    const gameLoop = () => {
      const currentDiff = getCurrentDifficulty(scoreRef.current)
      const settings = getGameSettings(currentDiff)

      const newVelocity = velocityRef.current + settings.gravity
      const newY = playerYRef.current + newVelocity

      if (newY < 0 || newY > 500 - PLAYER_SIZE - 48) {
        if (handleDeath()) return
      }

      setVelocity(newVelocity)
      setPlayerY(newY)

      setPipes(prevPipes => {
        let died = false
        let scored = false
        let collectedHeart = false

        const settings = getGameSettings(getCurrentDifficulty(scoreRef.current))

        const newPipes = prevPipes
          .map(pipe => {
            const movedPipe = { ...pipe, x: pipe.x - settings.pipeSpeed }

            const playerLeft = 80
            const playerRight = 80 + PLAYER_SIZE
            const playerTop = newY
            const playerBottom = newY + PLAYER_SIZE
            const pipeLeft = movedPipe.x
            const pipeRight = movedPipe.x + PIPE_WIDTH

            if (playerRight > pipeLeft && playerLeft < pipeRight) {
              const currentGap = settings.pipeGap
              if (playerTop < movedPipe.gapY || playerBottom > movedPipe.gapY + currentGap) {
                died = true
              }
            }

            if (movedPipe.hasHeart && !movedPipe.heartCollected) {
              const heartX = movedPipe.x + PIPE_WIDTH / 2
              const heartY = movedPipe.gapY + settings.pipeGap / 2
              const dist = Math.sqrt((playerLeft + PLAYER_SIZE/2 - heartX)**2 + (playerTop + PLAYER_SIZE/2 - heartY)**2)
              if (dist < 50) {
                movedPipe.heartCollected = true
                collectedHeart = true
              }
            }

            if (!movedPipe.passed && movedPipe.x + PIPE_WIDTH < playerLeft) {
              movedPipe.passed = true
              scored = true
            }

            return movedPipe
          })
          .filter(pipe => pipe.x > -PIPE_WIDTH)

        if (died) {
          if (handleDeath()) return prevPipes
        }

        if (collectedHeart) {
          playSound('heart')
          setLives(l => l + 1)
          setShowHeartCollect(true)
          setTimeout(() => setShowHeartCollect(false), 500)
        }

        if (scored) {
          playSound('score')
          setScore(s => {
            const newScore = s + 1
            if (gameMode === 'story' && newScore >= STORY_TARGET) {
              playSound('win')
              setScreen('won')
              setLetterUnlocked(true)
              localStorage.setItem('flappy-rita-letter-unlocked', 'true')
              clearInterval(gameLoopRef.current)
            }
            return newScore
          })
        }

        return newPipes
      })
    }

    gameLoopRef.current = setInterval(gameLoop, 20)
    return () => clearInterval(gameLoopRef.current)
  }, [screen, handleDeath, getCurrentDifficulty, getGameSettings, gameMode, playSound])

  useEffect(() => {
    if (screen !== 'playing') return

    const spawnPipe = () => {
      const currentDiff = getCurrentDifficulty(scoreRef.current)
      const settings = getGameSettings(currentDiff)

      const variance = 80 + currentDiff * 25
      const centerY = 200
      const gapY = centerY - variance/2 + Math.random() * variance

      const heartChance = gameMode === 'infinite' ? 0.3 : 0.25
      const hasHeart = Math.random() < heartChance

      setPipes(prev => [...prev, {
        id: pipeIdRef.current++,
        x: 420,
        gapY: Math.max(60, Math.min(gapY, 500 - settings.pipeGap - 100)),
        passed: false,
        hasHeart,
        heartCollected: false,
      }])
    }

    const firstTimeout = setTimeout(spawnPipe, 2000)
    const baseInterval = gameMode === 'infinite' ? 2200 : 2600
    const interval = setInterval(spawnPipe, baseInterval - difficulty * 100)

    return () => {
      clearTimeout(firstTimeout)
      clearInterval(interval)
    }
  }, [screen, difficulty, getCurrentDifficulty, getGameSettings, gameMode])

  const handleJump = useCallback(() => {
    if (screen === 'playing') {
      playSound('jump')
      setVelocity(BASE_JUMP_FORCE)
      velocityRef.current = BASE_JUMP_FORCE
    }
  }, [screen, playSound])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault()
        handleJump()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleJump])

  const startGame = (mode) => {
    setGameMode(mode)
    setScreen('intro')
  }

  const beginPlaying = () => {
    const bonus = getAttemptsBonus(attempts)
    setScreen('playing')
    setPlayerY(250)
    playerYRef.current = 250
    setVelocity(0)
    velocityRef.current = 0
    setPipes([])
    setScore(0)
    scoreRef.current = 0
    setLives(bonus.extraLives)
    setDifficulty(0)
    pipeIdRef.current = 0
  }

  const goToMenu = () => {
    setScreen('menu')
    setGameMode(null)
  }

  const PlayerAvatar = () => (
    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-malaysia-red to-malaysia-pink flex items-center justify-center">
      {ritaPhoto && !imageError ? (
        <img src={ritaPhoto} alt="Rita" className="w-full h-full object-cover" onError={() => setImageError(true)} />
      ) : (
        <span className="text-3xl">👸</span>
      )}
    </div>
  )

  if (screen === 'menu') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="card max-w-md w-full text-center animate-scale-in">
          <div className="relative mb-4 inline-block">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-malaysia-gold shadow-xl mx-auto animate-float bg-gradient-to-br from-malaysia-red to-malaysia-pink flex items-center justify-center">
              {ritaPhoto && !imageError ? (
                <img src={ritaPhoto} alt="Rita" className="w-full h-full object-cover" onError={() => setImageError(true)} />
              ) : (
                <span className="text-4xl">👸</span>
              )}
            </div>
            <div className="absolute -right-2 top-0 text-2xl">🐦</div>
          </div>

          <h2 className="text-3xl font-display font-bold gradient-text mb-1">
            Flappy Rita 🐦💕
          </h2>
          <p className="text-gray-500 mb-6">Escolhe o teu modo de jogo!</p>

          <button
            onClick={() => startGame('story')}
            className="w-full mb-3 p-4 rounded-2xl bg-gradient-to-r from-malaysia-red to-malaysia-pink text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <div className="text-left flex-1">
                <div className="font-bold text-lg">🎁 Modo História</div>
                <div className="text-sm opacity-80">
                  {letterUnlocked ? '✓ Carta desbloqueada!' : `Desbloqueia a carta (${STORY_TARGET} pontos)`}
                </div>
              </div>
            </div>
            {highScoreStory > 0 && (
              <div className="mt-2 text-xs opacity-70">Recorde: {highScoreStory} pontos</div>
            )}
          </button>

          <button
            onClick={() => startGame('infinite')}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Infinity className="w-6 h-6" />
              </div>
              <div className="text-left flex-1">
                <div className="font-bold text-lg">🎮 Modo Infinito</div>
                <div className="text-sm opacity-80">Joga sem limites, bate o recorde!</div>
              </div>
            </div>
            {highScoreInfinite > 0 && (
              <div className="mt-2 text-xs opacity-70 flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3" /> Recorde: {highScoreInfinite} pontos
              </div>
            )}
          </button>

          {letterUnlocked && (
            <button
              onClick={onComplete}
              className="w-full mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium shadow-lg hover:shadow-xl transition-all animate-glow"
            >
              💌 Ver a Minha Carta de Amor
            </button>
          )}
        </div>
      </div>
    )
  }

  if (screen === 'intro') {
    const isStory = gameMode === 'story'

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="card max-w-md w-full text-center animate-scale-in">
          <button onClick={goToMenu} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-4xl mb-3">{isStory ? '🎁' : '🎮'}</div>

          <h2 className="text-2xl font-display font-bold gradient-text mb-1">
            {isStory ? 'Modo História' : 'Modo Infinito'}
          </h2>

          <p className="text-gray-500 mb-4">
            {isStory
              ? 'Chega aos 10 pontos para desbloquear a carta!'
              : 'Sem limites! Voa o mais longe que conseguires!'
            }
          </p>

          <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl p-4 mb-4 text-left">
            {isStory ? (
              <p className="text-sm text-gray-600 italic">
                "O amor não é fácil... começa suave mas fica mais intenso! Tal como nós 😏💕"
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Dicas:</span><br/>
                • A dificuldade aumenta mais rápido 🔥<br/>
                • Apanha ❤️ para vidas extra<br/>
                • Bate o teu recorde de <span className="font-bold text-purple-600">{highScoreInfinite}</span> pontos!
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-4">
            <span>💻 ESPAÇO</span>
            <span>📱 Toca</span>
          </div>

          <button onClick={beginPlaying} className={`w-full py-3 rounded-xl text-white font-bold text-lg shadow-lg ${isStory ? 'bg-gradient-to-r from-malaysia-red to-malaysia-pink' : 'bg-gradient-to-r from-purple-500 to-indigo-600'}`}>
            {isStory ? '💕 Vamos Lá, Amor!' : '🚀 Começar!'}
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'won') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="card max-w-md w-full text-center animate-scale-in">
          <div className="text-6xl mb-4 animate-bounce-slow">💕</div>

          <h2 className="text-2xl md:text-3xl font-display font-bold gradient-text mb-2">
            {WIN_MESSAGES.title}
          </h2>

          <p className="text-gray-600 mb-2">{WIN_MESSAGES.subtitle}</p>

          <p className="text-sm text-gray-500 italic mb-4 px-4">
            "{WIN_MESSAGES.description}"
          </p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-malaysia-gold">{score}</div>
              <div className="text-xs text-gray-500">Pontos</div>
            </div>
            <Heart className="w-6 h-6 text-malaysia-red fill-malaysia-red animate-heart-beat" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{attempts + 1}</div>
              <div className="text-xs text-gray-500">Tentativas</div>
            </div>
          </div>

          <button onClick={onComplete} className="btn-gold w-full text-lg mb-3">
            <span className="flex items-center justify-center gap-2">
              <Heart className="w-5 h-5" />
              Ler a Minha Carta de Amor 💌
            </span>
          </button>

          <button onClick={goToMenu} className="text-sm text-gray-500 hover:text-gray-700">
            ← Voltar ao menu
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'dead') {
    const isStory = gameMode === 'story'
    const currentHS = isStory ? highScoreStory : highScoreInfinite
    const isNewRecord = score >= currentHS && score > 0

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="card max-w-md w-full text-center animate-scale-in">
          <div className="text-5xl mb-3">{isNewRecord ? '🏆' : '💕'}</div>

          {isNewRecord && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-3 inline-block">
              🎉 NOVO RECORDE!
            </div>
          )}

          <p className="text-xl font-display text-gray-700 mb-2">
            {deathMessage}
          </p>

          <p className="text-gray-500 mb-1">
            Pontuação: <span className="font-bold text-2xl text-malaysia-red">{score}</span>
            {isStory && <span className="text-gray-400"> / {STORY_TARGET}</span>}
          </p>

          <p className="text-xs text-gray-400 mb-4">
            Nível: {"🔥".repeat(Math.min(difficulty + 1, 5))}
          </p>

          {attempts > 0 && isStory && (
            <p className="text-sm text-malaysia-coral mb-4 italic">
              {ENCOURAGEMENT[Math.min(attempts - 1, ENCOURAGEMENT.length - 1)]}
            </p>
          )}

          <button onClick={beginPlaying} className={`w-full py-3 rounded-xl text-white font-bold shadow-lg mb-3 ${isStory ? 'bg-gradient-to-r from-malaysia-red to-malaysia-pink' : 'bg-gradient-to-r from-purple-500 to-indigo-600'}`}>
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Tentar Outra Vez! 💪
            </span>
          </button>

          <button onClick={goToMenu} className="text-sm text-gray-500 hover:text-gray-700">
            ← Voltar ao menu
          </button>

          <p className="mt-4 text-xs text-gray-400">
            🏆 Recorde: {currentHS}
          </p>
        </div>
      </div>
    )
  }

  const settings = getGameSettings(difficulty)
  const isStory = gameMode === 'story'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-4">
      <div className="mb-3 flex items-center gap-3">
        <div className={`glass rounded-full px-4 py-2 flex items-center gap-2 ${!isStory && 'bg-purple-100/50'}`}>
          <Star className={`w-4 h-4 ${isStory ? 'text-malaysia-gold' : 'text-purple-500'} fill-current`} />
          <span className="text-xl font-bold">{score}</span>
          {isStory && <span className="text-gray-400 text-sm">/ {STORY_TARGET}</span>}
        </div>

        {lives > 0 && (
          <div className="glass rounded-full px-3 py-2 flex items-center gap-1">
            {[...Array(Math.min(lives, 5))].map((_, i) => (
              <Heart key={i} className="w-4 h-4 text-red-500 fill-red-500" />
            ))}
            {lives > 5 && <span className="text-xs text-red-500">+{lives - 5}</span>}
          </div>
        )}

        <div className="glass rounded-full px-3 py-2 text-xs">
          {"🔥".repeat(Math.min(difficulty + 1, 5))}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          className="glass rounded-full p-2 hover:bg-white/50 transition-colors"
          title={isMuted ? 'Ativar som' : 'Desativar som'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-gray-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      <div
        className={`relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer select-none ${isStory ? 'bg-gradient-to-b from-sky-300 via-sky-200 to-green-200' : 'bg-gradient-to-b from-purple-300 via-indigo-200 to-blue-200'}`}
        style={{ width: '100%', maxWidth: '400px', height: '500px' }}
        onClick={handleJump}
        onTouchStart={(e) => { e.preventDefault(); handleJump(); }}
      >
        <div className="absolute top-10 left-10 w-16 h-8 bg-white/70 rounded-full" />
        <div className="absolute top-20 right-16 w-20 h-10 bg-white/60 rounded-full" />
        <div className="absolute top-32 left-1/3 w-12 h-6 bg-white/50 rounded-full" />

        <div className={`absolute top-8 right-8 w-12 h-12 rounded-full ${isStory ? 'bg-yellow-300' : 'bg-purple-200'}`} style={{ boxShadow: `0 0 30px ${isStory ? 'rgba(255, 200, 0, 0.5)' : 'rgba(167, 139, 250, 0.5)'}` }} />

        <div className={`absolute bottom-0 left-0 right-0 h-12 ${isStory ? 'bg-gradient-to-t from-green-600 to-green-500' : 'bg-gradient-to-t from-indigo-600 to-indigo-500'}`}>
          <div className={`absolute top-0 left-0 right-0 h-2 ${isStory ? 'bg-green-700' : 'bg-indigo-700'}`} />
        </div>

        {pipes.map(pipe => (
          <div key={pipe.id}>
            <div
              className={`absolute rounded-b-lg ${isStory ? 'bg-gradient-to-b from-amber-500 via-amber-400 to-amber-500' : 'bg-gradient-to-b from-purple-500 via-purple-400 to-purple-500'}`}
              style={{ left: pipe.x, top: 0, width: PIPE_WIDTH, height: pipe.gapY }}
            >
              <div className="absolute left-2 top-0 bottom-0 w-2 bg-white/30 rounded-full" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs font-bold px-1 rounded">🥤</div>
            </div>

            <div
              className={`absolute rounded-t-lg ${isStory ? 'bg-gradient-to-b from-amber-500 via-amber-400 to-amber-500' : 'bg-gradient-to-b from-purple-500 via-purple-400 to-purple-500'}`}
              style={{ left: pipe.x, top: pipe.gapY + settings.pipeGap, width: PIPE_WIDTH, height: 500 - pipe.gapY - settings.pipeGap - 48 }}
            >
              <div className="absolute left-2 top-0 bottom-0 w-2 bg-white/30 rounded-full" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs font-bold px-1 rounded">🥤</div>
            </div>

            {pipe.hasHeart && !pipe.heartCollected && (
              <div
                className="absolute animate-pulse"
                style={{ left: pipe.x + PIPE_WIDTH / 2 - 12, top: pipe.gapY + settings.pipeGap / 2 - 12 }}
              >
                <Heart className="w-6 h-6 text-red-500 fill-red-500 drop-shadow-lg" />
              </div>
            )}
          </div>
        ))}

        <div
          className="absolute"
          style={{
            left: 80, top: playerY, width: PLAYER_SIZE, height: PLAYER_SIZE,
            transform: `rotate(${Math.min(Math.max(velocity * 4, -30), 60)}deg)`,
            transition: 'transform 0.1s'
          }}
        >
          <PlayerAvatar />
          <div className="absolute top-1/2 -left-3 text-2xl" style={{ transform: `translateY(-50%) rotate(${velocity < 0 ? '-30deg' : '10deg'})`, transition: 'transform 0.15s' }}>
            🪽
          </div>
          {lives > 0 && (
            <div className="absolute inset-0 rounded-full border-2 border-red-400/50 animate-pulse" style={{ transform: 'scale(1.3)' }} />
          )}
        </div>

        {showHeartCollect && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-red-500 animate-ping">
            ❤️ +1
          </div>
        )}

        {score === 0 && pipes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="text-white text-center bg-black/50 rounded-2xl p-4">
              <p className="text-xl font-bold mb-1">👆 Toca para voar!</p>
              <p className="text-sm opacity-80">
                {isStory ? 'O amor começa suave... 💕' : 'Voa o mais longe que conseguires! 🚀'}
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-sm text-gray-400">
        📱 Toca | 💻 ESPAÇO
      </p>
    </div>
  )
}
