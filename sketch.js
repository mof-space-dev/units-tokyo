/**
 * UNITS Tokyo - Ice Blue Edition
 * タワーの赤とビルのアイスブルーが響き合う、現代の夜景
 */

let buildings = [];
let stars = [];
let cloudOffset = 0;
let titleText = "UNITS Tokyo";

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // ビル群の生成
  for (let i = 0; i < 60; i++) {
    buildings.push({
      x: random(-width * 0.8, width * 0.8),
      w: random(100, 250),
      h: random(height * 0.1, height * 0.65), 
      z: random(0.8, 2.0),
      seed: random(1000)
    });
  }

  // 星の生成
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: random(width),
      y: random(height * 0.6),
      size: random(1, 2.5),
      t: random(PI)
    });
  }
  noSmooth(); 
}

function draw() {
  background(4, 4, 10); 

  // 全体の呼吸（ごくわずかなズーム）
  let breathing = map(sin(frameCount * 0.008), -1, 1, 1.0, 1.015);
  
  push();
  translate(width / 2, height / 2);
  scale(breathing);
  translate(-width / 2, -height / 2);

  drawStars();
  drawDriftingClouds();
  drawRoughCalmNoise();
  drawPaleMoon();

  push();
  translate(width / 2, height);

  // 東京タワー
  push();
  translate(0, -height * 0.02); 
  drawGlowingTower();
  pop();

  // ビル群（アイスブルー強化版）
  drawBuildingForest();
  pop();
  
  drawTitle();
  pop(); 

  // 走査線（ビルの発色を邪魔しないよう少し薄めに）
  drawCRTEffect();
}

function drawBuildingForest() {
  buildings.sort((a, b) => a.z - b.z);
  for (let b of buildings) {
    let bx = b.x / b.z;
    let bw = b.w / b.z;
    let bh = b.h / b.z;
    
    fill(2, 2, 8);
    
    // --- アイスブルーの二重縁取り ---
    // 1. 外側の滲み（グロー効果）
    stroke(100, 220, 255, 40); 
    strokeWeight(4);
    rect(bx - bw/2, 0, bw, -bh);
    
    // 2. 内側の芯（メインのライン）
    stroke(100, 220, 255, 180); 
    strokeWeight(1.5);
    rect(bx - bw/2, 0, bw, -bh);
    
    drawWindows(bx - bw/2, -bh, bw, bh, b.seed);
  }
}

function drawTitle() {
  push();
  textAlign(RIGHT, BOTTOM);
  textFont('sans-serif'); 
  textSize(16);
  let tAlpha = map(sin(frameCount * 0.01), -1, 1, 60, 120);
  fill(255, tAlpha);
  text(titleText, width - 40, height - 40);
  pop();
}

function drawDriftingClouds() {
  push();
  noStroke();
  let res = 20;
  cloudOffset += 0.0012;
  for (let x = 0; x < width; x += res) {
    for (let y = 0; y < height * 0.7; y += res) {
      let n = noise(x * 0.003, y * 0.005, cloudOffset);
      if (n > 0.45) {
        fill(70, 80, 120, (n - 0.45) * 30); // 雲も少し青に寄せて統一感を
        rect(x, y, res, res);
      }
    }
  }
  pop();
}

// --- 共通描画関数群 ---
function drawStars() {
  push();
  for (let s of stars) {
    let brightness = map(sin(frameCount * 0.02 + s.t), -1, 1, 40, 160);
    stroke(255, 255, 255, brightness);
    strokeWeight(s.size);
    point(s.x, s.y);
  }
  pop();
}

function drawPaleMoon() {
  push();
  let mx = width * 0.75, my = height * 0.15, mSize = 55;
  noStroke();
  for(let i = 12; i > 0; i--) {
    fill(255, 255, 210, 12 - i);
    ellipse(mx, my, mSize + i * 4);
  }
  fill(255, 255, 230, 180);
  ellipse(mx, my, mSize);
  fill(4, 4, 10); 
  ellipse(mx - 12, my - 4, mSize);
  pop();
}

function drawRoughCalmNoise() {
  push(); noStroke();
  let grainSize = 5;
  for (let i = 0; i < 100; i++) {
    let x = random(width), y = random(height);
    let n = noise(x * 0.01, y * 0.01, frameCount * 0.004);
    fill(60, 80, 100, n * 20); 
    rect(x, y, grainSize, grainSize);
  }
  pop();
}

function drawGlowingTower() {
  let h = height * 0.88, baseW = 170;      
  let pulse = sin(frameCount * 0.07);
  let flashAlpha = map(pulse, -1, 1, 150, 255);
  let glowSize = map(pulse, -1, 1, 5, 12);
  noFill();
  for (let i = 4; i > 0; i--) {
    stroke(255, 20, 0, flashAlpha / (i * 2.5));
    strokeWeight(i * glowSize);
    drawTowerPath(baseW, h);
  }
  stroke(255, 215, 215, flashAlpha);
  strokeWeight(2.5);
  drawTowerPath(baseW, h);
}

function drawTowerPath(baseW, h) {
  beginShape();
  for (let i = 0; i <= 1; i += 0.05) {
    let tx = baseW * pow(1 - i, 2.6) + 15;
    vertex(-tx, -i * h);
  }
  for (let i = 1; i >= 0; i -= 0.05) {
    let tx = baseW * pow(1 - i, 2.6) + 15;
    vertex(tx, -i * h);
  }
  endShape(CLOSE);
  rectMode(CENTER);
  rect(0, -h * 0.38, 65, 22); rect(0, -h * 0.62, 38, 14);
}

function drawWindows(x, y, w, h, s) {
  let cols = floor(w / 16), rows = floor(h / 24);
  fill(200, 240, 255, 100); // 窓もアイスブルー系に
  noStroke();
  for (let i = 1; i < cols; i++) {
    for (let j = 1; j < rows; j++) {
      if (noise(i, j, frameCount * 0.006 + s) > 0.72) {
        rect(x + i * 16, y + j * 24, 2, 3);
      }
    }
  }
}

function drawCRTEffect() {
  stroke(0, 35); // 視認性のために少し薄く調整
  strokeWeight(2);
  for (let i = 0; i < height; i += 6) line(0, i, width, i);
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }