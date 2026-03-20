# 🍹 The Cocktail Bar

A cocktail explorer web app built with **Express.js**, **Axios**, and **EJS**, powered by [TheCocktailDB](https://www.thecocktaildb.com/) free public API.

## Features
- 🎲 Random cocktail on every home page load
- 🔍 Search cocktails by name
- 📖 Full recipe detail pages (ingredients, measures, instructions)
- ✅ No API key required

## Tech Stack
| Tool | Purpose |
|------|---------|
| Node.js | Runtime |
| Express.js | Web server & routing |
| Axios | HTTP requests to the API |
| EJS | HTML templating |

## Project Structure
```
cocktail-bar/
├── index.js              # Express server + routes + helper
├── package.json
├── public/
│   └── styles.css        # All CSS styles
└── views/
    ├── index.ejs         # Home page (random cocktail)
    ├── search.ejs        # Search results grid
    ├── detail.ejs        # Full recipe page
    └── partials/
        ├── header.ejs    # Shared nav/header
        └── footer.ejs    # Shared footer
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server (with auto-reload)
```bash
npx nodemon index.js
```

Or, to run without nodemon:
```bash
node index.js
```

### 3. Open in your browser
```
http://localhost:3000
```

## API Used
[TheCocktailDB](https://www.thecocktaildb.com/api.php) — Free, no authentication needed.

Endpoints used:
- `GET /random.php` — Random cocktail
- `GET /search.php?s={name}` — Search by name
- `GET /lookup.php?i={id}` — Lookup by ID
