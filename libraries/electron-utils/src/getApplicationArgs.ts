const APPLICATION_ARGS: Record<string, string | number | boolean> = process.argv
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
    } else if (parseInt(v as string).toString() === v) {
      v = parseInt(v);
    } else {
      // string value
    }

    acc[k] = v;
    return acc;
  }, {});

export const getApplicationArgs = <
  T extends Record<string, string | number | boolean | null> = Record<
    string,
    string | number | boolean | null
  >,
>(
  defArgs?: Partial<T>,
): T => {
  return Object.assign(defArgs ?? {}, APPLICATION_ARGS) as T;
};
