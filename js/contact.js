/* ═══════════════════════════════════════════════════════
   PORTFOLIO 4.2 — CONTACT.JS (Formspree handler)
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const form    = document.getElementById('contactForm');
  const msgOk   = document.getElementById('formSuccess');
  const msgErr  = document.getElementById('formError');
  const submitBtn = form ? form.querySelector('.submit-btn') : null;

  if (!form) return;

  function validate(data) {
    const nom     = (data.get('Nom') || '').trim();
    const email   = (data.get('Email') || '').trim();
    const sujet   = (data.get('Sujet') || '').trim();
    const message = (data.get('Message') || '').trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nom.length < 2)       return 'Le nom doit contenir au moins 2 caractères.';
    if (!emailRe.test(email)) return 'Adresse email invalide.';
    if (sujet.length < 3)     return 'Le sujet doit contenir au moins 3 caractères.';
    if (message.length < 10)  return 'Le message doit contenir au moins 10 caractères.';
    return null;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset messages
    if (msgOk) { msgOk.classList.remove('success'); msgOk.style.display = 'none'; }
    if (msgErr) { msgErr.classList.remove('error');  msgErr.style.display = 'none'; }

    const validationError = validate(new FormData(form));
    if (validationError) {
      if (msgErr) {
        msgErr.textContent = '⚠ ' + validationError;
        msgErr.classList.add('error');
        msgErr.style.display = 'block';
        msgErr.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '[ Envoi en cours... ]';
    }

    try {
      const data     = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        if (msgOk) {
          msgOk.textContent = '✅ Message envoyé ! Je vous réponds sous 24h.';
          msgOk.classList.add('success');
          msgOk.style.display = 'block';
          msgOk.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        throw new Error('Server error');
      }
    } catch {
      if (msgErr) {
        msgErr.textContent = '❌ Une erreur est survenue. Réessayez ou contactez-moi directement.';
        msgErr.classList.add('error');
        msgErr.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '[ Envoyer le message ]';
      }
    }
  });
});
