


/// util

import { Yandlebars } from "../../deps.ts";
import type { HandlerFunc } from "../../deps.ts";

/// constant

import { handlebarsConfig } from "./constant.ts";

const handlebars = new Yandlebars(handlebarsConfig);



/// export

export const showNotFound: HandlerFunc = async(context) => {
  const { url: { pathname }} = context;

  return await handlebars.render("index", {
    content: await handlebars.render("page/not-found", {
      content: `<code>${pathname}</code>`
    }),
    description: "A blog about the DNS, Handshake, and the internet at large.",
    head: `<link rel="stylesheet" href="/not-found.css"/>`
  });
};
