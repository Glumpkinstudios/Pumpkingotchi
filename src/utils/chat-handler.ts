import ComfyJS from 'comfy.js';
import EmoteParser from './emote-parser';
import { getTwitchResourceUrl } from '../emote-providers/twitchProvider';

type ChatHandlerListener = (
  user: string,
  bangMessage: [string, string | undefined] | undefined,
  emotesUrls: string[]
) => void;

type RewardListener = (user: string, rewardTitle: string) => void;

export default class ChatHandler {
  private listeners: ChatHandlerListener[] = [];
  private rewardListeners: RewardListener[] = [];

  private async init(channelNames: string[]) {
    ComfyJS.Init(
      '',
      undefined,
      typeof channelNames === 'string' ? [channelNames] : channelNames,
      true
    );

    // add the roomstate listener as soon as possible after the ComfyJS.Init()
    const roomId = await new Promise<string | undefined>((resolve) => {
      ComfyJS.GetClient().on('roomstate', (_channel, state) => {
        resolve(state['room-id']);
      });
    });

    const emoteParser = new EmoteParser({ channelId: roomId });
    await emoteParser.init();

    ComfyJS.onCommand = (user, command, message, flags) => {
      if (this.options.subOnly && !flags.subscriber) {
        return;
      }

      this.listeners.forEach((listener) => {
        listener(user, [command, message.trim()], []);
      });
    };

    ComfyJS.onChat = async (user, message, flags, _self, extra) => {
      if (this.options.subOnly && !flags.subscriber) {
        return;
      }

      const twitchEmoteUrls = Object.keys(extra.messageEmotes ?? {}).map(
        (imgId) => {
          return getTwitchResourceUrl(imgId);
        }
      );

      const externalEmoteUrls = emoteParser.parse(message);

      this.listeners.forEach((listener) => {
        listener(user, undefined, [...twitchEmoteUrls, ...externalEmoteUrls]);
      });
    };

    // Add PubSub handler
    const pubSubWs = new WebSocket(`wss://pubsub-edge.twitch.tv`);
    const rewardTopic = `community-points-channel-v1.${roomId}`;
    pubSubWs.onopen = () => {
      pubSubWs.send('{"type": "PING"}');
      pubSubWs.send(`{"data":{"topics":["${rewardTopic}"]},"type":"LISTEN"}`);
    };

    pubSubWs.onmessage = (message) => {
      try {
        const { data, type } = JSON.parse(message.data.toString());
        if (type === 'MESSAGE' && data.topic === rewardTopic) {
          const innerMessage = JSON.parse(data.message);
          this.rewardListeners.forEach((listener) => {
            listener(
              innerMessage.data.redemption.user.display_name,
              innerMessage.data.redemption.reward.title
            );
          });
        }
      } catch {
        // ignore
      }
    };
  }

  constructor(
    channelNames: string | string[],
    private options: { subOnly?: boolean } = {}
  ) {
    this.init(typeof channelNames === 'string' ? [channelNames] : channelNames);
  }

  public addListener(listener: ChatHandlerListener) {
    this.listeners.push(listener);
  }

  public addRewardListener(listener: RewardListener) {
    this.rewardListeners.push(listener);
  }
}
