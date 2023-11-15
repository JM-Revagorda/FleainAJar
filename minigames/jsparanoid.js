window.addEventListener('load', function(){
    const canvas = document.getElementById("mainarea");
    const ctx = canvas.getContext('2d');
    canvas.width = 2000;
    canvas.height = 720;
    let pause_menu = this.document.querySelector("dialog");
    let timer = 5000;
    let entities = [];
    let gameOver = false, pause = false;
    let score = 0;

    //Creates inputs
    class InputHandler{
        constructor(){
            this.keys = [];
            window.addEventListener('keydown', e => {
                if ((e.key === 'ArrowUp' ||
                     e.key == " "||
                     e.key == "q")
                     && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                }
            });
            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowUp' ||
                    e.key == " "||
                    e.key == "q"){
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
        }        
    }

    //Player instantiation
    class Player{
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 271;
            this.height = 348;
            this.x = this.gameWidth / 2 * 1.1;
            this.y = this.gameHeight - this.height;
            this.color = 'black';
            this.frameX = 0;
            this.frameY = 0; //Temporary, until we get a new state
            this.fps = 9;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.maxFrame = 3;
            this.image = document.getElementById("objPlayer");
            // this.speed = 5;
        }
        draw(context){
            //fillRect(x, y, h, w) - Creates a Rectangle
            //drawImage(image *must have an <img> tag*, source x, source y, source width, source height, destx, desty, destwidth, destheight) - creates the sprites we know of today
            // context.fillStyle = "black";
            // context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.frameX * this.width, 0 * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update(input, deltaTime){
            if(input.keys.indexOf("ArrowUp") > -1){
                score += 0;
            } else {
                score += Math.round(2 * 0.6);
            }

            //Animation
            if(this.frameTimer > this.frameInterval){
                if (this.frameX >= this.maxFrame){ this.frameX = 0;}
                else {
                    if(input.keys.indexOf("ArrowUp") == -1) this.frameX++;
                    else this.frameX = 0;
                }
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
        }
    }

    // Background Instantiation
    class Background{
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById("objBackground");
            this.x = 0;
            this.y = 0;
            this.width = 4031;
            this.height = 744;
            this.speed = 7;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
        }
        update(input){
            this.x -= this.speed;
            if (this.x < 0 - this.width) this.x = 0;

            if(input.keys.indexOf("ArrowUp") > -1) this.speed = 0;
            else this.speed = 7;
        }
    }
    
    // Timer creator
    let steps = 0;
    function Timer(input){
        if(input.keys.indexOf("ArrowUp") > -1){
            timer += 3;
        } else {
            timer -= steps + 1;
        }
        if(timer > 5000) timer = 5000;
        //Game Over mechanic
        else if(timer < 0) gameOver = true;

        if (score % 500 == 0) steps += 1;
    }

    //Pause menu(open and close)
    function pauser(input){
        let closer = document.getElementsByClassName("options")[0];
        let leave = document.getElementsByClassName("options")[1];
        if (input.keys.indexOf('q') > -1 && !pause){
            pause = true;
            pause_menu.showModal();
        }
        closer.onclick = function(){
            pause_menu.close();
            pause = false;
        }
        leave.onclick = function(){
            window.close();
        }
    }

    // Darkness(for aesthtics only!)
    class Dark{
        constructor(gameHeight, gameWidth){
            this.gameHeight = gameHeight;
            this.gameWidth = gameWidth;
            this.width = this.gameWidth;
            this.height = this.gameHeight;
            this.opacity = 0;
            this.x = -this.gameWidth;
            this.y = 0;
            this.speed = 1;
        }
        draw(context){
            context.fillStyle = "black";
            context.fillRect(this.x, this.y, this.width, this.height);
        }
        update(input){
            if(input.keys.indexOf("ArrowUp") > -1) this.speed = -10;
            else this.speed = timer/5000 + 1;
            this.x += this.speed;
            if(this.x < 0 - this.width) this.x = 0 - this.width;
            if(this.x > (this.gameWidth / 2) - this.width) this.x = (this.gameWidth / 2) - this.width;
        }
    }

    function closer(){
        pause = false;
        pause_menu.close();
    }

    function displayText(context, gameWidth, gameHeight){
        context.font = "20px Arial";
        context.fillStyle = "white";
        context.fillText("Timer: " + timer, 20, 50);
        context.font = "20px Arial";
        context.fillStyle = "white";
        context.fillText("Score: " + score, 20, 100);
        if(gameOver){
            context.font = "40px Arial";
            context.fillStyle = "white";
            context.fillText("Game Over!", gameWidth / 2, gameHeight / 2);
            console.log(score);
        }
    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);
    const dark = new Dark(canvas.height, canvas.width);
    // const eye = new Eye(canvas.width, canvas.height);

    // let lastTime = 0;
    // let entityTimer = 0;
    // let entityInterval = 500;
    // let randomEntityInterval = Math.random() * 100 + 20;

    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        pauser(input);
        if(!pause){
            Timer(input);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            background.draw(ctx);
            background.update(input);
            dark.draw(ctx);
            dark.update(input);
            player.draw(ctx);
            player.update(input, deltaTime);
            displayText(ctx, canvas.width, canvas.height);
        }
        if(!gameOver){requestAnimationFrame(animate);}
    }
    animate(0);
});
