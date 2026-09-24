# AURORA // GRID — Soirée Halloween du lycée

Jeu de piste scénarisé « AURORA » (IA de défense) en 5 phases, 100 % HTML/CSS/JS.
Thème : **noir + bleu pétant + blanc** — le rouge est réservé au bouton d'urgence.
Architecture **multi-pages** (une page = une phase) pour travailler facilement.
Aucune dépendance : ça tourne partout, y compris GitHub Pages.

## Structure

```
halloween-skynet/
├── index.html        ← routeur : redirige vers la phase mémorisée
├── alert.html        ← phase 1 : gros bouton rouge « EN CAS DE DANGER »
├── video.html        ← phase 2 : vidéo + voix animée + logs + compte à rebours
├── map.html          ← phase 3 : carte du plan PDF importé + chrono 90 s + accès MJ
├── code.html         ← phase 4 : code d'annihilation 15 chiffres + question secrète
├── finale.html       ← phase 5 : audio de fond + texte machine à écrire
├── assets/
│   ├── style.css     ← design system partagé (HUD, transitions, modale MJ)
│   ├── core.js       ← moteur partagé (navigation, phases, sons, anti-triche)
│   ├── intro.mp4     ← À CRÉER (vidéo de lancement)
│   └── *.mp3         ← sons générés (bips, erreur, succès, boom, ambiance)
└── docs/screens/     captures de chaque écran
```

## Le déroulé

1. **alert.html** — bouton rouge pulsant, anneaux bleus qui pulsent. Clic → flash + zoom → phase 2.
2. **video.html** — vidéo (placeholder si absente) + voix AURORA (waveform bleu/blanc + sous-titres) + logs.
   Fin → compte à rebours 5 s affiché → iris → phase 3.
3. **map.html** — plan importé à l'identique depuis `map test.pdf` (murs vectoriels extraits),
   5 sites à points blancs/halos bleus clignotants aux emplacements exacts du PDF.
   Compte à rebours visible de **1 min 30** : à 00:00 la carte est effacée et
   « redevient confidentielle » (voile + message). Le point MJ reste utilisable.
   Test accéléré : `?debug=1&mapms=4000` (4 s).
4. **code.html** — 15 cases (gabarit `XXX45XXX78XXX9X` : 5 chiffres verrouillés, 10 à trouver),
   pavé + clavier, question secrète. 3 erreurs = verrou 15 s. Bon code → implosion → phase 5.
5. **finale.html** — arrivée en flash blanc, audio en boucle, texte tapé à la machine (lorem ipsum).

## Maître du jeu (MJ)

Sur la carte (`map.html`) :
- **triple-clic** sur le point bleu presque invisible (bas-droit de la carte) ;
- ou **taper les lettres `m` `j`** au clavier.

Mot de passe MJ : `MJ-AURORA-31` (le hash vérifié, jamais le mot en clair).

## Anti-triche

Code d'annihilation, mot secret et mot de passe MJ existent uniquement sous forme de
**hash djb2 salé** dans `assets/core.js` (`H_CODE`, `H_MJ`). Rien en clair dans les sources.

Pour changer une valeur (Console JS ou Node) :
```js
function djb2(s){var h=5381;for(var i=0;i<s.length;i++){h=(h*33+s.charCodeAt(i))>>>0}return h}
djb2("1195084351.3720007810" + "|" + "094453677812990" + "|" + "surprise") // → H_CODE
djb2("1195084351.3720007810" + "|" + "MJ-AURORA-31")                        // → H_MJ
```

## Mode debug / répétition

`?debug=1` dans l'URL : boutons « Passer », voix accélérée. Le flag survit aux navigations.
`?reset=1` : repart de zéro. La phase est mémorisée entre les pages (localStorage) avec
proposition de reprise au chargement de `index.html`.

## Personnaliser

| Quoi | Où |
|---|---|
| Vidéo de lancement → `assets/intro.mp4` | détection automatique |
| Texte final (lorem ipsum) | `finale.html` → `MESSAGE` |
| Sous-titres de la voix | `video.html` → `SUBS` |
| Noms des 5 sites | SVG `map.html` + légende |
| Délai avant la carte | `video.html` → `VIDEO_DELAY_MS` |
| Gabarit du code | `code.html` → `PATTERN` |

## Déploiement GitHub Pages

```bash
cd Documents/halloween-skynet
git init && git add -A && git commit -m "AURORA Halloween v2"
git remote add origin https://github.com/<compte>/<repo>.git
git push -u origin main
```
Settings → Pages → Branch: main → Save.

## Tests

Parcours complet vérifié (Edge headless) : **18/18** — routeur, transitions inter-pages,
compte à rebours, MJ, code erroné/bon, implosion, finale, antitriche, zéro erreur console.
Audit couleur : aucun rouge hors bouton sur les 5 pages.
