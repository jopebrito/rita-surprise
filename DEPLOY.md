# 🚀 Como Hospedar no GitHub Pages (GRÁTIS!)

## Passo 1: Criar repositório no GitHub

1. Vai a https://github.com e faz login
2. Clica no **"+"** no canto superior direito → **"New repository"**
3. Nome do repositório: `rita-surprise` (ou outro nome)
4. Seleciona **Public**
5. **NÃO** marques "Add a README file"
6. Clica **"Create repository"**

## Passo 2: Configurar o projeto

O ficheiro `vite.config.js` já está configurado. Só precisas de mudar o nome do repo se for diferente de "Rita":

```javascript
base: '/rita-surprise/',  // Muda para o nome do TEU repositório
```

## Passo 3: Fazer deploy

Abre o terminal na pasta do projeto e executa:

```bash
# Navegar para a pasta
cd "c:/Users/jpbrito/Documents/Brito/Rita"

# Instalar dependências (se ainda não fizeste)
npm install

# Inicializar git
git init

# Adicionar todos os ficheiros
git add .

# Fazer o primeiro commit
git commit -m "Surpresa para a Rita"

# Adicionar o repositório remoto (MUDA O USERNAME!)
git remote add origin https://github.com/SEU-USERNAME/rita-surprise.git

# Push para o GitHub
git branch -M main
git push -u origin main

# DEPLOY para GitHub Pages (isto cria o site!)
npm run deploy
```

## Passo 4: Ativar GitHub Pages

1. Vai ao teu repositório no GitHub
2. Clica em **"Settings"** (ícone de engrenagem)
3. No menu lateral esquerdo, clica em **"Pages"**
4. Em **"Source"**, seleciona:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Clica **"Save"**

## Passo 5: O teu link! 🎉

Espera 2-3 minutos e o site estará disponível em:

```
https://SEU-USERNAME.github.io/rita-surprise/
```

---

## ⚡ Comandos Rápidos (copia e cola)

```bash
cd "c:/Users/jpbrito/Documents/Brito/Rita"
npm install
git init
git add .
git commit -m "Surpresa para a Rita"
git remote add origin https://github.com/SEU-USERNAME/rita-surprise.git
git branch -M main
git push -u origin main
npm run deploy
```

**IMPORTANTE:** Substitui `SEU-USERNAME` pelo teu username do GitHub!
