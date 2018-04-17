(function(w){
    var scale = document.documentElement.clientWidth/320,//图像的缩放情况
        count = 2;//序列帧每行图片数

    var Parking = function(x , y ,img,view){
        this.width = img.width/count;
        this.height = img.height;
        this.bitmap = null;
        this.x = x;
        this.y = y;
        this._view = view;
        this.init(img);
    };

    Parking.prototype = {
        init:function(img){
            this.bitmap = new createjs.Bitmap(img);
            this._view.addChild(this.bitmap);
            // this.sprite.setTransform(this.x, this.y, scale, scale);
            this.bitmap.setTransform(this.x, this.y, 1, 1);
            this._view.addChildAt(this.bitmap,2);
            createjs.Tween.get(this.bitmap,{loop:false}).wait(200)
                .to({alpha:1})
                .wait(200)
                .to({alpha:0})
                .wait(200)
                .to({alpha:1})
                .wait(200)
                .to({alpha:0})
                .wait(200)
                .to({alpha:1},200,createjs.Ease.bounceInOut);
        },
        picsize:function(){
            return {
                x:this.x,
                y:this.y,
                w:this.width,
                h:this.height

            }
        }
    };

    w.createParking = function(x , y , img, view){
        return new Parking(x , y , img,view);
    };
})(window);