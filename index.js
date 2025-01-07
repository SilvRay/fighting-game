const canvasEl = document.querySelector("canvas");
const ctx = canvasEl.getContext("2d");

canvasEl.width = 1024;
canvasEl.height = 576;

ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "/assets/background/background_layer.png",
});

const shop = new Sprite({
  position: {
    x: 670,
    y: 220,
  },
  imageSrc: "/assets/decorations/shop_anim.png",
  scale: 2,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "/assets/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "/assets/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "/assets/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "/assets/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "/assets/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "/assets/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "/assets/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "/assets/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "/assets/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "/assets/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "/assets/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "/assets/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "/assets/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "/assets/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "/assets/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "/assets/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  arrowRight: {
    pressed: false,
  },
  arrowLeft: {
    pressed: false,
  },
  arrowUp: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  //   console.log("animation working");
  requestAnimationFrame(animate);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

  background.update();
  shop.update();
  ctx.fillStyle = "rgba(255,255,255, .15)";
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //
  // déplacement du player
  //
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprites("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprites("run");
  } else {
    player.switchSprites("idle");
  }

  if (player.velocity.y < 0) {
    // si on est en l'air
    player.switchSprites("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprites("fall");
  }

  //
  // déplacement de l'enemy
  //
  if (keys.arrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprites("run");
  } else if (keys.arrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprites("run");
  } else {
    enemy.switchSprites("idle");
  }

  if (enemy.velocity.y < 0) {
    // si on est en l'air
    enemy.switchSprites("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprites("fall");
  }

  //
  // détecte les collisions et l'enemy est touché
  //
  if (
    rectangularCollision({
      rect1: player,
      rect2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    // console.log("player attacked successfully !!! !!!");
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to(".healthEnemy", {
      width: enemy.health + "%",
    });
  }

  // si le player rate son attaque
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  //
  // détecte les collisions et le player est touché
  //
  if (
    rectangularCollision({
      rect1: enemy,
      rect2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 1
  ) {
    //   console.log("ennemy attacked successfully !!!");
    player.takeHit();
    enemy.isAttacking = false;
    gsap.to(".healthPlayer", {
      width: player.health + "%",
    });
  }

  // si l'enemy rate son attaque
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  // fin du jeu en fonction de la jauge de vie
  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    // player keys
    switch (event.key) {
      case "d": // bouger vers la droite
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a": // bouger vers la gauche
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w": // sauter
        player.velocity.y = -20;
        break;
      case " ": // attaquer
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    // enemy keys
    switch (event.key) {
      case "ArrowRight": // bouger vers la droite
        keys.arrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft": // bouger vers la gauche
        keys.arrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp": // sauter
        enemy.velocity.y = -20;
        break;
      case "ArrowDown": // attaquer
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    // player keys
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;

    // enemy keys
    case "ArrowRight":
      keys.arrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.arrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.arrowUp.pressed = false;
      break;
  }
});
