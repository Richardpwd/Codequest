# 🤖 CodeQuest — Jogo Educativo de Lógica de Programação

Plataforma web gamificada para ensinar pensamento computacional para alunos do Ensino Fundamental II (11–14 anos).

---

## 📁 Estrutura do projeto

```
codequest/
├── index.html            ← Página inicial
├── css/
│   ├── style.css         ← Estilos principais
│   └── melhorias.css     ← Boas-vindas, tutorial, relatório
├── js/
│   ├── main.js           ← Scripts da home
│   ├── game.js           ← Lógica do jogo (fases, execução)
│   └── melhorias.js      ← Boas-vindas, tutorial, relatório
└── pages/
    ├── jogo.html         ← Página do jogo
    └── sobre.html        ← Sobre o projeto
```

---

## 🚀 Como rodar no VS Code

### Opção 1 — Live Server (recomendado)

1. Abra o VS Code
2. Instale a extensão **Live Server** (ritwickdey.LiveServer)
3. Clique com o botão direito em `index.html`
4. Selecione **"Open with Live Server"**
5. O navegador abrirá em `http://127.0.0.1:5500`

### Opção 2 — Abrir direto no navegador

1. Abra a pasta `codequest/` no explorador
2. Dê dois cliques em `index.html`

> ⚠️ Para que o relatório do professor salve dados entre sessões, use a Opção 1.

---

## 🎮 Como funciona

### Para o aluno
1. Ao abrir o jogo, uma tela de **boas-vindas** pede o nome
2. Um **tutorial** explica as regras antes da Fase 1
3. O aluno monta blocos de comando para guiar o robô 🤖 até a estrela ⭐
4. 5 fases com dificuldade progressiva · sistema de pontos

| Bloco              | Ação                         |
|--------------------|------------------------------|
| ⬆ Mover para cima  | Move o robô uma casa acima   |
| ⬇ Mover para baixo | Move o robô uma casa abaixo  |
| ⬅ Mover para esquerda | Move para a esquerda      |
| ➡ Mover para direita  | Move para a direita       |
| 🔁 Repetir N vezes | Repete um bloco N vezes (loop)|

### Para o professor
- Um botão **👩‍🏫 Professor** aparece no canto inferior direito do jogo
- Senha padrão: **1234** (pode ser trocada em `js/melhorias.js`, linha 8)
- O relatório mostra: nome do aluno, fases concluídas, pontos, tempo e horário
- Os dados ficam salvos no navegador (localStorage) durante a sessão
- Botão para limpar registros entre turmas

---

## 🗺️ As 5 fases

| Fase | Nome               | Conceito principal       |
|------|--------------------|--------------------------|
| 1    | Caminho direto     | Sequência básica         |
| 2    | Primeira curva     | Combinação de direções   |
| 3    | Use a repetição!   | Loops                    |
| 4    | Labirinto          | Planejamento + depuração |
| 5    | Desafio final      | Tudo junto               |

**Pontuação:** 100 pts por fase + bônus por usar menos blocos.

---

## ✏️ Como personalizar

### Trocar a senha do professor
Em `js/melhorias.js`, linha 8:
```js
const SENHA_PROFESSOR = '1234'; // troque aqui
```

### Adicionar uma nova fase
Em `js/game.js`, adicione ao array `FASES`:
```js
{
  id: 6,
  nome: "Fase 6 — Minha fase",
  descricao: "Descrição para o aluno.",
  cols: 6, rows: 5,
  inicio: [0, 0],
  objetivo: [4, 5],
  paredes: [[1,1],[2,2]],
  dica: "Dica para o aluno."
}
```
E em `pages/jogo.html`, adicione o botão:
```html
<button class="fase-btn" title="Fase 6">6</button>
```

### Alterar cores
Em `css/style.css`:
```css
:root {
  --verde:   #1D9E75;
  --amarelo: #EF9F27;
}
```

---

## 🏫 Roteiro de aula sugerido (50 min)

| Tempo | Atividade |
|-------|-----------|
| 0–5 min | Professor explica o objetivo usando o projetor |
| 5–15 min | Alunos jogam a Fase 1 e 2 individualmente |
| 15–25 min | Discussão: por que o robô travou? Como resolver? |
| 25–40 min | Fases 3 e 4 — introdução a loops e depuração |
| 40–50 min | Fase 5 (desafio) + professor consulta relatório |

---

## 📚 Alinhamento BNCC

Competência 5 — Cultura Digital:
- Pensamento computacional e algoritmos
- Resolução de problemas com tecnologia
- Protagonismo e criatividade digital

---

## 🛠️ Tecnologias

- HTML5 · CSS3 · JavaScript puro (sem frameworks)
- Google Fonts: Space Mono + Nunito
- localStorage para persistência dos registros
- Compatível com Chrome, Firefox, Edge, Safari
