class GameComponent{
    // VARS AND CONSTS
    static UP = "ArrowUp"
    static DOWN = "ArrowDown"
    static LEFT = "ArrowLeft"
    static RIGHT = "ArrowRight"
    static _gameComponents = []
    // Constructor
    constructor(){
        setTimeout(() => {
            GameComponent._gameComponents.push(this)
        }, 0)
    }
    // Self static functions
    static KeyDownComponents(event){
        for(let gameComponentIndex in GameComponent._gameComponents)
            GameComponent._gameComponents[gameComponentIndex].KeyDown(event)
    }
    static UpdateComponents(canvas, info){
        for(let gameComponentIndex in GameComponent._gameComponents)
            GameComponent._gameComponents[gameComponentIndex].Update(canvas, info)
    }
    static RenderComponents(canvas, canvasContext){
        for(let gameComponentIndex in GameComponent._gameComponents)
            GameComponent._gameComponents[gameComponentIndex].Render(canvas, canvasContext)
    }
    // Static functions
    static createRect(canvasContext, x, y, width, height, color="white"){
        canvasContext.fillStyle = color
        canvasContext.fillRect(x, y, width, height)
    }
    static createText(canvasContext, text, x, y, color="black", font="20px Arial"){
        canvasContext.font = font
        canvasContext.fillStyle = color
        canvasContext.fillText(text, x, y)
    }
    static clearScreen(canvas, canvasContext){
        canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    }
    // Functions called
    Update(_canvas, _info){}
    Render(_canvas, _canvasContext){}
    KeyDown(_event){}
}

class Snake extends GameComponent{
    constructor(initialX, initialY, size, timeToMove, color, endGame){
        super()
        this.position = {
            x: initialX,
            y: initialY
        }
        this.endGame = endGame
        this.timeToMove = timeToMove
        this.size = size
        this.color = color
        this.body = [
            {x: this.position.x, y: this.position.y},
            {x: this.position.x, y: this.position.y},
        ]
        this.rotation = {
            x: 0,
            y: 1
        }
        this.timeMoved = 0
    }

    move(){
        var newRect
        if(this.rotation.x == 1){
            newRect = {
                x: this.body[this.body.length - 1].x + this.size,
                y: this.body[this.body.length - 1].y
            }
        }
        if(this.rotation.x == -1){
            newRect = {
                x: this.body[this.body.length - 1].x - this.size,
                y: this.body[this.body.length - 1].y
            }
        }
        if(this.rotation.y == -1){
            newRect = {
                x: this.body[this.body.length - 1].x,
                y: this.body[this.body.length - 1].y + this.size
            }
        }
        if(this.rotation.y == 1){
            newRect = {
                x: this.body[this.body.length - 1].x,
                y: this.body[this.body.length - 1].y - this.size
            }
        }
        this.body.shift()
        this.body.push(newRect)
        this.position = newRect
    }

    hasEatSelf(){
        let counter = 0
        for(let i = 0; i < this.body.length; i++)
            if(this.position.x == this.body[i].x && this.position.y == this.body[i].y)
                counter++
        return counter >= 2
    }

    hasQuitMap(canvas){
        return this.position.x < 0 || this.position.x >= canvas.width || this.position.y < 0 || this.position.y >= canvas.height
    }

    eatApple(){
        this.body.unshift({
            x: this.body[0].x,
            y: this.body[0].y
        })
    }

    Update(canvas, _info){
        if(this.timeMoved >= this.timeToMove){
            this.move()
            if(this.hasEatSelf() || this.hasQuitMap(canvas))
                this.endGame()
            this.timeMoved = 0
        }else
            this.timeMoved++
    }

    Render(_canvas, canvasContext){
        this.body.forEach(b => {
            GameComponent.createRect(canvasContext, b.x, b.y, this.size, this.size, this.color)
        })
    }

    KeyDown(event){
        const key = event.key
        if(key == GameComponent.UP)
            this.rotation = {
                x: 0,
                y: 1
            }
        if(key == GameComponent.DOWN)
            this.rotation = {
                x: 0,
                y: -1
            }
        if(key == GameComponent.LEFT)
            this.rotation = {
                x: -1,
                y: 0
            }
        if(key == GameComponent.RIGHT)
            this.rotation = {
                x: 1,
                y: 0
            }
    }
}

class Apple extends GameComponent{
    constructor(x, y, size, color){
        super()
        this.color = color
        this.size = size
        this.position = {x, y}
        this.positionsX = []
        this.positionsY = []
        for(let i = 0; i < (canvas.width / this.size); i++)
            this.positionsX.push(i * this.size)
        for(let i = 0; i < (canvas.height / this.size); i++)
            this.positionsY.push(i * this.size)
    }
    hasSnakeBodyHere(snake, x, y){
        for(let i = 0; i < snake.body.length; i++)
            if(x == snake.body[i].x && y == snake.body[i].y)
                return true
        return false
    }
    respawnAppleNotAtSnake(snake){
        let canSpawn = false
        while(!canSpawn){
            let newPositionX = this.positionsX[Math.floor(Math.random() * this.positionsX.length)]
            let newPositionY = this.positionsY[Math.floor(Math.random() * this.positionsY.length)]
            canSpawn = !this.hasSnakeBodyHere(snake, newPositionX, newPositionY)
            if(canSpawn)
                this.position = {x: newPositionX, y: newPositionY}
        }
    }
    Update(_canvas, info){
        if(this.hasSnakeBodyHere(info.snake, this.position.x, this.position.y)){
            this.respawnAppleNotAtSnake(info.snake)
            info.snake.eatApple()
        }
    }
    Render(_canvas, canvasContext){
        GameComponent.createRect(canvasContext, this.position.x, this.position.y, this.size, this.size, this.color)
    }
}