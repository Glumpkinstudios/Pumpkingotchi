import { Actor, Color, Engine, Random, Scene, Vector } from 'excalibur';
import { Resources } from './resources';
import PumpkinActor from './pumpkin';
import ChatHandler from '../utils/chat-handler';
import EmoteActor from './emote-actor';
import { CaseInsensitiveMap } from '@/utils/generic';

export class MainScene extends Scene {
  activeChatters = new CaseInsensitiveMap<PumpkinActor>();
  rand = new Random();

  chatHandler: ChatHandler;
  blacklist: string[];

  initialEngineMaxFps: number | undefined;

  constructor(
    private options: {
      channel?: string | null;
      blacklist?: string[] | null;
      transparent?: boolean;
      rollRewardTitle?: string;
      rollCommand?: string;
    }
  ) {
    super();
    this.chatHandler = new ChatHandler(options.channel ?? 'ItsMerume');
    this.blacklist = (options.blacklist ?? []).map((el) => el.toUpperCase());
  }

  override onInitialize(engine: Engine): void {
    this.initialEngineMaxFps = engine.maxFps;

    if (!this.options.transparent) {
      const background = new Actor();
      background.graphics.use(Resources.backgroundTexture.toSprite());
      background.anchor = new Vector(0, 0);
      background.z = -1;
      background.scale = new Vector(2, 2);
      this.add(background);
    }

    this.backgroundColor = this.options.transparent
      ? Color.Transparent
      : Color.fromHex('84c669');

    if (process.env.DEBUG) {
      for (let i = 0; i < 10; i++) {
        const pumpkin = new PumpkinActor({
          pos: new Vector(
            this.rand.floating(
              PumpkinActor.radius * 2,
              engine.drawWidth - PumpkinActor.radius * 2
            ),
            this.rand.floating(
              PumpkinActor.radius * 2,
              engine.drawHeight - PumpkinActor.radius * 2
            )
          ),
          chatterName: `Chatter ${i}`,
        });
        this.add(pumpkin);
      }
    }

    // setup chat handler so each time chatter types they are added to active chatters
    // and their pumpkin is added to the scene
    // additionally each time they emote their pumpkin launches emote particle
    // TODO: remove unactive chatters
    // TODO: remove chatters as they go offline
    // TODO: limit the amount of chatters
    this.chatHandler.addListener((user, bangMessage, emotesUrls) => {
      if (this.blacklist.includes(user.toUpperCase())) {
        return;
      }

      const activeChatter = this.activeChatters.getOrAdd(
        user,
        new PumpkinActor({
          pos: new Vector(
            this.rand.floating(
              PumpkinActor.radius * 2,
              engine.drawWidth - PumpkinActor.radius * 2
            ),
            this.rand.floating(
              PumpkinActor.radius * 2,
              engine.drawHeight - PumpkinActor.radius * 2
            )
          ),
          chatterName: user,
        })
      );

      if (!this.contains(activeChatter)) {
        this.add(activeChatter);
        activeChatter.onCustomAdd();
      }

      // reset the timeout to ten minutes each time chatter types
      activeChatter.timeout = 10 * 60 * 1000;

      if (
        bangMessage &&
        `!${bangMessage[0]} ${bangMessage[1] ?? ''}`.trim() ===
          this.options.rollCommand
      ) {
        activeChatter.rollSkin();
      }

      emotesUrls.slice(0, 5).forEach((emoteUrl) => {
        this.add(
          new EmoteActor(activeChatter.pos.clone(), emoteUrl, this.rand)
        );
      });
    });

    this.chatHandler.addRewardListener((user, rewardTitle) => {
      if (rewardTitle === this.options.rollCommand) {
        this.activeChatters.get(user)?.rollSkin();
      }
    });
  }

  override onPostUpdate(engine: Engine, elapsed: number): void {
    super.onPostUpdate(engine, elapsed);

    // decrease the FPS if there are no active chatters for performance reasons
    if (this.activeChatters.size === 0) {
      engine.maxFps = 1;
    } else {
      engine.maxFps = this.initialEngineMaxFps ?? 48;
    }
  }
}
