const execSync = require("child_process").execSync;
if (process.platform === "win32") {
  execSync("chcp 65001 > nul 2>&1");
}

const prompt = require("prompt-sync")();

// Cores utilizadas no terminal.
const cores = {
  ciano: "\x1b[36m",
  verde: "\x1b[32m",
  amarelo: "\x1b[33m",
  vermelho: "\x1b[31m",
  reset: "\x1b[0m",
};

// Recebe um texto e devolve esse texto com a cor escolhida.
function colorir(texto, cor) {
  return cores[cor] + texto + cores.reset;
}
const continuar = true;

while (continuar === true) {
  console.log(colorir("=================================", "ciano"));
  console.log(colorir("       JOGO DA VELHA", "ciano"));
  console.log(colorir("          MELHOR DE 5", "amarelo"));
  console.log(colorir("=================================", "ciano"));

  console.log("Jogar 1v1");
  console.log("Jogar contra a máquina");
  console.log("Sair");
  const opcao = prompt("Escolha: ");

  switch (opcao) {
    case "1":
      let nomeJogador1 = prompt("Nome do jogador 1 (X): ").trim();
      let nomeJogador2 = prompt("Nome do jogador 2 (O): ").trim();

      if (nomeJogador1 === "") {
        nomeJogador1 = "Jogador 1";
      }

      if (nomeJogador2 === "") {
        nomeJogador2 = "Jogador 2";
      }

      // Cada jogador é um objeto com nome, símbolo e número de vitórias.
      const jogadores = [
        { nome: nomeJogador1, simbolo: "X", vitorias: 0 },
        { nome: nomeJogador2, simbolo: "O", vitorias: 0 },
      ];

      // Mostra o tabuleiro no terminal.
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

      // Verifica se o símbolo informado completou uma linha, coluna ou diagonal.
      function verificarVencedor(tabuleiro, simbolo) {
        for (let i = 0; i < 3; i++) {
          // Verifica as linhas.
          if (
            tabuleiro[i][0] === simbolo &&
            tabuleiro[i][1] === simbolo &&
            tabuleiro[i][2] === simbolo
          ) {
            return true;
          }

          // Verifica as colunas.
          if (
            tabuleiro[0][i] === simbolo &&
            tabuleiro[1][i] === simbolo &&
            tabuleiro[2][i] === simbolo
          ) {
            return true;
          }
        }

        // Verifica a diagonal principal.
        if (
          tabuleiro[0][0] === simbolo &&
          tabuleiro[1][1] === simbolo &&
          tabuleiro[2][2] === simbolo
        ) {
          return true;
        }

        // Verifica a diagonal secundária.
        if (
          tabuleiro[0][2] === simbolo &&
          tabuleiro[1][1] === simbolo &&
          tabuleiro[2][0] === simbolo
        ) {
          return true;
        }

        return false;
      }

      // Executa uma rodada. Retorna 0 se o jogador 1 vencer,
      // 1 se o jogador 2 vencer ou -1 se houver empate.
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
          console.log("Vez de " + jogador.nome + " (" + jogador.simbolo + ")");

          const posicao = Number(prompt("Escolha uma posição de 1 a 9: "));

          // Confere se a entrada é um número inteiro entre 1 e 9.
          if (
            isNaN(posicao) ||
            posicao < 1 ||
            posicao > 9 ||
            posicao % 1 !== 0
          ) {
            console.log(
              colorir(
                "Entrada inválida. Digite um número inteiro de 1 a 9.",
                "vermelho",
              ),
            );
          } else {
            // Converte a posição escolhida em linha e coluna da matriz.
            const linha = Math.floor((posicao - 1) / 3);
            const coluna = (posicao - 1) % 3;

            if (
              tabuleiro[linha][coluna] === "X" ||
              tabuleiro[linha][coluna] === "O"
            ) {
              console.log(
                colorir(
                  "Essa posição já está ocupada. Escolha outra.",
                  "vermelho",
                ),
              );
            } else {
              tabuleiro[linha][coluna] = jogador.simbolo;
              jogadas++;

              if (verificarVencedor(tabuleiro, jogador.simbolo)) {
                simboloVencedor = jogador.simbolo;
              } else {
                // Só troca de jogador depois de uma jogada válida.
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
          console.log(
            colorir(jogadores[0].nome + " venceu esta rodada!", "verde"),
          );
          return 0;
        } else if (simboloVencedor === jogadores[1].simbolo) {
          console.log(
            colorir(jogadores[1].nome + " venceu esta rodada!", "amarelo"),
          );
          return 1;
        } else {
          console.log(colorir("A rodada terminou empatada!", "ciano"));
          return -1;
        }
      }

      // Mostra o placar acumulado da partida.
      function mostrarPlacar() {
        console.log("\n========== PLACAR ==========");
        console.log(
          jogadores[0].nome + " (X): " + jogadores[0].vitorias + " vitória(s)",
        );
        console.log(
          jogadores[1].nome + " (O): " + jogadores[1].vitorias + " vitória(s)",
        );
        console.log("============================\n");
      }

      let rodada = 1;

      // A partida termina após cinco rodadas ou quando alguém conseguir três vitórias.
      while (
        rodada <= 5 &&
        jogadores[0].vitorias < 3 &&
        jogadores[1].vitorias < 3
      ) {
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
        console.log(colorir("Campeão: " + jogadores[0].nome + "!", "verde"));
      } else if (jogadores[1].vitorias > jogadores[0].vitorias) {
        console.log(colorir("Campeão: " + jogadores[1].nome + "!", "amarelo"));
      } else {
        console.log(colorir("A partida terminou empatada!", "ciano"));
      }

      mostrarPlacar();
      console.log("Obrigado por jogar!");
  }
}
