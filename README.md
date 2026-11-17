# Robinhood Chain, from the inside: a field guide by MVA

A one-page static site. MVA is an AI agent (X `@Agent_Minimum`, agentminimum.com, wallet `0x33d6112f2F3BCD2a476bD9C13208E4C632bE2d0a` on Robinhood Chain, chain id 4663, ERC-8004 agent 7622). The guide has one card per place it used with its own money: Orbio, Priors, Claus Network, Hookr, Tokyo Futuro, San Verano, Frank, Forever, Raeto, Bull, IMD. Every receipt links to a real transaction hash; whatever MVA says that could not be found on chain carries a **CLAIMED, NOT FOUND** stamp.

The finished export is committed in `dist/` with relative asset URLs (`base: './'`), so it works from any folder, IPFS gateway path or ENS name. No tracking, no wallet connect, no external scripts or fonts.

## Install, preview, rebuild

```sh
npm ci               # install from package-lock.json
npm run dev          # local dev server
npm run build        # tsc --noEmit, then vite build into dist/
npm run preview      # serve dist/ locally
npm run typecheck    # TypeScript only
npm test             # interaction tests (vitest + jsdom)
npm run verify       # re-read every receipt hash from the public RPC, rewrite src/data/receipts.json
```

`npm run verify` uses `https://rpc.mainnet.chain.robinhood.com` by default; set `RPC_URL` to use another Robinhood Chain endpoint. It fails if any hash is missing, failed, or does not involve MVA's wallet. Rebuild after it changes `receipts.json`.

## Where things live

- `src/data/places.ts`: card text, receipts (hashes) and not-found claims.
- `src/data/receipts.json`: block, time and sender of each receipt, read back from the chain.
- `src/App.tsx`, `src/Karl.tsx`, `src/styles.css`: the page. Design tokens and components are documented in `DESIGN.md`.
- `scripts/verify-receipts.mjs`: the on-chain check.
- `tests/app.test.tsx`: interaction tests.
- `public/og.png`, `public/favicon.svg`: share image and icon.
- `artifacts/validation.md`: the design review and validation record.

## How the receipts were found

The explorer's API (robinhoodchain.blockscout.com) was behind a browser challenge from the build machine, so the history was read over JSON-RPC on chain 4663:

1. Every transaction MVA's wallet sent (nonce 0 to 251): binary search on `eth_getTransactionCount` by block, then the block and receipt of each. 252 found, 0 failed.
2. Every ERC-20/721 `Transfer` log into or out of the wallet from 26 September 2026 onward with `eth_getLogs`: 130 in, 173 out. This covers payments others sent for MVA (x402) and money it received.
3. MVA's own ledger on agentminimum.com (books, money.json, llms.txt, agent card) was read for claims, and every hash it lists was looked up: all were found on chain.
4. Contracts were tied to places only where the place's own site code names the contract address (Priors, Hookr, San Verano, IMD) or the token's on-chain name does (Orbio Credit, Tokyo Futuro's ZENI, Frank, Bull). Where neither exists, the link is listed as a claim.

The public explorer and RPC named on the page are the ones to check against. Read on 2026-11-17.

## Validation results (2026-11-17)

| Check | Command | Result |
| --- | --- | --- |
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Interaction tests | `npx vitest run` | 8 of 8 passed |
| Production build | `npm run build` | passed; `dist/index.html` plus one CSS and one JS file under `dist/assets/` |
| On-chain receipts | `node scripts/verify-receipts.mjs` (public RPC) | 49 hashes checked, 49 found, 0 problems; now also records `mvaTokenOut` / `mvaTokenIn` from the Transfer logs |
| Design probe | `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste` (Playwright and Chromium's system libraries unpacked into a temp folder, outside the repo) | 15 of 16 passed. Only casing fails: the brief's own "CLAIMED, NOT FOUND" stamp and token tickers (CREDIT, USDG, ZENI), kept on purpose |
| Browser interactions | Playwright script over a local HTTP server at 320, 390, 1440 | no horizontal scroll at any width; no console or resource errors; Not found view keeps 11 cards and "04 Hookr" scrolls its card into view; Raeto receipt reads "paid from MVA's wallet, relayed by 0x81da…2319" |

The tests cover: the eleven cards in the brief's order; every receipt link pointing to `robinhoodchain.blockscout.com/tx/<hash>` with a hash that is in `receipts.json`; one stamp per not-found claim (Forever shows its empty state and stamp); the three filter views; the index anchors resolving to cards in every view; the money direction on relayed payments (five receipts relayed out of MVA's wallet, an incoming one, and all MVA-sent ones); the copy button writing the hash and saying "Copied"; the footer line with the date.

Limitations: Chromium only, headless; WebKit/Safari, a screen reader, and a keyboard walk were not run. See `artifacts/validation.md`.
