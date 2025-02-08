import { Actor, Color, Engine, Random, Scene, Vector } from 'excalibur';
import { Resources } from './resources';
import PumpkinActor from './pumpkin';
import ChatHandler from '../utils/chat-handler';
import EmoteActor from './emote-actor';

export class MainScene extends Scene {
  activeChatters = new Map<string, PumpkinActor>();
  rand = new Random();

  chatHandler: ChatHandler;
  blackList: string[];

  constructor(
    private options: {
      channel?: string | null;
      blackList?: string[] | null;
      transparent?: boolean;
    }
  ) {
    super();
    this.chatHandler = new ChatHandler(options.channel ?? 'ItsMerume');
    this.blackList = ['StreamElements', ...(options.blackList ?? [])].map(
      (el) => el.toUpperCase()
    );
  }

  override onInitialize(engine: Engine): void {
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
      if (this.blackList.includes(user.toUpperCase())) {
        return;
      }

      let activeChatterOpt = this.activeChatters.get(user.toUpperCase());
      if (!activeChatterOpt) {
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
          chatterName: user,
        });
        this.add(pumpkin);
        this.activeChatters.set(user.toUpperCase(), pumpkin);
        activeChatterOpt = pumpkin;
      }

      if (bangMessage) {
        activeChatterOpt.sendBangMessage(bangMessage[0], bangMessage[1]);
      }

      emotesUrls.slice(0, 5).forEach((emoteUrl) => {
        this.add(
          new EmoteActor(activeChatterOpt.pos.clone(), emoteUrl, this.rand)
        );
      });
    });
  }
}
