```sh
npm install -g @cloudflare/wrangler@beta
wrangler login
# see previous step's output for `CF_ACCOUNT_ID` value
env CF_ACCOUNT_ID=[see previous step's output] wrangler publish
```
