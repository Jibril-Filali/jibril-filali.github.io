# CLAUDE.md — Portfolio4.2

## PROJET
Portfolio personnel — Vanilla HTML / CSS / JS (pas de framework).
Niveau : intermédiaire. Code simple, lisible, sans over-engineering.

---

## STRUCTURE
```
Portfolio4.2/
├── index.html
├── about.html
├── contact.html
├── projects.html
├── skills.html
├── easteregg.html
├── css/
│   └── style.css
└── js/
    ├── script.js
    ├── contact.js
    └── easteregg.js
```

---

## RÈGLES DE CODE

**HTML**
- Sémantique correcte : `<header>`, `<main>`, `<section>`, `<footer>`
- Attributs `alt` sur toutes les images
- Pas de styles inline — tout dans `css/style.css`

**CSS**
- Variables CSS pour les couleurs et polices (`:root`)
- Mobile-first : media queries avec `min-width`
- Pas de `!important` sauf cas exceptionnel justifié

**JavaScript**
- Vanilla JS uniquement — pas de jQuery, pas de libs externes
- `const` par défaut, `let` si mutation nécessaire, jamais `var`
- Sélecteurs : `querySelector` / `querySelectorAll`
- Pas de `console.log` laissés en production

---

## PRINCIPES
- Simplicité d'abord — le moins de code possible pour le résultat voulu
- Ne pas modifier `style.css` globalement sans vérifier l'impact sur toutes les pages
- Tester dans le navigateur après chaque modification visuelle
