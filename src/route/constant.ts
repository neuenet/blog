


import { baseDirectory } from "../../deps.ts";

export const handlebarsConfig = {
  baseDir: `${baseDirectory}/src/view`,
  extension: ".hbs",
  partialDir: "partial",
  useCache: true
};

export const markdownConfig = {
  footnotes: true,
  smartPunctuation: true,
  strikethrough: true,
  tables: true
};
