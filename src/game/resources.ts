import { ImageSource, ImageWrapping, Loadable } from 'excalibur';
import CustomLoader from './loader';
import { AsepriteResource } from '@excaliburjs/plugin-aseprite';

import backgroundTextureSrc from '../assets/background.png';
import pumpkinAsepriteSrc from '../assets/running_pumpkin_32.aseprite';
import pumpkinPemchSkinSrc from '../assets/skins/running_pemch_32.aseprite';
import pumpkinBeardSkinSrc from '../assets/skins/running_pumpkin_beard_32.aseprite';
import pumpkinCookSkinSrc from '../assets/skins/running_pumpkin_cook_32.aseprite';
import pumpkinNerdSkinSrc from '../assets/skins/running_pumpkin_nerd_32.aseprite';
import pumpkinSystem32SkinSrc from '../assets/skins/running_pumpkin_system32_32.aseprite';
import pumpkinZerfaruSkinSrc from '../assets/skins/running_pumpkin_zerfaru_32.aseprite';
import pumpkinCatSkinSrc from '../assets/skins/running_pumpkin_cat_32.aseprite';
import pumpkinDaisySkinSrc from '../assets/skins/running_pumpkin_daisy_32.aseprite';
import pumpkinPiphatSkinSrc from '../assets/skins/running_pumpkin_piphat_32.aseprite';
import orangesuitSkinSrc from '../assets/skins/running_orangesuit.aseprite';
import pumpkinMaidSkinSrc from '../assets/skins/running_pumpkin_maid_32.aseprite';
import watermelonSkinSrc from '../assets/skins/running_watermelon_32.aseprite';
import pumpkinFireSkinSrc from '../assets/skins/running_pumpkin_fire_32.aseprite';
import pumpkinWitchSkinSrc from '../assets/skins/running_pumpkin_witch_32.aseprite';
import pumpkinGlorpSkinSrc from '../assets/skins/running_pumpkin_glorp_32.aseprite';
import pumpkinOrangeHatSkinSrc from '../assets/skins/running_pumpkin_hat_hoodie_32.aseprite';

export const Resources = {
  backgroundTexture: new ImageSource(backgroundTextureSrc, {
    wrapping: ImageWrapping.Repeat,
  }),
  pumpkin: new AsepriteResource(pumpkinAsepriteSrc),
  pumpkinPemch: new AsepriteResource(pumpkinPemchSkinSrc),
  pumpkinBeard: new AsepriteResource(pumpkinBeardSkinSrc),
  pumpkinCook: new AsepriteResource(pumpkinCookSkinSrc),
  pumpkinNerd: new AsepriteResource(pumpkinNerdSkinSrc),
  pumpkinSystem32: new AsepriteResource(pumpkinSystem32SkinSrc),
  pumpkinZerfaru: new AsepriteResource(pumpkinZerfaruSkinSrc),
  pumpkinCat: new AsepriteResource(pumpkinCatSkinSrc),
  pumpkinDaisy: new AsepriteResource(pumpkinDaisySkinSrc),
  pumpkinPiphat: new AsepriteResource(pumpkinPiphatSkinSrc),
  orangesuit: new AsepriteResource(orangesuitSkinSrc),
  pumpkinMaid: new AsepriteResource(pumpkinMaidSkinSrc),
  watermelon: new AsepriteResource(watermelonSkinSrc),
  pumpkinFire: new AsepriteResource(pumpkinFireSkinSrc),
  pumpkinWitch: new AsepriteResource(pumpkinWitchSkinSrc),
  pumpkinGlorp: new AsepriteResource(pumpkinGlorpSkinSrc),
  pumpkinOrangeHat: new AsepriteResource(pumpkinOrangeHatSkinSrc),
} as const satisfies Record<string, Loadable<unknown>>;

export const loader = new CustomLoader(Object.values(Resources));
