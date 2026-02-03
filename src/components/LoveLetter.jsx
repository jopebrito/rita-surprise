import { useState, useRef } from 'react'
import { Heart, Download, RefreshCw, Sparkles } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// ============================================
// CARTA DE AMOR PARA A RITA
// ============================================
const LETTER_CONTENT = {
  title: "Para ti, minha pequenina",
  date: "Malásia - 3 de Fevereiro de 2026",

  paragraphs: [
    "Olá, meu amor.",

    "Se estás a ler isto, significa que não desististe. E isso diz tudo sobre ti  ( aliás sobre nós). Nunca desistimos, mesmo quando está difícil. Mesmo quando estamos a 10.759 km de distância.",

    "Passei os últimos dois dias a criar isto para ti. Dois dias a programar, a escolher cores, a escrever mensagens, a pôr a tua cara linda a voar pelo ecrã a fugir de Milkshakes 😂. E sabes que mais? Cada segundo valeu a pena só de imaginar o teu sorriso ao jogar isto.",

    "Aquele sorriso. O mesmo sorriso que vi nas fotos do Japão, quando estavas a comer dango nas ruas de Tokyo. O mesmo sorriso radiante do festival, com os braços no ar, cheia de vida. O sorriso que me faz sentir a pessoa mais sortuda do mundo por te ter encontrado.",

    "Estes 3 meses vão custar. Eu sei. Tu sabes. Mas quero que saibas uma coisa: mesmo estando do outro lado do mundo, não há um único momento em que não pense em ti. Acordo a pensar em ti. Adormeço a pensar em ti. E nos intervalos? Também.",

    "Este jogo é sobre nós, sabes? Começa fácil, como quando nos conhecemos. Mas vai ficando mais intenso, mais desafiante. Tal como o amor. Tal como a vida. E no final, se não desistirmos, há sempre uma recompensa. Há sempre algo bonito à nossa espera.",

    "E este é apenas o primeiro desafio. Vou criar mais. Vou inventar mais surpresas. Porque tu mereces. Porque quero que, mesmo longe, sintas que estou aí contigo. Que o meu amor atravessa oceanos, fusos horários, e quilómetros infinitos.",

    "Quando sentires saudades, joga o jogo outra vez. Olha para a tua cara a voar e ri-te. Lembra-te que há alguém na Malásia que te ama loucamente e que está a contar os dias para te voltar a abraçar.",

    "Tu és a minha pessoa favorita no mundo inteiro, Rita. A minha companheira de aventuras. A minha casa. Não importa onde eu esteja porque contigo é onde eu quero estar.",

    "Aguenta firme, meu amor. Já falta menos. 💕"
  ],

  signature: "Com todo o amor que tenho (e é muito),",
  name: "O teu Pedro ❤️"
}
// ============================================

