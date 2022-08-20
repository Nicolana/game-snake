// 蛇的格子大小
const SNAKE_RECT_SIZE = 20;
const Directions = {
  LEFT: 1,
  RIGHT: 2,
  UP: 3,
  DOWN: 4,
};

const buttonWidth = 160;
const buttonHeight = 40;

class Snake {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
    this.width = 800;
    this.height = 500;
    this.food = {};
    this.isEnd = true; // 游戏是否结束
    this.xCount = Math.floor(this.width / SNAKE_RECT_SIZE);
    this.yCount = Math.floor(this.height / SNAKE_RECT_SIZE);
    this.button = {
      text: "开始游戏",
      x: this.width / 2 - buttonWidth / 2,
      y: (this.height - SNAKE_RECT_SIZE) / 2 + 80,
      width: buttonWidth,
      height: buttonHeight,
      radius: 5,
    };
    this.init();
  }

  // 初始化配置
  init() {
    this.initGame();
    this.render();
    this.listenEvent(); // 初始化按键
  }

  initGame() {
    // 方向
    this.direction = Directions.LEFT;

    const startX = SNAKE_RECT_SIZE * 20;
    const startY = SNAKE_RECT_SIZE * 10;
    // 蛇头
    this.head = {
      x: startX,
      y: startY,
    };
    // 蛇身
    this.body = [
      this.head,
      {
        x: startX + SNAKE_RECT_SIZE,
        y: startY,
      },
      {
        x: startX + SNAKE_RECT_SIZE * 2,
        y: startY,
      },
    ];
    this.generateFood();
  }

  // 检查是不是在蛇身上
  isInSnake(x, y) {
    for (const item of this.body) {
      if (
        x >= item.x &&
        x <= item.x + SNAKE_RECT_SIZE &&
        y >= item.y &&
        y <= item.y + SNAKE_RECT_SIZE
      ) {
        return true;
      }
    }
    return false;
  }

  getRandomFood() {
    return {
      x: Math.trunc(Math.random() * this.xCount) * SNAKE_RECT_SIZE,
      y: Math.trunc(Math.random() * this.yCount) * SNAKE_RECT_SIZE,
    };
  }

  generateFood() {
    let pos = this.getRandomFood();
    while (this.isInSnake(pos.x, pos.y)) {
      // 如果随机数生成到了蛇身上就重新生成
      pos = this.getRandomFood();
    }
    this.food = pos;
  }

  drawButton({ text, x, y, width, height, radius }) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + radius);
    this.ctx.lineTo(x, y + height - radius);
    this.ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    this.ctx.lineTo(x + width - radius, y + height);
    this.ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width,
      y + height - radius
    );
    this.ctx.lineTo(x + width, y + radius);
    this.ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    this.ctx.lineTo(x + radius, y);
    this.ctx.quadraticCurveTo(x, y, x, y + radius);
    this.ctx.fillStyle = "#409eff"; //设置线条颜色
    this.ctx.fill(); //用于绘制线条

    var xoffset = this.ctx.measureText(text).width;
    this.ctx.beginPath();
    this.ctx.font = "24px Verdana";
    this.ctx.fillStyle = "#ffffff";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, x + width / 2, y + height / 2, width);
    this.ctx.closePath();
    this.ctx.restore();
  }

  render() {
    setInterval(() => {
      if (!this.isEnd) {
        // 游戏没有结束
        this.ctx.clearRect(0, 0, this.width, this.height);
        // 绘制食物
        this.ctx.fillRect(
          this.food.x,
          this.food.y,
          SNAKE_RECT_SIZE,
          SNAKE_RECT_SIZE
        );
        this.ctx.strokeRect(
          this.food.x,
          this.food.y,
          SNAKE_RECT_SIZE,
          SNAKE_RECT_SIZE
        );
        // 绘制蛇
        for (let item of this.body) {
          this.ctx.strokeRect(item.x, item.y, SNAKE_RECT_SIZE, SNAKE_RECT_SIZE);
        }
        this.move();
      } else {
        this.drawButton({ ...this.button });
        this.gameOver();
      }
    }, 100);
  }

  gameOver() {
    this.ctx.save();
    this.ctx.font = "36px Verdana";
    this.ctx.fillStyle = "#000000";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Game Over", this.width / 2, this.height / 2);
    this.ctx.restore();
  }

  move() {
    if (this.isEnd) return;
    let head = { ...this.body[0] }; // 复制头部
    // 墙壁检测，如果撞墙了。就GG
    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x > this.width - SNAKE_RECT_SIZE ||
      head.y > this.height - SNAKE_RECT_SIZE
    ) {
      this.isEnd = true;
      return;
    }
    switch (this.direction) {
      case Directions.UP: {
        if (this.direction === Directions.DOWN) return;
        let prev = head;
        this.body = this.body.map((item, index) => {
          if (index === 0) {
            // 如果是头部
            item.y = item.y - SNAKE_RECT_SIZE;
          } else {
            // 如果是身子, 向前移动
            const tmp = { ...item }; // 修改
            item.x = prev.x;
            item.y = prev.y;
            prev = tmp;
          }
          return item;
        });
        break;
      }
      case Directions.LEFT: {
        if (this.direction === Directions.RIGHT) return;

        let prev = head;
        this.body = this.body.map((item, index) => {
          if (index === 0) {
            // 如果是头部
            item.x = item.x - SNAKE_RECT_SIZE;
          } else {
            // 如果是身子, 向前移动
            const tmp = { ...item }; // 修改
            item.x = prev.x;
            item.y = prev.y;
            prev = tmp;
          }
          return item;
        });
        break;
      }
      case Directions.RIGHT: {
        if (this.direction === Directions.LEFT) return;

        let prev = head;
        this.body = this.body.map((item, index) => {
          if (index === 0) {
            // 如果是头部
            item.x = item.x + SNAKE_RECT_SIZE;
          } else {
            // 如果是身子, 向前移动
            const tmp = { ...item }; // 修改
            item.x = prev.x;
            item.y = prev.y;
            prev = tmp;
          }
          return item;
        });
        break;
      }
      case Directions.DOWN: {
        if (this.direction === Directions.UP) return;
        let prev = head;
        this.body = this.body.map((item, index) => {
          if (index === 0) {
            // 如果是头部
            item.y = item.y + SNAKE_RECT_SIZE;
          } else {
            // 如果是身子, 向前移动
            const tmp = { ...item }; // 修改
            item.x = prev.x;
            item.y = prev.y;
            prev = tmp;
          }
          return item;
        });
        break;
      }
    }

    head = this.body[0];
    if (head.x === this.food.x && head.y === this.food.y) {
      // 如果吃到食物了，让食物成为他的新头部
      this.body.unshift(this.food);
      // 生成新的食物
      this.generateFood();
    }

    // 咬到自己了，GG
    for (const item of this.body.slice(1)) {
      let a1 = head.x > item.x;
      let a2 = head.x < item.x + SNAKE_RECT_SIZE;
      let a3 = head.y > item.y;
      let a4 = head.y < item.y + SNAKE_RECT_SIZE;
      if (
        head.x > item.x &&
        head.x < item.x + SNAKE_RECT_SIZE &&
        head.y > item.y &&
        head.y < item.y + SNAKE_RECT_SIZE
      ) {
        debugger;
        this.isEnd = true;
        return;
      }
    }
  }

  listenEvent() {
    document.onkeydown = (e) => {
      const evt = e || window.event;
      console.log("event =", e);
      switch (evt.key) {
        case "ArrowLeft":
          if (this.direction === Directions.RIGHT) return;
          this.direction = Directions.LEFT;
          break;
        case "ArrowUp":
          if (this.direction === Directions.DOWN) return;
          this.direction = Directions.UP;
          break;
        case "ArrowRight":
          if (this.direction === Directions.LEFT) return;
          this.direction = Directions.RIGHT;
          break;
        case "ArrowDown":
          if (this.direction === Directions.UP) return;
          this.direction = Directions.DOWN;
          break;
        case " ": {
          // 按空格的时候，如果游戏没有启动，可以启动游戏
          if (!this.isEnd) return; // 游戏进行中不可点击
          this.isEnd = false; // 开启游戏
          this.initGame();
        }
      }
    };

    this.canvas.addEventListener("click", (e) => {
      if (!this.isEnd) return; // 游戏进行中不可点击
      const pos = {
        x: e.clientX - this.canvas.offsetLeft,
        y: e.clientY - this.canvas.offsetTop,
      };
      if (
        pos.x >= this.button.x &&
        pos.x <= this.button.x + this.button.width &&
        pos.y >= this.button.y &&
        pos.y <= this.button.y + this.button.height
      ) {
        this.isEnd = false; // 开启游戏
        this.initGame();
      }
    });
  }
}

export default Snake;
