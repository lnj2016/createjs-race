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
            this.sprite.setTransform(this.x, this.y, scale, scale);
            this._view.addChildAt(this.bitmap,2);
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