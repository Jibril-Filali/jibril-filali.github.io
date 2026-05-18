'use strict';

/* ── DONNÉES ── */

const LEADERBOARD_KEY = 'eg_leaderboard';

const QUESTIONS = [
  {
    title: 'Question 1 :',
    text:  'Quelle commande faut-il taper dans le terminal du portfolio pour voir les commandes disponibles ?',
    answer: 'help'
  },
  {
    title: 'Question 2 :',
    text:  'Combien de projets sont présentés dans la page Projets ?',
    answer: '3'
  },
  {
    title: 'Question 3 :',
    text:  'Quel framework JavaScript est utilisé pour les animations de ce site ?',
    answer: 'gsap'
  },
  {
    title: 'Question 4 :',
    text:  'Quel est le nom complet du développeur de ce portfolio ?',
    answer: 'jibril filali'
  }
];

/* ── ÉTAT ── */

let currentLevel = 0;

/* ── UTILITAIRES ── */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function injectShakeCSS() {
  if (document.getElementById('eg-shake-style')) return;
  const style = document.createElement('style');
  style.id = 'eg-shake-style';
  style.textContent = `
    @keyframes eg-input-shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
    .input-shake { animation: eg-input-shake 0.35s ease; }
  `;
  document.head.appendChild(style);
}

/* ── DÉTECTION FIN DE LOADER ── */

function waitForLoaderHidden(callback) {
  const loader = document.getElementById('loader');

  if (!loader) {
    callback();
    return;
  }

  if (loader.classList.contains('hidden')) {
    callback();
    return;
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class' &&
        loader.classList.contains('hidden')
      ) {
        observer.disconnect();
        callback();
        return;
      }
    }
  });

  observer.observe(loader, {
    attributes: true,
    attributeFilter: ['class']
  });
}

/* ── BOOT SEQUENCE ── */

function runBootSequence(callback) {
  const bootSeq = document.getElementById('bootSeq');
  if (!bootSeq) { callback(); return; }

  const lines = bootSeq.querySelectorAll('.eg-boot-line');

  lines.forEach(line => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-12px)';
    line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });

  let i = 0;

  function revealNext() {
    if (i >= lines.length) {
      setTimeout(callback, 600);
      return;
    }
    const line = lines[i++];
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
      setTimeout(revealNext, 420);
    }, 80);
  }

  revealNext();
}

/* ── CHALLENGE ── */

function showQuestion(level) {
  const challengeZone  = document.getElementById('challengeZone');
  const currentLevelEl = document.getElementById('currentLevel');
  const questionTitle  = document.getElementById('questionTitle');
  const questionText   = document.getElementById('questionText');
  const answerInput    = document.getElementById('answerInput');
  const feedback       = document.getElementById('feedback');
  const submitBtn      = document.getElementById('submitAnswer');

  const q = QUESTIONS[level];

  currentLevelEl.textContent = level + 1;
  questionTitle.textContent  = q.title;
  questionText.textContent   = q.text;
  answerInput.value          = '';
  answerInput.disabled       = false;
  feedback.textContent       = '';
  feedback.style.color       = '';

  if (submitBtn) submitBtn.disabled = false;

  challengeZone.style.display = '';
  setTimeout(() => answerInput.focus(), 100);
}

function validateAnswer() {
  const answerInput = document.getElementById('answerInput');
  const feedback    = document.getElementById('feedback');
  const submitBtn   = document.getElementById('submitAnswer');

  const given    = answerInput.value.trim().toLowerCase();
  const expected = QUESTIONS[currentLevel].answer.toLowerCase();

  if (given === expected) {
    feedback.textContent = '>> Correct ! Accès au niveau suivant...';
    feedback.style.color = 'var(--green)';

    if (submitBtn) submitBtn.disabled = true;
    answerInput.disabled = true;

    setTimeout(() => {
      currentLevel++;
      if (currentLevel >= QUESTIONS.length) {
        showRewardZone();
      } else {
        showQuestion(currentLevel);
      }
    }, 800);

  } else {
    feedback.textContent = '>> Mauvaise réponse. Réessayez...';
    feedback.style.color = 'var(--red, #ff1744)';

    answerInput.classList.add('input-shake');
    answerInput.addEventListener('animationend', () => {
      answerInput.classList.remove('input-shake');
    }, { once: true });

    answerInput.value = '';
    answerInput.focus();
  }
}

