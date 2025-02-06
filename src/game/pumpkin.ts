import {
  Actor,
  ActorArgs,
  Circle,
  clamp,
  Collider,
  CollisionGroup,
  CollisionType,
  Color,
  EmitterType,
  Engine,
  Font,
  Label,
  ParticleEmitter,
  Random,
  Vector,
} from "excalibur";
import { Resources } from "./resources";

const rand = new Random();

function randBetween(min: number, max: number) {
  return rand.floating(min, max);
}

export default class PumpkinActor extends Actor {
  walkAnimation =
    Resources.pumpkinAseprite.getAnimation("walk") ??
    new Circle({ radius: 16, color: Color.Orange });
  idleAnimation =
    Resources.pumpkinAseprite.getAnimation("idle") ??
    new Circle({ radius: 16, color: Color.Orange });

  minWalkRadius = 15;
  maxWalkRadius = 50;
  walkSpeed = 0.1;

  minIdleTime = 1000;
  maxIdleTime = 10000;

  collidingWith: Collider[] = [];

  state:
    | {
        type: "walk";
        to: Vector;
        for: number;
      }
    | {
        type: "idle";
        for: number;
      } = {
    type: "idle",
    for: 0,
  };
  chatterName: string;

  constructor(config: ActorArgs & { chatterName: string }) {
    const newConfig = Object.assign(
      {
        radius: 16,
        collisionType: CollisionType.Active,
        collisionGroup: CollisionGroup.All,
      },
      config
    );
    super(newConfig);
    this.chatterName = config.chatterName;
  }

  override onInitialize(engine: Engine): void {
    super.onInitialize(engine);

    // set idle as initial animation
    this.graphics.use(this.idleAnimation);

    // add label with user name
    const label = new Label({
      text: this.chatterName,
      font: new Font({
        size: 10,
        color: Color.White,
      }),
      pos: new Vector(0, -18),
    });
    label.anchor = new Vector(0.5, 0.5);
    this.addChild(label);
  }

  private setIdle() {
    this.state = {
      type: "idle",
      for: randBetween(this.minIdleTime, this.maxIdleTime),
    };

    this.graphics.use(this.idleAnimation);
  }

  private setWalk(movement: Vector) {
    this.graphics.use(this.walkAnimation);
    this.graphics.flipHorizontal = movement.x >= 0;

    this.state = {
      type: "walk",
      to: this.pos.add(movement),
      for: 5000,
    };
  }

  private handleIdle(engine: Engine, elapsed: number) {
    // wait in place until the timeout passes
    if (this.state.for && this.state.for > 0) {
      this.state.for -= elapsed;
      return;
    }

    // if the timeout passed find a new place to walk to
    this.setWalk(
      new Vector(
        randBetween(this.minWalkRadius, this.maxWalkRadius) *
          rand.pickOne([1, -1]),
        randBetween(this.minWalkRadius, this.maxWalkRadius) *
          rand.pickOne([1, -1])
      )
    );
  }

  private handleWalk(
    state: Extract<typeof this.state, { type: "walk" }>,
    engine: Engine,
    elapsed: number
  ) {
    if (state.for && state.for <= 0) {
      this.setIdle();
      return;
    }

    this.state.for -= elapsed;

    const elapsedTimesSpeed = this.walkSpeed * elapsed;

    const movement = state.to
      .clone()
      .sub(this.pos)
      .normalize()
      .scale(elapsedTimesSpeed)
      .clampMagnitude(this.pos.distance(state.to));
    this.pos = this.pos.add(movement);

    // if we left the map then move back and set state to idle
    if (
      this.pos.x < 0 ||
      this.pos.x > engine.drawWidth ||
      this.pos.y < 0 ||
      this.pos.y > engine.drawHeight
    ) {
      this.pos.x = clamp(this.pos.x, 0, engine.drawWidth);
      this.pos.y = clamp(this.pos.y, 0, engine.drawHeight);

      this.setIdle();
      return;
    }

    // if we reached the destination (with small error) then set the state to idle and clip to the destination
    if (state.to.squareDistance(this.pos) < 0.001) {
      this.pos = state.to.clone();
      this.setIdle();
    }
  }

  override update(engine: Engine, elapsed: number): void {
    super.update(engine, elapsed);

    switch (this.state.type) {
      case "idle":
        this.handleIdle(engine, elapsed);
        break;
      case "walk":
        this.handleWalk(this.state, engine, elapsed);
        break;
      default:
        throw new Error("Invalid state");
    }
  }
}
