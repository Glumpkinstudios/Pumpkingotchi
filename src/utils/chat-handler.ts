import ComfyJS from "comfy.js";
import EmoteParser from "./emote-parser";
import { getTwitchResourceUrl } from "../emote-providers/twitchProvider";

type ChatHandlerListener = (user: string, emotesUrls: string[]) => void;

export default class ChatHandler {
  private listeners: ChatHandlerListener[] = [];

  private async init(channelNames: string[]) {
    ComfyJS.Init(
      "",
      undefined,
      typeof channelNames === "string" ? [channelNames] : channelNames,
      true
    );

    // add the roomstate listener as soon as possible after the ComfyJS.Init()
    const roomId = await new Promise<string | undefined>((resolve) => {
      ComfyJS.GetClient().on("roomstate", (_channel, state) => {
        resolve(state["room-id"]);
      });
    });

    const emoteParser = new EmoteParser({ channelId: roomId });
    await emoteParser.init();

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
        listener(user, [...twitchEmoteUrls, ...externalEmoteUrls]);
      });
    };
  }

  constructor(
    channelNames: string | string[],
    private options: { subOnly?: boolean } = {}
  ) {
    this.init(typeof channelNames === "string" ? [channelNames] : channelNames);
  }

  public addListener(listener: ChatHandlerListener) {
    this.listeners.push(listener);
  }

  public removeListener(listener: ChatHandlerListener) {
    this.listeners = this.listeners.filter(
      (listenerEl) => listenerEl !== listener
    );
  }
}
