import { useEffect, useState } from 'react'

// Hibiscus flower SVG component
function HibiscusFlower({ size = 40, color = '#DC143C', opacity = 0.3 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ opacity }}
      className="transition-all duration-300"
    >
      {/* Petals */}
      {[0, 72, 144, 216, 288].map((rotation, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="25"
          rx="18"
          ry="25"
          fill={color}
          transform={`rotate(${rotation} 50 50)`}
        />
      ))}
      {/* Center */}
      <circle cx="50" cy="50" r="12" fill="#FFD700" />
      <circle cx="50" cy="50" r="6" fill="#FF6B6B" />
      {/* Stamen */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, i) => (
        <line
          key={`stamen-${i}`}
          x1="50"
          y1="50"
          x2="50"
          y2="35"
          stroke="#FFD700"
          strokeWidth="1"
          transform={`rotate(${rotation} 50 50)`}
        />
      ))}
    </svg>
  )
}

// Heart shape
function FloatingHeart({ size = 30, color = '#FF69B4', opacity = 0.4 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={{ opacity }}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

// Sparkle/Star
function Sparkle({ size = 20, color = '#FFD700', opacity = 0.5 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={{ opacity }}
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  )
}

export default function FloatingDecorations() {
  const [decorations, setDecorations] = useState([])

  useEffect(() => {
    // Generate random decorations
    const types = ['hibiscus', 'heart', 'sparkle']
    const colors = {
      hibiscus: ['#DC143C', '#FF69B4', '#FF6B6B'],
      heart: ['#FF69B4', '#DC143C', '#FF6B6B'],
      sparkle: ['#FFD700', '#FFA500', '#FFE4B5']
    }

    const newDecorations = Array.from({ length: 15 }, (_, i) => {
      const type = types[Math.floor(Math.random() * types.length)]
      return {
        id: i,
        type,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 40,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
        opacity: 0.1 + Math.random() * 0.3,
        animationDuration: 5 + Math.random() * 10,
        animationDelay: Math.random() * 5,
        rotation: Math.random() * 360
      }
    })

    setDecorations(newDecorations)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {decorations.map((dec) => (
        <div
          key={dec.id}
          className="absolute animate-float"
          style={{
            left: `${dec.x}%`,
            top: `${dec.y}%`,
            animationDuration: `${dec.animationDuration}s`,
            animationDelay: `${dec.animationDelay}s`,
            transform: `rotate(${dec.rotation}deg)`
          }}
        >
          {dec.type === 'hibiscus' && (
            <HibiscusFlower
              size={dec.size}
              color={dec.color}
              opacity={dec.opacity}
            />
          )}
          {dec.type === 'heart' && (
            <FloatingHeart
              size={dec.size}
              color={dec.color}
              opacity={dec.opacity}
            />
          )}
          {dec.type === 'sparkle' && (
            <Sparkle
              size={dec.size}
              color={dec.color}
              opacity={dec.opacity}
            />
          )}
        </div>
      ))}

      {/* Gradient orbs */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #DC143C 0%, transparent 70%)',
          top: '-10%',
          right: '-10%'
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
          bottom: '-10%',
          left: '-10%'
        }}
      />
      <div
        className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #228B22 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
    </div>
  )
}
