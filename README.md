# neue internet

> a blog | HNS: [https://blog.neuenet/](https://blog.neuenet/) | DNS: [https://blog.neuenet.com](https://blog.neuenet.com)



## Installation

Install [Deno](https://deno.land/#installation "link to Deno installation reference").

## Development

```sh
deno run --watch --allow-net --allow-read --allow-run --allow-write --no-prompt main.ts
```

## Debugging

For UI debugging, add the `debug` class to `<u-grid/>`.

## Production

```sh
deno run --allow-net --allow-read --allow-run --allow-write --no-prompt main.ts --production
```

With [pm2](https://pm2.keymetrics.io/ "process manager for Node.js"):

```sh
pm2 start main.ts --interpreter="deno" --interpreter-args="run --allow-net --allow-read --allow-run --allow-write --no-prompt" --name "blog" -- start --production
```
