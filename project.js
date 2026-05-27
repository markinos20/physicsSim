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
        ballGravFrame();
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
function updateText(){  document.getElementById("count").innerText = balls.length;  }

function clear(){
    balls.length = 0;
    updateText();
}

buttonB.addEventListener("click",spawnball);
buttonC.addEventListener("click",clear);
/*end ball sim*/

/*gravity sim*/
const buttonC1 = document.getElementById('clearGame1');
const game1 = document.getElementById('Game1');
const ctx1 = game1.getContext('2d');
const ballsGrav = [];
function spawnballGrav(){
    const rect = game1.getBoundingClientRect();
    const mass = Math.random() * 90 + 10;
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;

    // tangent velocity respect to center at start
    const cx = game1.width / 2;
    const cy = game1.height / 2;
    const dx = cursorX - cx;
    const dy = cursorY - cy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const speed = 0.3; // tweakable
    const vx = -dy / dist * speed;
    const vy =  dx / dist * speed;

    ballsGrav.push({
        m: mass,
        r: mass / 6,
        x: cursorX,
        y: cursorY,
        vx: vx,
        vy: vy,
        color: `hsl(${Math.random()*360},75%, 60%)`,
    });
}
function ballGravFrame(){
    if(activeGame === document.getElementById('game-section2') && vbl === true){
        const G = document.getElementById('gravconsSlide').value/1000;
        ctx1.clearRect(0, 0, game1.width, game1.height);
        for(let b of ballsGrav){
            b.x += b.vx;
            b.y += b.vy;
            for(let other of ballsGrav){
                if(other === b) continue;                
                const dx = other.x - b.x;
                const dy = other.y - b.y;
                const minDist = other.r + b.r;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const nx = dx / dist;
                const ny = dy / dist;
                const F = G*b.m*other.m/((dist**2)+500);
                const ax = nx * F / b.m;
                const ay = ny * F / b.m;
                b.vx += ax;
                b.vy += ay;
            }
            ctx1.beginPath();
            ctx1.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx1.fillStyle = b.color;
            ctx1.fill();
        }
        requestAnimationFrame(ballGravFrame);
    }
}
function clearGrav(){   ballsGrav.length = 0;   }
buttonC1.addEventListener("click",clearGrav);
game1.addEventListener("click",spawnballGrav);
/*end gravity sim*/

/*end games*/
