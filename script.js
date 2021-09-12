//COMPONENETES

//Load imagens
//imagem da tela
const imgTela = new Image();
imgTela.src = "./imagens/tela2.jpg";
//imagem do nível
const imagNivel = new Image();
imagNivel.src = "./imagens/nivel.png";
//imagem das vidas
const imagVidas = new Image();
imagVidas.src = "./imagens/vidas2.png";
//imagem dos pontos
const imagPontos = new Image();
imagPontos.src = "./imagens/pontos.png"

//fim de load imagens

//load sons
//som muro
const somMuro = new Audio();
somMuro.src = "./som/muro.mp3"
//som de vida perdida
const somVida = new Audio();
somVida.src = "./som/vida.mp3"
//som da raquete
const somRaquete = new Audio();
somRaquete.src = "./som/raquete.mp3"
//som de ganhar ou passar de nível
const somGanhar = new Audio();
somGanhar.src = "./som/ganhar.mp3"
//som de quebra tijolos
const somTijolo = new Audio();
somTijolo.src = "./som/tijolo.mp3"



//JOGO

//Selecionando os elementos da tela
const tela = document.getElementById("tabuleiro");
const context = tela.getContext("2d");

context.lineWidth = 2;

//Variaveis
const raqueteLargura = 100;
const raqueteMargInferior = 60;
const raqueteAltura = 10;
const bolaRaio = 8;
let leftArrow = false;
let rightArrow = false;
let vida = 3;
let ponto = 0;
const pontoUnidade = 10; 
let nivel = 1;
const nivelMax = 3;
let gameFim = false;


//Criando o raquete do jogador
const raquete = {
    x: tela.width/2 - raqueteLargura/2,
    y: tela.height - raqueteMargInferior - raqueteAltura + 20,
    width: raqueteLargura,
    height:raqueteAltura,
    deltaX: 5
}

//Desenhar a Raquete
function drawRaquete(){
    context.fillStyle = "#120f0f";
    context.fillRect(raquete.x, raquete.y, raquete.width, raquete.height);

    context.strokeStyle = "#ffea00";
    context.strokeRect(raquete.x, raquete.y, raquete.width, raquete.height);
}

//Controlar a raquete
document.addEventListener("keydown", function(e){
    if(e.keyCode == 37){
        leftArrow = true;
    }else if(e.keyCode == 39){
        rightArrow = true;
    }
});
document.addEventListener("keyup", function(e){
    if(e.keyCode == 37){
        leftArrow = false;
    }else if(e.keyCode == 39){
        rightArrow = false;
    }
});

//Função mover raquete
function moverRaquete (){
    if(rightArrow && raquete.x + raqueteLargura < tela.width){
        raquete.x += raquete.deltaX;
    }else if(leftArrow && raquete.x > 0){
        raquete.x -=raquete.deltaX;
    }
}

//Criar bola
const bola = {
    x : tela.width/2,
    y : raquete.y - bolaRaio,
    raio : bolaRaio,
    velocidade : 4,
    deltaX : 3 * (Math.random() * 2 - 1),
    deltaY : -3,
}
//Função desenha bola
function drawBola(){
    context.beginPath();

    context.arc(bola.x, bola.y, bola.raio, 0, Math.PI*2);
    context.fillStyle = "#0400ff";
    context.fill();

    context.strokeStyle = "#ffea00";
    context.stroke();

    context.closePath();
}

//Função mover a bola
function moveBola(){
    bola.x += bola.deltaX;
    bola.y += bola.deltaY;
}

//Função de detecção de colisão de bola na parede
function colisionBolaParede(){
    if(((bola.x + bola.raio) > tela.width) || ((bola.x - bola.raio) < 0)){
        bola.deltaX = - bola.deltaX;
        somMuro.play();//som da bola batendo no muro
    }
    if((bola.y + bola.raio) < 0){
        bola.deltaY = - bola.deltaY;
        somMuro.play();//som da bola batendo no muro
    }
    if((bola.y + bola.raio) > tela.height){
        vida --;
        somVida.play();//som de perdeu vida
        resetBola();
        resetRaquete();
    }
}

//Função de redefinir bola
function resetBola(){
    bola.x = tela.width/2;
    bola.y = raquete.y - bolaRaio;
    bola.deltaX = 3 *(Math.random() * 2 - 1);
    bola.deltaY = -3;
}
//Função de redefinir raquete
function resetRaquete(){
    raquete.x = tela.width/2 - raqueteLargura/2;
    deltaX = 5;
}

//Função de detecção de colisão de bola na raquete
function colisionBolaRaquete(){
    if((bola.x < (raquete.x + raquete.width)) && (bola.x > raquete.x) && (raquete.y < (raquete.y + raquete.height)) &&(bola.y > raquete.y)){
        //som da bola colidindo na raquete
        somRaquete.play();
       //check onde a bola bateu na raquete
       let colidRaquete = bola.x - (raquete.x + raquete.width/2);
       //normaliza os valores
       colidRaquete = colidRaquete / (raquete.width/2);
       //calcular o angulo da bola
       let angulo = colidRaquete * Math.PI/3;

       bola.deltaX = bola.velocidade * Math.sin(angulo);
       bola.deltaY = - bola.velocidade * Math.cos(angulo);
    }
}

