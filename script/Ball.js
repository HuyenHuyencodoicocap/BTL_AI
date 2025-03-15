"use strict";

class Ball {
    constructor(initPos, color) {
        this.initPos = initPos;//vị trí ban đầu
        this.position = initPos.copy();//vị trí
        this.origin = new Vector2(25, 25);//tâm
        this.velocity = Vector2.zero;//vận tôcs
        this._color = color;
        this.moving = false;
        this.visible = true;
        this.inHole = false;
    }

    // Getter và Setter cho thuộc tính color
    get color() {
        if (this.sprite === sprites.redBall) {
            return Color.red;
        } else if (this.sprite === sprites.yellowBall) {
            return Color.yellow;
        } else if (this.sprite === sprites.blackBall) {
            return Color.black;
        } else {
            return Color.white;
        }
    }

    set color(value) {
        if (value === Color.red) {
            this.sprite = sprites.redBall;
        } else if (value === Color.yellow) {
            this.sprite = sprites.yellowBall;
        } else if (value === Color.black) {
            this.sprite = sprites.blackBall;
        } else {
            this.sprite = sprites.ball;
        }
    }

    // Hàm bắn bóng
    shoot(power, angle) {
        if (power <= 0) return;

        this.moving = true;
        this.velocity = Ball.calculateBallVelocity(power, angle);
    }

    // Hàm tính vận tốc dựa trên lực đánh và góc đánh
    static calculateBallVelocity(power, angle) {
        //công thức vx= v * cos(alpha) và vy= v * sin(alpha)
        //v=power/weight(=1)
        return new Vector2(
            100 * Math.cos(angle) * power,
            100 * Math.sin(angle) * power
        );
    }

    // Cập nhật vị trí bóng theo thời gian
    update(delta) {
        this.updatePosition(delta);
        this.velocity.multiplyWith(0.98);//Giamr vận tốc dần theo thời gian(2%)


        //Kiểm tra nếu di chuyên nhưng vận tốc nhỏ hơn 1 thì dừng bóng
        if (this.moving && Math.abs(this.velocity.x) < 1 && Math.abs(this.velocity.y) < 1) {
            this.stop();
        }
    }

    // Cập nhật vị trí bóng trong khoảng thời gian delta
    updatePosition(delta) {
        //kiểm tra bóng có đang di chuyển và bóng có trong lỗ không
        if (!this.moving || this.inHole) return;

        // newPos=this.position+s
        //s=this.velocity.multiply(delta)=v*t tương đưiong (x*t,y*t)
        let newPos = this.position.add(this.velocity.multiply(delta));

        //Kiêm tra xem vị trí mới có trong khoảng lỗ bida k
        if (Game.policy.isInsideHole(newPos)) {
            //Bật âm thanh khi bóng vào lỗ
            if (Game.sound && SOUND_ON) {
                let holeSound = sounds.hole.cloneNode(true);
                holeSound.volume = 0.5;
                holeSound.play();
            }

            //Cập nhật vị trí ,trạng thái
            this.position = newPos;
            this.inHole = true;
            setTimeout(() => {
                this.visible = false;
                this.velocity = Vector2.zero;
            }, 100);
            Game.policy.handleBallInHole(this);
            return;
        }


        //Ngược lại xử lý va chạm
        if (this.handleCollision(newPos)) {
            this.velocity.multiplyWith(0.95);//giảm vận tốc sau mỗi lần và chạm(5%)
        }
        //Cuối cung cập nhật vị trí mới 
        else {
            this.position = newPos;
        }
    }

    // Xử lý va chạm với biên bàn chơi
    handleCollision(newPos) {
        let collision = false;//Trạng thái va chạm

        //Nếu bóng ra khỏi biên trái thì đổi hướng và cập nhật vị trí
        if (Game.policy.isXOutsideLeftBorder(newPos, this.origin)) {
            this.velocity.x = -this.velocity.x;//chuyển hướng ngươjc lại
            this.position.x = Game.policy.leftBorderX + this.origin.x//phép toán để vị trí bóng phải ở trong bàn;
            collision = true;
        }
        //Nếu bóng ra khỏi biên phải thì đổi hướng và cập nhật vị trí 
        else if (Game.policy.isXOutsideRightBorder(newPos, this.origin)) {
            this.velocity.x = -this.velocity.x;
            this.position.x = Game.policy.rightBorderX - this.origin.x;
            collision = true;
        }
        //Nếu bóng ra khỏi biên trên thì đổi hướng và cập nhật vị trí 

        if (Game.policy.isYOutsideTopBorder(newPos, this.origin)) {
            this.velocity.y = -this.velocity.y;
            this.position.y = Game.policy.topBorderY + this.origin.y;
            collision = true;
        }
        //Nếu bóng ra khỏi biên dưới thì đổi hướng và cập nhật vị trí
        else if (Game.policy.isYOutsideBottomBorder(newPos, this.origin)) {
            this.velocity.y = -this.velocity.y;
            this.position.y = Game.policy.bottomBorderY - this.origin.y;
            collision = true;
        }

        return collision;
    }

    // Dừng bóng
    stop() {
        this.moving = false;
        this.velocity = Vector2.zero;
    }

    // Reset lại bóng về vị trí ban đầu
    reset() {
        this.inHole = false;
        this.moving = false;
        this.velocity = Vector2.zero;
        this.position = this.initPos;
        this.visible = true;
    }

    // Xử lý bóng ra ngoài bàn
    out() {
        this.position = new Vector2(0, 900);
        this.visible = false;
        this.inHole = true;
    }

    // Vẽ bóng lên màn hình
    draw() {
        if (!this.visible) return;
        //hình ảnh,vị trí,góc quay ,scale,điểm gốc
        Canvas2D.drawImage(this.sprite, this.position, 0, 1, new Vector2(25, 25));
    }
}
