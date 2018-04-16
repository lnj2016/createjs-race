(function(w){
    var scale = document.documentElement.clientWidth/320,//图像的缩放情况
        count = 2;//序列帧每行图片数

    var Player = function(x , y ,img,view){
        this.width = img.width/count;
        this.height = img.height;
        this.state = "normal";
        this.sprite = null;
        this.x = x;
        this.y = y;
        this._view = view;
        this.init(img);
    };

    Player.prototype = {
        init:function(img){
            //动作序列设置
            var spriteSheet = new createjs.SpriteSheet({
                "images":[img],
                "frames":[
                    [0,0,119,231],
                    [119,0,136,235]
                ],
                "animations":{
                    "normal":{
                        frames:[0]
                    },
                    "explode":{
                        frames:[1]
                    }
                }
            });
            this.sprite = new createjs.Sprite(spriteSheet , this.state);
            // this.sprite.setTransform(this.x, this.y, scale, scale);
            this.sprite.setTransform(this.x, this.y, 1, 1);
            this._view.addChildAt(this.sprite,2);
        },
        update:function(x,y){
            this.x = this.sprite.x = x ;
            this.y = this.sprite.y = y;
        },
        normal:function(){
            this.sprite.gotoAndPlay("normal");
        },
        explode:function(){
            this.sprite.gotoAndPlay("explode");
        },
        picsize:function(){
            return {
                x:this.x,
                y:this.y,
                // w:this.width*scale,
                // h:this.width*scale
                w:this.width,
                h:this.height

            }
        }
    };

    w.createPlayer = function(x , y , img, view){
        return new Player(x , y , img,view);
    };
})(window);