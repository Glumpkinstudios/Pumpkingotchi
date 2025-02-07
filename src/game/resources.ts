import { ImageSource, Loadable, SpriteSheet } from "excalibur";
import CustomLoader from "./loader";
import { AsepriteResource } from "@excaliburjs/plugin-aseprite";

import backgroundTextureSrc from "../assets/background.png";
import pumpkinAsepriteSrc from "../assets/running_pumpkin_32.aseprite";
import pumpkinPemchSkinSrc from "../assets/skins/running_pemch_32.aseprite";
import pumpkinBeardSkinSrc from "../assets/skins/running_pumpkin_beard_32.aseprite";
import pumpkinCookSkinSrc from "../assets/skins/running_pumpkin_cook_32.aseprite";
import pumpkinNerdSkinSrc from "../assets/skins/running_pumpkin_nerd_32.aseprite";
import pumpkinSystem32SkinSrc from "../assets/skins/running_pumpkin_system32_32.aseprite";
import pumpkinZerfaruSkinSrc from "../assets/skins/running_pumpkin_zerfaru_32.aseprite";
import pumpkinCatSkinSrc from "../assets/skins/running_pumpkin_cat_32.aseprite";

export const Resources = {
  backgroundTexture: new ImageSource(backgroundTextureSrc),
  pumpkin: new AsepriteResource(pumpkinAsepriteSrc),
  pumpkinPemch: new AsepriteResource(pumpkinPemchSkinSrc),
  pumpkinBeard: new AsepriteResource(pumpkinBeardSkinSrc),
  pumpkinCook: new AsepriteResource(pumpkinCookSkinSrc),
  pumpkinNerd: new AsepriteResource(pumpkinNerdSkinSrc),
  pumpkinSystem32: new AsepriteResource(pumpkinSystem32SkinSrc),
  pumpkinZerfaru: new AsepriteResource(pumpkinZerfaruSkinSrc),
  pumpkinCat: new AsepriteResource(pumpkinCatSkinSrc),
} as const satisfies Record<string, Loadable<unknown>>;

export const loader = new CustomLoader(Object.values(Resources));
