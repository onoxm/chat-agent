import { fileURLToPath } from "node:url";

export const resolvePath = (
  path: string,
  base: string | URL = import.meta.url,
) => fileURLToPath(new URL(path, base));
