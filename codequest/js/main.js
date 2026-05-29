/* ============================
   CodeQuest — main.js
   Animações e efeitos da home
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  // Animação simples do robô no hero
  const cells = document.querySelectorAll('.path-cell');
  let idx = 0;
  if (cells.length > 0) {
    setInterval(() => {
      cells.forEach(c => c.classList.remove('current'));
      cells[idx]?.classList.add('current');
      idx = (idx + 1) % cells.length;
    }, 700);
  }
});
