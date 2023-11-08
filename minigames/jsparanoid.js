window.addEventListener('load', function(){
    const canvas = document.getElementById("mainarea");
    const ctx = canvas.getContext('2d');
    canvas.width = 2000;
    canvas.height = 720;
    let timer = 5000;
    let entities = [];
    let gameOver = false;
    let score = 0;

    class InputHandler{
        constructor(){
            this.keys = [];
            window.addEventListener('keydown', e => {
                if ((e.key === 'ArrowUp' ||
                     e.key == " ")
                     && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                }
            });
            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowUp' ||
                    e.key == " "){
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
        }        
    }

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
                // this.speed = 0;
                // this.color = 'red';
                score += 0;
            } else {
                // this.speed = 5;
                // this.color = 'blue';
                score += 3;
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

            // context.fillStyle = this.color;
            // context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

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

    class Dark{
        constructor(gameHeight, gameWidth){
            this.gameHeight = gameHeight;
            this.gameWidth = gameWidth;
            this.width = this.gameWidth;
            this.height = this.gameHeight;
            this.opacity = 0;
            this.x = 0;
            this.y = 0;
        }
        draw(context){
            context.fillStyle = "black";
            context.fillStroke(this.x, this.y, this.width, this.height);
        }
    }
    // class Eye{
    //     constructor(gameWidth, gameHeight){
    //         this.gameWidth = gameWidth;
    //         this.gameHeight = gameHeight;
    //         this.width = 100;
    //         this.height = 100;
    //         this.x = 0;
    //         this.y = Math.round(Math.random(5) * 650);
    //         this.speed = 0;
    //         console.log(this.y);
    //         this.maxSpeed = -5;
    //         // this.markedForDeleting = false;
    //     }
    //     draw(context){
    //         context.fillStyle = 'black';
    //         context.fillRect(this.x, this.y, this.width, this.height);
    //     }
    //     update(input){
    //         if (input.keys.indexOf("ArrowUp") > -1){
    //             if (this.speed > this.maxSpeed){
    //                 this.speed = this.maxSpeed;
    //             } else{
    //                 this.speed -= 3;
    //             }
    //         } 
    //         else{ 
    //             this.speed = Math.random() * 0.2 + 10;
    //         }
    //         this.x += this.speed;

    //         if(this.x < -20){
    //             this.x = -20;
    //         }
    //         // if (this.x >= this.gameWidth / 2 * 0.5){ 
    //         //     this.markedForDeleting = true;
    //         // }
    //     }
    // }

    let steps = 0;
    function Timer(input){
        // if(entity.color != "red"){
        //     timer -= steps + 1;
        // }
        // else{
        //     timer += 3;
        // }

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

    function displayText(context, gameWidth, gameHeight){
        context.font = "20px Arial";
        context.fillStyle = "white";
        context.fillText("Timer: " + timer, 20, 50);
        context.font = "20px Arial";
        context.fillStyle = "white";
        context.fillText("Score: " + Math.round(score * 0.4), 20, 100);
        if(gameOver){
            context.font = "40px Arial";
            context.fillStyle = "white";
            context.fillText("Game Over!", gameWidth / 2, gameHeight / 2);
            console.log(score);
        }
    }
    // function handleEnemies(deltaTime){
    //     if (entityTimer > entityInterval + randomEntityInterval){
    //         entities.push(new Eye(canvas.width, canvas.height));
    //         randomEntityInterval = Math.random() * 1000 + 500;
    //         entities = 0;
    //     } else{
    //         entities += deltaTime;
    //     }
    //     entities.forEach(eye => {
    //         eye.draw(ctx);
    //         eye.update(deltaTime);
    //     });
    //         //creates a new array for all elements that passes the test, thus keeping them from being deleted. Functions similarly to GM's instance_destroy().
    //     entities = entities.filter(eye => !eye.markedForDeleting);
    // }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);
    // const eye = new Eye(canvas.width, canvas.height);

    // let lastTime = 0;
    // let entityTimer = 0;
    // let entityInterval = 500;
    // let randomEntityInterval = Math.random() * 100 + 20;

    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        Timer(input);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        background.update(input);
        player.draw(ctx);
        player.update(input, deltaTime);
        // handleEnemies(deltaTime);
        // eye.draw(ctx);
        // eye.update(input);
        displayText(ctx, canvas.width, canvas.height);
        if(!gameOver){requestAnimationFrame(animate);}
    }
    animate(0);
});