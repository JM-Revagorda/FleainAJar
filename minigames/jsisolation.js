window.addEventListener('load', function(){
    const canvas = document.getElementById("mainarea");
    const ctx = canvas.getContext("2d");
    canvas.width = 3200;
    canvas.height = 2000;

    class InputHandler{
        constructor(){
            this.keys = [];
            window.addEventListener('keydown', e => {
                if ((e.key == "ArrowUp" ||
                    e.key == "ArrowDown" ||
                    e.key == "ArrowLeft" ||
                    e.key == "ArrowRight") 
                    && this.keys.indexOf === -1){
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
            this.speed = 0;
        }
        draw(context){
            context.fillStyle = "red";
            context.fillRect(this.x, this.y, this.width, this.height);
        }
        update(input){
            //Vertical Movement
            // if(input.keys.indexOf("ArrowUp") > -1){ 
            //     this.speedY = -5;
            // } else if (input.keys.indexOf("ArrowDown") > -1){ 
            //     this.speedY = 5;
            // }
            // else {
            //     this.speedY = 0;
            // }

            //Horizontal Movement
            if (input.keys.indexOf('ArrowRight') > -1){
                this.speed = 5;
            } else if(inputs.keys.indexOf("ArrowLeft") > -1){
                this.speed = -5;
            } else{this.speed = 0;}

            this.x += this.speed;
            // this.y += this.speedY;
        }
    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);

    function animate(){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        player.draw(ctx);
        player.update(input);
        requestAnimationFrame(animate);
    }
    animate();
});