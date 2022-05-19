


/// native

export { ensureDir, expandGlob } from "https://deno.land/std@0.137.0/fs/mod.ts";
export { format as formatDate } from "https://deno.land/std@0.137.0/datetime/mod.ts";
export { join } from "https://deno.land/std@0.139.0/path/mod.ts";
export { serve } from "https://deno.land/std@0.137.0/http/server.ts";

/// third-party

export { Application, Context } from "https://deno.land/x/abc@v1.3.3/mod.ts";
export { Feed } from "https://esm.sh/feed";
export { parse as frontmatter } from "https://deno.land/x/frontmatter@v0.1.4/mod.ts";
export { HighlightJS } from "https://cdn.esm.sh/v78/highlight.js@11.5.1/es2022/highlight.js";
export { html, tokens } from "https://deno.land/x/rusty_markdown@v0.4.1/mod.ts";
export { useDartSass } from "https://raw.githubusercontent.com/MarkTiedemann/deno-dart-sass/0.2.0/mod.ts";
export { Yandlebars } from "https://raw.githubusercontent.com/cybertim/yandlebars/main/mod.ts";

export type { HandlerFunc, MiddlewareFunc } from "https://deno.land/x/abc@v1.3.3/mod.ts";

/// project

export const baseDirectory = Deno.cwd();

export interface LooseObject {
  [key: string]: any;
}

export interface PostMetadata {
  date: string
  file: string
  slug: string
  tags: string
  title: string
  tldr: string
}

export function merge(source: any, target: any) {
  for (const [key, val] of Object.entries(source)) {
    if (val !== null && typeof val === "object") {
      if (target[key] === undefined) {
        // @ts-ignore
        target[key] = new val.__proto__.constructor();
      }

      merge(val, target[key]);
    } else {
      target[key] = val;
    }
  }

  return target;
  /// via https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6?permalink_comment_id=3889214
}

export const order = (maybeObject?: any) => {
  // TODO
  // : fix issue with dates becoming empty object
  // : create Deno port
  if (!maybeObject)
    return null;

  if (maybeObject instanceof Array || typeof maybeObject !== "object")
    return maybeObject;

  // https://stackoverflow.com/a/56833507
  const definitelyObject: { [index: string]: any } = maybeObject;
  const sortedKeys = Object.keys(definitelyObject).sort();

  // https://gist.github.com/aleph-naught2tog/938dd20dfc53e91da952569fd5655e2d
  return sortedKeys.reduce((objectSoFar, currentKey) => {
    const currentValue: any = definitelyObject[currentKey];
    const maybeSortedValue: any = order(currentValue);

    return Object.setPrototypeOf({
      ...objectSoFar,
      [currentKey]: maybeSortedValue === null ? 0 : maybeSortedValue
    }, Object.getPrototypeOf(definitelyObject));
  }, {});
};

export function searchObject(obj: LooseObject, searchItem: any, result?: LooseObject) {
  result = {};

  for (const key in obj) {
    if (searchItem === obj[key])
      result[key] = obj[key];
  }

  return result;
}



/// reference
// https://deno.land/std/fs
// https://deno.land/std/datetime
// https://deno.land/std/http

// https://deno.land/x/abc
// https://deno.land/x/frontmatter
// https://deno.land/x/minifier
// https://deno.land/x/rusty_markdown

// https://github.com/marktiedemann/deno-dart-sass
// https://github.com/cybertim/yandlebars
