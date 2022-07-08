kaboom({
  global: true,
  fullscreen: true,
  clearColor: [0, 0.65, 1, 1],
  debug: true,
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("mario", "mario.png");
loadSprite("castle", "castle.png");
loadSprite("block", "ground.png");
loadSprite("coin", "coin.png");
loadSprite("surprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("goomba", "evil_mushroom.png");
loadSprite("tree", "tree.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("coin", "coin.png");
loadSprite("d", "d.png");
loadSprite("cc", "cc.png");

loadSound("gameSound", "gameSound.mp3");
loadSound("jumpSound", "jumpSound.mp3");
scene("gameover", (score) => {
  add([
    text("game over!\n your score: " + score + "\npress enter to restart", 25),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyRelease("enter", () => {
    go("game");
  });
});
scene("begin", () => {
  add([
    text("welcom\n press ENTER to start\n the game", 25),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyRelease("enter", () => {
    go("game");
  });
});

scene("game", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");
  const symbolMap = {
    width: 20,
    height: 20,
    cc: [sprite("cc", "cc")],
    d: [sprite("d"), "d"],
    c: [sprite("castle"), "castle"],
    "=": [sprite("block"), solid(), scale(1.3)],
    "?": [sprite("surprise"), solid(), "suprise-coin"],
    "!": [sprite("surprise"), solid(), "suprise-mushroom"],
    $: [sprite("coin"), "coin"],
    M: [sprite("mushroom"), solid(), body(), "mushroom"],
    x: [sprite("unboxed"), solid()],
    g: [sprite("goomba"), solid(), body(), "goomba"],
  };
  const map = [
    "                                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                                    ",
    "                                                 =====!==                                                                                                                                                                           ",
    "                                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                                    ",
    "                                                                                                                          c                                                                                                         ",
    "                ==?!===                    =$ ==?====                          =??==                   ==?==                                                                                                                        ",
    "                                        $ =                                                                                                                                                                                         ",
    "                        g          g     =           g          $        g            $                 g           g                                                                                                              ",
    "====================================================================================================================================================================================================================================",
    "====================================================================================================================================================================================================================================",
    "====================================================================================================================================================================================================================================",
    "                                                                                                                                                                                                                                    ",
    "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  ];
  const gameLevel = addLevel(map, symbolMap);

  const speed = 120;
  const jumpf = 350;
  let isjump = false;
  let score = 0;

  const scoreLabel = add([
    text("score: " + score),
    pos(50, 10),
    layer("ui"),
    {
      value: score,
    },
  ]);

  const player = add([
    sprite("mario"),
    solid(),
    pos(250, 200),
    body(),
    origin("bot"),
    big(jumpf),
  ]);

  keyDown("d", () => {
    player.move(speed, 0);
  });

  keyDown("a", () => {
    if (player.pos.x > 10) {
      player.move(-speed, 0);
    }
  });

  keyDown("space", () => {
    if (player.grounded()) {
      player.jump(jumpf);
      play("jumpSound");
      isjump = true;
    }
  });
  player.on("headbump", (obj) => {
    if (obj.is("suprise-coin")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }
    if (obj.is("suprise-mushroom")) {
      gameLevel.spawn("M", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }
  });

  player.collides("coin", (x) => {
    destroy(x);
    scoreLabel.value += 1;
    scoreLabel.text = "Score: " + scoreLabel.value;
  });
  player.collides("mushroom", (x) => {
    destroy(x);
    player.biggify(5);
  });
  action("mushroom", (x) => {
    x.move(25, 0);
  });
  player.collides("goomba", (x) => {
    if (isjump) {
      destroy(x);
    } else {
      if (player.isBig()) {
        destroy(x), player.smallify();
      } else {
        destroy(player);
        go("gameover", scoreLabel.value);
      }
    }
  });
  player.collides("d", (x) => {
    go("gameover", scoreLabel.value);
  });

  player.action(() => {
    camPos(player.pos.x, 100);
    //console.log(player.pos.x);
    scoreLabel.pos.x = player.pos.x - 200;
    if (player.pos.x >= 2479.442479999995) {
      go("win", scoreLabel.value);
    }
    if (player.grounded()) {
      isjump = false;
    } else {
      go;
      isjump = true;
    }
  });

  action("goomba", (gege) => {
    gege.move(-25, 0);
  });
});
scene("win", (score) => {
  add([
    text("you win\nyour score: " + score, 25),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

start("begin");
