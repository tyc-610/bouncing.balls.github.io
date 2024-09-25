// 设置画布

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数

function random(min,max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}
// 生成随机颜色的函数
function randomColor() {
  return 'rgb(' +
         random(0, 255) + ', ' +
         random(0, 255) + ', ' +
         random(0, 255) + ')';
}
// 定义 Ball 构造器
function Ball(x, y, velX, velY, color, size) {
  this.x = x;//x坐标
  this.y = y;//y坐标
  this.velX = velX;//水平速度
  this.velY = velY;//垂直速度
  this.color = color;//颜色
  this.size = size;//大小
}
// 定义绘制球的方法
Ball.prototype.draw = function() {
  ctx.beginPath();//开始绘制
  ctx.fillStyle = this.color;//填充颜色
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);//绘制圆
  ctx.fill();//填充
}
// 定义更新球的方法
Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {//右边界
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {//左边界
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {//下边界
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {//上边界
    this.velY = -(this.velY);
  }

  this.x += this.velX;//更新x坐标
  this.y += this.velY;//更新y坐标
}
Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;//x坐标差
      const dy = this.y - balls[j].y;//y坐标差
      const distance = Math.sqrt(dx * dx + dy * dy);
      // 如果两球相撞
      if (distance < this.size + balls[j].size) {
        this.velX = -this.velX;
        this.velY = -this.velY;
        balls[j].velX = -balls[j].velX;
        balls[j].velY = -balls[j].velY;
        this.color = randomColor();
        balls[j].color = randomColor();
      }//颜色，速度变化
    }
  }
}
let balls = [];//存储所有球的数组
// 定义循环遍历所有球的函数
while (balls.length < 25) {//生成25个球
  let size = random(10,20);//大小
  let ball = new Ball(
    // 为避免球生成在画布边缘，x、y坐标需要减去球的大小
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    randomColor(),
    size
  );
  balls.push(ball);//添加到数组
}
// 定义一个循环来不停地播放
function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';//半透明黑色
  ctx.fillRect(0, 0, width, height);//填充矩形
  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();//绘制球
    balls[i].update();//更新球的位置
    balls[i].collisionDetect();//检测碰撞
  }
  requestAnimationFrame(loop);//递归调用
}
loop();
