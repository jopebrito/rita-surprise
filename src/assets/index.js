// ============================================
// ADICIONA AS FOTOS DA RITA AQUI!
// ============================================
//
// 1. Coloca as fotos nesta pasta (src/assets/)
// 2. Renomeia-as para:
//    - rita-japan.jpg (foto do Japão com o dango)
//    - rita-festival.jpg (foto do festival)
//
// Ou muda os nomes abaixo para os nomes dos teus ficheiros!
// ============================================

// Tenta importar as imagens, se não existirem usa placeholder
let ritaJapan = null
let ritaFestival = null

try {
  ritaJapan = new URL('./rita-japan.jpg', import.meta.url).href
} catch (e) {
  ritaJapan = null
}

try {
  ritaFestival = new URL('./rita-festival.jpg', import.meta.url).href
} catch (e) {
  ritaFestival = null
}

export { ritaJapan, ritaFestival }
