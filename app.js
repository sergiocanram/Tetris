document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('start-button')
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const color = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    
//Piezas del Tetris

const lTetromino = [
    [1, 1+width, width*2 + 1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width + 1, width*2 + 1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const zTetromino = [
    [0, width, width + 1, width*2 + 1],
    [width + 1, width + 2, width * 2, width*2+1],
    [0, width, width + 1, width*2 + 1],
    [width + 1, width+2, width*2, width*2+1]
] 

const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width +1, width + 2, width*2 + 1],
    [1, width, width+1, width*2+1]
]

const oTetromino = [
    [0,1,width, width+1],
    [0,1,width, width+1],
    [0,1,width, width+1],
    [0,1,width, width+1]
]

const iTetromino = [
    [1, width+1, width*2 + 1, width*3+1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
]

const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

let currentPosition = 4; 
let currentRotation = 0;

// Sortear qué pieza va a salir aleatoriamente y de qué forma va a salir (Recordemos que cada una tiene 4 rotaciones)
let random = Math.floor(Math.random()* theTetrominos.length)
let current = theTetrominos[random][0];



//Ahora toca una función para dibujar las piezas
function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = color[random];
    })
}


//Ahora toca una función para borrar las piezas
function undraw(){
     current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
        squares[currentPosition + index].style.backgroundColor = '';
     })
}


//Hacer que las piezas se muevan cada X milisegundos
//


// Asignar los códigos de las teclas para después invocar las funciones correspondientes
function control(e) {
    if(e.keyCode === 37){
        moveLeft();
    } else if(e.keyCode === 38) {
        rotate();
    } else if(e.keyCode === 39) {
        moveRight();
    } else if(e.keyCode === 40){
        moveDown();
    }
}
document.addEventListener('keydown', control)


// Función de mover hacia abajo
//function moveDown() {
//   undraw();
//    currentPosition += width;
//    draw();
//    freeze();
//}

function moveDown() {
    if (!current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        undraw();
        currentPosition += width;
        draw();  
    } else {
        freeze();
    }
}

//Función para detener las piezas
function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //Que empiece a caer otra pieza
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominos.length) ;
        current = theTetrominos[random][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        addScore();
        gameOver();
    }
}

//Ahora vamos a definir los límites del mapa para que la ficha deje de moverse hacia el lado.
//Empezamos definiendo la función para mover la pieza hacia la izquierda

function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if(!isAtLeftEdge) currentPosition -= 1;

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
    }

    

    draw();
}





//Y ahora hacia la derecha
function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1 )

    if(!isAtRightEdge) currentPosition += 1;

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
    }

    draw();
}


//Rotar la pieza
function rotate() {
    undraw();
    currentRotation++;
    if(currentRotation === current.length) {
        currentRotation = 0;
    }
    current = theTetrominos[random][currentRotation]
    draw();
}


//Mostrar la siguiente pieza en una minicuadrícula a la derecha
const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
let displayIndex = 0;


//Las piezas sin ninguna rotación, sólo queremos un ejemplo de cada una para mostrarla
const upNextTetrominoes = [
    [1, displayWidth +1, displayWidth*2 + 1, 2], //Este es la pieza L
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //Esta es la pieza Z
    [1, displayWidth, displayWidth+1, displayWidth+2], //Pieza en T
    [0,1,displayWidth, displayWidth+1], // Pieza O
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] // Pieza I
]

//Ahora vamos a escribir una función que la muestre

function displayShape() {
    // Borrar cualquier rastro de una pieza de toda esta cuadrícula
    displaySquares.forEach(square => {
        square.classList.remove('tetromino');
        square.style.backgroundColor = '';
    });

    upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino');
        displaySquares[displayIndex + index].style.backgroundColor = color[nextRandom];
    });
}


//Vamos a añadirle funcionalidad al boton de start/pause
  startButton.addEventListener('click', () => {
    if(timerId) {
        clearInterval(timerId);
        timerId = null
    } else {
        draw();
        
        nextRandom = Math.floor(Math.random()*theTetrominos.length);
        displayShape();
        timerId = setInterval(moveDown, 500);
    }
  })

  function addScore() {
    for(let i=0; i<199; i+=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+6, i+7, i+8, i+9]

        if(row.every(index => squares[index].classList.contains('taken'))){
            score+=10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
                squares[index].style.backgroundColor = '';
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell))
 
        }
    }
  }

 //Game Over 
function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = "The End";
        clearInterval(timerId)
    }
}










}) //Final del DOMContentLoaded