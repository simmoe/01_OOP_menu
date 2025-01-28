let currentPage = 1
let pages //array med alle elementer med class = page 
let gravity = 1

//Menu maker er en klasse som kigger i html dokumentet efter en div som har id=menu - og laver en menu ud fra de punkter
class menuMaker{
    constructor(){
        this.menuItems = selectAll('#menu div')
        this.itemSize = 100
        this.itemGap = (width - this.menuItems.length * this.itemSize) / (this.menuItems.length + 1)
        this.menuBalls = []
        this.makeMenu()
        this.secondsLeft = 180 
        this.timer = setInterval( () => this.countdown(), 1000 )
        this.solutionOrder = ['white', 'black', 'blue', 'green', 'white', 'blue', 'green', 'red'] 
    }

    countdown(){
        this.secondsLeft--
        select('#time').html(this.secondsLeft)
        if(this.secondsLeft == 150){
            select('#hint').html('Klik på knapperne i bunden for at regne rækkefølgen ud')
        }
        if(this.secondsLeft == 60){
            select('#hint').html('Du skal bruge knappens farve og sidens baggrundsfarve til at regne rækkefølgen ud')
        }
        if(this.secondsLeft == 0){
            select('#result').html('Du har tabt - rejsen slutter her')
            clearInterval(this.timer)
            shiftPage(5)
        }
    }

    makeMenu(){
        //console.log(this.menuItems)
        let startX = this.itemGap
        for(const menuItem of this.menuItems){
            //console.log(menuItem.attribute('data-page'))
            let b = new Ball(this.itemSize, menuItem.attribute('data-page'), menuItem.html(), menuItem.attribute('data-color'), startX)
            startX += this.itemSize + this.itemGap
            this.menuBalls.push(b)
        }
    }
    showMenu(){
        for(const menuBall of this.menuBalls){
            menuBall.show()
            menuBall.move()
            menuBall.collide()
        }
    }
}

class Ball{
    constructor(ballDiameter, ballPage, ballLink, ballColor, ballX){
        this.ballDiameter = ballDiameter
        this.ballPage = ballPage
        this.ballLink = ballLink
        this.ballColor = ballColor
        this.ballX = ballX
        this.gravity = gravity
        this.ballAir = .97
        this.ballVelocity = 0
        this.ballY = -this.ballX
        this.ballButton = createButton(this.ballLink)
        this.ballButton.size(this.ballDiameter, this.ballDiameter)
        this.ballButton.mousePressed( () => shiftPage(this.ballPage) )
    }
    show(){
        noStroke()
        fill(this.ballColor)
        ellipse(this.ballX, this.ballY, this.ballDiameter)
    }
    move(){
        //tilføjer tyngdekraft
        this.ballVelocity += this.gravity
        this.ballVelocity *= this.ballAir
        this.ballY += this.ballVelocity
        this.ballButton.position(this.ballX, this.ballY) 
    }
    collide(){
        if(this.ballY >= height - this.ballDiameter){
            this.ballVelocity = -this.ballVelocity
            this.ballY = height - this.ballDiameter
        }    
    }
}

let menu

function setup(){    
    pages = selectAll('.page')
    //nu kan man se at pages er blevet til en liste med alle class = page ting
    console.log(pages.length)

    ellipseMode(CORNER)
    createCanvas(windowWidth, windowHeight)

    menu = new menuMaker()
}

function draw(){
    //clear tegner et transparent canvas hver frame 
    clear()
    menu.showMenu()
}

function shiftPage(num){
    if(isNaN(num) || num > pages.length || num == 0){
        return
    }
    select("#page" + currentPage).removeClass('visible')
    currentPage = num
    select("#page" + currentPage).addClass('visible')
}


