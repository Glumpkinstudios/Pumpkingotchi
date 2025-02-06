import { DefaultLoader, Loadable } from "excalibur";

export default class CustomLoader extends DefaultLoader {
  constructor(loadables: Loadable<unknown>[]) {
    super();
    this.addResources(loadables);
  }

  onDraw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}
