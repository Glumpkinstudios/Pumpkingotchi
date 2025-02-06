import { ImageSource, Loadable, SpriteSheet } from "excalibur";
import CustomLoader from "./loader";
import { AsepriteResource } from "@excaliburjs/plugin-aseprite";

import backgroundTextureSrc from "../assets/background.png";
import pumpkinAsepriteSrc from "../assets/running_pumpkin_32.aseprite";

export const Resources = {
  backgroundTexture: new ImageSource(backgroundTextureSrc),
  pumpkinAseprite: new AsepriteResource(pumpkinAsepriteSrc),
} as const satisfies Record<string, Loadable<unknown>>;

export const loader = new CustomLoader(Object.values(Resources));
