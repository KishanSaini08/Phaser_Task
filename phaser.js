let gameScene = new Phaser.Scene("Game");


gameScene.preload = function () {
    this.load.image("background", "assets/background.jpg");
    this.load.image("ball", "assets/ball.png");
    this.load.audio('bounce', 'assets/bounce.mp3');
}

let session = document.querySelector("#sessionID");
let start1Time = document.querySelector("#startTime");
let eTime = document.querySelector("#endTime");
let btn = document.querySelector("#btn");
let showList = document.querySelector("#show");
let Data = [];


gameScene.create = function () {
    let screenWidth = this.cameras.main.width; // Get the width of the game canvas
    let screenHeight = this.cameras.main.height; // Get the height of the game canvas

    let background = this.add.image(screenWidth / 2, screenHeight / 2, "background");

    // Adjust the background size to cover the entire canvas
    background.displayWidth = screenWidth;
    background.displayHeight = screenHeight;

    // Center the background image
    background.setOrigin(0.5);

    let ball = this.physics.add.sprite(screenWidth / 2, screenHeight - 40, "ball");
    ball.setScale(0.1);

    let counterText = this.add.text(screenWidth / 2, 100, 'Counter: ', { fill: '#ffffff' });
    counterText.setOrigin(0.5);
    let timer;;

    function gameStart() {
        let audio = new Audio('assets/bounce.mp3');
        btn.disabled = true;
        let startTime = Date.now();
        let counterValue = Phaser.Math.Between(30, 120);
        counterText.setText('Counter: ' + counterValue);
        let newTime = startTime + counterValue * 1000;
        let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let sessionId = '';
        for (let i = 0; i < 10; i++) {
            let randomIndex = Math.floor(Math.random() * charset.length);
            sessionId += charset[randomIndex];
        }

        let Interval = setInterval(() => {
            if (counterValue > 0) {
                counterValue--;
                counterText.setText('Counter: ' + counterValue);
            }
        }, 1000);
        
        ball.setVelocity(1100, 200);
        ball.setBounce(1);

       
        timer = gameScene.time.addEvent({
            callback: function () {
                if (counterValue === 0) {
                    clearInterval(Interval);
                    timer.remove(false); // Stop the timer when the counter reaches 0
                    btn.disabled = false;
                    session.innerHTML = sessionId;
                    startTime = new Date(startTime);
                    let stopTime = new Date(newTime);
                    start1Time.innerHTML = startTime;
                    eTime.innerHTML = stopTime;
                    Data.push({
                        sessionId,
                        startTime,
                        stopTime
                    });
                    counterValue = 0;
                    counterText.setText('Counter: ' + counterValue);
                     // Stop the ball's movement
                ball.setVelocity(0, 0);
                }
            },
            delay: 1000,
            callbackScope: gameScene,
            loop: true
        });
        
   
        ball.setCollideWorldBounds(true);
        ball.body.onWorldBounds = true;
        gameScene.physics.world.on('worldbounds', function (body) {
            if (body.gameObject === ball) {
                audio.play();
            }
        });
    }

    btn.onclick = () => {
        gameStart();
    }
};

function List() {
    if (!document.getElementById("list")) {
        let list = document.createElement("table");
        list.setAttribute("id", "list");
        let tr = document.createElement("tr");
        let th1 = document.createElement("th");
        let th2 = document.createElement("th");
        let th3 = document.createElement("th");
        th1.innerHTML = "Session ID";
        th2.innerHTML = "Start Time";
        th3.innerHTML = "End Time";
        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        list.appendChild(tr);

        Data.forEach((element, index) => {
            let tr = document.createElement("tr");
            let td1 = document.createElement("td");
            let td2 = document.createElement("td");
            let td3 = document.createElement("td");
            td1.innerHTML = element.sessionId;
            td2.innerHTML = element.startTime;
            td3.innerHTML = element.stopTime;
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            list.appendChild(tr);
        });
        document.body.appendChild(list);
    }
}

showList.onclick = () => {
    List();
};

// Set the configuration of the game
let Config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // No gravity in this case
            debug: false // For debugging purposes
        }
    },
    scene: gameScene,
    disableVisibilityChange: true,
}

// Create a new game, pass the configuration
let game = new Phaser.Game(Config);