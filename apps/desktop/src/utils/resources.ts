import path from "node:path";
import { app } from "electron";

const isPackaged = app.isPackaged;

/**
 * - dist
 * - Resources/app.asar
 */
const APP_PATH = app.getAppPath();

/**
 * - resources/*
 * - Resources/app.asar/*
 */
const INTERNAL_RESOURCES_PATH = isPackaged
  ? path.resolve(APP_PATH, ".")
  : path.resolve(APP_PATH, "../resources");

/**
 * - resources/.*
 * - Resources/.*
 */
const EXTERNAL_RESOURCES_PATH = isPackaged
  ? path.resolve(process.resourcesPath, ".")
  : path.resolve(APP_PATH, "../resources");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type WithRelativePrefix = `./${string}`;
type NoDotPrefixString<P extends WithRelativePrefix> = P extends `./.${string}`
  ? never
  : P;
type DotPrefixString<P extends WithRelativePrefix> = P extends `./.${string}`
  ? P
  : never;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const getInternalFilename = <T extends WithRelativePrefix>(
  field: NoDotPrefixString<T>,
  ...args: string[]
) => {
  const isCompiledFile = [
    "./main",
    "./preload",
    "./renderer",
    "./package.json",
  ].some((x) => field.startsWith(x));
  if (isCompiledFile) {
    return path.resolve(APP_PATH, field, ...args);
  } else {
    return path.resolve(INTERNAL_RESOURCES_PATH, field, ...args);
  }
};

export const getExternalFilename = <T extends WithRelativePrefix>(
  field: DotPrefixString<T>,
  ...args: string[]
) => path.resolve(EXTERNAL_RESOURCES_PATH, field, ...args);
