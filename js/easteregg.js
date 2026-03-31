/* ═══════════════════════════════════════════════════════
   PORTFOLIO 4.2 — EASTEREGG.JS
   Quiz + Flash de page + Hall of Détectives (localStorage)
   ═══════════════════════════════════════════════════════ */

const questions = [
  {
    question: 'Quel est le nom du créateur de Linux ?',
    answers:  ['linus torvalds', 'torvalds', 'linus'],
    hint:     'Indice : Son prénom commence par L'
  },
  {
    question: 'Quel est le port HTTP par défaut ?',
    answers:  ['80'],
    hint:     "Indice : C'est un nombre à 2 chiffres"
  },
  {
    question: 'En quelle année le World Wide Web a-t-il été inventé ?',
    answers:  ['1989', '89'],
    hint:     'Indice : La même année que la chute du mur de Berlin'
  },
  {
    question: 'Quel framework JavaScript utilise un DOM virtuel ?',
    answers:  ['react', 'reactjs', 'react.js'],
    hint:     'Indice : Créé par Facebook'
  }
];

const HARDCODED_COUNT = 0;

let currentLevel = 0;
let attempts     = 0;
const startTime  = Date.now();

/* ── Éléments DOM ─────────────────────────────────────── */
const bootSeq        = document.getElementById('bootSeq');
const challengeZone  = document.getElementById('challengeZone');
const rewardZone     = document.getElementById('rewardZone');
const answerInput    = document.getElementById('answerInput');
const submitBtn      = document.getElementById('submitAnswer');
const feedback       = document.getElementById('feedback');
const questionTitle  = document.getElementById('questionTitle');
const questionText   = document.getElementById('questionText');
const levelIndicator = document.getElementById('currentLevel');

const lbDynamic       = document.getElementById('lbDynamic');
const detectiveForm   = document.getElementById('detectiveForm');
const detectiveAlias  = document.getElementById('detectiveAlias');
const detectiveSubmit = document.getElementById('detectiveSubmit');
const detectiveBadge  = document.getElementById('detectiveBadge');
const badgeName       = document.getElementById('badgeName');

/* ── Boot sequence → challenge ────────────────────────── */
setTimeout(() => {
  if (bootSeq)      bootSeq.style.display      = 'none';
  if (challengeZone) challengeZone.style.display = 'block';
  loadQuestion();
}, 3200);

/* ── Quiz ─────────────────────────────────────────────── */
function loadQuestion() {
  if (currentLevel >= questions.length) { showReward(); return; }
  const q = questions[currentLevel];
  if (questionTitle)  questionTitle.textContent  = `Question ${currentLevel + 1} :`;
  if (questionText)   questionText.textContent   = q.question;
  if (levelIndicator) levelIndicator.textContent = currentLevel + 1;
  if (answerInput)  { answerInput.value = ''; answerInput.focus(); }
  if (feedback)       feedback.textContent = '';
  attempts = 0;
}

function checkAnswer() {
  if (!answerInput) return;
  const userAnswer     = answerInput.value.trim().toLowerCase();
  const correctAnswers = questions[currentLevel].answers;

  if (correctAnswers.includes(userAnswer)) {
    feedback.style.color   = 'var(--green)';
    feedback.textContent   = '✅ CORRECT ! Niveau suivant...';
    setTimeout(() => { currentLevel++; loadQuestion(); }, 1300);
  } else {
    attempts++;
    feedback.style.color = 'var(--red)';
    feedback.textContent = attempts >= 2
      ? `❌ Incorrect. ${questions[currentLevel].hint}`
      : '❌ Incorrect. Réessayez !';
  }
}

if (submitBtn)   submitBtn.addEventListener('click', checkAnswer);
if (answerInput) answerInput.addEventListener('keypress', e => { if (e.key === 'Enter') checkAnswer(); });

/* ── Récompense ───────────────────────────────────────── */
function showReward() {
  if (challengeZone) challengeZone.style.display = 'none';

  // 1. Flash de page
  flashPage();

  // 2. Afficher la zone récompense après le flash
  setTimeout(() => {
    if (rewardZone) rewardZone.style.display = 'block';
    renderLeaderboard();
    checkAlreadyRegistered();
  }, 600);

  console.log('%c🎉 BRAVO ! TU AS GAGNÉ ! 🎉', 'font-size:24px;color:#00ff41;font-weight:bold;background:#000;padding:8px');
}

/* ── Flash de page ────────────────────────────────────── */
function flashPage() {
  const flash = document.createElement('div');
  flash.className = 'page-flash';
  document.body.appendChild(flash);
  flash.addEventListener('animationend', () => flash.remove());
}

/* ── Leaderboard (localStorage) ───────────────────────── */
const LS_KEY = 'portfolio_detectives';

function getDetectives() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
}

function saveDetective(alias) {
  const list = getDetectives();
  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const entry = {
    alias,
    date: new Date().toLocaleDateString('fr-FR'),
    elapsed
  };
  list.push(entry);
  localStorage.setItem(LS_KEY, JSON.stringify(list));
  return list.length; // rank
}

function renderLeaderboard() {
  if (!lbDynamic) return;
  const list = getDetectives();
  lbDynamic.innerHTML = '';

  list.forEach((entry, i) => {
    const rank = i + 1;
    const div  = document.createElement('div');
    div.className = 'lb-entry';
    div.innerHTML = `
      <span class="lb-rank">#${rank}</span>
      <span class="lb-name">${escHtml(entry.alias)}</span>
      <span class="lb-date">${entry.date}</span>
    `;
    lbDynamic.appendChild(div);
  });
}

function checkAlreadyRegistered() {
  const alias = localStorage.getItem(LS_KEY + '_me');
  if (alias) {
    if (detectiveForm)  detectiveForm.style.display  = 'none';
    if (detectiveBadge) { detectiveBadge.style.display = 'block'; }
    if (badgeName)      badgeName.textContent = alias;
  }
}

function escHtml(str) {
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ── Inscription detective ────────────────────────────── */
if (detectiveSubmit) {
  detectiveSubmit.addEventListener('click', registerDetective);
}
if (detectiveAlias) {
  detectiveAlias.addEventListener('keypress', e => { if (e.key === 'Enter') registerDetective(); });
}

function registerDetective() {
  if (!detectiveAlias) return;
  const alias = detectiveAlias.value.trim();
  if (!alias) {
    detectiveAlias.style.borderColor = 'var(--red)';
    setTimeout(() => detectiveAlias.style.borderColor = '', 1000);
    return;
  }

  const rank = saveDetective(alias);
  localStorage.setItem(LS_KEY + '_me', alias);
  renderLeaderboard();

  if (detectiveForm)  detectiveForm.style.display  = 'none';
  if (detectiveBadge) detectiveBadge.style.display = 'block';
  if (badgeName)      badgeName.textContent = alias;

  // Mini flash de confirmation
  flashPage();
}
