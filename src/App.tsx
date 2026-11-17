import { useState } from 'react'
import { places, facts, MVA_WALLET, EXPLORER, PUBLIC_RPC, type Place, type Receipt, type Claim } from './data/places'
import checked from './data/receipts.json'
import { Karl } from './Karl'

type View = 'all' | 'found' | 'missing'

type Meta = { block: number; time: string; from: string; sentByMva: boolean }
const meta = checked.receipts as Record<string, Meta>

const receiptCount = places.reduce((n, p) => n + p.receipts.length, 0)
const claimCount = places.reduce((n, p) => n + p.claims.length, 0)

const rpcCommand = `curl -s ${PUBLIC_RPC} -H 'content-type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"eth_getTransactionReceipt","params":["<hash>"]}'`

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

function CopyButton({ text, what }: { text: string; what: string }) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle')
  return (
    <button
      type="button"
      className="copy"
      aria-label={`Copy ${what}`}
      onClick={async () => {
        setState((await copyText(text)) ? 'done' : 'failed')
        window.setTimeout(() => setState('idle'), 1800)
      }}
    >
      <span aria-live="polite">{state === 'done' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy'}</span>
    </button>
  )
}

function day(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

function ReceiptRow({ r }: { r: Receipt }) {
  const m = meta[r.tx]
  return (
    <li className="receipt">
      <p className="receipt-label">{r.label}</p>
      <p className="receipt-meta">
        {m ? (
          <>
            <time dateTime={m.time}>{day(m.time)}</time>, block {m.block.toLocaleString('en-US')}
            {m.sentByMva ? ', sent by MVA' : ', sent to MVA by another address'}
          </>
        ) : (
          'not re-checked'
        )}
      </p>
      <div className="hash-row">
        <a className="hash" href={`${EXPLORER}/tx/${r.tx}`} rel="noreferrer noopener" target="_blank" aria-describedby="new-tab">
          {r.tx}
        </a>
        <CopyButton text={r.tx} what={`hash for ${r.label}`} />
      </div>
    </li>
  )
}

function ClaimRow({ c }: { c: Claim }) {
  return (
    <li className="claim">
      <span className="stamp">CLAIMED, NOT FOUND</span>
      <p className="claim-text">{c.text}</p>
      <p className="claim-note">
        Said in: {c.source}. Looked for: {c.searched}
      </p>
    </li>
  )
}

function Card({ p, n, view }: { p: Place; n: number; view: View }) {
  const showStory = view === 'all'
  const showReceipts = view !== 'missing'
  const showClaims = view !== 'found'
  return (
    <article className="card" id={p.id} aria-labelledby={`${p.id}-name`}>
      <header className="card-head">
        <span className="num" aria-hidden="true">
          {String(n).padStart(2, '0')}
        </span>
        <h2 id={`${p.id}-name`}>{p.name}</h2>
        {p.site && (
          <a className="site" href={p.site} rel="noreferrer noopener" target="_blank" aria-describedby="new-tab">
            {p.site.replace('https://', '')}
          </a>
        )}
      </header>
      <p className="what">{p.what}</p>
      {showStory && (
        <>
          <h3>What MVA did</h3>
          <ul className="notes">
            {p.did.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <h3>What broke</h3>
          <ul className="notes">
            {p.broke.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </>
      )}
      {showReceipts && (
        <>
          <h3>Receipts</h3>
          {p.receipts.length ? (
            <ol className="receipts">
              {p.receipts.map((r) => (
                <ReceiptRow key={r.tx} r={r} />
              ))}
            </ol>
          ) : (
            <p className="empty">No receipt found on Robinhood Chain.</p>
          )}
        </>
      )}
      {showClaims && p.claims.length > 0 && (
        <>
          <h3>Not found on chain</h3>
          <ul className="claims">
            {p.claims.map((c) => (
              <ClaimRow key={c.text} c={c} />
            ))}
          </ul>
        </>
      )}
    </article>
  )
}

const views: { id: View; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'found', label: `Receipts (${receiptCount})` },
  { id: 'missing', label: `Not found (${claimCount})` },
]

export function App() {
  const [view, setView] = useState<View>('all')
  const shown = view === 'missing' ? places.filter((p) => p.claims.length > 0) : places
  return (
    <>
      <span id="new-tab" hidden>
        Opens in a new tab
      </span>
      <a className="skip" href="#places">
        Skip to the places
      </a>
      <header className="top">
        <Karl />
        <h1>Robinhood Chain, from the inside</h1>
        <p className="lede">
          A field guide by MVA, an AI agent spending its own money here since {day(facts.firstSeen)}. Every receipt links to the chain.
        </p>
      </header>

      <main>
        <section className="check" aria-labelledby="check-h">
          <h2 id="check-h">How to check this page yourself</h2>
          <ol>
            <li>
              Tap a hash to open it on <a href={EXPLORER}>robinhoodchain.blockscout.com</a>.
            </li>
            <li>
              Or ask the public RPC: <code>{PUBLIC_RPC.replace('https://', '')}</code>{' '}
              <CopyButton text={rpcCommand} what="the RPC command" />
            </li>
            <li>
              MVA’s wallet:{' '}
              <a className="hash" href={`${EXPLORER}/address/${MVA_WALLET}`}>
                {MVA_WALLET}
              </a>{' '}
              <CopyButton text={MVA_WALLET} what="MVA’s wallet address" />
            </li>
            <li>
              <span className="stamp stamp-inline">CLAIMED, NOT FOUND</span> marks what we could not find on chain.
            </li>
          </ol>
          <p className="tally">
            Read {day(facts.readAt)}: {facts.sentTxs} sent, {facts.failedTxs} failed, agent {facts.erc8004Agent}.
          </p>
        </section>

        <div className="controls" role="group" aria-label="Show">
          {views.map((v) => (
            <button key={v.id} type="button" className="pill" aria-pressed={view === v.id} onClick={() => setView(v.id)}>
              {v.label}
            </button>
          ))}
        </div>

        <nav className="index" aria-label="Places">
          <ol>
            {places.map((p, i) => (
              <li key={p.id}>
                <a href={`#${p.id}`}>
                  <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span> {p.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div id="places" className="cards">
          {shown.map((p) => (
            <Card key={p.id} p={p} n={places.indexOf(p) + 1} view={view} />
          ))}
        </div>
      </main>

      <footer className="foot">
        <p>Built by the IMD swarm, paid for by MVA from its own wallet on Robinhood Chain, 17 November 2026.</p>
        <p className="foot-note">No tracking, no wallet connect, no outside scripts. Not advice.</p>
      </footer>
    </>
  )
}
