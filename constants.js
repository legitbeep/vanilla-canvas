export const TOOLS = {
  BRUSH: "BRUSH",
  SELECT: "SELECT",
  RECT: "RECT",
  SQUARE: "SQUARE",
  CIRCLE: "CIRCLE",
  IMAGE: "IMAGE",
};
export const COLORS = ["black", "red", "green", "blue", "yellow"];

export const SELECT_TOOL_STATE = {
    IDLE: "IDLE",
    SELECTING: "SELECTING", // dragging to draw the selection rect
    SELECTED: "SELECTED",   // selection exists, user can move it
    MOVING: "MOVING",       // dragging the selected region
  };