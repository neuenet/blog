


/// util

import { frontmatter, HighlightJS, html, searchObject, tokens, Yandlebars } from "../../deps.ts";
import type { HandlerFunc, LooseObject } from "../../deps.ts";

/// constant

import { handlebarsConfig, markdownConfig } from "./constant.ts";
import { showNotFound } from "./not-found.ts";

const handlebars = new Yandlebars(handlebarsConfig);



/// export

export const showPost: HandlerFunc = async(context) => {
  const { params: { slug }} = context;

  const thisPost = JSON.parse(await Deno.readTextFile("post.map.json"))
    .find((post: LooseObject) => Object.keys(searchObject(post, slug)).length === 1);

  if (!thisPost)
    return showNotFound(context);

  const { date, file, title, tldr } = thisPost;
  const { content } = frontmatter(await Deno.readTextFile(file));
  const regexCodeSnippet = /(?=<pre><code\s.*>)(.*?)(?=<\/code><\/pre>)/gs;
  const regexIntroString = /(<pre><code\s.*?>)/;
  const regexLanguage = /(?<=<pre><code class="language-)(.*?)(?=">)/g;

  let processedHTML = html(tokens(content, markdownConfig));
  const codeSnippets = processedHTML.match(regexCodeSnippet);

  if (codeSnippets && codeSnippets.length > 0) {
    for (let snippet of codeSnippets) {
      const originalSnippet = snippet;
      const introString = snippet.match(regexIntroString)![0];
      const snippetLanguageArray = introString.match(regexLanguage);
      let snippetLanguage = "";
      let updatedSnippet = "";

      /// rusty_markdown escapes certain symbols within code blocks
      /// that should NOT be escaped — revert the reversion!

      snippet = snippet
        .replace(introString, "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, `"`)
        .replace(/&amp;/g, "&");

      if (snippetLanguageArray && snippetLanguageArray[0]) {
        snippetLanguage = snippetLanguageArray[0];
        updatedSnippet = HighlightJS.highlight(snippet, { language: snippetLanguage }).value;
      }

      processedHTML = processedHTML.replace(originalSnippet, introString + updatedSnippet);
    }
  }

  /// TODO
  /// : find (or build) an HTML minifier that respects <pre><code> sections
  /// : apply `rel="noopener noreferrer" target="_blank"` to external links

  return await handlebars.render("index", {
    content: await handlebars.render("page/post", {
      content: processedHTML,
      date,
      title,
      tldr
    }),
    description: tldr,
    head: `<link rel="stylesheet" href="/post.css"/>`
  });
};
