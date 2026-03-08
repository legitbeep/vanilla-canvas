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

    const radiusX = Math.abs(x - this._startx) / 2;
    const radiusY = Math.abs(y - this._starty) / 2;

    const centerX = this._startx + (x - this._startx) / 2;
    const centerY = this._starty + (y - this._starty) / 2;

    this.ctx.beginPath();
    this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  onMouseUp(e) {
    this._drawing = false;
    this._snapshot = null;
  }
}

export default RectTool;
