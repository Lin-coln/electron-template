import { getPackageJson } from "./scripts/utils";

interface ApplicationConfig {
  app_name: string;
  product_name: string;
  author: string;
  version: string;
  description: string;
  copyright: string;
  //
  protocols?: string[];
}

export async function resolveAppConfig() {
  const pkg = await getPackageJson();
  const cfg: ApplicationConfig = {
    app_name: "foobar",
    product_name: "Foobar", // pkg.name,
    author: "lincoln",
    version: pkg.version,
    description: pkg.description ?? pkg.name,
    copyright: "my copyright",

    // ...
    protocols: [],
  };
  return cfg;
}
