# 💕 Flappy Rita - Website Romântico

Um jogo Flappy Bird personalizado com a cara da Rita como personagem! Ao completar o jogo, desbloqueia uma carta de amor.

## 🎮 O Jogo

**Flappy Rita** - A Rita voa pelo céu a evitar... Milkshakes voadoras! 🍺😂

- Meta: Passar 10 obstáculos
- Prémio: Carta de amor desbloqueada

## 🚀 Como Usar

### 1. Instalar

```bash
cd Rita
npm install
```

### 2. Executar

```bash
npm run dev
```

Abre `http://localhost:5173` no browser.

## 🖼️ Adicionar Fotos da Rita

### Opção 1: Ficheiros locais (recomendado)

1. Coloca as fotos em `src/assets/`
2. Edita `src/games/FlappyRita.jsx` linha ~10:

```javascript
import ritaPhoto from '../assets/NOME-DA-FOTO.jpg'
```

3. Edita `src/components/WelcomePage.jsx` linha ~10 da mesma forma

### Opção 2: URL direto

Se tiveres a foto online (Imgur, Google Drive público, etc.):

```javascript
const ritaPhoto = 'https://i.imgur.com/XXXXX.jpg'
```

### Opção 3: Sem foto (emoji)

Deixa `const ritaPhoto = null` para usar 👸 como placeholder.

## ✉️ Personalizar a Carta

Edita `src/components/LoveLetter.jsx` a partir da linha ~12:

```javascript
const LETTER_CONTENT = {
  title: "Para a minha Rita",
  date: "Fevereiro de 2026",
  paragraphs: [
    "Primeiro parágrafo...",
    "Segundo parágrafo...",
    // Adiciona quantos quiseres!
  ],
  signature: "Com todo o meu amor,",
  name: "O teu amor ❤️"
}
```

## 🌐 Deploy no GitHub Pages

### 1. Criar repositório

- Vai a github.com → New repository
- Nome: `Rita` (ou outro)
- Público
- NÃO inicializar com README

### 2. Configurar base URL

Edita `vite.config.js`:

```javascript
base: '/NOME-DO-REPO/',  // Ex: '/Rita/'
```

### 3. Deploy

```bash
git init
git add .
git commit -m "Flappy Rita"
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
npm run deploy
```

### 4. Ativar Pages

- Settings → Pages
- Source: Deploy from branch
- Branch: `gh-pages`, `/ (root)`
- Save

URL final: `https://USERNAME.github.io/REPO/`

## 🎨 Características

- 🎮 Jogo Flappy Bird personalizado
- 👸 Foto da Rita como personagem
- 🍺 Obstáculos temáticos (Super Bock!)
- 💌 Carta de amor desbloqueável
- 📱 Responsivo (funciona em telemóvel)
- 💾 Progresso guardado automaticamente
- 📄 Exportar carta em PDF

## 🛠️ Tecnologias

- React + Vite
- Tailwind CSS
- Lucide React (ícones)
- html2canvas + jsPDF

---

**Dica para testar:** Para saltar o jogo e ver a carta, abre a consola (F12) e executa:

```javascript
localStorage.setItem('rita-love-progress', JSON.stringify({completed: true, screen: 'letter'}))
location.reload()
```

---

Feito com ❤️
