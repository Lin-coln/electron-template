import { Options } from "tsup";

export function getNoExternal(): Options["noExternal"] {
  return [
    // libs
    "@lib/electron-utils",
    // ...["electron-devtools-installer"],
  ];
}
