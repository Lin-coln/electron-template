import { Options } from "tsup";

export function getTsupNoExternal(): Options["noExternal"] {
  return [
    // libs
    "@lib/electron-utils",
    // ...["electron-devtools-installer"],
  ];
}
