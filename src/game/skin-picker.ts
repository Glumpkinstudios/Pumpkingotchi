import { Random } from "excalibur";
import { Resources } from "./resources";
import { compareStringsCaseInsensitive } from "../utils/generic";

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

  // first check if user is in the hardcoded list of usernames
  if (compareStringsCaseInsensitive(username, "angypeachy")) {
    return Resources.pumpkinPemch;
  }

  if (compareStringsCaseInsensitive(username, "Zefaru")) {
    return Resources.pumpkinZefaru;
  }

  if (compareStringsCaseInsensitive(username, "ItsSystem32")) {
    return Resources.pumpkinSystem32;
  }

  if (compareStringsCaseInsensitive(username, "The_Mazor")) {
    return Resources.pumpkinCook;
  }

  // if the skinchance roll fails, return the default pumpkin skin
  if (!skipDefaultSkin && rand.floating(0, 1) > skinChance) {
    return Resources.pumpkin;
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
