


/// util

import { Yandlebars, type HandlerFunc } from "/dep.ts";

/// constant

import { handlebarsConfig } from "./constant.ts";

const handlebars = new Yandlebars(handlebarsConfig);



/// export

export const showComingSoon: HandlerFunc = async() => {
  return await handlebars.render("index", {
    content: await handlebars.render("page/coming-soon", {}),
    description: "A blog about the DNS, Handshake, and the internet at large.",
    head: `
      <link rel="stylesheet" href="/not-found.css"/>
      <title>the internet, by Neuenet/ &middot; a blog</title>
    `
  });
};
