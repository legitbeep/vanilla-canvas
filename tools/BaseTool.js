class BaseTool {
  constructor(ctx, getRect) {
    this.ctx = ctx;
    this.getRect = getRect;
  }

  onMouseDown(e) {}
  onMouseMove(e) {}
  onMouseUp(e) {}

  __coords(e) {
    const rect = this.getRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }
}

export default BaseTool;
