const readlineSync = require("readline-sync");

readlineSync.setDefaultOptions({ encoding: "utf8" });

const cores = {
  ciano: "\x1b[36m",
  verde: "\x1b[32m",
  amarelo: "\x1b[33m",
  vermelho: "\x1b[31m",
  reset: "\x1b[0m",
};

function colorir(texto, cor) {
  return cores[cor] + texto + cores.reset;
}

console.log(colorir("=================================", "ciano"));
console.log(colorir("       JOGO DA VELHA", "ciano"));
console.log(colorir("          MELHOR DE 5", "amarelo"));
console.log(colorir("=================================", "ciano"));

console.log("Escolha o modo de jogo:");
console.log("1 - Jogador contra jogador");
console.log("2 - Jogador contra computador");

let modoJogo = readlineSync.question("Opcao: ");

while (modoJogo !== "1" && modoJogo !== "2") {
  console.log(colorir("Opcao invalida. Digite 1 ou 2.", "vermelho"));
  modoJogo = readlineSync.question("Opcao: ");
}

let nomeJogador1 = readlineSync.question("Nome do jogador 1 (X): ").trim();

if (nomeJogador1 === "") {
  nomeJogador1 = "Jogador 1";
}

let nomeJogador2;

if (modoJogo === "1") {
  nomeJogador2 = readlineSync.question("Nome do jogador 2 (O): ").trim();

  if (nomeJogador2 === "") {
    nomeJogador2 = "Jogador 2";
  }
} else {
  nomeJogador2 = "Computador";
}

const jogadores = [
  {
    nome: nomeJogador1,
    simbolo: "X",
    vitorias: 0,
    tipo: "jogador",
  },
  {
    nome: nomeJogador2,
    simbolo: "O",
    vitorias: 0,
    tipo: modoJogo === "2" ? "maquina" : "jogador",
  },
];

function mostrarTabuleiro(tabuleiro) {
  console.log("");

  for (let i = 0; i < 3; i++) {
    let linhaVisual = "";

    for (let j = 0; j < 3; j++) {
      let valor = tabuleiro[i][j];

      if (valor === "X") {
        valor = colorir(valor, "verde");
      } else if (valor === "O") {
        valor = colorir(valor, "amarelo");
      } else {
        valor = colorir(valor, "ciano");
      }

      linhaVisual += " " + valor + " ";

      if (j < 2) {
        linhaVisual += "|";
      }
    }

    console.log(linhaVisual);

    if (i < 2) {
      console.log("---+---+---");
    }
  }

  console.log("");
}

function verificarVencedor(tabuleiro, simbolo) {
  for (let i = 0; i < 3; i++) {
    if (
      tabuleiro[i][0] === simbolo &&
      tabuleiro[i][1] === simbolo &&
      tabuleiro[i][2] === simbolo
    ) {
      return true;
    }

    if (
      tabuleiro[0][i] === simbolo &&
      tabuleiro[1][i] === simbolo &&
      tabuleiro[2][i] === simbolo
    ) {
      return true;
    }
  }

  if (
    tabuleiro[0][0] === simbolo &&
    tabuleiro[1][1] === simbolo &&
    tabuleiro[2][2] === simbolo
  ) {
    return true;
  }

  if (
    tabuleiro[0][2] === simbolo &&
    tabuleiro[1][1] === simbolo &&
    tabuleiro[2][0] === simbolo
  ) {
    return true;
  }

  return false;
}

function escolherJogadaComputador(tabuleiro) {
  const posicoesLivres = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (tabuleiro[i][j] !== "X" && tabuleiro[i][j] !== "O") {
        posicoesLivres.push(Number(tabuleiro[i][j]));
      }
    }
  }

  const indiceAleatorio = Math.floor(Math.random() * posicoesLivres.length);
  return posicoesLivres[indiceAleatorio];
}

function jogarRodada() {
  const tabuleiro = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
  ];

  let jogadorAtual = 0;
  let jogadas = 0;
  let simboloVencedor = "";

  while (jogadas < 9 && simboloVencedor === "") {
    mostrarTabuleiro(tabuleiro);

    const jogador = jogadores[jogadorAtual];

    let posicao;

    if (jogador.tipo === "maquina") {
      console.log("Vez da maquina (" + jogador.simbolo + ")");
      posicao = escolherJogadaComputador(tabuleiro);
      console.log("A maquina escolheu a posicao " + posicao + ".");
    } else {
      console.log(
        "Vez do jogador: " + jogador.nome + " (" + jogador.simbolo + ")",
      );
      posicao = Number(readlineSync.question("Escolha uma posicao de 1 a 9: "));
    }

    if (isNaN(posicao) || posicao < 1 || posicao > 9 || posicao % 1 !== 0) {
      console.log(
        colorir(
          "Entrada invalida. Digite um numero inteiro de 1 a 9.",
          "vermelho",
        ),
      );
    } else {
      const linha = Math.floor((posicao - 1) / 3);
      const coluna = (posicao - 1) % 3;

      if (
        tabuleiro[linha][coluna] === "X" ||
        tabuleiro[linha][coluna] === "O"
      ) {
        console.log(
          colorir("Essa posicao ja esta ocupada. Escolha outra.", "vermelho"),
        );
      } else {
        tabuleiro[linha][coluna] = jogador.simbolo;
        jogadas++;

        if (verificarVencedor(tabuleiro, jogador.simbolo)) {
          simboloVencedor = jogador.simbolo;
        } else {
          if (jogadorAtual === 0) {
            jogadorAtual = 1;
          } else {
            jogadorAtual = 0;
          }
        }
      }
    }
  }

  mostrarTabuleiro(tabuleiro);

  if (simboloVencedor === jogadores[0].simbolo) {
    console.log(colorir(jogadores[0].nome + " venceu esta rodada!", "verde"));
    return 0;
  } else if (simboloVencedor === jogadores[1].simbolo) {
    console.log(colorir(jogadores[1].nome + " venceu esta rodada!", "amarelo"));
    return 1;
  } else {
    console.log(colorir("A rodada terminou empatada!", "ciano"));
    return -1;
  }
}

function mostrarPlacar() {
  console.log("\n========== PLACAR ==========");
  console.log(
    jogadores[0].nome + " (X): " + jogadores[0].vitorias + " vitoria(s)",
  );
  console.log(
    jogadores[1].nome + " (O): " + jogadores[1].vitorias + " vitoria(s)",
  );
  console.log("============================\n");
}

let rodada = 1;

while (rodada <= 5 && jogadores[0].vitorias < 3 && jogadores[1].vitorias < 3) {
  console.log(
    colorir("\n========== RODADA " + rodada + " ==========", "ciano"),
  );

  const resultado = jogarRodada();

  if (resultado === 0) {
    jogadores[0].vitorias++;
  } else if (resultado === 1) {
    jogadores[1].vitorias++;
  }

  mostrarPlacar();
  rodada++;
}

console.log(colorir("========== RESULTADO FINAL ==========", "ciano"));

if (jogadores[0].vitorias > jogadores[1].vitorias) {
  console.log(colorir("Campeao: " + jogadores[0].nome + "!", "verde"));
} else if (jogadores[1].vitorias > jogadores[0].vitorias) {
  console.log(colorir("Campeao: " + jogadores[1].nome + "!", "amarelo"));
} else {
  console.log(colorir("A partida terminou empatada!", "ciano"));
}

mostrarPlacar();
console.log("Obrigado por jogar!");
