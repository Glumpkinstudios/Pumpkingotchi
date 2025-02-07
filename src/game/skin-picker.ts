import { Random } from "excalibur";
import { Resources } from "./resources";
import { CaseInsensitiveMap } from "../utils/generic";

export default function getPumpkinSkin(
  username: string,
  rand = new Random(),
  skipDefaultSkin = false
) {
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
      res: Resources.pumpkinCook,
      weight: 0.2,
    },
    {
      res: Resources.pumpkinPemch,
      weight: 0.1,
    },
    {
      res: Resources.pumpkinZefaru,
      weight: 0.1,
    },
    {
      res: Resources.pumpkinSystem32,
      weight: 0.1,
    },
  ];

  // hardcoded map of default skins for specific users
  const userSkins = new CaseInsensitiveMap([
    ["angypeachy", Resources.pumpkinPemch],
    ["Zefaru", Resources.pumpkinZefaru],
    ["ItsSystem32", Resources.pumpkinSystem32],
    ["The_Mazor", Resources.pumpkinCook],
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
      return skin.res;
    }
  }

  // if we get here, something went wrong
  console.error("Failed to pick a pumpkin skin");
  return Resources.pumpkin;
}
