import { Rectangle, screen, Display } from "electron";

export type BoundsOptions = {
  width: number;
  height: number;
  placement:
    | "center"
    | [
        number | "left" | "center" | "right",
        number | "top" | "center" | "bottom",
      ];
  display?: Display | number;
  margin?: number | [number, number] | [number, number, number, number];
};

export function getBounds(opts: BoundsOptions): Rectangle {
  const margin: [number, number, number, number] = (
    !opts.margin
      ? [0, 0, 0, 0]
      : !Array.isArray(opts.margin)
        ? Array.from({ length: 4 }, () => opts.margin)
        : opts.margin.length === 2
          ? [...opts.margin, ...opts.margin]
          : opts.margin
  ) as any;

  const displays = screen.getAllDisplays();
  const display: Display =
    typeof opts.display === "number"
      ? displays[Math.max(0, Math.min(displays.length - 1, opts.display))]
      : !!opts.display
        ? opts.display
        : screen.getPrimaryDisplay();

  const { width, height } = opts;

  let x = display.bounds.x;
  let y = display.bounds.y;

  const [_x, _y] = Array.isArray(opts.placement)
    ? opts.placement
    : [opts.placement, opts.placement];

  const offsetX =
    _x === "left" ? 0 : _x === "center" ? 0.5 : _x === "right" ? 1 : _x;
  x += (display.bounds.width - width) * offsetX;
  if (offsetX < 0.5) {
    x += margin[3];
  } else if (offsetX > 0.5) {
    x -= margin[1];
  }

  const offsetY =
    _y === "top" ? 0 : _y === "center" ? 0.5 : _y === "bottom" ? 1 : _y;
  y += (display.bounds.height - height) * offsetY;
  if (offsetY < 0.5) {
    y += margin[0];
  } else if (offsetY > 0.5) {
    y -= margin[2];
  }

  return {
    width,
    height,
    x,
    y,
  };
}
