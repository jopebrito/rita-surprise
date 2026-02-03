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
