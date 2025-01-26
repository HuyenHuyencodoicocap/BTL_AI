let sprites={};
let assetsStillloading=0;

function assetsLoadingLoop(callback){
    if(assetsStillloading){
        requestAnimationFrame(assetsLoadingLoop.bind(this,callback));
    }else{
        callback();
    }
}

function loadAssets(callback){

    function loadSprite(fileName){
        assetsStillloading++;

        let spriteIamge= new Image();
        spriteIamge.src="./assets/sprites/"+ fileName;

        spriteIamge.onload= function(){
            assetsStillloading--;
        }
        return spriteIamge  ;
    }

    sprites.background= loadSprite('spr_background4.png');
    sprites.stick=loadSprite('spr_stick.png');
    assetsLoadingLoop(callback);
}