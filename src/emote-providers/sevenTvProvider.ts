import { Emote } from "../types";

function mapToUnifiedEmote(emote: {
  data: { id: string; name: string };
}): Emote {
  return {
    id: emote.data.id,
    code: emote.data.name,
    url: getSevenTvResourceUrl(emote.data.id),
  };
}

export async function fetchSevenTvGlobalEmotes() {
  return fetch("https://7tv.io/v3/emote-sets/global")
    .then(
      (res) =>
        res.json() as Promise<{
          emotes: { data: { id: string; name: string } }[];
        }>
    )
    .then((obj) => obj.emotes.map(mapToUnifiedEmote));
}

export function getSevenTvResourceUrl(id: string) {
  return `https://cdn.7tv.app/emote/${id}/2x.webp`;
}
