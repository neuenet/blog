


/// util

import {
  Application,
  Context,
  Feed,
  ensureDir,
  expandGlob,
  formatDate,
  frontmatter,
  join,
  merge,
  order,
  serve,
  useDartSass,
  type HandlerFunc,
  type LooseObject,
  type MiddlewareFunc,
  type PostMetadata
} from "/dep.ts";

import {
  showComingSoon,
  showHome,
  showNotFound,
  showPost
} from "./src/route/index.ts";

const dartSass = await useDartSass();
const posts: PostMetadata[] = [];
const tags: LooseObject = {};

const feedOptions = {
  author: {
    name: "Paul Anthony Webb"
  },
  copyright: "All Rights Reserved, Neuenet",
  description: "A blog about the DNS, Handshake, and the internet at large.",
  generator: "The 'Net",
  language: "en",
  title: "neue internet"
};

const legacyFeed = new Feed(order(merge(feedOptions, {
  author: {
    link: "https://webb.page/"
  },
  favicon: "https://blog.neuenet.com/favicon.svg",
  feedLinks: {
    atom: "https://blog.neuenet.com/feed/legacy.atom",
    json: "https://blog.neuenet.com/feed/legacy.json",
    rss: "https://blog.neuenet.com/feed/legacy.rss"
  },
  id: "https://blog.neuenet.com/",
  link: "https://blog.neuenet.com/"
})));

const neueFeed = new Feed(order(merge(feedOptions, {
  author: {
    link: "https://paulwebb/"
  },
  favicon: "https://blog.neuenet/favicon.svg",
  feedLinks: {
    atom: "https://blog.neuenet/feed/index.atom",
    json: "https://blog.neuenet/feed/index.json",
    rss: "https://blog.neuenet/feed/index.rss"
  },
  id: "https://blog.neuenet/",
  link: "https://blog.neuenet/",
})));



/// generate CSS

await dartSass.compileFromFileToFile("src/sass/uchu/uchu-grid.scss", "static/style.css", { style: "compressed" });
await dartSass.compileFromFileToFile("src/sass/pages/home.scss", "static/home.css", { style: "compressed" });
await dartSass.compileFromFileToFile("src/sass/pages/not-found.scss", "static/not-found.css", { style: "compressed" });
await dartSass.compileFromFileToFile("src/sass/pages/post.scss", "static/post.css", { style: "compressed" });

/// setup post map

for await (const file of expandGlob("post/*.txt")) {
  const { data } = frontmatter(await Deno.readTextFile(file.path)) as { data: PostMetadata };

  const date = new Date(data.date);
  date.setDate(date.getDate() + 1); /// THIS is the correct date

  data.date = formatDate(date, "yyyy·MM·dd");
  data.file = file.path;
  data.slug =
    file.name
      .replace(/\.[^/.]+$/, "")            /// remove file extension
      .replace(/^\d{4}.\d{2}.\d{2}./, ""); /// remove date from file name

  posts.push(order(data));

  /// setup feeds

  const legacyUrl = `https://blog.neuenet.com/post/${data.slug}`;
  const neueUrl = `https://blog.neuenet/post/${data.slug}`;

  legacyFeed.addItem({
    author: [
      {
        link: "https://webb.page/",
        name: "Paul Anthony Webb"
      }
    ],
    date: new Date(date.setDate(date.getDate() - 1)),
    description: data.tldr,
    id: legacyUrl,
    link: legacyUrl,
    title: data.title
  });

  neueFeed.addItem({
    author: [
      {
        link: "https://paulwebb/",
        name: "Paul Anthony Webb"
      }
    ],
    date: new Date(date.setDate(date.getDate() - 1)),
    description: data.tldr,
    id: neueUrl,
    link: neueUrl,
    title: data.title
  });

  /// setup tag map

  for (let tag of data.tags.split(",")) {
    tag = tag.trim();

    if (!tags[tag])
      tags[tag] = [];

    tags[tag].push({
      date: data.date,
      slug: data.slug,
      title: data.title
    });
  }
}

/// generate post and tag maps

await Deno.writeTextFile("post.map.json", JSON.stringify(posts.reverse(), null, 2));
await Deno.writeTextFile("tags.map.json", JSON.stringify(tags, null, 2));

/// generate feeds

legacyFeed.items = legacyFeed.items.reverse();
neueFeed.items = neueFeed.items.reverse();

await ensureDir(join("static", "feed"));

await Deno.writeTextFile(join("static", "feed", "legacy.json"), legacyFeed.json1());
await Deno.writeTextFile(join("static", "feed", "index.json"), neueFeed.json1());
await Deno.writeTextFile(join("static", "feed", "legacy.rss"), legacyFeed.rss2());
await Deno.writeTextFile(join("static", "feed", "index.rss"), neueFeed.rss2());
await Deno.writeTextFile(join("static", "feed", "legacy.atom"), legacyFeed.atom1());
await Deno.writeTextFile(join("static", "feed", "index.atom"), neueFeed.atom1());



/// start app

const app = new Application();

app
  .get("/", showHome)
  .get("/coming-soon", showComingSoon)
  .get("/post/:slug", showPost)
  .static("/", "./static")
  .start({ port: 8000 });

if (!Deno.args.includes("--production"))
  console.log("\n> http://localhost:8000");



/// deno run --allow-net --allow-read --allow-run --allow-write --no-prompt main.ts
