(function(w){
    var scale = document.documentElement.clientWidth/320,//图像的缩放情况
        C_W,C_H;

    var Road = function(img,view){
        this.bg = null;
        this.copy_bg = null;
        this._view = view;
        C_W = view.canvas.width;
        C_H =  view.canvas.height;
        this.flag = true;
        this.init(img);
        this.bg_height = null;
    };

    Road.prototype = {
        init:function(img){
            this.bg = new createjs.Bitmap(img);
            this.copy_bg = new createjs.Bitmap(img);
            this._view.addChild(this.bg,this.copy_bg);
            this.bg_height = this.bg.getBounds().height;
            this.bg.setTransform(0, 0, scale, scale);
            this.copy_bg.setTransform(0, 0, scale, scale);
            this.bg.y = C_H-this.bg_height;
            this.copy_bg.y = C_H-this.bg_height*2;
        },
        update:function(speed){
            if(this.flag){
                this.bg.y += speed;
                this.copy_bg.y += speed;
                if (this.bg.y >= C_H - speed) {
                    this.bg.y = C_H-this.bg.getBounds().height*2;
                }
                if (this.copy_bg.y >= C_H - speed) {
                    this.copy_bg.y = C_H -this.bg.getBounds().height*2;
                }
            }
        },
        over:function(){
            this.flag = false;
        }
    };

    w.createRoad = function(img , view){
        return new Road(img ,view)
    };
})(window);