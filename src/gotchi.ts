import { Color, DisplayMode, Engine, FadeInOut } from 'excalibur';
import { MainScene } from './game/scene';
import { loader } from './game/resources';

const options: Record<string, string | undefined> = Object.fromEntries(
  new URLSearchParams(window.location.search)
);

const game = new Engine({
  width: options.width !== undefined ? Number.parseInt(options.width) : 512,
  height: options.height !== undefined ? Number.parseInt(options.height) : 512,
  displayMode: DisplayMode.Fixed,
  pixelArt: true,
  scenes: {
    main: new MainScene({
      channel: options.channel,
      blackList: options.blackList?.split(','),
      transparent: !!options.transparent,
    }),
  },
  maxFps: options.fps !== undefined ? Number.parseInt(options.fps) : 48,
  fixedUpdateFps:
    options.fixedFps !== undefined ? Number.parseInt(options.fixedFps) : 24,
  canvasElementId: 'game-canvas',
});

if (!options.transparent) {
  document.body.style.backgroundColor = 'black';
}

game
  .start('main', {
    loader,
    inTransition: options.transparent
      ? undefined
      : new FadeInOut({
          duration: 1000,
          direction: 'in',
          color: Color.Black,
        }),
  })
  .then(() => {});
