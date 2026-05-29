/* ============================
   CodeQuest — Lógica do Jogo
   js/game.js
   ============================ */

// ── Definição das fases ──────────────────────────────────────────
const FASES = [
  {
    id: 1,
    nome: "Fase 1 — Caminho direto",
    descricao: "Leve o robô até a estrela. Sem obstáculos — foco na sequência!",
    cols: 5, rows: 4,
    inicio: [0, 0],
    objetivo: [0, 4],
    paredes: [],
    dica: "Dica: use blocos ➡ para mover o robô para a direita."
  },
  {
    id: 2,
    nome: "Fase 2 — Primeira curva",
    descricao: "Agora precisa virar. Combine movimentos diferentes.",
    cols: 5, rows: 4,
    inicio: [0, 0],
    objetivo: [3, 4],
    paredes: [[1,4],[2,4]],
    dica: "Dica: vá para a direita até o fim, depois desça."
  },
  {
    id: 3,
    nome: "Fase 3 — Use a repetição!",
    descricao: "O caminho é longo. Use o bloco 🔁 Repetir para economizar comandos.",
    cols: 6, rows: 5,
    inicio: [0, 0],
    objetivo: [0, 5],
    paredes: [[2,0],[2,1],[2,2],[2,3],[2,4]],
    dica: "Dica: use 🔁 5× ➡ para ir direto ao fim."
  },
  {
    id: 4,
    nome: "Fase 4 — Labirinto",
    descricao: "Agora tem paredes por todos os lados. Planeje bem antes de executar!",
    cols: 6, rows: 5,
    inicio: [0, 0],
    objetivo: [4, 5],
    paredes: [[1,1],[1,2],[2,2],[2,3],[3,3],[0,3],[0,4]],
    dica: "Dica: tente ir para baixo primeiro, depois para a direita."
  },
  {
    id: 5,
    nome: "Fase 5 — Desafio final",
    descricao: "O caminho mais longo, com mais obstáculos. Você consegue?",
    cols: 7, rows: 6,
    inicio: [0, 0],
    objetivo: [5, 6],
    paredes: [[1,1],[1,2],[2,2],[2,3],[2,4],[3,4],[3,5],[4,5],[0,3],[0,4],[0,5]],
    dica: "Dica: combine sequências e repetições para encontrar o caminho."
  }
];

// ── Estado global ─────────────────────────────────────────────────
let faseAtual = 0;
let playerPos = [];
let sequencia = [];
let rodando   = false;
let pontos    = 0;
let fasesConcluidas = new Set();

// ── Utilitários ───────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

function ehParede(fase, r, c) {
  return fase.paredes.some(([pr, pc]) => pr === r && pc === c);
}
function ehObjetivo(fase, r, c) {
  return fase.objetivo[0] === r && fase.objetivo[1] === c;
}

// ── Renderização do grid ──────────────────────────────────────────
function construirGrid() {
  const fase = FASES[faseAtual];
  const grid = document.getElementById('game-grid');
  if (!grid) return;

  grid.style.gridTemplateColumns = `repeat(${fase.cols}, 54px)`;
  grid.style.gridTemplateRows    = `repeat(${fase.rows}, 54px)`;
  grid.innerHTML = '';

  for (let r = 0; r < fase.rows; r++) {
    for (let c = 0; c < fase.cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = `cell-${r}-${c}`;

      if (ehParede(fase, r, c))      cell.classList.add('wall');
      else if (ehObjetivo(fase, r, c)) { cell.classList.add('goal'); cell.textContent = '⭐'; }

      grid.appendChild(cell);
    }
  }
  renderizarPlayer();
  atualizarInfo();
}

function renderizarPlayer() {
  document.querySelectorAll('.cell.player').forEach(c => {
    c.classList.remove('player');
    const [r, c2] = c.id.split('-').slice(1).map(Number);
    const fase = FASES[faseAtual];
    c.textContent = ehObjetivo(fase, r, c2) ? '⭐' : '';
  });
  document.querySelectorAll('.cell.visited').forEach(c => c.classList.remove('visited'));

  const cell = document.getElementById(`cell-${playerPos[0]}-${playerPos[1]}`);
  if (cell) { cell.classList.add('player'); cell.textContent = '🤖'; }
}

// ── Info e UI ─────────────────────────────────────────────────────
function atualizarInfo() {
  const fase = FASES[faseAtual];
  const el = document.getElementById('fase-nome');
  if (el) el.textContent = fase.nome;

  const dica = document.getElementById('fase-dica');
  if (dica) dica.textContent = fase.descricao;

  const pts = document.getElementById('pontos');
  if (pts) pts.textContent = `⭐ ${pontos} pts`;

  // Atualiza botões de fase
  document.querySelectorAll('.fase-btn').forEach((btn, i) => {
    btn.classList.remove('ativa', 'concluida');
    if (i === faseAtual)            btn.classList.add('ativa');
    if (fasesConcluidas.has(i))     btn.classList.add('concluida');
  });
}

function setMsg(texto, tipo = '') {
  const el = document.getElementById('msg');
  if (!el) return;
  el.textContent = texto;
  el.className = tipo;
}

// ── Sequência ─────────────────────────────────────────────────────
const cores = {
  up:    { bg: '#E6F1FB', cor: '#0C447C', borda: '#378ADD' },
  down:  { bg: '#C0DD97', cor: '#27500A', borda: '#639922' },
  left:  { bg: '#F5C4B3', cor: '#712B13', borda: '#D85A30' },
  right: { bg: '#EEEDFE', cor: '#3C3489', borda: '#7F77DD' },
  repeat:{ bg: '#FAEEDA', cor: '#633806', borda: '#EF9F27' }
};
const rotulos = {
  up:'⬆ Mover para cima', down:'⬇ Mover para baixo',
  left:'⬅ Mover para esquerda', right:'➡ Mover para direita'
};