export default function LoveLetter({ onReset }) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const letterRef = useRef(null)

  const handleDownloadPDF = async () => {
    if (!letterRef.current) return
    setIsDownloading(true)

    try {
      const canvas = await html2canvas(letterRef.current, {
        scale: 2,
        backgroundColor: '#FFF8DC',
        logging: false
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgRatio = canvas.width / canvas.height
      const pdfRatio = pdfWidth / pdfHeight

      let imgW, imgH
      if (imgRatio > pdfRatio) {
        imgW = pdfWidth - 20
        imgH = imgW / imgRatio
      } else {
        imgH = pdfHeight - 20
        imgW = imgH * imgRatio
      }

      const x = (pdfWidth - imgW) / 2
      const y = 10

      pdf.addImage(imgData, 'PNG', x, y, imgW, imgH)
      pdf.save('carta-para-rita.pdf')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF. Tenta novamente!')
    }

    setIsDownloading(false)
  }

  // Envelope fechado
  if (!isEnvelopeOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="text-center animate-scale-in">
          {/* Parabéns */}
          <div className="mb-6">
            <div className="text-6xl mb-4 animate-bounce-slow">🎉</div>
            <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-2">
              Parabéns, Campeã!
            </h1>
            <p className="text-gray-600">
              Desbloqueaste a tua surpresa! 🎁
            </p>
          </div>

          {/* Envelope */}
          <div
            onClick={() => setIsEnvelopeOpen(true)}
            className="relative cursor-pointer group mx-auto mb-6 hover:scale-105 transition-transform duration-300"
            style={{ width: '260px', height: '180px' }}
          >
            {/* Envelope body */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-200 to-rose-300 rounded-xl shadow-2xl overflow-hidden">
              {/* Flap */}
              <div
                className="absolute top-0 left-0 right-0 bg-gradient-to-br from-rose-300 to-rose-400 origin-top group-hover:-rotate-12 transition-transform duration-500"
                style={{
                  height: '50%',
                  clipPath: 'polygon(0 0, 50% 80%, 100% 0)'
                }}
              />

              {/* Heart seal */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-10">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-malaysia-red to-malaysia-pink flex items-center justify-center shadow-lg animate-heart-beat">
                  <Heart className="w-7 h-7 text-white fill-white" />
                </div>
              </div>

              {/* Lines */}
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <div className="h-1 bg-white/40 rounded" />
                <div className="h-1 bg-white/40 rounded w-2/3" />
              </div>
            </div>

            {/* Sparkles */}
            <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-malaysia-gold animate-pulse" />
          </div>

          <p className="text-gray-500 animate-pulse">
            👆 Clica no envelope para abrir! 💌
          </p>
        </div>
      </div>
    )
  }

  // Carta aberta
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Botões */}
        <div className="flex items-center justify-between mb-4 px-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Recomeçar
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="btn-gold !py-2 !px-4 text-sm flex items-center gap-2"
          >
            {isDownloading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isDownloading ? 'A gerar...' : 'Guardar PDF'}
          </button>
        </div>

        {/* Carta */}
        <div
          ref={letterRef}
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden animate-scale-in"
        >
          {/* Pattern de corações de fundo */}
          <div className="absolute inset-0 opacity-5">
            {[...Array(20)].map((_, i) => (
              <Heart
                key={i}
                className="absolute text-malaysia-red fill-malaysia-red"
                style={{
                  left: `${(i * 17) % 100}%`,
                  top: `${(i * 23) % 100}%`,
                  width: `${20 + (i % 3) * 10}px`,
                  transform: `rotate(${i * 18}deg)`
                }}
              />
            ))}
          </div>

          {/* Decoração superior */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-malaysia-gold to-transparent flex-1" />
            <Heart className="w-5 h-5 text-malaysia-red fill-malaysia-red" />
            <div className="h-px bg-gradient-to-r from-transparent via-malaysia-gold to-transparent flex-1" />
          </div>

          {/* Data */}
          {LETTER_CONTENT.date && (
            <p className="text-right text-sm text-gray-500 italic mb-4">
              {LETTER_CONTENT.date}
            </p>
          )}

          {/* Título */}
          <h2 className="text-2xl md:text-3xl font-display font-bold text-malaysia-darkRed mb-6 text-center">
            {LETTER_CONTENT.title}
          </h2>

          {/* Conteúdo */}
          <div className="space-y-4 text-gray-700 leading-relaxed relative z-10">
            {LETTER_CONTENT.paragraphs.map((p, i) => (
              <p key={i} className="text-sm md:text-base">
                {p}
              </p>
            ))}
          </div>

          {/* Assinatura */}
          <div className="mt-8 text-right relative z-10">
            <p className="text-gray-600 italic text-sm">{LETTER_CONTENT.signature}</p>
            <p className="text-xl font-display font-bold text-malaysia-red mt-1">
              {LETTER_CONTENT.name}
            </p>
          </div>

          {/* Decoração inferior */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="h-px bg-gradient-to-r from-transparent via-malaysia-gold to-transparent flex-1" />
            <div className="flex gap-1">
              <Heart className="w-3 h-3 text-malaysia-red fill-malaysia-red" />
              <Heart className="w-4 h-4 text-malaysia-pink fill-malaysia-pink" />
              <Heart className="w-3 h-3 text-malaysia-coral fill-malaysia-coral" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-malaysia-gold to-transparent flex-1" />
          </div>
        </div>

        {/* Mensagem final */}
        <div className="text-center mt-6 p-4 glass rounded-xl">
          <p className="text-gray-600 text-sm">
            Espero que tenhas gostado! 💕
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Feito com muito amor ❤️
          </p>
        </div>
      </div>
    </div>
  )
}
