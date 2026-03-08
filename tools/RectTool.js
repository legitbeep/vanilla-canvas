import BaseTool from "./BaseTool.js";

class RectTool extends BaseTool {
  constructor(ctx, getRect) {
    super(ctx, getRect);
    this._drawing = false;
    this._startx = 0;
    this._starty = 0;
    this._snapshot = null;
  }

  onMouseDown(e) {
    this._drawing = true;
    const { x, y } = this.__coords(e);
    this._startx = x;
    this._starty = y;
    this._snapshot = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
  }

  onMouseMove(e) {
    if (!this._drawing) return;
    const { x, y } = this.__coords(e);
    // return to original state
    this.ctx.putImageData(this._snapshot, 0, 0);
    this._drawShape(this._startx, this._starty, x, y);
  }

  onMouseUp(e) {
    this._drawing = false;
    this._snapshot = null;
  }

  _drawShape(x1, y1, x2, y2) {
    this.ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  }
}

export default RectTool;
