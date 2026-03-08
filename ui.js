import { COLORS } from "./constants.js";

export function bindColorChange(onColorChange) {
  const colorInput = document.querySelector("#color-input");
  colorInput.onchange = (e) => onColorChange(e.target.value);
}

export function bindClearCanvas(onClearCanvas) {
  const clearBtn = document.querySelector("#clear");
  clearBtn.onclick = onClearCanvas;
}

export function bindToolButtons(onToolSelect) {
  document.querySelectorAll("[data-tool]").forEach((btn) => {
    btn.addEventListener("click", () => onToolSelect(btn.dataset.tool));
  });
}

export function renderColorSwatches(onColorSelect) {
  const container = document.getElementById("colors-container");
  console.log({ COLORS });
  COLORS.forEach((color) => {
    const btn = document.createElement("button");
    btn.style.background = color;
    btn.className = "color-btn";
    btn.addEventListener("click", () => onColorSelect(color));
    container.appendChild(btn);
  });
}