/* ── REWARD ── */

function showRewardZone() {
  const challengeZone = document.getElementById('challengeZone');
  const rewardZone    = document.getElementById('rewardZone');

  challengeZone.style.opacity    = '0';
  challengeZone.style.transition = 'opacity 0.4s ease';

  setTimeout(() => {
    challengeZone.style.display = 'none';

    rewardZone.style.opacity    = '0';
    rewardZone.style.transition = 'opacity 0.5s ease';
    rewardZone.style.display    = '';

    void rewardZone.offsetHeight; // force reflow
    rewardZone.style.opacity = '1';

    renderLeaderboard();
    handleDetectiveForm();
  }, 400);
}

/* ── LEADERBOARD ── */

function renderLeaderboard() {
  const lbDynamic = document.getElementById('lbDynamic');
  if (!lbDynamic) return;

  let entries = [];
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (raw) entries = JSON.parse(raw);
    if (!Array.isArray(entries)) entries = [];
  } catch (e) {
    entries = [];
  }

  if (entries.length === 0) {
    lbDynamic.innerHTML = '<p style="color:var(--text-muted);font-size:.8rem;margin:.5rem 0">Aucun détective enregistré pour l\'instant. Sois le premier !</p>';
    return;
  }

  const rows = entries.map((entry, index) => {
    const safeAlias = escapeHtml(entry.alias || '???');
    const safeDate  = escapeHtml(entry.date  || '');
    return `<div class="lb-entry">
      <span class="lb-rank">#${index + 1}</span>
      <span class="lb-name">${safeAlias}</span>
      <span class="lb-date">${safeDate}</span>
    </div>`;
  }).join('');

  lbDynamic.innerHTML = `<div style="margin:.75rem 0">${rows}</div>`;
}

/* ── FORMULAIRE DETECTIVE ── */

function handleDetectiveForm() {
  const detectiveForm   = document.getElementById('detectiveForm');
  const detectiveAlias  = document.getElementById('detectiveAlias');
  const detectiveSubmit = document.getElementById('detectiveSubmit');
  const detectiveBadge  = document.getElementById('detectiveBadge');
  const badgeName       = document.getElementById('badgeName');

  if (!detectiveSubmit || !detectiveAlias) return;

  const alreadyJoined = sessionStorage.getItem('eg_joined');
  if (alreadyJoined) {
    if (detectiveForm)  detectiveForm.style.display  = 'none';
    if (badgeName)      badgeName.textContent         = alreadyJoined;
    if (detectiveBadge) detectiveBadge.style.display  = 'block';
    return;
  }

  function submit() {
    const alias = detectiveAlias.value.trim();
    if (!alias) { detectiveAlias.focus(); return; }

    let entries = [];
    try {
      const raw = localStorage.getItem(LEADERBOARD_KEY);
      if (raw) entries = JSON.parse(raw);
      if (!Array.isArray(entries)) entries = [];
    } catch (e) {
      entries = [];
    }

    const dateStr = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const isDuplicate = entries.some(e => e.alias.toLowerCase() === alias.toLowerCase());
    if (!isDuplicate) {
      entries.push({ alias, date: dateStr });
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
    }

    sessionStorage.setItem('eg_joined', alias);

    if (detectiveForm)  detectiveForm.style.display  = 'none';
    if (badgeName)      badgeName.textContent         = alias;
    if (detectiveBadge) detectiveBadge.style.display  = 'block';

    renderLeaderboard();
  }

  detectiveSubmit.addEventListener('click', submit);
  detectiveAlias.addEventListener('keydown', e => {
    if (e.key === 'Enter') submit();
  });
}

/* ── INIT ── */

function initEasterEgg() {
  const bootSeq      = document.getElementById('bootSeq');
  const challengeZone = document.getElementById('challengeZone');
  if (!bootSeq && !challengeZone) return;

  const submitBtn   = document.getElementById('submitAnswer');
  const answerInput = document.getElementById('answerInput');

  if (submitBtn) {
    submitBtn.addEventListener('click', validateAnswer);
  }
  if (answerInput) {
    answerInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') validateAnswer();
    });
  }

  waitForLoaderHidden(() => {
    setTimeout(() => {
      runBootSequence(() => {
        showQuestion(currentLevel);
      });
    }, 200);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  injectShakeCSS();
  initEasterEgg();
});
