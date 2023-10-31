window.addEventListener('load', function(){
    const canvas = document.getElementById("mainarea");
    const ctx = canvas.getContext('2d');
    canvas.width = 2000;
    canvas.height = 720;
    let entities = [];

    class InputHandler{
        constructor(){
            this.keys = [];
            window.addEventListener('keydown', e => {
                if (e.key === 'ArrowUp' && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                }
            });
            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowUp'){
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
        }        
    }

    class Player{
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = this.gameWidth / 2 * 1.1;
            this.y = this.gameHeight - this.height;
            this.color = 'black';
            // this.speed = 5;
        }
        draw(context){
            //fillRect(x, y, h, w) - Creates a Rectangle
            //drawImage(image *must have an <img> tag*, source x, source y, source width, source height, destx, desty, destwidth, destheight) - creates the sprites we know of today
            context.fillStyle = "black";
            context.fillRect(this.x, this.y, this.width, this.height);
        }
        update(input, context){
            if(input.keys.indexOf("ArrowUp") > -1){
                // this.speed = 0;
                this.color = 'red';
            } else {
                // this.speed = 5;
                this.color = 'blue';
            }

            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
            // this.x += this.speed;
            // if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
            // else if (this.x < 0) this.x = 0;
            // if((this.x + this.width >= this.gameWidth) || (this.x < 0)){
            //     this.speed = 0;
            // }
            // if ((input.keys.indexOf('ArrowUp') > -1)){
            //     this.x -= this.speed;
            // } else {
            //     this.x += this.speed;
            // }

            // if (this.x + this.width >= this.gameWidth){
            //     this.speed = 0;
            // }

        }
    }

    class Eye{
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 100;
            this.height = 100;
            this.x = 0;
            this.y = Math.round(Math.random(5) * 650);
            this.speed = 0;
            console.log(this.y);
            this.maxSpeed = -5;
            // this.markedForDeleting = false;
        }
        draw(context){
            context.fillStyle = 'black';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
        update(input){
            if (input.keys.indexOf("ArrowUp") > -1){
                if (this.speed > this.maxSpeed){
                    this.speed = this.maxSpeed;
                } else{
                    this.speed -= 3;
                }
            } 
            else{ 
                this.speed = Math.random() * 0.2 + 10;
            }
            this.x += this.speed;

            if(this.x < -20){
                this.x = -20;
            }
            // if (this.x >= this.gameWidth / 2 * 0.5){ 
            //     this.markedForDeleting = true;
            // }
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
    const eye = new Eye(canvas.width, canvas.height);

    let lastTime = 0;
    let entityTimer = 0;
    let entityInterval = 500;
    let randomEntityInterval = Math.random() * 100 + 20;

    function animate(timeStamp){
        // const deltaTime = timeStamp - lastTime;
        // lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.draw(ctx);
        player.update(input, ctx);
        // handleEnemies(deltaTime);
        eye.draw(ctx);
        eye.update(input);
        requestAnimationFrame(animate);
    }
    animate(0);
});