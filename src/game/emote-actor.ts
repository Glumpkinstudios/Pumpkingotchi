import { Actor, Engine, Gif, ImageSource, Random, Vector } from "excalibur";

export default class EmoteActor extends Actor {
  static emoteCache = new Map<string, Gif | ImageSource>();

  life = 4000;
  loadingTimeout = 4000;

  constructor(source: Vector, private url: string, rand: Random) {
    super({
      pos: source,
      acc: new Vector(0, 100),
      vel: new Vector(rand.floating(-1, 1), rand.floating(-1, 0))
        .normalize()
        .scaleEqual(100),
    });
  }

  imgEl: HTMLImageElement | undefined;
  onInitialize(): void {
    const img = document.createElement("img");
    img.style.position = "absolute";
    img.style.top = "0";
    img.style.left = "0";
    img.style.transform = `translate(${this.pos.x - 14}px, ${
      this.pos.y - 14
    }px)`;
    img.src = this.url;
    document.getElementById("game-root")?.append(img);

    img.onload = () => {
      this.imgEl = img;
    };
  }

  update(engine: Engine, elapsed: number): void {
    super.update(engine, elapsed);
    // prevent the life timer from starting until the resource loads
    // if the resource does not load within loadingTimeout, the actor will be killed
    if (!this.imgEl) {
      this.loadingTimeout -= elapsed;
      if (this.loadingTimeout <= 0) {
        this.kill();
      }
      return;
    }

    this.imgEl.style.transform = `translate(${this.pos.x - 14}px, ${
      this.pos.y - 14
    }px)`;
    this.imgEl.style.opacity = (this.life / 4000).toFixed(2).toString();

    this.life -= elapsed;

    if (this.life <= 0) {
      this.kill();
    }
  }

  onPostKill(): void {
    this.imgEl?.remove();
  }
}
