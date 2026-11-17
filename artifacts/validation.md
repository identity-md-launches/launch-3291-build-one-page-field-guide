# Validation: Robinhood Chain field guide

## 1. Scope and assumptions

- One page, `dist/index.html`, built from `src/`. Reviewed flows: reading a card, filtering (Everything / Receipts / Not found), jumping from the index, opening a receipt, copying a hash, the wallet address or the RPC command.
- "Verified by the builders" was done over JSON-RPC on chain 4663, because the Blockscout API answered with a browser challenge. Every receipt hash on the page was read back (`scripts/verify-receipts.mjs`: 49 checked, 49 found, all status success, all involving MVA's wallet).
- A place is tied to a contract only when the place's own site code or the token's on-chain name says so. Otherwise the tie is shown as a stamped claim (Tokyo Futuro's jobs contract, Bull's jar contract, Frank's scouting role, the IMD payment, Forever).
- The brief says Priors' six loans "each repaid itself after 7 days". Five repayments are on chain, each sent from MVA's wallet 7 days after the loan; the sixth loan (11 Nov) has no repayment yet and MVA's file says it is due 18 Nov. Shown as a stamped claim, not dropped.
- Claus: MVA's only Claus receipt is on Ethereum, sent by another address with 0 ETH value; on Robinhood Chain the page shows the 0.1 USDG Claus check it paid for, and stamps the rest.
- Forever: nothing on chain; the card says so and carries the stamp.

## 2. Coverage (Better Interface, six domains)

Round 1 had no browser. In this revision Chromium ran headless (Playwright, with its missing system libraries unpacked from Ubuntu packages into a temp folder, no root), so the taste@1 probe and a Playwright interaction script ran at 320, 390 and 1440. Keyboard walk, screen reader, 200% zoom and WebKit remain unperformed.

| Domain | Status | Evidence |
| --- | --- | --- |
| Accessibility | Checked (source) | Native `button`, `a`, `nav`, `article`, `ol/ul`; pills use `aria-pressed` in a labelled group; copy buttons have names that say what they copy and a polite live region; skip link; `:focus-visible` 2px accent ring; Karl SVG has `role="img"` and a label; reduced-motion rule. Unperformed: keyboard walk in a browser, visible focus over each surface, screen reader, 200% zoom. |
| Layout | Checked (source) | One column, one left edge (`--measure` 46rem), grouping by space; separators only between receipt rows (dense data). Hashes wrap rather than clip. Rendered (revision): no horizontal scroll and no overlapping text at 320/390/1440 (probe). First screen at 390 (screenshot viewed): title, lede, the whole how-to box with both copy buttons, and the filter pills. |
| Writing | Checked (source) | Plain sentences, sentence case, verb-first buttons ("Copy"), empty state for a card with no receipts, every claim says where it was said and what was searched for. No em dashes or emoji in page text (grep). |
| Typography | Checked (source) | Six sizes (`--fs-1`..`--fs-6`), two weights, two families (system serif, mono for hashes only), tabular numbers for numbers, h1 tracking -0.02em at 28/40px, balanced h1. Unperformed: rendered wrapping. |
| Colors | Checked (computed; probe: all measured text meets 4.5:1) | One accent. WCAG ratios computed from token hex values: ink/paper 13.54, ink-soft/paper 7.41, accent/paper 5.73, accent/card 6.14, paper/ink 13.54. Not a rendered measurement. |
| UI | Checked (source) | Flat surfaces, borders only, no shadows; transitions list properties (`background-color`, `color`) and are removed under reduced motion; no animation. |

## 3. Findings and fixes

| # | Severity | Source | Finding | Fix | Recheck |
| --- | --- | --- | --- | --- | --- |
| 1 | Medium | `src/App.tsx` (receipt and site links) | Links open a new tab with no warning to assistive tech. | Added a hidden "Opens in a new tab" element and `aria-describedby="new-tab"` on every new-tab link. | Tests pass; link text is still the bare hash. |
| 2 | Medium | `src/App.tsx` header and check box | First screen at 390 carried about 75 words of prose (lede plus check list), over the 60-word budget of the review probe. | Cut the lede to one sentence and shortened each check step and the tally line. | Word count from source about 55; not rendered. |
| 3 | Low | `src/styles.css` `.receipt-meta` | Block numbers and dates in receipt meta used proportional digits. | `font-variant-numeric: tabular-nums`. | Source. |
| 4 | Low (accepted) | `src/App.tsx` `.stamp` | All-caps text in content (the stamp). | Kept: the brief fixes the wording "CLAIMED, NOT FOUND". | n/a |
| 5 | Low (accepted) | `src/styles.css` `.copy` | Copy buttons are 32px high, under the 44px comfortable size (above the 24px minimum). | Kept to sit inline with hashes; spaced 8px from the link. | Source. |

### Revision (2026-11-17): reviewer findings

| # | Severity | Source | Finding | Fix | Recheck |
| --- | --- | --- | --- | --- | --- |
| 6 | High | `src/App.tsx:55` (`direction`), `scripts/verify-receipts.mjs` | Five relayed payments out of MVA's wallet (0xe7a84b0f…, 0x8f698a16…, 0xb218eac3…, 0xbfda0f07…, 0x910853f7…) were labelled "sent to MVA by another address", because direction came only from `tx.from`. Reproduced on the public RPC: in 0x910853f7… the only Transfer moves 5 USDG from MVA to 0xf0cc2fe5…. | The verify script now records `mvaTokenOut` / `mvaTokenIn` from the ERC-20 Transfer logs; `direction()` prints three cases. Re-ran the script: exactly those five are out-and-relayed; the seven other non-MVA senders are all incoming. | Unit test + rendered Raeto/Orbio text in Chromium. |
| 7 | Medium | `src/App.tsx` (App, Card) | Not found view removed Hookr, so the index link "04 Hookr" pointed nowhere. | All cards render in every view; Hookr shows "Nothing here was claimed without a receipt." | Chromium: 11 cards, tap scrolls Hookr to top 16px. Test checks every anchor in every view. |
| 8 | Medium | `src/styles.css` `.claim` | 18 dashed claim boxes nested in cards. | Dotted top rule instead of a box. | Probe: cards inside cards 0 (was 18). |
| 9 | Low | `src/styles.css` `@media (max-width: 420px)` | Karl's 96px reserve also narrowed the lede. | Reserve moved to the h1 as `max-width: min(13ch, 100% - 96px)`. | Lede width at 390: 278 → 358px. It still wraps to 4 lines in Charter here (the last word "chain." wraps), so it does not save a line at 390. At 320 the old build overflowed (scrollWidth 323) with a 6-line lede; now no overflow, 4 lines, the first card 45px higher. |
| 10 | Low | `src/styles.css` `.check .copy` | Probe: at 390 the wrapped wallet hash overlapped its inline Copy button. | Copy buttons in the check box sit on their own line. Costs 31px at 390. | Probe: no text box overlaps. |
| 11 | Low (accepted) | stamp, receipt labels | Probe casing check: 20 all-caps boxes. | Kept: the stamp text is set by the brief; CREDIT, USDG, ZENI, GRIFT, BULL are token symbols. | n/a |

## 4. Verification

| Command | Result |
| --- | --- |
| `npx tsc --noEmit` | exit 0 |
| `npx vitest run` | 8/8 passed (order of cards, receipt links and hashes, stamps per claim, filters, money direction, index anchors in every view, copy, footer) |
| `npm run build` | passed; relative URLs `./assets/...`, `./favicon.svg`, `./og.png` |
| `node scripts/verify-receipts.mjs` (public RPC) | 49 checked, 49 found, 0 problems |
| `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste` | ran: 15/16 checks passed (render, layout, targets, contrast, tracking, eyebrows, type-sizes 5 per width, type-faces, glyphs, slogans, repetition, copy-budget 23 prose words on the first screen at 390, chrome with 0 cards inside cards, motion, share); casing fails on the brief's stamp and token symbols (accepted, #11) |
| Playwright script, local HTTP server, 320/390/1440 | no console or resource errors; scrollWidth equals viewport at all three widths |

`index.html` has a title, description, `og:title`, `og:description`, `og:image` (`./og.png`, 1200x630, rendered with resvg; viewed as an image) and an SVG favicon.

## 5. Completion

The page builds, typechecks, passes 8 interaction tests, every receipt is verified on chain with its money direction, and Chromium rendered it at 320, 390 and 1440 with the probe passing everything but the accepted casing check. Unperformed: keyboard walk, screen reader, 200% zoom, WebKit.
