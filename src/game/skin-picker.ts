import { Random } from 'excalibur';
import { Resources } from './resources';
import { CaseInsensitiveMap } from '../utils/generic';
import { AsepriteResource } from '@excaliburjs/plugin-aseprite';

function getPersistedSkins() {
  const pumpkinSkin = localStorage.getItem('pumpkingotchi-user-skins');
  const userSkins =
    pumpkinSkin &&
    (JSON.parse(pumpkinSkin) as Record<string, string | undefined>);

  return userSkins || {};
}

function persistUserSkin(username: string, skin: string | undefined) {
  try {
    if (!skin) {
      throw new Error('Skin is undefined');
    }
    const userSkins = getPersistedSkins();
    userSkins[username] = skin;
    localStorage.setItem('pumpkingotchi-user-skins', JSON.stringify(userSkins));
  } catch (err) {
    console.error(`Failed to persist skin for user ${username}`, err);
  }
}

export default function getPumpkinSkin(
  username: string,
  rand = new Random(),
  skipDefaultSkin = false,
  persist = false
) {
  // check the local storage first if the persistence is enabled
  if (!skipDefaultSkin && persist) {
    try {
      const userSkins = getPersistedSkins();
      const userSkin = userSkins[username];
      const resource =
        userSkin && Resources[userSkin as keyof typeof Resources];

      if (resource && resource instanceof AsepriteResource) {
        return resource;
      }
    } catch (err) {
      console.error(`Failed to load persisted skin for user ${username}`, err);
    }
  }

  const skinChance = 0.2;
  const skinWeights = [
    {
      res: Resources.pumpkinBeard,
    },
    {
      res: Resources.pumpkinCat,
    },
    {
      res: Resources.pumpkinNerd,
    },
    {
      res: Resources.pumpkinDaisy,
    },
    {
      res: Resources.pumpkinPiphat,
    },
    {
      res: Resources.pumpkinWitch,
    },
    {
      res: Resources.pumpkinGlorp,
    },
    {
      res: Resources.watermelon,
      weight: 0.5,
    },
    {
      res: Resources.pumpkinFire,
      weight: 0.05,
    },
    {
      res: Resources.pumpkinMaid,
      weight: 0.2,
    },
    {
      res: Resources.pumpkinCook,
      weight: 0.2,
    },
    {
      res: Resources.pumpkinPemch,
      weight: 0.1,
    },
    {
      res: Resources.pumpkinZerfaru,
      weight: 0.1,
    },
    {
      res: Resources.pumpkinSystem32,
      weight: 0.1,
    },
    {
      res: Resources.orangesuit,
      weight: 0.1,
    },
    {
      res: Resources.pumpkinOrangeHat,
      weight: 0.1,
    },
  ];

  // hardcoded map of default skins for specific users
  const userSkins = new CaseInsensitiveMap([
    ['angypeachy', Resources.pumpkinPemch],
    ['Zerfaru', Resources.pumpkinZerfaru],
    ['ItsSystem32', Resources.pumpkinSystem32],
    ['The_Mazor', Resources.pumpkinCook],
    ['Orangesuit1', Resources.orangesuit],
    ['angrid69', Resources.pumpkinFire],
    ['GlowyPumpkin', Resources.pumpkinNerd],
    ['HatAndHoodie', Resources.pumpkinOrangeHat],
  ]);

  const defaultSkin = userSkins.get(username) ?? Resources.pumpkin;
  const useDefaultSkin =
    !skipDefaultSkin &&
    (userSkins.has(username) || rand.floating(0, 1) > skinChance);

  // if the skinchance roll fails, return the default skin
  if (useDefaultSkin) {
    return defaultSkin;
  }

  // pick a random pumpkin skin using skinWeights
  const weightSum = skinWeights.reduce(
    (acc, curr) => acc + (curr.weight ?? 1),
    0
  );
  let randPick = rand.floating(0, weightSum);
  for (const skin of skinWeights) {
    randPick -= skin.weight ?? 1;
    if (randPick <= 0) {
      // persist the skin after rolling
      if (persist) {
        persistUserSkin(
          username,
          Object.entries(Resources).find((entry) => entry[1] === skin.res)?.[0]
        );
      }

      return skin.res;
    }
  }

  // if we get here, something went wrong
  console.error('Failed to pick a pumpkin skin');
  return Resources.pumpkin;
}
