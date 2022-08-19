
const SNAKE_RECT_SIZE = 20;
const Directions =  {
    LEFT: 1,
    RIGHT: 2,
    UP: 3,
    DOWN: 4,
}

class Snake {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.width = 800;
        this.height = 500;
        this.food = {};
        this.init();
    }

    // 初始化配置
    init() {
        // 方向
        this.direction = Directions.LEFT;

        const startX = this.width / 2 - SNAKE_RECT_SIZE / 2;
        const startY = this.height / 2 - SNAKE_RECT_SIZE / 2
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

        this.render();
        this.listenEvent(); // 初始化按键
    }

    // 检查是不是在蛇身上
    isInSnake(x, y) {
        for (const item of this.body) {
            if (x >= item.x && x <= item.x + SNAKE_RECT_SIZE && y >= item.y && y <= item.y + SNAKE_RECT_SIZE) {
                return true;
            }
        }
        return false;
    }

    getRandomFood() {
        return { x: Math.trunc(Math.random() * this.width - SNAKE_RECT_SIZE), y: Math.trunc(Math.random() * this.height - SNAKE_RECT_SIZE) }
    }

    generateFood() {
        let pos = this.getRandomFood();
        while (this.isInSnake(pos.x, pos.y)) {
            // 如果随机数生成到了蛇身上就重新生成
            pos = this.getRandomFood();
        }
        this.food = pos;
    }

    render() {
        setInterval(() => {
            this.ctx.clearRect(0, 0, this.width, this.height)
            // 绘制食物
            this.ctx.strokeRect(this.food.x, this.food.y, SNAKE_RECT_SIZE, SNAKE_RECT_SIZE);
            // 绘制蛇
            for (let item of this.body) {
                this.ctx.strokeRect(item.x, item.y, SNAKE_RECT_SIZE, SNAKE_RECT_SIZE);
            }
            this.move();
        }, 100)
    }

    move() {
        const head = {...this.body[0]}; // 复制头部
        switch (this.direction) {
            case Directions.UP: {
                if (this.direction === Directions.DOWN) return;
                let prev = head;
                this.body = this.body.map((item, index) => {
                    if (index === 0) {
                        // 如果是头部
                        item.y = item.y - SNAKE_RECT_SIZE
                    } else {
                        // 如果是身子, 向前移动
                        const tmp = {...item}; // 修改
                        item.x =  prev.x;
                        item.y = prev.y;
                        prev = tmp;
                    }
                    return item;
                })
                break
            }
            case Directions.LEFT: {
                if (this.direction === Directions.RIGHT) return;

                let prev = head;
                this.body = this.body.map((item, index) => {
                    if (index === 0) {
                        // 如果是头部
                        item.x = item.x - SNAKE_RECT_SIZE
                    } else {
                        // 如果是身子, 向前移动
                        const tmp = {...item}; // 修改
                        item.x =  prev.x;
                        item.y = prev.y;
                        prev = tmp;
                    }
                    return item;
                })
                break
            }
            case Directions.RIGHT: {
                if (this.direction === Directions.LEFT) return;

                let prev = head;
                this.body = this.body.map((item, index) => {
                    if (index === 0) {
                        // 如果是头部
                        item.x = item.x + SNAKE_RECT_SIZE
                    } else {
                        // 如果是身子, 向前移动
                        const tmp = {...item}; // 修改
                        item.x =  prev.x;
                        item.y = prev.y;
                        prev = tmp;
                    }
                    return item;
                })
                break
            }
            case Directions.DOWN:{
                if (this.direction === Directions.UP) return;
                let prev = head;
                this.body = this.body.map((item, index) => {
                    if (index === 0) {
                        // 如果是头部
                        item.y = item.y + SNAKE_RECT_SIZE
                    } else {
                        // 如果是身子, 向前移动
                        const tmp = {...item}; // 修改
                        item.x =  prev.x;
                        item.y = prev.y;
                        prev = tmp;
                    }
                    return item;
                })
                break
            }
        }
    }

    listenEvent() {
        document.onkeydown = (e) => {
            const evt = e || window.event;
            console.log("event =", e);
            switch(evt.key) {
                case 'ArrowLeft':
                    if (this.direction === Directions.RIGHT) return;
                    this.direction = Directions.LEFT;
                    break;
                case 'ArrowUp':
                    if (this.direction === Directions.DOWN) return;
                    this.direction = Directions.UP;
                    break;
                case 'ArrowRight':
                    if (this.direction === Directions.LEFT) return;
                    this.direction = Directions.RIGHT;
                    break;
                case 'ArrowDown':
                    if (this.direction === Directions.UP) return;
                    this.direction = Directions.DOWN;
                    break;
            }
        }
    }
}

export default Snake;