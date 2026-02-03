import { useRef, useCallback, useEffect, useState } from 'react'

const SOUND_URLS = {
  jump: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  score: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  heart: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
  hit: 'https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3',
  gameOver: 'https://assets.mixkit.co/active_storage/sfx/2658/2658-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  bgMusic: null,
  letterMusic: null,
}

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

  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) audio.volume = isMuted ? 0 : volume
    })
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = isMuted ? 0 : volume * 0.3
    }
    localStorage.setItem('flappy-rita-volume', volume.toString())
    localStorage.setItem('flappy-rita-muted', isMuted.toString())
  }, [volume, isMuted])

  const playSound = useCallback((soundName) => {
    if (isMuted) return

    const audio = audioRefs.current[soundName]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    }
  }, [isMuted])

  const stopAllSounds = useCallback(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    })
    if (bgMusicRef.current) {
      bgMusicRef.current.pause()
      bgMusicRef.current.currentTime = 0
    }
  }, [])

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

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])

  const setVolume = useCallback((newVolume) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)))
  }, [])

  useEffect(() => {
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause()
      }
    }
  }, [])

  return {
    playSound,
    stopAllSounds,
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
    }).catch(() => {})
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
