const APPLICATION_ARGS: Record<string, string | boolean> = process.argv
  .slice(2)
  .filter((x) => x.startsWith("--"))
  .map((x) => {
    const [k, v] = x.split("=");
    return [k.slice(2), v] as [string, unknown];
  })
  .reduce((acc, entry) => {
    let [k, v] = entry;
    if (v === undefined) {
      v = true;
    } else if (v === "true" || v === "false") {
      v = v == "true";
    }
    acc[k] = v;
    return acc;
  }, {});

export const getApplicationArgs = <
  T extends Record<string, string | boolean> = Record<string, string | boolean>,
>(): T => APPLICATION_ARGS as T;