//Criando os tijolos
const tijolo = {
    linha : 1,
    coluna : 5,
    width : 55,
    height : 20,
    offSetLeft : 20,
    offSetTop : 20,
    marginTop : 40,
    fillColor : "#004d04",
    strokeColor : "#00ff0d"
}
let tijolos = [];
function criarTijolos(){
    for(let l = 0; l < tijolo.linha; l++){
        tijolos[l] = [];
        for(let c = 0; c < tijolo.coluna; c++){
            tijolos[l][c] = {
                x : c * (tijolo.offSetLeft + tijolo.width) + tijolo.offSetLeft,
                y : l * (tijolo.offSetTop + tijolo.height) + tijolo.offSetTop + tijolo.marginTop,
                status: true
            }
        }
    }
}

criarTijolos();

//Desenhar os tijolos
function drawTijolos(){
    for(let l = 0; l < tijolo.linha; l++){
        for(let c = 0; c < tijolo.coluna; c++){
            let t = tijolos[l][c];
            //Se o tijolo não está quebrado
            if(t.status){
                context.fillStyle = tijolo.fillColor;
                context.fillRect(t.x, t.y, tijolo.width, tijolo.height);

                context.strokeStyle = tijolo.strokeColor;
                context.strokeRect (t.x, t.y, tijolo.width, tijolo.height);
            }
        }
    }
}

//Função bola colide no tijolo
function colidBolaTijolo(){
    for(let l = 0; l < tijolo.linha; l++){
        for(let c = 0; c <tijolo.coluna; c++){
            let t = tijolos[l][c];
            if(t.status){
                if(bola.x + bola.raio > t.x && bola.x - bola.raio < t.x + tijolo.width && bola.y + bola.raio > t.y && bola.y - bola.raio < t.y + tijolo.height){
                    somTijolo.play();//som do tijolo quebrando
                    bola.deltaY = - bola.deltaY;//mudar direção da bola
                    t.status = false; //o tijolo foi quebrado
                    ponto += pontoUnidade;
                }
            }
            
        }
    }
}

//Função mostrar os dados do jogo
function showGameStats (text, textX, textY, img, imgX, imgY){
    //criando o texto
    context.fillStyle = "#fff";
    context.font = "25px Germania One";
    context.fillText (text, textX, textY);
    //criando a imagem
    context.drawImage(img, imgX, imgY, width = 25, height= 25);
}

//Função GAME OVER
function gameOver(){
    if(vida <= 0){
        vocePerdeu();
        gameFim = true;
    }
}

//Proximo nível
function nivelProx(){
    let nivelFeito = true;
    
    //verificar se todos os tijolos estão quebrados
    for(let l = 0; l < tijolo.linha; l++){
        for(let c = 0; c < tijolo.coluna; c++){
            nivelFeito = nivelFeito && !tijolos[l][c].status;
        }
    }
    if(nivelFeito){
        somGanhar.play();//som de ganhar
        if(nivel >= nivelMax){
            voceGanhou();
            gameFim = true;
            return;
        }
        tijolo.linha ++;
        criarTijolos();
        bola.velocidade += 0.5;
        resetBola();
        resetRaquete();
        nivel ++; 
    }

}

//Função desenha o jogo
function draw(){
    drawRaquete();
    drawBola();
    drawTijolos();

    //mostrar os pontos
    showGameStats (ponto, 35, 25, imagPontos, 5, 3);
    //mostrar o nível
    showGameStats (nivel, tela.width/2 - 5, 25, imagNivel, tela.width/2 - 30, 3);
    //mostrar as vidas
    showGameStats (vida, tela.width -25, 25, imagVidas, tela.width - 55, 5);
}

//Função atualizar o jogo
function atualizar(){
    moverRaquete ();
    moveBola();
    colisionBolaParede();
    colisionBolaRaquete();
    colidBolaTijolo();
    gameOver();
    nivelProx();
}

//Função Loop
function loop(){
    //limpar canvas
    context.drawImage(imgTela, 0, 0);

    draw();
    
    atualizar();

    if(!gameFim){
        requestAnimationFrame(loop);
    }
}
loop();

//Selecione o elemento de som 
const elementoSom = document.getElementById("som");
elementoSom.addEventListener("click", gerenciarAudio);
function gerenciarAudio(){
    //mudar imagem do som
    let imgSrc = elementoSom.getAttribute("src");
    let imgSom = imgSrc == "./imagens/somLigado.png" ? "./imagens/somDesligado.png" : "./imagens/somLigado.png";

    elementoSom.setAttribute("src", imgSom);

    //silenciar os sons
    somMuro.muted = somMuro.muted ? false : true;
    somRaquete.muted = somRaquete.muted ? false : true;
    somVida.muted = somVida.muted ? false : true;
    somTijolo.muted = somTijolo.muted ?
    false : true;
    somGanhar.muted = somGanhar.muted ? false : true;
}

//Mensagem de fim de jogo

const fimDeJogo = document.getElementById("fimDeJogo");
const youGanhou = document.getElementById("youGanhou");
const youPerdeu = document.getElementById("youPerdeu");
const reiniciar = document.getElementById("reiniciar");

//Clique no botão Play Again!
reiniciar.addEventListener("click", function(){
    location.reload();//recarregar a página
});

//Quando ganhar
function voceGanhou(){
    fimDeJogo.style.display = "block";
    youGanhou.style.display = "block";
}
//Quando Perder
function vocePerdeu(){
    fimDeJogo.style.display = "block";
    youPerdeu.style.display = "block";
}