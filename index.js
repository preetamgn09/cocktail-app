// index.js — Main server file for the CocktailDB Explorer app
// Sets up Express, Axios, and EJS, then defines all routes.

import express from "express";
import axios from "axios";

const app = express();
const PORT = 3001;

// The base URL for TheCocktailDB's free API (no auth required)
const COCKTAIL_API = "https://www.thecocktaildb.com/api/json/v1/1";

// ── Middleware ────────────────────────────────────────────────
// Serve static files (CSS, images) from the "public" folder
app.use(express.static("public"));

// Parse URL-encoded form data submitted by the user
app.use(express.urlencoded({ extended: true }));

// Use EJS as the templating engine for rendering HTML pages
app.set("view engine", "ejs");

// ── Routes ────────────────────────────────────────────────────

// HOME — show a random cocktail on page load
app.get("/", async (req, res) => {
  try {
    // Fetch a random cocktail from the API
    const response = await axios.get(`${COCKTAIL_API}/random.php`);
    const cocktail = formatCocktail(response.data.drinks[0]);

    // Render index.ejs and pass the cocktail data to the template
    res.render("index", { cocktail, searchTerm: "" });
  } catch (error) {
    // Log the error server-side and show a friendly message to the user
    console.error("Error fetching random cocktail:", error.message);
    res.render("index", { cocktail: null, searchTerm: "", error: "Could not load a cocktail right now. Please try again!" });
  }
});

// SEARCH — look up cocktails by name
app.get("/search", async (req, res) => {
  const searchTerm = req.query.name?.trim();

  // If the user submitted an empty search, redirect home
  if (!searchTerm) return res.redirect("/");

  try {
    const response = await axios.get(`${COCKTAIL_API}/search.php`, {
      params: { s: searchTerm }, // "s" is the CocktailDB query param for name search
    });

    // The API returns null if no drinks are found
    const drinks = response.data.drinks;
    const results = drinks ? drinks.map(formatCocktail) : [];

    res.render("search", { results, searchTerm });
  } catch (error) {
    console.error("Error searching cocktails:", error.message);
    res.render("search", { results: [], searchTerm, error: "Search failed. Please try again!" });
  }
});

// RANDOM — fetch a fresh random cocktail (called via the "Surprise Me" button)
app.get("/random", async (req, res) => {
  try {
    const response = await axios.get(`${COCKTAIL_API}/random.php`);
    const cocktail = formatCocktail(response.data.drinks[0]);
    res.render("index", { cocktail, searchTerm: "" });
  } catch (error) {
    console.error("Error fetching random cocktail:", error.message);
    res.render("index", { cocktail: null, searchTerm: "", error: "Could not load a cocktail. Please try again!" });
  }
});

// DETAIL — view a single cocktail by its ID
app.get("/cocktail/:id", async (req, res) => {
  try {
    const response = await axios.get(`${COCKTAIL_API}/lookup.php`, {
      params: { i: req.params.id }, // "i" is the CocktailDB param for ID lookup
    });

    const drinks = response.data.drinks;
    if (!drinks) return res.redirect("/"); // Cocktail not found — go home

    const cocktail = formatCocktail(drinks[0]);
    res.render("detail", { cocktail });
  } catch (error) {
    console.error("Error fetching cocktail details:", error.message);
    res.redirect("/");
  }
});

// ── Helper: formatCocktail ─────────────────────────────────────
// The CocktailDB API stores ingredients as strIngredient1…15 and
// measures as strMeasure1…15. This helper collects them into a
// clean array so EJS templates don't need messy loops.
function formatCocktail(drink) {
  const ingredients = [];

  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];

    // Stop once we hit an empty ingredient slot
    if (!ingredient) break;

    ingredients.push({
      name: ingredient,
      measure: measure ? measure.trim() : "to taste",
    });
  }

  return {
    id: drink.idDrink,
    name: drink.strDrink,
    category: drink.strCategory,
    alcoholic: drink.strAlcoholic,
    glass: drink.strGlass,
    instructions: drink.strInstructions,
    image: drink.strDrinkThumb,
    ingredients,
    tags: drink.strTags ? drink.strTags.split(",") : [],
  };
}

// ── Start server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🍹 Cocktail Bar is running at http://localhost:${PORT}`);
});
