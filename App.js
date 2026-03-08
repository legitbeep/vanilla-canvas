import { TOOLS, COLORS } from "./constants.js";
import {
  bindColorChange,
  bindClearCanvas,
  bindToolButtons,
  renderColorSwatches,
} from "./ui.js";
import CanvasManager from "./CanvasManager.js";
import ToolsRegistry from "./ToolsRegistry.js";

class App {
  constructor() {
    this.canvasManager = new CanvasManager();
    this.toolsRegistry = new ToolsRegistry(
      this.canvasManager.getContext(),
      () => this.canvasManager.getRect()
    );

    // tools set active to brush;
    this.activeTool = this.toolsRegistry.get(TOOLS.BRUSH);

    this._bindUI();
    this._bindCanvasEvents();
  }

  _bindCanvasEvents() {
    const canvas = this.canvasManager.canvas;
    canvas.addEventListener("mousedown", (e) => this.activeTool.onMouseDown(e));
    canvas.addEventListener("mousemove", (e) => this.activeTool.onMouseMove(e));
    canvas.addEventListener("mouseup", (e) => this.activeTool.onMouseUp(e));
  }

  _bindUI() {
    const { canvasManager, toolsRegistry } = this;
    console.log("REACHED HERE");
    bindColorChange((color) => {
      canvasManager.setColor(color);
    });
    renderColorSwatches((color) => {
      canvasManager.setColor(color);
    });
    bindClearCanvas(() => {
      canvasManager.clear();
    });
    bindToolButtons((toolName) => {
      this.activeTool.onDeactivate?.();
      this.activeTool = this.toolsRegistry.get(toolName);
    });
  }
}

function init() {
  try {
    new App();
  } catch (err) {
    console.log("Init failed", err);
  }
}

window.addEventListener("load", init);
