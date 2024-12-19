import { app } from "electron";
import { getApplicationArgs } from "@lib/electron-utils";

const isPackaged = app.isPackaged;

export const args = getApplicationArgs<{
  boot_mode: "development" | "test" | "production";
  index_url: string | null;
  no_focus: boolean;
}>({
  boot_mode: isPackaged ? "production" : "development",
  index_url: null,
  no_focus: false,
});

if (args.boot_mode === "development") {
  process.env.NODE_ENV = "development";
}

// export const APP_PROTOCOL = "xaos";
export const isDevelopment = args.boot_mode === "development";
export const isTest = args.boot_mode === "test";
export const isProduction = args.boot_mode === "production";