function adicionarBloco(label, tipo, repetir = 1) {
  sequencia.push({ label, tipo, repetir });
  renderizarSeq();
}

function removerBloco(i) {
  sequencia.splice(i, 1);
  renderizarSeq();
}

function renderizarSeq() {
  const lista = document.getElementById('seq-list');
  if (!lista) return;
  lista.innerHTML = '';

  if (sequencia.length === 0) {
    lista.innerHTML = '<div class="seq-empty">Adicione blocos para começar</div>';
    return;
  }

  sequencia.forEach((item, i) => {
    const tipo = item.repetir > 1 ? 'repeat' : item.tipo;
    const c = cores[tipo];
    const el = document.createElement('div');
    el.className = 'seq-item';
    el.style.background  = c.bg;
    el.style.color       = c.cor;
    el.style.borderColor = c.borda;
    el.innerHTML = `<span>${item.label}</span>
      <button onclick="removerBloco(${i})" aria-label="Remover bloco">✕</button>`;
    lista.appendChild(el);
  });
}

// ── Modal Repetir ─────────────────────────────────────────────────
function abrirRepeat() {
  document.getElementById('modal-overlay').classList.add('open');
}
function fecharRepeat() {
  document.getElementById('modal-overlay').classList.remove('open');
}
function confirmarRepeat() {
  const n    = Math.max(1, Math.min(10, +document.getElementById('repeat-count').value || 2));
  const tipo = document.getElementById('repeat-block').value;
  const lbl  = `🔁 ${n}× ${rotulos[tipo]}`;
  adicionarBloco(lbl, tipo, n);
  fecharRepeat();
}

// ── Execução ──────────────────────────────────────────────────────
async function executar() {
  if (rodando || sequencia.length === 0) return;
  rodando = true;

  const fase = FASES[faseAtual];
  playerPos = [...fase.inicio];
  renderizarPlayer();
  setMsg('Executando...', 'aviso');
  await sleep(300);

  // Expande loops
  const movimentos = [];
  sequencia.forEach(item => {
    for (let k = 0; k < item.repetir; k++) movimentos.push(item.tipo);
  });

  let chegou = false;

  for (const mov of movimentos) {
    let [r, c] = playerPos;
    if      (mov === 'up')    r--;
    else if (mov === 'down')  r++;
    else if (mov === 'left')  c--;
    else if (mov === 'right') c++;

    // Fora do mapa ou parede
    if (r < 0 || r >= fase.rows || c < 0 || c >= fase.cols || ehParede(fase, r, c)) {
      setMsg('💥 O robô bateu! Ajuste os comandos e tente novamente.', 'erro');
      rodando = false;
      return;
    }

    // Marca visitado
    const prev = document.getElementById(`cell-${playerPos[0]}-${playerPos[1]}`);
    if (prev && !ehObjetivo(fase, playerPos[0], playerPos[1])) prev.classList.add('visited');

    playerPos = [r, c];
    renderizarPlayer();
    await sleep(370);

    if (ehObjetivo(fase, r, c)) { chegou = true; break; }
  }

  if (chegou) {
    pontos += 100 + Math.max(0, (10 - sequencia.length) * 10);
    fasesConcluidas.add(faseAtual);
    setMsg('🎉 Parabéns! Você chegou na estrela!', 'ok');
    atualizarInfo();
    // Salva progresso para o relatório do professor
    if (typeof registrarProgressoAluno === 'function') {
      registrarProgressoAluno(fasesConcluidas, pontos);
    }

    // Avança de fase automaticamente após 2s
    if (faseAtual < FASES.length - 1) {
      setTimeout(() => {
        mudarFase(faseAtual + 1);
      }, 2000);
    } else {
      setTimeout(() => setMsg('🏆 Você completou todas as fases! Incrível!', 'ok'), 2200);
    }
  } else if (!chegou) {
    setMsg('🤔 Não chegou na estrela. Revise sua sequência!', 'aviso');
  }

  rodando = false;
}

function resetar() {
  if (rodando) return;
  const fase = FASES[faseAtual];
  playerPos = [...fase.inicio];
  sequencia = [];
  renderizarSeq();
  construirGrid();
  setMsg('');
}

function mudarFase(i) {
  faseAtual = i;
  sequencia = [];
  const fase = FASES[faseAtual];
  playerPos = [...fase.inicio];
  renderizarSeq();
  construirGrid();
  setMsg('');
  document.getElementById('fase-dica').textContent = fase.descricao;
}

// ── Init ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const fase = FASES[faseAtual];
  playerPos = [...fase.inicio];
  construirGrid();
  renderizarSeq();

  // Bind botões
  document.getElementById('run-btn')?.addEventListener('click', executar);
  document.getElementById('reset-btn')?.addEventListener('click', resetar);

  // Botões de bloco
  document.querySelectorAll('.block-btn[data-tipo]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tipo = btn.dataset.tipo;
      adicionarBloco(rotulos[tipo], tipo);
    });
  });

  document.getElementById('btn-repeat')?.addEventListener('click', abrirRepeat);
  document.getElementById('btn-confirmar-repeat')?.addEventListener('click', confirmarRepeat);
  document.getElementById('btn-cancelar-repeat')?.addEventListener('click', fecharRepeat);

  // Botões de fase
  document.querySelectorAll('.fase-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => mudarFase(i));
  });
});
