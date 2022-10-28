# zenserv: `ERR_STREAM_PREMATURE_CLOSE` when fetching `https://stepzen.stepzen.net/directives.graphql`

When fetching the `https://stepzen.stepzen.net/directives.graphql` from a NodeJS app using the `node-fetch` library, fetch requests occasionally fail with `ERR_STREAM_PREMATURE_CLOSE` (on the latest `node-fetch` version) or silently stall (on the latest `node-fetch` v2).

Issue verified with

- NodeJS versions: `14.20.1`, `16.18.0`, `18.12.0`
- `node-fetch` versions: `2.6.7`, `3.2.10`

## Steps to reproduce

1. clone this repo
1. `cd node-fetch-v3 && npm i && npm start`
1. See one of the fetch calls fail with

   ```
    FetchError: Invalid response body while trying to fetch https://stepzen.stepzen.net/directives.graphql: aborted
        at consumeBody (file:///Users/viktor/code/sandbox/fetch-issue/node-fetch-v3/node_modules/node-fetch/src/body.js:234:60)
        at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
        at async Response.text (file:///Users/viktor/code/sandbox/fetch-issue/node-fetch-v3/node_modules/node-fetch/src/body.js:158:18)
        at async main (file:///Users/viktor/code/sandbox/fetch-issue/node-fetch-v3/index.mjs:10:20) {
    type: 'system',
    errno: 'ECONNRESET',
    code: 'ECONNRESET',
    erroredSysCall: undefined
    }
   ```

   NOTE: with Node 14 the error message is slightly different

   ```
    FetchError: Invalid response body while trying to fetch https://stepzen.stepzen.net/directives.graphql: Premature close
        at consumeBody (file:///Users/viktor/code/sandbox/fetch-issue/node-fetch-v3/node_modules/node-fetch/src/body.js:234:60)
        at processTicksAndRejections (internal/process/task_queues.js:95:5)
        at async Response.text (file:///Users/viktor/code/sandbox/fetch-issue/node-fetch-v3/node_modules/node-fetch/src/body.js:158:18)
        at async main (file:///Users/viktor/code/sandbox/fetch-issue/node-fetch-v3/index.mjs:10:20) {
    type: 'system',
    errno: 'ERR_STREAM_PREMATURE_CLOSE',
    code: 'ERR_STREAM_PREMATURE_CLOSE',
    erroredSysCall: undefined
    }
   ```

1. `cd ../node-fetch-v2 && npm i && npm start`
1. See the program terminates before making all 50 fetch calls (no error message given)

---

This looks like an incompatibility issue between the `stepzen.net` HTTP config and the NodeJS network stack - changing one of these components resolves the issue.

- replace NodeJS with a browser: running the function `main()` from `index.js` in Chrome, Firefox or Safari works fine
- replace NodeJS with curl: running `./curl.sh` on macOS works fine
- replace `stepzen.net`: run the same NodeJS scripts against another URL (e.g. `https://stepzen.com`) works fine

On the other hand, keeping NodeJS and replacing `node-fetch` with another HTTP client (`axios`) preserves the issue:

```
cd axios
npm i
npm start
```
