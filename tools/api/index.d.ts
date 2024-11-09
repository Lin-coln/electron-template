import { ChildProcess } from "child_process";

export function ts(
  target: string,
  env?: Record<string, string | number | boolean | undefined>,
): Promise<void>;

export function useCleanup(
  callback: () => unknown,
  target?: NodeJS.Process | ChildProcess,
): void;

export function isMainEntry(meta: any): boolean;
