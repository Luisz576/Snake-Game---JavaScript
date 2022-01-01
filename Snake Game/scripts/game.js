const canvas = document.querySelector('canvas')
const canvasContext = canvas.getContext('2d')

var gameRunning = true

var snake = new Snake(100, 100, 10, 5, "green", endGame)
var apple = new Apple(100, 60, 10, "red")

// START GAME LOOP
window.onload = () => {
    window.addEventListener("keydown", keydownHandler)
    setInterval(GameLoop, 1000/30) //30 frames
}

// GAME LOOP
function GameLoop(){
    if(gameRunning){
        Update()
        Render()
    }else{
        RenderEndGame()
    }
}

// UPDATE THE GAME
function Update(){
    GameComponent.UpdateComponents(canvas, {snake, apple})
}

// RENDER THE GAME
function Render(){
    GameComponent.clearScreen(canvas, canvasContext)
    GameComponent.RenderComponents(canvas, canvasContext)
    GameComponent.createText(canvasContext, "Score: " + (snake.body.length - 2), 10, 20)
}

// KEYDOWN HANDLER
function keydownHandler(event){
    GameComponent.KeyDownComponents(event)
}

// RENDER END GAME
function RenderEndGame(){
    GameComponent.clearScreen(canvas, canvasContext)
    GameComponent.RenderComponents(canvas, canvasContext)
    GameComponent.createText(canvasContext, "GAME OVER", 180, 120, "red")
    GameComponent.createText(canvasContext, "Score: " + (snake.body.length - 2), 200, 160, "green")
}

// END GAME
function endGame(){
    gameRunning = false
}