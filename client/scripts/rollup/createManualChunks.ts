export async function createManualChunks() {
  // const pkg = await getPackageJson();
  return (id: string): string | undefined => {
    const key = "/node_modules/";
    const idx = id.lastIndexOf(key);
    if (idx >= 0) {
      const name = id.slice(idx + key.length).split("/")[0];
      return `chunks/${name}`;
    }
    return;
  };
}
