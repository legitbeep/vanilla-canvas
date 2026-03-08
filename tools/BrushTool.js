import BaseTool from "./BaseTool.js";

class BrushTool extends BaseTool {
  constructor(ctx, getRect) {
    super(ctx, getRect);
    this._drawing = false;
  }

  onMouseDown(e) {
    this._drawing = true;
    const { x, y } = this.__coords(e);

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  onMouseMove(e) {
    if (!this._drawing) return;
    const { x, y } = this.__coords(e);

    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  onMouseUp(e) {
    this._drawing = false;
  }
}

export default BrushTool;
