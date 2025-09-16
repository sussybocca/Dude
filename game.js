const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let keys = {};
let score = 0;

// ----------------- Player -----------------
class Player {
  constructor(){
    this.w = 50; this.h = 50;
    this.x = canvas.width/2; this.y = canvas.height-100;
    this.speed = 6; this.color = "gold";
    this.hammer = 0; this.maxHammer = 100;
    this.dx = 0; this.dy = 0;
  }
  move(){
    if(keys["a"]||keys["ArrowLeft"]) this.dx=-this.speed;
    else if(keys["d"]||keys["ArrowRight"]) this.dx=this.speed;
    else this.dx=0;
    if(keys["w"]||keys["ArrowUp"]) this.dy=-this.speed;
    else if(keys["s"]||keys["ArrowDown"]) this.dy=this.speed;
    else this.dy=0;
    this.x+=this.dx; this.y+=this.dy;
    this.x=Math.max(0,Math.min(canvas.width-this.w,this.x));
    this.y=Math.max(0,Math.min(canvas.height-this.h,this.y));
  }
  draw(){
    ctx.fillStyle=this.color;
    ctx.fillRect(this.x,this.y,this.w,this.h);
    ctx.fillStyle="white";
    ctx.fillRect(this.x,this.y-10,this.w*(this.hammer/this.maxHammer),5);
  }
}

// ----------------- Gmunk Enemy -----------------
class Gmunk {
  constructor(){
    this.w=40; this.h=40;
    this.x=Math.random()*(canvas.width-50)+25;
    this.y=-50;
    this.color="purple"; this.speed=2+Math.random()*2;
    this.cooldown=0;
  }
  update(){
    this.y+=this.speed;
    this.cooldown++;
    if(this.cooldown>100){
      this.cooldown=0;
      let abilities=["shrink","stun","freeze","hdhd","laser"];
      let ab=abilities[Math.floor(Math.random()*abilities.length)];
      projectiles.push(new Projectile(this.x+this.w/2,this.y+this.h,ab));
    }
  }
  draw(){
    ctx.fillStyle=this.color;
    ctx.fillRect(this.x,this.y,this.w,this.h);
  }
}

// ----------------- Obstacle -----------------
class Obstacle {
  constructor(){
    this.w=60; this.h=20;
    this.x=Math.random()*(canvas.width-60);
    this.y=-20;
    this.color="grey"; this.speed=3+Math.random()*3;
  }
  update(){ this.y+=this.speed; }
  draw(){ ctx.fillStyle=this.color; ctx.fillRect(this.x,this.y,this.w,this.h); }
}

// ----------------- Projectile -----------------
class Projectile {
  constructor(x,y,ability){
    this.x=x; this.y=y;
    this.w=10; this.h=10;
    this.speed=6; this.color="cyan"; this.ability=ability;
  }
  update(){ this.y+=this.speed; }
  draw(){ ctx.fillStyle=this.color; ctx.fillRect(this.x,this.y,this.w,this.h); }
}

// ----------------- Globals -----------------
let player=new Player();
let gmunks=[], obstacles=[], projectiles=[], hallucinations=[];
let blinkTimer=0, BLINK_INTERVAL=5000;

// ----------------- Game Mechanics -----------------
function handleHammer(){
  if(keys[" "]){
    player.hammer+=2;
    if(player.hammer>=player.maxHammer){
      player.hammer=0;
      hallucinations.push({x:player.x,y:player.y,r:200,t:100});
      gmunks=[]; obstacles=[];
      score+=50;
    }
  }
}

function handleProjectiles(){
  for(let i=projectiles.length-1;i>=0;i--){
    let p=projectiles[i]; p.update();
    if(p.y>canvas.height) projectiles.splice(i,1);
    else if(collide(p,player)){
      if(p.ability==="shrink"){player.w/=2;player.h/=2;}
      if(p.ability==="stun"){player.speed=0;setTimeout(()=>player.speed=6,1000);}
      if(p.ability==="freeze"){player.dx=0;player.dy=0;}
      if(p.ability==="hdhd"){
        let id=setInterval(()=>{player.dx=(Math.random()-0.5)*14;player.dy=(Math.random()-0.5)*14;},100);
        setTimeout(()=>{clearInterval(id);player.dx=0;player.dy=0;},2000);
      }
      if(p.ability==="laser"){score-=10;}
      projectiles.splice(i,1);
    }
  }
}

function handleHallucinations(){
  blinkTimer+=16;
  if(blinkTimer>=BLINK_INTERVAL){
    blinkTimer=0;
    hallucinations.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:50+Math.random()*100,t:50});
  }
  for(let i=hallucinations.length-1;i>=0;i--){
    let h=hallucinations[i];
    ctx.fillStyle="magenta"; ctx.beginPath();
    ctx.arc(h.x,h.y,h.r,0,Math.PI*2); ctx.fill();
    h.t--; if(h.t<=0) hallucinations.splice(i,1);
  }
}

function collide(a,b){
  return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
}

// ----------------- Game Loop -----------------
function gameLoop(){
  ctx.fillStyle="black"; ctx.fillRect(0,0,canvas.width,canvas.height);
  player.move(); handleHammer(); handleProjectiles();
  if(Math.random()<0.01) gmunks.push(new Gmunk());
  gmunks.forEach(g=>{g.update();g.draw();});
  gmunks=gmunks.filter(g=>g.y<canvas.height);
  if(Math.random()<0.02) obstacles.push(new Obstacle());
  obstacles.forEach(o=>{o.update();o.draw();});
  obstacles=obstacles.filter(o=>o.y<canvas.height);
  projectiles.forEach(p=>p.draw());
  handleHallucinations();
  player.draw();
  ctx.fillStyle="white"; ctx.fillText("Score: "+score,10,20);
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown",e=>keys[e.key]=true);
document.addEventListener("keyup",e=>keys[e.key]=false);

// Fake loading screen
setTimeout(()=>{document.getElementById("loading").style.display="none";},3000);

gameLoop();