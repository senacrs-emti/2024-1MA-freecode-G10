let figurasPossiveis = [...figurasHistoricas];
let perguntaIndex = 0;
let figura;
let perguntas = [
    { campo: "ocupacao", texto: "A pessoa é um(a) {ocupacao}?" },
    { campo: "periodo", texto: "A pessoa viveu na {periodo}?" },
    { campo: "principaisRealizacoes", texto: "A pessoa realizou algo relacionado a {realizacao}?" },
    { campo: "descricao", texto: "A pessoa é famosa por sua inteligência ou sabedoria?" }

];

// função p  embaralhar as perguntas

function shuffleQuestions(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Troca os elementos
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

// função para gerar a próxima pergunta
function nextQuestion() {
    let aleatorio = getRandomInt(0,figurasHistoricas.length);
    if (figurasPossiveis.length === 1) {
        // caso reste só uma pessoa, vai mostra isso ae
        document.getElementById('question').textContent = 'Você estava pensando em ${figurasHistoricas[aleatorio].nome}?';
        document.getElementById('result').textContent = figurasHistoricas[aleatorio].descricao;
        
        return;
    }
    if (perguntaIndex >= perguntas.length) {
        // se não tiver mais perguntas para fazer, finaliza o jogo
        document.getElementById('question').textContent = "Eu não consegui adivinhar. Você tem outra figura em mente?";
        document.getElementById('result').textContent = "";
        return;
    }
    const pergunta = perguntas[perguntaIndex];
    const atributo = pergunta.campo;
    if (atributo === 'principaisRealizacoes') {
        // se for para pergunta sobre realizações dos mano, escolhe uma realização aleatória
        const realizacaoIndex = Math.floor(Math.random() * figurasHistoricas[aleatorio].principaisRealizacoes.length);
        const realizacao = figurasHistoricas[aleatorio].principaisRealizacoes[realizacaoIndex];
/*        console.log(figurasHistoricas[aleatorio]);
        console.log(realizacao);*/
        document.getElementById('question').textContent = pergunta.texto.replace("{realizacao}", realizacao);
    } else {
        // para as outras perguntas (ocupação, período, etc.), esse codigo burro escolhe o primeiro valor
        const valor = figurasHistoricas[aleatorio][atributo] || figurasHistoricas[aleatorio][atributo][0];  // Pega o primeiro valor caso seja uma lista
        document.getElementById('question').textContent = pergunta.texto.replace(`{${atributo}}`, valor);
        console.log(pergunta.texto.replace(`{${atributo}}`, valor));
    }
}


// Função para processar a resposta
function answer(resposta) {
    let filtro;
    console.log(figurasPossiveis);
    console.log(resposta);
    if (resposta === "sim") {
        filtro = figurasPossiveis.filter(figura => {
            if (figura[perguntas[perguntaIndex].campo] instanceof Array) {
                return figura[perguntas[perguntaIndex].campo].includes(perguntas[perguntaIndex].texto);  // Para listas, verifica se contém o valor
            } else {
                return figura[perguntas[perguntaIndex].campo] === perguntas[perguntaIndex].texto;
            }
        });
        console.log(filtro);
    } else if (resposta === "nao") {
        filtro = figurasPossiveis.filter(figura => {
           // console.log(figura[perguntas[perguntaIndex].campo]);
            if (figura[perguntas[perguntaIndex].campo] instanceof Array) {
                return !figura[perguntas[perguntaIndex].campo].includes(perguntas[perguntaIndex].texto);
            } else {
                return figura[perguntas[perguntaIndex].campo] !== perguntas[perguntaIndex].texto;
            }
        });
    }
    figurasPossiveis = filtro;
    perguntaIndex++;
    nextQuestion();
    console.log(filtro);
}
// começar o jogo
shuffleQuestions(perguntas); // embaralha as pergunta para a ordem ser random

