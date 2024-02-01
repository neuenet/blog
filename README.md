# neue internet

> a blog | HNS: [https://blog.neuenet/](https://blog.neuenet/) | DNS: [https://blog.neuenet.com](https://blog.neuenet.com)



## Installation

Install [Deno](https://deno.land/#installation "link to Deno installation reference").

## Development

```sh
# `unstable` flag is for `npm:feed` support: https://deno.com/blog/v1.25#experimental-npm-support
deno run --unstable --import-map=import_map.json --watch --allow-net --allow-read --allow-run --allow-write --no-prompt main.ts
# or
deno run --allow-all --unstable --import-map=import_map.json main.ts
deno run --allow-all --import-map=import_map.json main.ts
```

## Debugging

For UI debugging, add the `debug` class to `<u-grid/>`.

## Production

```sh
# `unstable` flag is for `npm:feed` support: https://deno.com/blog/v1.25#experimental-npm-support
deno run --unstable --import-map=import_map.json --allow-net --allow-read --allow-run --allow-write --no-prompt main.ts --production
```

With [pm2](https://pm2.keymetrics.io/ "process manager for Node.js"):

```sh
# `unstable` flag is for `npm:feed` support: https://deno.com/blog/v1.25#experimental-npm-support
pm2 start main.ts --interpreter="deno" --interpreter-args="run --unstable --import-map=import_map.json --allow-net --allow-read --allow-run --allow-write --no-prompt" --name "blog" -- start --production
pm2 save
```
