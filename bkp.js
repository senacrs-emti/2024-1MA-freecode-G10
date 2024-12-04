let figurasPossiveis = [];
let perguntaIndex = 0;
let descartadas = {}; // Objeto para armazenar características descartadas

let perguntas = [
    { campo: "ocupacao", texto: "A pessoa é um(a) {ocupacao}?" },
    { campo: "periodo", texto: "A pessoa viveu na {periodo}?" },
    { campo: "principaisRealizacoes", texto: "A pessoa realizou algo relacionado a {realizacao}?" },
    { campo: "descricao", texto: "A pessoa é famosa por sua inteligência ou sabedoria?" },
    { campo: "nacionalidade", texto: "A pessoa é originária de {nacionalidade}?" },
    { campo: "genero", texto: "A pessoa se identifica como {genero}?" },
    { campo: "fatospersonalidade", texto: "A personalidade que você está pensando foi {fatospersonalidade}?" }
];

// Função para embaralhar as perguntas
function shuffleQuestions(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Carregar personagens do JSON
async function carregarFigurasHistoricas() {
    try {
        const response = await fetch('figurasHistoricas.json'); // Certifique-se de que o arquivo JSON esteja acessível.
        const data = await response.json();
        figurasPossiveis = data.figuras;
        iniciarJogo();
    } catch (error) {
        console.error("Erro ao carregar figuras históricas:", error);
    }
}

// Função para gerar a próxima pergunta
function nextQuestion() {
    // Se sobrou uma figura, o jogo adivinhou corretamente
    if (figurasPossiveis.length === 1) {
        const figura = figurasPossiveis[0];
        document.getElementById('question').textContent = `Você estava pensando em ${figura.nome}?`;
        document.getElementById('result').textContent = figura.descricao;
        return;
    }

    // Se não houver mais perguntas possíveis
    if (perguntaIndex >= perguntas.length) {
        perguntaIndex = 0; // Reinicia para fazer as perguntas restantes
    }

    let pergunta = perguntas[perguntaIndex];

    // Pula perguntas descartadas
    while (descartadas[pergunta.campo] && perguntaIndex < perguntas.length) {
        perguntaIndex++;
        if (perguntaIndex >= perguntas.length) perguntaIndex = 0;
        pergunta = perguntas[perguntaIndex];
    }

    const atributo = pergunta.campo;

    if (atributo === 'principaisRealizacoes') {
        const figuraAleatoria = figurasPossiveis[getRandomInt(0, figurasPossiveis.length)];
        if (figuraAleatoria.principaisRealizacoes.length > 0) {
            const realizacaoIndex = getRandomInt(0, figuraAleatoria.principaisRealizacoes.length);
            const realizacao = figuraAleatoria.principaisRealizacoes[realizacaoIndex];
            document.getElementById('question').textContent = pergunta.texto.replace("{realizacao}", realizacao);
        }
    } else {
        const figuraAleatoria = figurasPossiveis[getRandomInt(0, figurasPossiveis.length)];
        const valor = Array.isArray(figuraAleatoria[atributo]) ? figuraAleatoria[atributo][0] : figuraAleatoria[atributo];
        document.getElementById('question').textContent = pergunta.texto.replace(`{${atributo}}`, valor);
    }
}

// Função para processar a resposta
function answer(resposta) {
    const perguntaAtual = perguntas[perguntaIndex];
    const atributo = perguntaAtual.campo;

    figurasPossiveis = figurasPossiveis.filter(figura => {
        const valorFigura = figura[atributo];
        const textoPergunta = document.getElementById('question').textContent;
        const valorPergunta = textoPergunta.split(' ').pop().replace("?", "");

        if (resposta === "sim") {
            return Array.isArray(valorFigura) ? valorFigura.includes(valorPergunta) : valorFigura === valorPergunta;
        } else {
            descartadas[atributo] = true; // Marca a característica como descartada
            return Array.isArray(valorFigura) ? !valorFigura.includes(valorPergunta) : valorFigura !== valorPergunta;
        }
    });

    perguntaIndex++;
    nextQuestion();
}

// Iniciar o jogo após carregar as figuras
function iniciarJogo() {
    shuffleQuestions(perguntas);
    nextQuestion();
}

carregarFigurasHistoricas();
