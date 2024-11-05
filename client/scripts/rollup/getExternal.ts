import { getPackageJson } from "@scripts/utils";

export async function getExternal(): Promise<string[]> {
  const pkg = await getPackageJson();
  return Array.from<string>(
    new Set([
      "electron",
      ...Object.keys(pkg.devDependencies ?? []),
      ...Object.keys(pkg.peerDependencies ?? []),
    ]),
  );
}
