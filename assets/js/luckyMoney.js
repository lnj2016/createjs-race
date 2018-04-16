(function(w){
    var gravity = 0.4,//红包的下降速度
        scale = document.documentElement.clientWidth/320,//图像的缩放情况
        single_width = 102,//单个图案的宽高
        single_height = 108,
        count = 5;//序列帧每行图片数

    var LuckyMoney = function(x,y,img){
        this.width = img.width/count;
        this.height = img.height;
        this.x = x;
        this.y = y;
        this.vy = 0;
        this.type = 1;//标记掉落物品的属性
        this.init(img);
    };

    LuckyMoney.prototype = {
        init:function(img){
            //动作序列设置
            var data = {
                images:[img],
                frames:[
                    [0,0,single_width,single_height],
                    [single_width,0,single_width,single_height],
                    [single_width*2,0,single_width,single_height],
                    [single_width*3,0,single_width,single_height],
                    [single_width*4,0,single_width,single_height]
                ],
                animations:{
                    luckymoney01:0,
                    luckymoney02:1,
                    luckymoney03:2,
                    luckymoney04:3,
                    luckymoney05:4
                }
            },
            spriteConfig = new createjs.SpriteSheet(data);
            this.sprite = new createjs.Sprite(spriteConfig,`luckymoney0${Math.floor(Math.random()*(5))+1}`);
            this.sprite.setTransform(this.x, this.y, scale, scale);
            stage.addChild(this.sprite);
        },
        update:function(){
            this.vy += gravity;
            this.y = this.sprite.y += this.vy ;
        },
        destory:function(){
            stage.removeChild(this.sprite);
        },
        picsize:function(){
            return {
                type:this.type,
                x:this.x,
                y:this.y,
                w:this.width*scale,
                h:this.width*scale
            }
        }
    };

    w.createLuckyMoney = function(x , y , img){
        return new LuckyMoney(x , y , img)
    };
})(window);