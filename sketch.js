// MIT License
//
// Copyright (c) 2019 Rudy Darth Castan, Minui Lee
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


let player;
let bombs = [];
let lives = 3;
let score = 0;
let isPause = true;
let bombsPerFrame = 0.005;
let bombsToSpawn = 3;
let scoreEffect = 1;
let screenShakeTime = 0;

let timestamp;

function preload() {
  soundPreload();
}

function setup() {
  createCanvas(800, 600);
  player = new Player();
  createBombPool();
  timestamp = millis();
}

function draw() {
  background('#DAF0EE');
  let current_timestamp = millis();
  let delta_time = (current_timestamp - timestamp) / 1000;
  timestamp = current_timestamp;

  if (isPause) {
    textSize(32);
    strokeWeight(5);
    stroke(0);
    fill('Aquamarine');
    textAlign(CENTER);
    text(score, width / 2, height / 2);
    text("Click any mouse button to play again!", width / 2, height / 2 + 30);
    return;
  }

  player.Update(delta_time);

  bombsToSpawn += bombsPerFrame;
  bombsPerFrame += 0.01 * delta_time;

  for (let b of bombs) {
    if (b.isDead && bombsToSpawn >= 1) {
      b.Reset(player.pos);
      bombsToSpawn--;
    }

    b.Update(delta_time);

    if (!player.isInvulnrable && !b.isDead) {
      if (b.isExploding && playerVsBomb(b)) {
        lives--;
        playLoseLifeSfx();
        player.OnBombCollide(b);
        screenShakeTime = bombs.length / 3;
      }
    }

    if (screenShakeTime > 0) {
      applyMatrix(1, 0, 0, 1, random(-0.2, 0.2), random(-0.2, 0.2));
      b.Draw();
      screenShakeTime -= delta_time;
    } else
      b.Draw();
  }

  if (lives <= 0 && screenShakeTime <= 0)
    isPause = true;

  player.Draw();

  score++;
  displayStatus();
}

function playerVsBomb(bomb) {
  let difference = p5.Vector.sub(player.pos, bomb.pos);
  let distanceSquared = p5.Vector.dot(difference, difference);
  let radiusSquared = player.radius + bomb.blastRadius;
  radiusSquared *= radiusSquared;

  return (distanceSquared < radiusSquared);
}

function mousePressed() {
  if (isPause) {
    score = 0;
    isPause = false;
    lives = 3;
    bombsPerFrame = 0.005;
    bombsToSpawn = 3;
    createBombPool();
    playStartGameSfx();
  }
}

function createBombPool() {
  while (bombs.length < 200)
    bombs.push(new Bomb());

  for (let b of bombs) {
    b.ShutDown();
  }
}

function displayStatus() {
  textSize(32);
  strokeWeight(5);
  stroke(0);
  fill('Aquamarine');
  textAlign(LEFT);
  text(lives, 10, 30);
  if (score % 100 == 0)
    scoreEffect = 1.2;
  if (scoreEffect > 1) {
    fill(114, 229, 190);
    textSize(32 * scoreEffect);
    scoreEffect -= 0.01;
  } else
    textSize(32);

  text(score, 10, 70);
}