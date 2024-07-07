window.addEventListener('load', function(){
    const canvas = document.getElementById("mainarea");
    const ctx = canvas.getContext("2d");
    canvas.width = 3200;
    canvas.height = 1500;

    class InputHandler{
        constructor(){
            this.keys = [];
            window.addEventListener('keydown', e => {
                if ((e.key == "ArrowUp" ||
                    e.key == "ArrowDown" ||
                    e.key == "ArrowLeft" ||
                    e.key == "ArrowRight") 
                    && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                }
            });
            window.addEventListener('keyup', e => {
                if (e.key == "ArrowUp" ||
                    e.key == "ArrowDown" ||
                    e.key == "ArrowLeft" ||
                    e.key == "ArrowRight"){
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            console.log(e.key, this.keys);
            });
        }        
    }

    class Player{
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = (this.width + this.gameWidth) / 2;
            this.y = (this.height + this.gameHeight) / 2;
            this.speedX = 0;
            this.speedY = 0;
            this.radius = 300;
        }
        draw(context){
            context.fillStyle = "red";
            context.fillRect(this.x, this.y, this.width, this.height);
            context.beginPath();
            context.arc(this.x + this.width / 2, this.y + this.height / 2, this.radius, 0, 2 * Math.PI);
            context.stroke();
        }
        update(input){
            //Vertical Movement
            if(input.keys.indexOf("ArrowUp") > -1){ 
                this.speedY = -5;
            } else if (input.keys.indexOf("ArrowDown") > -1){ 
                this.speedY = 5;
            }
            else {
                this.speedY = 0;
            }

            //Horizontal Movement
            if (input.keys.indexOf("ArrowRight") > -1){
                this.speedX = 5;
            }
            else if(input.keys.indexOf("ArrowLeft") > -1){
                this.speedX = -5;
            } else{this.speedX = 0;}

            this.x += this.speedX;
            this.y += this.speedY;
        }
    }

    class NPC{
        constructor(gameWidth, gameHeight){
            this.gameHeight = gameHeight;
            this.gameWidth = gameWidth;
            this.x = Math.random() * this.gameWidth;
            this.y = Math.random() * this.gameHeight;
            this.width = 300;
            this.height = 500;
        }
        draw(context){
            context.fillStyle = "black";
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const nonplayer = new NPC(canvas.width, canvas.height);

    function animate(){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        player.draw(ctx);
        player.update(input);
        nonplayer.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});