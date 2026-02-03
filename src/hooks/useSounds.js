import { useRef, useCallback, useEffect, useState } from 'react'

// ============================================
// CONFIGURAÇÃO DOS SONS
// ============================================
// Para usar os teus próprios sons, coloca os ficheiros MP3 em:
// src/assets/sounds/
// E atualiza os caminhos abaixo
// ============================================

// Sons do jogo (usando URLs de sons gratuitos por defeito)
// Substitui por imports locais quando tiveres os ficheiros:
// import jumpSound from '../assets/sounds/jump.mp3'
const SOUND_URLS = {
  // Efeitos do jogo
  jump: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',       // Som de salto/flap
  score: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',      // Passar pelo tubo
  heart: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',      // Apanhar coração
  hit: 'https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3',        // Bater no tubo (perder vida)
  gameOver: 'https://assets.mixkit.co/active_storage/sfx/2658/2658-preview.mp3',   // Game over
  win: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',        // Vitória
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',      // Click em botões

  // Música de fundo (placeholder - substitui pelo teu ficheiro)
  // Para a carta de amor, adiciona: letterMusic: '../assets/sounds/musica-carta.mp3'
  bgMusic: null,       // Música de fundo do jogo (opcional)
  letterMusic: null,   // Música quando abre a carta (adiciona o teu MP3 aqui)
}

// ============================================
// HOOK PRINCIPAL
// ============================================
export function useSounds() {
  const audioRefs = useRef({})
  const bgMusicRef = useRef(null)
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('flappy-rita-muted')
    return saved === 'true'
  })
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('flappy-rita-volume')
    return saved ? parseFloat(saved) : 0.5
  })

  // Pre-carregar sons
  useEffect(() => {
    Object.entries(SOUND_URLS).forEach(([key, url]) => {
      if (url && !audioRefs.current[key]) {
        const audio = new Audio(url)
        audio.preload = 'auto'
        audio.volume = volume
        audioRefs.current[key] = audio
      }
    })
  }, [])

  // Atualizar volume em todos os sons
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) audio.volume = isMuted ? 0 : volume
    })
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = isMuted ? 0 : volume * 0.3 // Música de fundo mais baixa
    }
    localStorage.setItem('flappy-rita-volume', volume.toString())
    localStorage.setItem('flappy-rita-muted', isMuted.toString())
  }, [volume, isMuted])

  // Tocar um som
  const playSound = useCallback((soundName) => {
    if (isMuted) return

    const audio = audioRefs.current[soundName]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(() => {
        // Ignorar erros de autoplay (precisa de interação do utilizador primeiro)
      })
    }
  }, [isMuted])

  // Música de fundo
  const playBgMusic = useCallback((musicKey = 'bgMusic') => {
    const url = SOUND_URLS[musicKey]
    if (!url || isMuted) return

    if (bgMusicRef.current) {
      bgMusicRef.current.pause()
    }

    bgMusicRef.current = new Audio(url)
    bgMusicRef.current.loop = true
    bgMusicRef.current.volume = isMuted ? 0 : volume * 0.3
    bgMusicRef.current.play().catch(() => {})
  }, [isMuted, volume])

  const stopBgMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause()
      bgMusicRef.current.currentTime = 0
      bgMusicRef.current = null
    }
  }, [])

  const pauseBgMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause()
    }
  }, [])

  const resumeBgMusic = useCallback(() => {
    if (bgMusicRef.current && !isMuted) {
      bgMusicRef.current.play().catch(() => {})
    }
  }, [isMuted])

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])

  // Ajustar volume
  const setVolume = useCallback((newVolume) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)))
  }, [])

  // Cleanup
  useEffect(() => {
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause()
      }
    }
  }, [])

  return {
    playSound,
    playBgMusic,
    stopBgMusic,
    pauseBgMusic,
    resumeBgMusic,
    toggleMute,
    setVolume,
    isMuted,
    volume,
  }
}

// ============================================
// HOOK SIMPLIFICADO PARA MÚSICA DA CARTA
// ============================================
export function useLetterMusic(musicPath) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const play = useCallback(() => {
    if (!musicPath) return

    if (!audioRef.current) {
      audioRef.current = new Audio(musicPath)
      audioRef.current.loop = true
      audioRef.current.volume = 0.4
    }

    audioRef.current.play().then(() => {
      setIsPlaying(true)
    }).catch(() => {
      // Precisa de interação do utilizador primeiro
    })
  }, [musicPath])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop()
    } else {
      play()
    }
  }, [isPlaying, play, stop])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  return { play, stop, toggle, isPlaying }
}

export default useSounds
