/*selec menu*/
let trg = false;
document.getElementById('sim').addEventListener("click",function(){
    if(trg === false){
        document.getElementById('selection-menu').style.visibility = "visible";
        document.getElementById('selection-menu').style.opacity = "1";
        trg = true;
    } else{
        document.getElementById('selection-menu').style.visibility = "hidden";
        document.getElementById('selection-menu').style.opacity = "0";
        trg = false;
    }
});

let prevGame;
let activeGame;
let vbl = false;

document.getElementById('n1').addEventListener("click",function(){
    if(prevGame){
        if(prevGame != document.getElementById('game-section1')) {
            prevGame.style.visibility = 'hidden';
            prevGame.style.opacity = '0';
        }
    }
    activeGame = document.getElementById('game-section1');
    const alreadyOpen = (activeGame === prevGame && activeGame.style.visibility === 'visible');
    if(!alreadyOpen){
        activeGame.style.visibility = 'visible';
        activeGame.style.opacity = '1';
        vbl = true;
        ballFrame();
    } else{
        activeGame.style.visibility = 'hidden';
        activeGame.style.opacity = '0';
        vbl = false;
    }
    prevGame = activeGame;
});

document.getElementById('n2').addEventListener("click",function(){
    if(prevGame){
        if(prevGame != document.getElementById('game-section2')) {
            prevGame.style.visibility = 'hidden';
            prevGame.style.opacity = '0';
        }
    }
    activeGame = document.getElementById('game-section2');
    const alreadyOpen = (activeGame === prevGame && activeGame.style.visibility === 'visible');
    if(!alreadyOpen){
        activeGame.style.visibility = 'visible';
        activeGame.style.opacity = '1';
        vbl = true;
    } else{
        activeGame.style.visibility = 'hidden';
        activeGame.style.opacity = '0';
        vbl = false;
    }
    prevGame = activeGame;
});
/*end selec menu*/

/*games*/

/*ball sim*/
const game = document.getElementById('Game');
const ctx = game.getContext('2d');
const buttonB = document.getElementById('trigGame');
const buttonC = document.getElementById('clearGame');
const balls = [];
const friction = 0.98;
function spawnball(){
    const direction = Math.random() < 0.5 ? -1 : 1;
    const size = Math.random()*3.5+10;
    balls.push({
        dir: direction,
        r: size,
        x: game.width/2,
        y: 10,
        vx: 20*direction/size,
        vy: 0,
        color: `hsl(${Math.random()*360},50%, 60%)`,
    });
    updateText();
};
function ballFrame(){
    if(activeGame === document.getElementById('game-section1') && vbl === true){
        const bounce = document.getElementById('bounceSlide').value/100;
        const gravity = document.getElementById('gravitySlide').value/100;
        ctx.clearRect(0, 0, game.width, game.height);
        for(let b of balls){
            b.vy += gravity;
            b.y += b.vy;
            b.x += b.vx;
            if(b.y + b.r > game.height){
                b.y = game.height - b.r;
                b.vy *= -bounce;
                b.vx *= friction;
            }
            if(b.y - b.r < 0){
                b.y = b.r;
                b.vy *= -bounce;
            }
            if(b.x - b.r < 0){
                b.x = b.r;
                b.vx *= -bounce;
            }
            if(b.x + b.r > game.width){
                b.x = game.width - b.r;
                b.vx *= -bounce;
            }
            /*collision detection*/
            for(let other of balls){
                if(other === b) continue;
                const dx = other.x - b.x;
                const dy = other.y - b.y;
                const minDist = other.r + b.r;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < minDist){
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const overlap = minDist-dist;
                    b.x -= nx*overlap/2;
                    b.y -= ny*overlap/2;
                    other.x += nx*overlap/2;
                    other.y += ny*overlap/2;
                    const dvx = b.vx - other.vx;
                    const dvy = b.vy - other.vy;
                    const dot = dvx*nx + dvy*ny;
                    b.vx -= dot*nx;
                    b.vy -= dot*ny;
                    other.vx += dot*nx;
                    other.vy += dot*ny;
                }
            }
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.fill();
        }
        requestAnimationFrame(ballFrame);
    }
}
buttonB.addEventListener("click",spawnball);

function clear(){
    balls.length = 0;
    updateText();
}
buttonC.addEventListener("click",clear);

function updateText(){
    document.getElementById("count").innerText = balls.length;
}
/*end ball sim*/

/*gravity sim*/

/*end gravity sim*/

/*end games*/
