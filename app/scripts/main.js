window.addEventListener('load', function () {
  var Q = window.Q = Quintus()
    .include('Sprites, Scenes, Inputs, 2D, Anim, Touch, UI, Audio')
    .setup({
      maximize: true
    })
    .controls().touch().enableSpound();

  Q.animation('People', {
    run_left: {
      frames: [0, 1, 2],
      rate: 1 / 8
    },
    run_right: {
      frames: [3, 4, 5],
      rate: 1 / 8
    },
    stand_left: {
      frames: [0],
      loop: false
    },
    stand_right: {
      frames: [3],
      loop: false
    }
  });
  Q.Sprite.extend('fireball', {
    int: function(s) {
      this._super(s, {
        sheet: 'fireball',
        sprite: 'fireball',
        x: 64,
        y: 64,
        gravity: 0
      });
      this.add('2d, animation');
      this.on('hit', this, function(col) {
        if (col.obj.isA('Knight')){
          col.obj.destroy();
        }
        this.destroy();
      });
    },
    step: function(dt){
      if (this.p.vx > 0) this.play('fly_right');
      else if (this.p.vx <0) this.play('fly_left');
    }
  });
  Q.Sprite.extend('Knight', {
    int: function(s){
      this._super(s, {
        sheet: 'knight',
        sprite: 'People',
        vx: 40
      });
      this.add('2d, aiBounce, animation');
    },
    step: function(dt){
      if (this.p.vx > 0) this.play('run_right');
      else if (this.p.vx <0) this.play('run_left');
      else this.play('stand_' + this.p.direction);
    }
  });
  Q.Sprite.extend('Hero', {
    init: function (s) {
      this._super(s, {
        sheet: 'hero',
        sprite: 'People',
        x: 64,
        y: 64
      });
      this.add('2d, platfomerControls, animation');
      Q.input.on('jump', this, function(){
        Q.audio.play('jump.mp3');
      });
      Q.input.on('fire'. this, function() {
        Q.audio.play('fireball.mp3');
        this.stage.insert(new Q.Fireball({
          x: this.p.x + (thisp.direction === 'left' ? -32 : 32),
          y: this.p.y + 8,
          vx: (this.p.direction ==='left' ? -220 : 220)
        }));
      });
      this.on('hit', this, function(col){
        if (col.obj.isA('Knight')){
          Q.stageScene('gameOver',1);
          Q.stage(0).pause;
        }
      });
    },
    step: function(dt){
      if (this.p.vx > 0) this.play('run_right');
      else if (this.p.vx <0) this.play('run_left');
      else this.play('stand_' + this.p.direction);
    }
  });
  Q.scene('level1', function (stage) {
    stage.insert(new Q.Repeater({ asset: 'background.jpg', speedX: 0.1, speedY:0.1 }));
    stage.insert(new Q.TileLayer({
      dataAsset: 'level1background.json',
      sheet: 'tiles'
    }));
    stage.collisionLayer(new Q.TileLayer({
      dataAsset: 'level1collision.json',
      sheet: 'tiles'
    }));
    var hero = stage.insert(new Q.Hero());
    stage.add('viewport').follow(hero);
    stage.insert(new Q.Knight({x:256, y: 800}));
    stage.insert(new Q.TileLayer({
      dataAsset: 'level1foreground.json',
      sheet: 'tiles'
    }));
  });
  Q.scene('gameOver', function(stage){
    stage.insert(
      new Q.UI.Text({
        x:Q.width/2,
        y:Q.height/2,
        family: 'Cursive',
        size: 24,
        color: 'white',
        label: 'Game over'
      }))
  });

  Q.load('tiles.png, level1collision.json, hero.png, knight.png, fireball.png, jump.mp3, fireball.mp3', function () {
    Q.sheet('tiles', 'tiles.png', {
      tilew: 32,
      tileh: 32
    });
    Q.sheet('hero', 'hero.png', {
      titew: 32,
      tileh: 32
    });
    Q.sheet('knight', 'knight.png', {
      titew: 32,
      tileh: 41
    });
    Q.sheet('fireball', 'fireball.png', {
      titew: 32,
      tileh: 16
    });
    Q.stageScene('level1');
  });
});
