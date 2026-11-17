# Validation: Robinhood Chain field guide

## 1. Scope and assumptions

- One page, `dist/index.html`, built from `src/`. Reviewed flows: reading a card, filtering (Everything / Receipts / Not found), jumping from the index, opening a receipt, copying a hash, the wallet address or the RPC command.
- "Verified by the builders" was done over JSON-RPC on chain 4663, because the Blockscout API answered with a browser challenge. Every receipt hash on the page was read back (`scripts/verify-receipts.mjs`: 49 checked, 49 found, all status success, all involving MVA's wallet).
- A place is tied to a contract only when the place's own site code or the token's on-chain name says so. Otherwise the tie is shown as a stamped claim (Tokyo Futuro's jobs contract, Bull's jar contract, Frank's scouting role, the IMD payment, Forever).
- The brief says Priors' six loans "each repaid itself after 7 days". Five repayments are on chain, each sent from MVA's wallet 7 days after the loan; the sixth loan (11 Nov) has no repayment yet and MVA's file says it is due 18 Nov. Shown as a stamped claim, not dropped.
- Claus: MVA's only Claus receipt is on Ethereum, sent by another address with 0 ETH value; on Robinhood Chain the page shows the 0.1 USDG Claus check it paid for, and stamps the rest.
- Forever: nothing on chain; the card says so and carries the stamp.

## 2. Coverage (Better Interface, six domains)

No browser could run on the build machine (Chromium installed but failed to start: missing libglib-2.0, libnss3, X11 libraries; no root to install them). All checks below are source checks or jsdom tests. Every "with a browser" check is **unperformed**.

| Domain | Status | Evidence |
| --- | --- | --- |
| Accessibility | Checked (source) | Native `button`, `a`, `nav`, `article`, `ol/ul`; pills use `aria-pressed` in a labelled group; copy buttons have names that say what they copy and a polite live region; skip link; `:focus-visible` 2px accent ring; Karl SVG has `role="img"` and a label; reduced-motion rule. Unperformed: keyboard walk in a browser, visible focus over each surface, screen reader, 200% zoom. |
| Layout | Checked (source) | One column, one left edge (`--measure` 46rem), grouping by space; separators only between receipt rows (dense data). Hashes wrap rather than clip. Unperformed: 320/390/1440 render, overflow check, first screen at 390. |
| Writing | Checked (source) | Plain sentences, sentence case, verb-first buttons ("Copy"), empty state for a card with no receipts, every claim says where it was said and what was searched for. No em dashes or emoji in page text (grep). |
| Typography | Checked (source) | Six sizes (`--fs-1`..`--fs-6`), two weights, two families (system serif, mono for hashes only), tabular numbers for numbers, h1 tracking -0.02em at 28/40px, balanced h1. Unperformed: rendered wrapping. |
| Colors | Checked (computed, not rendered) | One accent. WCAG ratios computed from token hex values: ink/paper 13.54, ink-soft/paper 7.41, accent/paper 5.73, accent/card 6.14, paper/ink 13.54. Not a rendered measurement. |
| UI | Checked (source) | Flat surfaces, borders only, no shadows; transitions list properties (`background-color`, `color`) and are removed under reduced motion; no animation. |

## 3. Findings and fixes

| # | Severity | Source | Finding | Fix | Recheck |
| --- | --- | --- | --- | --- | --- |
| 1 | Medium | `src/App.tsx` (receipt and site links) | Links open a new tab with no warning to assistive tech. | Added a hidden "Opens in a new tab" element and `aria-describedby="new-tab"` on every new-tab link. | Tests pass; link text is still the bare hash. |
| 2 | Medium | `src/App.tsx` header and check box | First screen at 390 carried about 75 words of prose (lede plus check list), over the 60-word budget of the review probe. | Cut the lede to one sentence and shortened each check step and the tally line. | Word count from source about 55; not rendered. |
| 3 | Low | `src/styles.css` `.receipt-meta` | Block numbers and dates in receipt meta used proportional digits. | `font-variant-numeric: tabular-nums`. | Source. |
| 4 | Low (accepted) | `src/App.tsx` `.stamp` | All-caps text in content (the stamp). | Kept: the brief fixes the wording "CLAIMED, NOT FOUND". | n/a |
| 5 | Low (accepted) | `src/styles.css` `.copy` | Copy buttons are 32px high, under the 44px comfortable size (above the 24px minimum). | Kept to sit inline with hashes; spaced 8px from the link. | Source. |

## 4. Verification

| Command | Result |
| --- | --- |
| `npx tsc --noEmit` | exit 0 |
| `npx vitest run` | 7/7 passed (order of cards, receipt links and hashes, stamps per claim, filters, index anchors, copy, footer) |
| `npm run build` | passed; relative URLs `./assets/...`, `./favicon.svg`, `./og.png` |
| `node scripts/verify-receipts.mjs` (machine RPC for chain 4663) | 49 checked, 49 found, 0 problems |
| `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste` | did not run (Chromium could not start, see above) |

`index.html` has a title, description, `og:title`, `og:description`, `og:image` (`./og.png`, 1200x630, rendered with resvg; viewed as an image) and an SVG favicon.

## 5. Completion

Incomplete for rendered checks: the page builds, typechecks, passes its interaction tests and every receipt is verified on chain, but no browser rendered it here, so the first screen at 390, overflow at 320/390/1440, rendered contrast, focus visibility, console errors and the taste@1 probe remain unperformed.
