// tools/SelectTool.js
import { BaseTool } from "./BaseTool.js";
import { SELECT_TOOL_STATE as STATE } from "./constants.js";

class SelectTool extends BaseTool {
  constructor(ctx, getRect) {
    super(ctx, getRect);

    this._state = STATE.IDLE;

    // The selection rectangle in canvas coords
    this._sel = null; // { x, y, w, h }

    // The pixel data lifted off the canvas
    this._floatingPixels = null;

    // Where the mouse was when MOVING started
    this._dragStart = null;

    // The snapshot of canvas BEFORE the selection was lifted
    this._canvasSnapshot = null;

    // Animation frame id for marching ants
    this._antsFrame = null;
    this._antsOffset = 0;
  }

  // ─── Mouse handlers ────────────────────────────────────────────────

  onMouseDown(e) {
    const { x, y } = this._coords(e);

    if (this._state === STATE.SELECTED && this._isInsideSel(x, y)) {
      // Start moving the floating selection
      this._state = STATE.MOVING;
      this._dragStart = { x, y };
      return;
    }

    // Stamp any existing floating selection before starting a new one
    this._stampFloating();
    this._clearAnts();

    // Start a new selection
    this._state = STATE.SELECTING;
    this._sel = { x, y, w: 0, h: 0 };
    this._canvasSnapshot = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
  }

  onMouseMove(e) {
    const { x, y } = this._coords(e);

    if (this._state === STATE.SELECTING) {
      const { x: sx, y: sy } = this._sel;
      this._sel.w = x - sx;
      this._sel.h = y - sy;

      // Restore snapshot and redraw selection preview
      this.ctx.putImageData(this._canvasSnapshot, 0, 0);
      this._drawSelectionRect();
      return;
    }

    if (this._state === STATE.MOVING) {
      const dx = x - this._dragStart.x;
      const dy = y - this._dragStart.y;

      // Restore canvas without the lifted pixels
      this.ctx.putImageData(this._canvasSnapshot, 0, 0);

      // Move the selection rect
      this._sel.x += dx;
      this._sel.y += dy;
      this._dragStart = { x, y };

      // Draw the floating pixels at new position
      this._drawFloating();
      this._drawSelectionRect();
    }
  }

  onMouseUp(e) {
    if (this._state === STATE.SELECTING) {
      this._normalizeRect();

      if (this._sel.w < 2 && this._sel.h < 2) {
        // Tiny click with no drag = deselect
        this._reset();
        return;
      }

      // Lift the pixels out of the canvas
      this._liftPixels();
      this._state = STATE.SELECTED;
      this._startAnts();
      return;
    }

    if (this._state === STATE.MOVING) {
      // Update the snapshot to include the moved pixels at new position
      this._updateSnapshotWithFloating();
      this._state = STATE.SELECTED;
    }
  }

  // Called when user switches away from this tool
  onDeactivate() {
    this._stampFloating();
    this._reset();
  }

  // ─── Selection rect helpers ─────────────────────────────────────────

  // Ensure w/h are always positive (handles dragging up/left)
  _normalizeRect() {
    let { x, y, w, h } = this._sel;
    if (w < 0) {
      x += w;
      w = Math.abs(w);
    }
    if (h < 0) {
      y += h;
      h = Math.abs(h);
    }
    this._sel = { x, y, w, h };
  }

  _isInsideSel(x, y) {
    const { x: sx, y: sy, w, h } = this._sel;
    return x >= sx && x <= sx + w && y >= sy && y <= sy + h;
  }

  // ─── Pixel lifting / stamping ───────────────────────────────────────

  _liftPixels() {
    const { x, y, w, h } = this._sel;
    // Copy the pixels
    this._floatingPixels = this.ctx.getImageData(x, y, w, h);
    // Erase them from canvas (leave a hole)
    this.ctx.clearRect(x, y, w, h);
    // Update snapshot to reflect the hole
    this._canvasSnapshot = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
  }

  _drawFloating() {
    if (!this._floatingPixels) return;
    const offscreen = document.createElement("canvas");
    offscreen.width = this._sel.w;
    offscreen.height = this._sel.h;
    offscreen.getContext("2d").putImageData(this._floatingPixels, 0, 0);
    this.ctx.drawImage(offscreen, this._sel.x, this._sel.y);
  }

  _stampFloating() {
    if (!this._floatingPixels) return;
    this._drawFloating();
    this._floatingPixels = null;
  }

  _updateSnapshotWithFloating() {
    this._stampFloating();
    this._canvasSnapshot = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
    // Re-lift so the selection stays active
    this._liftPixels();
  }

  // ─── Marching ants ──────────────────────────────────────────────────

  _drawSelectionRect() {
    const { x, y, w, h } = this._sel;
    this.ctx.save();
    this.ctx.setLineDash([6, 3]);
    this.ctx.lineDashOffset = -this._antsOffset;
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, w, h);
    // White offset dash for contrast on dark backgrounds
    this.ctx.strokeStyle = "white";
    this.ctx.lineDashOffset = -(this._antsOffset + 4);
    this.ctx.strokeRect(x, y, w, h);
    this.ctx.restore();
  }

  _startAnts() {
    const animate = () => {
      if (this._state !== STATE.SELECTED) return;
      this._antsOffset = (this._antsOffset + 0.5) % 9;
      // Redraw canvas + floating + ants each frame
      this.ctx.putImageData(this._canvasSnapshot, 0, 0);
      this._drawFloating();
      this._drawSelectionRect();
      this._antsFrame = requestAnimationFrame(animate);
    };
    this._antsFrame = requestAnimationFrame(animate);
  }

  _clearAnts() {
    if (this._antsFrame) {
      cancelAnimationFrame(this._antsFrame);
      this._antsFrame = null;
    }
  }

  // ─── Cleanup ────────────────────────────────────────────────────────

  _reset() {
    this._state = STATE.IDLE;
    this._sel = null;
    this._floatingPixels = null;
    this._dragStart = null;
    this._canvasSnapshot = null;
    this._clearAnts();
  }
}

export default SelectTool;
