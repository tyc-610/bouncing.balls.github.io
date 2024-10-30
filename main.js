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
    if (!(this === balls[j])&&balls[j].exists) {
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
    true,
    randomColor(),
    size
  );
  balls.push(ball);//添加到数组
}
function shape(x,y,velX,velY,){
  this.x=x;
  this.y=y;
  this.velX=velX;
  this.velY=velY;
}
// 定义 Ball 构造器
function Ball(x, y, velX, velY, exists,color, size) {
  shape.call(this,x,y,velX,velY);//继承shape
  this.exists = exists;//是否存在
  this.color = color;//颜色
  this.size = size;//大小
  Ball.constructor = Ball;//构造器
}
// 定义 EvilCircle 构造器
function EvilCircle(x, y) {
  shape.call(this,x,y,20,20);//继承shape
  this.color = 'white';//颜色
  this.size = 10;//大小
  EvilCircle.constructor = EvilCircle;//构造器
}
// 定义 EvilCircle draw 方法
EvilCircle.prototype.draw = function() {
  ctx.beginPath();//开始绘制
  ctx.lineWidth = 3;//线宽
  ctx.strokeStyle = this.color;//填充颜色
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);//绘制圆
  ctx.stroke();//填充
}
// 定义 EvilCircle checkBounds 方法
EvilCircle.prototype.update = function() {
  if ((this.x + this.size) >= width) {//右边界
    this.x = width - this.size;
  }

  if ((this.x - this.size) <= 0) {//左边界
    this.x = width - this.size;
  }

  if ((this.y + this.size) >= height) {//下边界
    this.y = height - this.size;
  }

  if ((this.y - this.size) <= 0) {//上边界
    this.y = height - this.size;
  }
}
//定义 EvilCircle setControls 方法
EvilCircle.prototype.setControls = function() {
  let _this = this;
  window.onkeydown = function(e) {
    if (e.key === 'a') {
      _this.x -= _this.velX;
    } else if (e.key === 'd') {
      _this.x += _this.velX;
    } else if (e.key === 'w') {
      _this.y -= _this.velY;
    } else if (e.key === 's') {
      _this.y += _this.velY;
    }
  }
}
// 定义 EvilCircle collisionDetect 方法
EvilCircle.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (balls[j].exists) {
      const dx = this.x - balls[j].x;//x坐标差
      const dy = this.y - balls[j].y;//y坐标差
      const distance = Math.sqrt(dx * dx + dy * dy);
      // 如果两球相撞
      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;//被吃掉的球不存在
        this.size += balls[j].size; // 恶魔圈变大
        this.color = balls[j].color; // 恶魔圈变成被吃掉小球的颜色
      }
    }
  }

  // 检查是否所有球都被吃掉
  if (balls.filter(ball => ball.exists).length === 0) {
    para.textContent = '游戏结束';
    setTimeout(() => {
      location.reload(); // 5秒后刷新页面
    }, 5000);
  }
}
// 创建一个变量存储段落的引用
const para = document.querySelector('p');

// 更新段落显示球的数量
function updateBallCount() {
  para.textContent = `还剩: ${balls.filter(ball => ball.exists).length}个球`;
}

// 初始化球数显示
updateBallCount();

// 修改 loop 函数，确保每次循环时更新球数显示
const evil = new EvilCircle(50, 50);//生成恶魔圈
evil.setControls();//设置控制

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';//半透明黑色
  ctx.fillRect(0, 0, width, height);//填充矩形

  evil.collisionDetect();//检测碰撞
  evil.draw();//绘制恶魔圈
  evil.update();//更新恶魔圈
  
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      balls[i].draw();//绘制球
      balls[i].update();//更新球的位置
      balls[i].collisionDetect();//检测碰撞
    }
  }
  updateBallCount(); // 更新球数显示
  requestAnimationFrame(loop);//递归调用
}
loop();//调用loop函数
