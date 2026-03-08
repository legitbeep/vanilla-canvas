import BrushTool from "./tools/BrushTool.js";
import RectTool from "./tools/RectTool.js";
import SelectTool from "./tools/SelectTool.js";
import CircleTool from "./tools/CircleTool.js";
import { TOOLS } from "./constants.js";

class ToolsRegistry {
  constructor(ctx, getRect) {
    this._tools = {
      [TOOLS.BRUSH]: new BrushTool(ctx, getRect),
      [TOOLS.SELECT]: new SelectTool(ctx, getRect),
      //   [TOOLS.SELECT]: new SelectTool(ctx, getRect),
      [TOOLS.RECT]: new RectTool(ctx, getRect),
      //   [TOOLS.SQUARE]: new SquareTool(ctx, getRect),
      [TOOLS.CIRCLE]: new CircleTool(ctx, getRect),
      //   [TOOLS.IMAGE]: new ImageTool(ctx, getRect),
    };
  }

  get(toolName) {
    const tool = this._tools[toolName];
    if (!tool) throw new Error(`Uknown tool : ${toolName}`);
    return tool;
  }
}
export default ToolsRegistry;
