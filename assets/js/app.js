var t1,
    fallSpeed = 600,
    speed = 30,
    xSpeed = -1,
    distance = 0,
    goal_distance = 200,
    car_count = 0,
    hasParking = false,
    isPlay = false;
var stage, C_W, C_H, player, enemy,parking, enemyDownArr = [], loader, bg , distanceText ,distanceKilo;

//通过两倍缩放canvas，适应retina
var sWidth = document.documentElement.clientWidth, sHeight = document.documentElement.clientHeight, ratio = sWidth / 320;
document.querySelector("canvas").style.width = sWidth + "px";document.querySelector("canvas").style.height = sHeight + "px";

$('.btn_start').one('click',()=>{
    $('.index').fadeOut();
    $('#canvas').removeClass('hide');
    init();
});

$('.btn_replay').on('click',()=>{
    $('.game_over_panel').fadeOut();
    isPlay= true;
    if(hasParking){
        hasParking = false;
    }
    distance=0;
    car_count = 0;
    enemyDownArr = [];
    stage.removeChild(player,enemy,bg,distanceKilo,distanceText);
    init();

});

$('.btn_share').on('click',()=>{
    $('.share_wrap').fadeIn();
    $('.game_over_panel').fadeOut();
});

$('.share_wrap').on('click',()=>{
    $('.share_wrap').fadeOut();
    $('.game_over_panel').fadeIn();
})

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
        {src: "assets/images/car-list.png", id: "enemy"},
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

    //距离提示绘制
    distanceText = new createjs.Text(`${goal_distance - distance}M`, `${24 * ratio}px Times`, "#fff");
    distanceText.y = 40 * ratio;
    distanceText.x = 50 * ratio;

    distanceKilo = new createjs.Bitmap('assets/images/kilo.png');
    distanceKilo.setTransform(0, 0, ratio, ratio);
    stage.addChild(distanceKilo,distanceText);

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
        if(goal_distance - distance>=0){
            distanceText.text = `${goal_distance - distance}M`;
        }
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
                        failPanel();
                    }
                } else if (enemyDownArr[i].sprite.y >= C_H) {
                    car_count++;
                    enemyDownArr[i].destory();
                    enemyDownArr.splice(i, 1);
                }
            }
        }else{//生成停车位
            if(!hasParking){
                var parking_img = loader.getResult("parking");
                parking = new createParking(C_W/5*3,100*ratio,parking_img,stage);
                hasParking = true;
            }else if(player.picsize().x > parking.picsize().x&&player.picsize().y>parking.picsize().y&&player.picsize().y+player.picsize().h<parking.picsize().y+parking.picsize().h){
                window.clearInterval(t1);
                player.sprite.removeAllEventListeners();
                stage.removeAllEventListeners();
                isPlay = false;
                successPanel();
            }
        }
    }
    stage.update();
}

function failPanel(){
    $('.game_over_panel').fadeIn();
    // console.log(`共躲避${car_count}辆汽车,行驶${distance}米`);
    $('.avatar').attr(`class`,'avatar fail_avatar');
    $('.game_over_top').attr(`class`,'game_over_top fail_top');
    $('.game_over_img').attr(`src`,`./assets/images/fail_img.png`);
}

function successPanel(){
    $('.game_over_panel').fadeIn();
    $('.avatar').attr(`class`,'avatar suc_avatar');
    $('.game_over_top').attr(`class`,'game_over_top suc_top');
    $('.game_over_img').attr(`src`,`./assets/images/suc_img.png`);
}

