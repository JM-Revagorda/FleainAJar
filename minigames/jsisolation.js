window.addEventListener('load', function(){
    const canvas = document.getElementById("mainarea");
    const ctx = canvas.getContext("2d");
    canvas.width = 6400;
    canvas.height = 3000;
    let nonplayer = [];

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

        //     //Change opacity of NPC
        //     npcs.forEach(npcs=> {
        //         const dx = npcs.x - this.x;
        //         const dy = npcs.y - this.y;
        //         const distance = Math.sqrt(dx*dx + dy*dy);

        //         npcs.opacity = (distance + npcs.width / 2 + this.radiu/2) / this.radius;
        //         console.log(npcs.opacity);
        //     })
        }
    }

    class NPC{
        constructor(gameWidth, gameHeight){
            this.gameHeight = gameHeight;
            this.gameWidth = gameWidth;
            this.x = Math.random() * this.gameWidth;
            this.y = Math.random() * this.gameHeight;
            this.width = 300;
            this.height = 300;
            this.opacity = 1;
        }
        draw(context){
            context.fillStyle = "rgba(0, 0, 0, " + this.opacity + ")";
            context.fillRect(this.x, this.y, this.width, this.height);
        }
        update(context, player){
            let dx = (this.x + this.width / 2) - (player.x + player.width/2);
            let dy = (this.y + this.height / 2) - (player.y + player.height/2);
            let distance = Math.sqrt(dx*dx + dy*dy);

            let opacityChange = ((distance - player.radius) / distance) * 4;

            this.opacity = opacityChange;
        }
    }

    const input = new InputHandler();
    for(let i = 0; i < 30; i++)
        nonplayer[i] = new NPC(canvas.width, canvas.height);
    const player = new Player(canvas.width, canvas.height);
    
    function animate(){
        for(var i = 0; i < 11; i++){
            nonplayer[i].draw(ctx);
            // nonplayer[i].update(ctx);
        }
        ctx.clearRect(0,0, canvas.width, canvas.height);
        player.draw(ctx);
        player.update(input);
        for(var i = 0; i < 30; i++){
            nonplayer[i].draw(ctx);
            nonplayer[i].update(ctx, player);
        }
        requestAnimationFrame(animate);
    }
    animate();
});