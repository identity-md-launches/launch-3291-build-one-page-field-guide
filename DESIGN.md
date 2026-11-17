# DESIGN.md: Robinhood Chain, from the inside

Taken from the final source: `src/styles.css`, `src/App.tsx`, `src/Karl.tsx`, `index.html`.

## Overview

A one-page field guide for agents and people new to Robinhood Chain. It looks like a field notebook: cream ruled paper, dark ink, and one accent colour (stamp red) used for annotations. It is read on a phone first. Content runs in one column of at most 46rem. Each place gets one card, in a fixed order, and every card has the same parts: what it is, what MVA did, what broke, receipts, and the claims nobody could find on chain. Data lives in `src/data/places.ts` (text and hashes) and `src/data/receipts.json` (block, time and sender read back from the chain by `scripts/verify-receipts.mjs`).

## Colors

All tokens are in `:root` in `src/styles.css`.

| Token | Value | Job |
| --- | --- | --- |
| `--paper` | `#f5efe0` | page background (cream paper) |
| `--paper-card` | `#fbf7ec` | card and check-box surface |
| `--ink` | `#1d2433` | body text, links, control borders, pressed pill fill |
| `--ink-soft` | `#454d5c` | secondary text: lede, meta, notes, dashed check-box border |
| `--rule` | `#d8ccb0` | card borders, dotted receipt separators, footer rule |
| `--line` | `rgba(29, 36, 51, 0.06)` | ruled-paper lines on `body` (28px pitch) |
| `--accent` | `#b4231b` | the one accent: CLAIMED, NOT FOUND stamps, card numbers and left edge, Karl, focus ring, link hover |

Contrast below is computed from the token hex values with the WCAG formula. It was not measured in a rendered browser (no browser could run on the build machine): ink on paper 13.54:1, ink on card 14.51:1, ink-soft on paper 7.41:1, ink-soft on card 7.95:1, accent on paper 5.73:1, accent on card 6.14:1, paper on ink (pressed pill) 13.54:1.

There is no dark theme.

## Typography

- Text: `--font-text`, a system serif stack (`Charter, 'Bitstream Charter', 'Iowan Old Style', Georgia, Cambria, 'Times New Roman', serif`). No web fonts are loaded.
- Data: `--font-mono` (`ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace`), only for transaction hashes, the wallet address and the RPC host.
- Weights: 400 and 700. Italic only for the one-sentence "what it is" line on each card.
- One scale, six sizes:

| Token | Size | Used for |
| --- | --- | --- |
| `--fs-1` | 0.8125rem (13px) | hashes, receipt meta, copy buttons, stamps |
| `--fs-2` | 0.9375rem (15px) | check-box list, controls, index, h3, notes under claims |
| `--fs-3` | 1.0625rem (17px) | body, check-box heading |
| `--fs-4` | 1.3125rem (21px) | card name (h2) under 760px |
| `--fs-5` | 1.75rem (28px) | h1 under 760px; card name from 760px |
| `--fs-6` | 2.5rem (40px) | h1 from 760px |

Body line-height 1.55; h1 1.1 with `letter-spacing: -0.02em` and `text-wrap: balance`; card names 1.2 with -0.01em. Numbers in card numbers, index and receipt meta use `tabular-nums`. The stamp text is written in capitals in the source because the brief fixes its wording; nothing else uses capitals or tracking.

## Layout

- Spacing tokens: `--space-1` 4px, `--space-2` 8px, `--space-3` 12px, `--space-4` 16px, `--space-5` 24px, `--space-6` 40px.
- `.top`, `main` and `.foot` share `max-width: var(--measure)` (46rem) and 16px side padding, so every block aligns on one left edge.
- Order: title and lede, the how-to-check box, the filter pills, the place index, the cards, the footer line.
- Cards stack in a single-column grid with 24px gaps. Hashes wrap with `word-break: break-all` instead of being cut, so a full 66-character hash is always readable at 320px.
- Breakpoints: under 420px the header reserves 96px on the right for Karl; from 760px the h1 grows to 40px, card padding grows to 24px and card names to 28px.
- `scroll-padding-top` keeps a jumped-to card off the top edge.

## Elevation & Depth

Flat. No shadows anywhere. Surfaces separate by tone (`--paper-card` on `--paper`) and 1px borders. Cards add a 3px accent left edge, like a margin line.

## Shapes

`--radius` 6px for cards, the check box and claim boxes; pills and copy buttons are fully rounded (999px); stamps use 3px and a -2deg tilt (flat inside the check box legend). Borders: solid 1px for cards, dashed 1.5px ink-soft for the check box, dashed 1px accent for claims, dotted 1px between receipts.

## Components

- **Check box** (`.check`, `App.tsx`): dashed box with a numbered list of ways to verify the page, a copy button for a ready `curl` command and for the wallet address, and the stamp legend.
- **Filter pills** (`.pill`, `role="group"`, `aria-pressed`): Everything, Receipts (count), Not found (count). One is pressed at a time; the pressed one is filled with ink. Min height 44px.
- **Index** (`nav.index`): numbered anchor links to each card.
- **Card** (`Card` in `App.tsx`, `.card`): `article` labelled by its h2, with number, name, site link, italic one-line description, then "What MVA did", "What broke", "Receipts" and "Not found on chain" sections. In the Receipts view only receipts show; in the Not found view only cards with claims show, with only their claims.
- **Receipt row** (`ReceiptRow`, `.receipt`): bold label, date and block from `receipts.json`, whether MVA sent it, the full hash as an explorer link (new tab, described by a hidden "Opens in a new tab" note), and a copy button.
- **Claim row** (`ClaimRow`, `.claim`): red stamp CLAIMED, NOT FOUND, the claim, where it was said and what was searched for.
- **Copy button** (`CopyButton`, `.copy`): writes to the clipboard (textarea fallback), then reads "Copied" or "Copy failed" for 1.8s in a polite live region. Min height 32px.
- **Empty state** (`.empty`): "No receipt found on Robinhood Chain." for a card with no receipts.
- **Karl** (`src/Karl.tsx`, `.karl`): one line-drawn goldfish in the accent colour, top right of the header, tilted -6deg, with an accessible name.
- Focus: every link and button gets a 2px accent outline with 2px offset (`:focus-visible`). A skip link jumps to the cards.

## Do's and Don'ts

- Do add a place by adding an entry to `src/data/places.ts`, then run `npm run verify` so its hashes are read back from the chain.
- Do put anything MVA says that the chain does not show into `claims`; it then renders with the stamp automatically.
- Do keep the accent for annotations (stamps, numbers, focus); don't use it for body text or fills.
- Don't add a second accent, shadows, web fonts or another type size.
- Don't shorten or ellipsize hashes or addresses; let them wrap.
- Don't add tracking, wallet connection or outside scripts.
