var config = {
	type: Phaser.AUTO,
	width: 2560,
	height: 2560,
	pixelArt: true,
	backgroundColor: "#898989",
	parent: "game-container",
	physics: {
	    default: "arcade",
	    arcade: {
	      gravity: { y: 0 }
	    }
	  },
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);
let cursors;
let player;

function preload() {
	// this.load.image('sky', 'assets/sky.png');
	// this.load.spritesheet('dude', 'assets/dude.png', {
	// 	frameWidth: 32,
	// 	frameHeight: 48
	// });
	this.load.image("terrain", "./assets/terrain.png");
	this.load.tilemapTiledJSON('mappy', 'assets/废墟.json');
	
	// 精灵表单
	this.load.spritesheet('player',
	    'assets/player.png',
	    { frameWidth: 64, frameHeight: 60 } //一帧的宽高
	);

}

function create() {
	// let mappy = this.add.tilemap('mappy');
	// let terrain = mappy.addTilesetImage('kenny_platformer');
	// let wallLayer = mappy.createLayer('wall', [terrain], 0, 0);

	let mappy = this.make.tilemap({
		key: "mappy"
	});

	let tileset = mappy.addTilesetImage("terrain", 'terrain');
	// const wallLayer = mappy.createLayer("wall", tileset, 0, 0).setScale(0.5);
	// const barrierLayer = mappy.createLayer("barrier", tileset, 0, 0).setScale(0.5);
	// const pinLayer = mappy.createLayer("pin", tileset, 0, 0).setScale(0.5);
	// const doorLayer = mappy.createLayer("door", tileset, 0, 0).setScale(0.5);
	// const decorationLayer = mappy.createLayer("decoration", tileset, 0, 0).setScale(0.5);
	const wallLayer = mappy.createLayer("wall", tileset, 0, 0);
	const barrierLayer = mappy.createLayer("barrier", tileset, 0, 0);
	const pinLayer = mappy.createLayer("pin", tileset, 0, 0);
	const doorLayer = mappy.createLayer("door", tileset, 0, 0);
	const decorationLayer = mappy.createLayer("decoration", tileset, 0, 0);
	//碰撞检测
	wallLayer.setCollisionByProperty({ collides: true });
	barrierLayer.setCollisionByProperty({ collides: true });
	
	// 物理精灵和动画
	player = this.physics.add.sprite(450,450,'player').setScale(2);
	//玩家不能跑出画面边界
	player.setCollideWorldBounds(true);
	//上下左右动画
	this.anims.create({
	    key: 'left',
	    // 使用9,10,11帧
	    frames: this.anims.generateFrameNumbers('player',{ start:9, end: 11}),
	    frameRate: 10,  //每秒10帧
	    repeat: -1, //循环播放
	})
	this.anims.create({
	    key: 'turn',
	    frames: [{key: 'player', frame:7 }],
	    repeat: 20,
	});
	this.anims.create({
	    key: 'right',
	    frames: this.anims.generateFrameNumbers('player',{start:3,end:5}),
	    frameRate: 10,
	    repeat: -1,
	})
	this.anims.create({
	    key: 'back',
	    frames: this.anims.generateFrameNumbers('player',{start:0,end:2}),
	    frameRate: 10,
	    repeat: -1,
	})
	this.anims.create({
	    key: 'front',
	    frames: this.anims.generateFrameNumbers('player',{start:6,end:8}),
	    frameRate: 10,
	    repeat: -1,
	})
	this.physics.add.collider(player, wallLayer);
	this.physics.add.collider(player, barrierLayer);

	//照相机功能
	const camera = this.cameras.main;
	camera.startFollow(player);

	// Set up the arrows to control the camera
	cursors = this.input.keyboard.createCursorKeys();

	// Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
	camera.setBounds(0, 0, mappy.widthInPixels, mappy.heightInPixels);

	// Help text that has a "fixed" position on the screen
	this.add
		.text(16, 16, "Arrow keys to scroll", {
			font: "18px monospace",
			fill: "#ffffff",
			padding: {
				x: 20,
				y: 10
			},
			backgroundColor: "#000000"
		})
		.setScrollFactor(0);
		
		
	    this.physics.world.createDebugGraphic();
	
	    // Create worldLayer collision graphic above the player, but below the help text
	    const graphics = this.add.graphics();
	    wallLayer.renderDebug(graphics, {
	      tileColor: null, // Color of non-colliding tiles
	      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Color of colliding tiles
	      faceColor: new Phaser.Display.Color(40, 39, 37, 200), // Color of colliding face edges
	    });
		barrierLayer.renderDebug(graphics, {
		  tileColor: null, // Color of non-colliding tiles
		  collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Color of colliding tiles
		  faceColor: new Phaser.Display.Color(40, 39, 37, 200), // Color of colliding face edges
		});
}

function update() {
	let speed = 200;
	
	if (cursors.left.isDown) {
	    player.setVelocityX(-speed);      //负的水平速度
	    player.anims.play('left', true);
	}else if (cursors.right.isDown) {
	    player.setVelocityX(speed);	//正的水平速度
	    player.anims.play('right', true);
	}else{
	    player.setVelocityX(0);		//清除速度值
	    player.anims.play('turn');
	}
	
	if (cursors.up.isDown) {
	    player.setVelocityY(-speed);	//向上的速度
		player.anims.play('back', true);
	}else if (cursors.down.isDown) {
	    player.setVelocityY(speed);	
		player.anims.play('front', true);
	}else{
	    player.setVelocityY(0);		//清除速度值
	    player.anims.play('turn');
	}

}
