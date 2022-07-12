


/// util

import { Yandlebars, type HandlerFunc } from "/dep.ts";

/// constant

import { handlebarsConfig } from "./constant.ts";

const handlebars = new Yandlebars(handlebarsConfig);



/// export

export async function showHome() {
  return await handlebars.render("index", {
    content: await handlebars.render("page/index", {
      posts: JSON.parse(await Deno.readTextFile("post.map.json"))
    }),
    description: "A blog about the DNS, Handshake, and the internet at large.",
    head: `<link rel="stylesheet" href="/home.css"/>`
  });
}
