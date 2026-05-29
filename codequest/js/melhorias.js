/* ============================
   CodeQuest — Melhorias de Campo
   js/melhorias.js
   Boas-vindas · Tutorial · Relatório
   ============================ */

// ── Dados persistidos no localStorage ────────────────────────────
const STORAGE_KEY = 'codequest_registros';
const SENHA_PROFESSOR = '1234'; // professores podem trocar aqui

function carregarRegistros() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function salvarRegistro(registro) {
  const lista = carregarRegistros();
  const idx = lista.findIndex(r => r.nome === registro.nome);
  if (idx >= 0) lista[idx] = registro;
  else lista.push(registro);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}
function limparRegistros() {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Estado do aluno atual ─────────────────────────────────────────
let nomeAluno = '';
let inicioSessao = Date.now();

// ── Boas-vindas ───────────────────────────────────────────────────
function iniciarBoasVindas() {
  const overlay = document.getElementById('bv-overlay');
  if (!overlay) return;

  const input = document.getElementById('bv-input');
  const btn   = document.getElementById('bv-btn');

  function confirmar() {
    const nome = input.value.trim();
    if (!nome) { input.style.borderColor = 'var(--vermelho)'; return; }
    input.style.borderColor = '';
    nomeAluno = nome;
    inicioSessao = Date.now();

    // Exibe nome na navbar
    const exibir = document.getElementById('bv-nome-exibir');
    if (exibir) exibir.textContent = `Olá, ${nome}!`;

    overlay.style.display = 'none';

    // Abre tutorial na fase 1
    abrirTutorial();
  }

  btn.addEventListener('click', confirmar);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') confirmar(); });
}

// ── Tutorial ──────────────────────────────────────────────────────
function abrirTutorial() {
  const el = document.getElementById('tutorial-overlay');
  if (el) el.classList.add('open');
}
function fecharTutorial() {
  const el = document.getElementById('tutorial-overlay');
  if (el) el.classList.remove('open');
}

// ── Salvar progresso ──────────────────────────────────────────────
// Chamado pelo game.js quando uma fase é concluída
function registrarProgressoAluno(fasesConcluidasSet, pontosTotal) {
  if (!nomeAluno) return;
  const duracao = Math.round((Date.now() - inicioSessao) / 1000 / 60); // minutos
  salvarRegistro({
    nome: nomeAluno,
    fases: [...fasesConcluidasSet],
    pontos: pontosTotal,
    duracao,
    horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  });
}

// ── Relatório do professor ────────────────────────────────────────
let relDesbloqueado = false;

function abrirRelatorio() {
  const overlay = document.getElementById('rel-overlay');
  if (!overlay) return;

  if (!relDesbloqueado) {
    document.getElementById('rel-conteudo').style.display = 'none';
    document.getElementById('rel-senha-wrap').style.display = 'block';
    document.getElementById('rel-senha-erro').textContent = '';
    document.getElementById('rel-senha-input').value = '';
  } else {
    renderizarRelatorio();
  }
  overlay.classList.add('open');
}

function verificarSenha() {
  const val = document.getElementById('rel-senha-input').value;
  if (val === SENHA_PROFESSOR) {
    relDesbloqueado = true;
    document.getElementById('rel-senha-wrap').style.display = 'none';
    document.getElementById('rel-conteudo').style.display = 'block';
    renderizarRelatorio();
  } else {
    document.getElementById('rel-senha-erro').textContent = 'Senha incorreta.';
  }
}

function fecharRelatorio() {
  document.getElementById('rel-overlay')?.classList.remove('open');
}

function renderizarRelatorio() {
  const registros = carregarRegistros();
  const tbody = document.getElementById('rel-tbody');
  const resumo = document.getElementById('rel-resumo');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (registros.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--texto-muted);padding:1.5rem;">Nenhum aluno registrado ainda.</td></tr>';
    resumo.textContent = '0 alunos jogaram nesta sessão.';
    return;
  }

  const totalFases = 5;
  let totalConcluidos = 0;

  registros.forEach(r => {
    const concluidas = r.fases?.length || 0;
    if (concluidas === totalFases) totalConcluidos++;

    const faseBadges = Array.from({ length: totalFases }, (_, i) => {
      const ok = r.fases?.includes(i);
      return `<span class="badge-fase ${ok ? 'badge-ok' : 'badge-no'}" title="Fase ${i+1}">${i+1}</span>`;
    }).join('');

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:700">${r.nome}</td>
      <td>${faseBadges}</td>
      <td>${r.pontos || 0} pts</td>
      <td>${r.duracao ?? '—'} min</td>
      <td style="color:var(--texto-muted)">${r.horario || '—'}</td>
    `;
    tbody.appendChild(tr);
  });

  resumo.textContent = `${registros.length} aluno${registros.length > 1 ? 's' : ''} registrado${registros.length > 1 ? 's' : ''} · ${totalConcluidos} completou${totalConcluidos !== 1 ? 'ram' : ''} todas as fases.`;
}

function confirmarLimpar() {
  if (confirm('Limpar todos os registros desta sessão?')) {
    limparRegistros();
    renderizarRelatorio();
  }
}

// ── Init ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  iniciarBoasVindas();

  document.getElementById('btn-fechar-tutorial')?.addEventListener('click', fecharTutorial);
  document.getElementById('rel-btn')?.addEventListener('click', abrirRelatorio);
  document.getElementById('rel-fechar')?.addEventListener('click', fecharRelatorio);
  document.getElementById('rel-senha-ok')?.addEventListener('click', verificarSenha);
  document.getElementById('rel-senha-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') verificarSenha(); });
  document.getElementById('rel-limpar')?.addEventListener('click', confirmarLimpar);
});
