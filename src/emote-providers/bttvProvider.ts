import { Emote } from '../types';

function mapToUnifiedEmote(emote: { id: string; code: string }): Emote {
  return {
    id: emote.id,
    code: emote.code,
    url: getBttvResourceUrl(emote.id),
  };
}

export async function fetchBttvGlobalEmotes() {
  return fetch('https://api.betterttv.net/3/cached/emotes/global')
    .then((res) => res.json() as Promise<{ id: string; code: string }[]>)
    .then((emotes) => emotes.map(mapToUnifiedEmote));
}

export async function fetchBttvChannelEmotes(channelId?: string) {
  if (!channelId) return [];

  return fetch(`https://api.betterttv.net/3/cached/users/twitch/${channelId}`)
    .then(
      (res) =>
        res.json() as Promise<{ channelEmotes: { id: string; code: string }[] }>
    )
    .then((emotes) => emotes.channelEmotes.map(mapToUnifiedEmote));
}

export function getBttvResourceUrl(id: string) {
  return `https://cdn.betterttv.net/emote/${id}/1x`;
}
