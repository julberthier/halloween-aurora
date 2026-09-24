/* ════════════════════════════════════════════════════════════
   AURORA // GRID — moteur partagé (inclus dans chaque page)
   Architecture multi-pages : chaque phase est une page autonome.
   index.html = routeur (redirige vers la phase mémorisée).
   ════════════════════════════════════════════════════════════ */
(function(window){
"use strict";

/* ---------- CONFIG GLOBALE ---------- */
var AURORA = {
  SEED: "1195084351.3720007810",          /* sel interne — ne pas divulguer */
  H_CODE: 4254224195,                      /* empreinte(code 15 chiffres + mot secret) */
  H_MJ: 2907609231,                        /* empreinte(mot de passe MJ) */
  STAGE_LABELS: {
    alert:    "PHASE 01/05 — VEILLE",
    video:    "PHASE 02/05 — TRANSMISSION",
    map:      "PHASE 03/05 — RECONNAISSANCE",
    code:     "PHASE 04/05 — AUTHENTIFICATION",
    finale:   "PHASE 05/05 — SINGULARITÉ"
  },
  FX_MS: { blast: 470, static: 500, iris: 580, implode: 1560, none: 0 }
};

/* ---------- utilitaires ---------- */
function djb2(s){
  var h = 5381;
  for (var i = 0; i < s.length; i++){ h = (h * 33 + s.charCodeAt(i)) >>> 0; }
  return h;
}
function qs(id){ return document.getElementById(id); }

/* ---------- sons (mis en cache : un seul objet Audio par son) ---------- */
var SFX_CACHE = {};
function sfx(name, vol){
  try{
    var a = SFX_CACHE[name];
    if (!a){
      a = new Audio("assets/" + name + ".mp3");
      SFX_CACHE[name] = a;
    }
    a.volume = vol || 0.4;
    a.currentTime = 0;
    a.play().catch(function(){});
  }catch(e){}
}
/* précharge les sons pour éviter la latence au clic */
function sfxPreload(names){
  (names || []).forEach(function(n){
    try{ var a = new Audio("assets/" + n + ".mp3"); a.preload = "auto"; }catch(e){}
  });
}

/* ---------- mémoire de phase (cross-page) ---------- */
function setStage(stage){
  try{ localStorage.setItem("aur_stage", stage); }catch(e){}
}
function getStage(){
  try{ return localStorage.getItem("aur_stage"); }catch(e){ return null; }
}
function clearStage(){
  try{ localStorage.removeItem("aur_stage"); }catch(e){}
}

/* ---------- navigation avec transition de sortie ---------- */
/* goPage({url, stage, fx}) : fx = blast | static | iris | implode | none */
function goPage(opt){
  var fx = opt.fx || "none";
  var ms = AURORA.FX_MS[fx] || 0;
  setStage(opt.stage);
  /* conserve le mode debug à travers la navigation */
  var url = opt.url;
  if (AURORA.debug){ url += (url.indexOf("?") >= 0 ? "&" : "?") + "debug=1"; }
  if (fx === "blast"){
    var f = qs("flash");
    if (f){ f.classList.remove("go"); void f.offsetWidth; f.classList.add("go"); }
  }
  if (fx === "static"){
    var s = qs("static-overlay");
    if (s){ s.classList.remove("go"); void s.offsetWidth; s.classList.add("go"); }
  }
  if (ms > 0){
    document.body.classList.add("page-exit-" + fx);
    setTimeout(function(){ location.href = url; }, ms);
  } else {
    location.href = url;
  }
}

/* ---------- amorçage commun d'une page ---------- */
/* AURORA.boot("map") : badge la phase, démarre horloge/hex/glitches */
function boot(stage){
  AURORA.debug = /[?&]debug=1/.test(location.search);
  if (AURORA.debug){ document.body.classList.add("debug"); }
  document.body.classList.add("page-enter");
  setStage(stage);

  var lbl = AURORA.STAGE_LABELS[stage] || "";
  var sl = qs("stage-label");
  if (sl){ sl.textContent = lbl; }

  /* horloge */
  var clock = qs("clock");
  if (clock){
    var tick = function(){
      var d = new Date();
      function p(n){ return (n < 10 ? "0" : "") + n; }
      clock.textContent = p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
    };
    tick(); setInterval(tick, 1000);
  }
  /* hex aléatoire */
  var hex = qs("syshex");
  if (hex){
    setInterval(function(){
      var s = "";
      for (var i = 0; i < 4; i++){ s += "0123456789ABCDEF"[Math.floor(Math.random() * 16)]; }
      hex.textContent = "SYS:0" + s.charAt(0) + "." + s.charAt(1) + s.charAt(2);
    }, 900);
  }
  /* micro-glitches aléatoires */
  setInterval(function(){
    if (Math.random() < 0.5) return;
    document.body.classList.add("glitch-burst");
    setTimeout(function(){ document.body.classList.remove("glitch-burst"); }, 150);
  }, 6400);
}

AURORA.djb2 = djb2;
AURORA.qs = qs;
AURORA.sfx = sfx;
AURORA.sfxPreload = sfxPreload;
AURORA.setStage = setStage;
AURORA.getStage = getStage;
AURORA.clearStage = clearStage;
AURORA.goPage = goPage;
AURORA.boot = boot;
window.AURORA = AURORA;

})(window);
