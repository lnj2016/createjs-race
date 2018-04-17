(function(w){
    var gravity = 0.4,
        C_W,C_H,
        scale = document.documentElement.clientWidth/320,//图像的缩放情况
        count = 1;//序列帧每行图片数

    var Enemy = function(x,y,img,view){
        this.width = img.width;
        this.height = img.height;
        this.state = "carl";
        this._view = view;
        C_W = view.canvas.width;
        this.x = x;
        this.y = y;
        this.vy = 0;
        this.sprite = null;
        this.init(img);
    };

    Enemy.prototype = {
        init:function(img){
            //动作序列设置
            var data ={
                "images":[img],
                "frames":[
                    [120,0,136.344],//废弃
                    [0,0,121,228],
                    [256,0,148,282],
                    [404,0,117,227],
                    [521,0,136,344],
                ],
                "animations":{
                    "car1":{
                        frames:[4]
                    },
                    "car2":{
                        frames:[1]
                    },
                    "car3":{
                        frames:[2]
                    },
                    "car4":{
                        frames:[3]
                    }
                }
            };
            var spriteSheet = new createjs.SpriteSheet(data);
            this.sprite = new createjs.Sprite(spriteSheet);
            this.sprite.gotoAndPlay(`car${Math.floor(Math.random()*(4))+1}`);
            this.sprite.setTransform(this.x, this.y, scale, scale);
            this.width = this.sprite.getBounds().width;
            this.height = this.sprite.getBounds().height;
            this._view.addChild(this.sprite);
        },
        update:function(xSpeed){
            this.vy += gravity;
            this.y = this.sprite.y += this.vy ;
            this.sprite.x += xSpeed;
        },
        explode:function(){
            createjs.Tween.get(this.sprite,{loop:false}).wait(200)
                .to({scaleX:0,scaleY:0,alpha:0})
                .wait(200)
                .to({scaleX:1,scaleY:1,alpha:1})
                .wait(200)
                .to({scaleX:0,scaleY:0,alpha:1},200,createjs.Ease.bounceInOut);
            this.destory();
        },
        destory:function(){
            var _this = this;
            setTimeout(function(){
                stage.removeChild(_this.sprite);
            },500);
        },
        picsize:function(){
            return {
                x:this.x,
                y:this.y,
                // w:this.width*scale,
                // h:this.height*scale
                w:this.width,
                h:this.height
            }
        }
    };

    w.createEnemy = function(x , y , img ,view){
        return new Enemy(x , y , img ,view)
    };
})(window);