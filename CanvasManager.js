class CanvasManager {
  constructor(canvasSelector = ".main-canvas", areaSelector = ".canvas-area") {
    this.canvas = document.querySelector(canvasSelector);
    this.canvasArea = document.querySelector(areaSelector);
    this.ctx = this.canvas.getContext("2d");

    this._fitToContainer();
    this._bindResizeAndScroll();

    // rect is used by tools to translate clientX/Y → canvas coords
    this.rect = this.canvas.getBoundingClientRect();
  }

  getContext() {
    return this.ctx;
  }
  getRect() {
    return this.rect;
  }
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  setColor(color) {
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
  }

  _fitToContainer() {
    this.canvas.height = this.canvasArea.offsetHeight;
    this.canvas.width = this.canvasArea.offsetWidth;
  }

  _bindResizeAndScroll() {
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // existing image
        const imageData = this.ctx.getImageData(
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
        // new size
        this.canvas.height = this.canvasArea.offsetHeight;
        this.canvas.width = this.canvasArea.offsetWidth;

        this.ctx.putImageData(imageData, 0, 0);
        this.rect = this.canvas.getBoundingClientRect();
      }, 100);
    });

    window.addEventListener("scroll", () => {
      this.rect = this.canvas.getBoundingClientRect();
    });
  }
}

export default CanvasManager;
