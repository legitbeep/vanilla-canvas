const TOOLS = {
  BRUSH: "BRUSH",
  SELECT: "SELECT",
  RECT: "RECT",
  SQUARE: "SQUARE",
  CIRCLE: "CIRCLE",
  IMAGE: "IMAGE",
};
const COLORS = ["black", "red", "green", "blue", "yellow"];

class CanvasManager {}

class App {}

class Canvas {
  constructor() {
    this.canvas = document.querySelector(".main-canvas");
    this.canvasArea = document.querySelector(".canvas-area");

    // Set canvas resolution ONCE from the container
    this.canvas.height = this.canvasArea.offsetHeight;
    this.canvas.width = this.canvasArea.offsetWidth;

    this.ctx = this.canvas.getContext("2d");
    this.color = COLORS[0];
    this.drawing = false;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
    this.handleTool(TOOLS.BRUSH);

    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("mouseup", this.onMouseUp);

    // rect is only for mouse offset calculation, not canvas size
    this.rect = this.canvas.getBoundingClientRect();
    let resizeTimer;
    // On resize: update both rect AND canvas dimensions
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const imageData = this.ctx.getImageData(
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );

        this.canvas.height = this.canvasArea.offsetHeight;
        this.canvas.width = this.canvasArea.offsetWidth;

        this.ctx.putImageData(imageData, 0, 0);
        this.rect = this.canvas.getBoundingClientRect();
      }, 100);
    });

    // On scroll: only update rect (canvas size doesn't change!)
    window.addEventListener("scroll", () => {
      this.rect = this.canvas.getBoundingClientRect();
    });
  }

  onMouseDown(e) {
    this.drawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(e.clientX - this.rect.left, e.clientY - this.rect.top);
  }
  onMouseMove(e) {
    let x = e.clientX - this.rect.left;
    let y = e.clientY - this.rect.top;
    if (this.drawing) {
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }
  }
  onMouseUp() {
    this.drawing = false;
  }

  handleBrushTool() {}
  handleSelectTool() {}
  handleRectTool() {}
  handleSquareTool() {}
  handleCircleTool() {}
  handleImageTool() {}
  onColorChange(color) {
    this.color = color;
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
  }

  handleTool(tool) {
    this.tool = tool;
    const fn = {
      [TOOLS.BRUSH]: this.handleBrushTool,
      [TOOLS.SELECT]: this.handleSelectTool,
      [TOOLS.RECT]: this.handleRectTool,
      [TOOLS.SQUARE]: this.handleSquareTool,
      [TOOLS.CIRCLE]: this.handleCircleTool,
      [TOOLS.IMAGE]: this.handleImageTool,
    };
    return fn[tool]?.call(this);
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function renderColors(onColorSelect) {
  const container = document.getElementById("colors-container");
  COLORS.forEach((clr) => {
    const btn = document.createElement("button");
    btn.style.background = clr;
    btn.className = "color-btn";
    btn.onclick = onColorSelect.bind(null, clr);
    container.appendChild(btn);
  });
}
function bindClearCanvas(fn) {
  const clearBtn = document.querySelector("#clear");
  clearBtn.onclick = fn;
}
function bindColorChange(fn) {
  const colorInput = document.querySelector("#color-input");
  colorInput.onchange = (e) => fn(e.target.value);
}

function init() {
  try {
    const canvas = new Canvas();
    renderColors(canvas.onColorChange);
    bindColorChange(canvas.onColorChange);
    bindClearCanvas(canvas.clearCanvas);
  } catch (err) {
    console.log(err);
  }
}

// Do this:
window.addEventListener("load", init);
// or
