import { Actor, Engine, Gif, ImageSource, Random, Vector } from "excalibur";

export default class EmoteActor extends Actor {
  static emoteCache = new Map<string, Gif | ImageSource>();

  life = 4000;
  loadingTimeout = 4000;
  resource: Gif | ImageSource | undefined;
  isInit = false;

  constructor(source: Vector, private url: string, rand: Random) {
    super({
      pos: source,
      acc: new Vector(0, 100),
      vel: new Vector(rand.floating(-1, 1), rand.floating(-1, 0))
        .normalize()
        .scaleEqual(100),
      scale: new Vector(0.5, 0.5),
    });

    let emoteResource = EmoteActor.emoteCache.get(this.url);
    if (!emoteResource) {
      fetch(this.url)
        .then((res) => res.bytes())
        .then((blob) => {
          const isGif =
            Array.from(blob.slice(0, 3), (chara) =>
              String.fromCharCode(chara)
            ).join("") === "GIF";

          const base64 = btoa(
            Array.from(blob.values(), (x) => String.fromCharCode(x)).join("")
          );

          emoteResource = isGif
            ? new Gif("data:image/gif;base64," + base64)
            : new ImageSource("data:image/png;base64," + base64);

          EmoteActor.emoteCache.set(this.url, emoteResource);
          emoteResource.load();
          this.resource = emoteResource;
        });
    }
  }

  update(engine: Engine, elapsed: number): void {
    super.update(engine, elapsed);

    if (this.resource && this.resource.isLoaded() && !this.isInit) {
      this.graphics.use(
        this.resource instanceof Gif
          ? this.resource.toAnimation()!
          : this.resource.toSprite()
      );
      this.isInit = true;
    }

    // prevent the life timer from starting until the resource loads
    // if the resource does not load within loadingTimeout, the actor will be killed
    if (!this.isInit) {
      this.loadingTimeout -= elapsed;
      if (this.loadingTimeout <= 0) {
        this.kill();
      }
      return;
    }

    this.life -= elapsed;

    this.graphics.opacity = this.life / 4000;

    if (this.life <= 0) {
      this.kill();
    }
  }
}
