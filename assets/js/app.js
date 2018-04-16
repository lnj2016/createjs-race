var t1,
    fallSpeed = 500,
    speed = 30,
    xSpeed = -1,
    distance = 0,
    goal_distance = 2000,
    car_count = 0,
    hasParking = true,
    isPlay = false;
var stage, C_W, C_H, player, enemy,parking, enemyDownArr = [], loader, bg;

//通过两倍缩放canvas，适应retina
var sWidth = document.documentElement.clientWidth, sHeight = document.documentElement.clientHeight, ratio = sWidth / 320;
document.querySelector("canvas").style.width = sWidth + "px";document.querySelector("canvas").style.height = sHeight + "px";

function init() {
    isPlay = true;
    stage = new createjs.Stage("canvas");
    createjs.Touch.enable(stage);
    stage.canvas.width = sWidth * 2;
    stage.canvas.height = sHeight * 2;
    C_W = stage.canvas.width;
    C_H = stage.canvas.height;
    var manifest = [
        {src: "assets/images/road.png", id: "road"},
        {src: "assets/images/car.png", id: "car"},
        {src: "assets/images/car-list2.png", id: "enemy"},
        {src: "assets/images/parking.png", id: "parking"}
    ];

    loader = new createjs.LoadQueue(false);
    loader.on("complete", handleComplete);
    loader.loadManifest(manifest);

}

function handleComplete() {
    var bg_img = loader.getResult("road");
    bg = new createRoad(bg_img,stage);

    var player_img = loader.getResult("car");
    player = createPlayer(C_W / 2 - player_img.width / 4 * ratio, C_H - player_img.height * ratio, player_img,stage);

    player.sprite.addEventListener("mousedown", function (e) {
        e.preventDefault();
        stage.addEventListener('stagemousemove', function (e) {
            var target = e.target;
            var moveX = target.mouseX - player.picsize().w / 2,
                moveY = target.mouseY - player.picsize().h / 2;
            if (moveX < 100*ratio) {
                moveX = 100*ratio;
            } else if (moveX > C_W - player.picsize().w - 100*ratio) {
                moveX = C_W - player.picsize().w - 100*ratio;
            }
            if (moveY < 0) {
                moveY = 0;
            } else if (moveY > C_H - player.picsize().h) {
                moveY = C_H - player.picsize().h;
            }

            player.update(moveX,moveY);
        });
        stage.addEventListener('stagemouseup', function(e) {
            e.target.removeAllEventListeners();
        });
    });

    t1 = setInterval(fallDownCreate, fallSpeed);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", handleTick);
}

function fallDownCreate() {
    var enemy_img = loader.getResult("enemy");
    if(distance<=goal_distance-100){
        let rad = Math.random() * (C_W - enemy_img.width / 2 * ratio);
        let enemy_x = rad<100*ratio?100*ratio:rad>C_W -100*ratio?C_W -100*ratio:rad;
        enemy = createEnemy(enemy_x, -enemy_img.height * ratio, enemy_img,stage);
        enemyDownArr.push(enemy);
    }
}


function handleTick() {
    if (isPlay) {
        distance++;
        bg.update(speed);
        if(distance<=goal_distance){//指定距离内可以行驶
            for (var i = 0; i < enemyDownArr.length; i++) {
                if (enemyDownArr[i].x < C_W / 2) {
                    enemyDownArr[i].update(-xSpeed);
                } else {
                    enemyDownArr[i].update(xSpeed);
                }
                if (enemyDownArr[i].sprite.y + enemyDownArr[i].picsize().h >= player.picsize().y && enemyDownArr[i].sprite.y  < player.picsize().y + player.picsize().h) {//高度检测
                    if (enemyDownArr[i].sprite.x + enemyDownArr[i].picsize().w >= player.picsize().x && enemyDownArr[i].sprite.x <= player.picsize().x + player.picsize().w) {
                        enemyDownArr[i].explode();
                        enemyDownArr.splice(i, 1);
                        player.explode();
                        bg.over();
                        isPlay = false;
                        window.clearInterval(t1);
                        player.sprite.removeAllEventListeners();
                        stage.removeAllEventListeners();
                        alert(`共躲避${car_count}辆汽车,行驶${distance}米`);
                    }
                } else if (enemyDownArr[i].sprite.y >= C_H) {
                    car_count++;
                    enemyDownArr[i].destory();
                    enemyDownArr.splice(i, 1);
                }
            }
        }else{//生成停车位
            if(hasParking){
                var parking_img = loader.getResult("parking");
                parking = new createParking(C_W/5*3,100*ratio,parking_img,stage);
                hasParking = false;
            }
            if(player.picsize().x > parking.picsize().x&&player.picsize().y>parking.picsize().y&&player.picsize().y+player.picsize().h<parking.picsize().y+parking.picsize().h){
                window.clearInterval(t1);
                player.sprite.removeAllEventListeners();
                stage.removeAllEventListeners();
                isPlay = false;
                alert('泊车成功！')
            }

        }
    }
    stage.update();
}

init();