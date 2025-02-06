import {
  fetchBttvChannelEmotes,
  fetchBttvGlobalEmotes,
  getBttvResourceUrl,
} from "../emote-providers/bttvProvider";
import {
  fetchSevenTvGlobalEmotes,
  getSevenTvResourceUrl,
} from "../emote-providers/sevenTvProvider";

type Emote = {
  id: string;
  code: string;
  url: string;
};

export default class EmoteParser {
  emotesMap = new Map<string, Emote>();

  constructor(private options?: { channelId?: string }) {}

  /**
   * Loads BTTV and 7tv emotes from the API.
   */
  async init() {
    const bttvGlobalEmotes = await fetchBttvGlobalEmotes().catch(() => []);
    const sevenTvGlobalEmotes = await fetchSevenTvGlobalEmotes().catch(
      () => []
    );
    const bttvChannelEmotes = await fetchBttvChannelEmotes(
      this.options?.channelId
    ).catch(() => []);

    [...sevenTvGlobalEmotes, ...bttvGlobalEmotes, ...bttvChannelEmotes].forEach(
      (emote) => {
        this.emotesMap.set(emote.code, emote);
      }
    );
  }

  parse(message: string): string[] {
    return message
      .split(" ")
      .map((word) => {
        const emote = this.emotesMap.get(word.trim());
        return emote?.url;
      })
      .filter((emote) => emote !== undefined);
  }
}
