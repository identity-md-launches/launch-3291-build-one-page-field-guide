import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react'
import { App, direction } from '../src/App'
import { places } from '../src/data/places'
import checked from '../src/data/receipts.json'

afterEach(cleanup)

describe('field guide', () => {
  it('renders the eleven places in the brief order', () => {
    render(<App />)
    const names = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent).filter((t) => t !== 'How to check this page yourself')
    expect(names).toEqual(['Orbio', 'Priors', 'Claus Network', 'Hookr', 'Tokyo Futuro', 'San Verano', 'Frank', 'Forever', 'Raeto', 'Bull', 'IMD'])
  })

  it('links every receipt to the explorer with a hash that was re-checked on chain', () => {
    render(<App />)
    const links = screen.getAllByRole('link').filter((a) => a.getAttribute('href')?.includes('/tx/'))
    const total = places.reduce((n, p) => n + p.receipts.length, 0)
    expect(links.length).toBe(total)
    for (const a of links) {
      const hash = a.getAttribute('href')!.split('/tx/')[1]
      expect(hash).toMatch(/^0x[0-9a-f]{64}$/)
      expect(a.textContent).toBe(hash)
      expect((checked.receipts as Record<string, unknown>)[hash]).toBeTruthy()
    }
  })

  it('stamps every claim that was not found', () => {
    render(<App />)
    const claims = places.reduce((n, p) => n + p.claims.length, 0)
    // one extra stamp sits in the how-to box as the legend
    expect(screen.getAllByText('CLAIMED, NOT FOUND').length).toBe(claims + 1)
    const forever = document.getElementById('forever')!
    expect(within(forever).getByText('No receipt found on Robinhood Chain.')).toBeTruthy()
    expect(within(forever).getByText('CLAIMED, NOT FOUND')).toBeTruthy()
  })

  it('filters between everything, receipts and not-found claims', () => {
    render(<App />)
    const notFound = screen.getByRole('button', { name: /Not found/ })
    fireEvent.click(notFound)
    expect(notFound.getAttribute('aria-pressed')).toBe('true')
    expect(screen.queryAllByRole('link').filter((a) => a.getAttribute('href')?.includes('/tx/')).length).toBe(0)
    // every card stays, so the index always resolves; a place with no claims says so
    expect(document.querySelectorAll('article.card').length).toBe(11)
    expect(within(document.getElementById('hookr')!).getByText('Nothing here was claimed without a receipt.')).toBeTruthy()
    expect(screen.queryByText('What MVA did')).toBeNull()
    const receipts = screen.getByRole('button', { name: /Receipts/ })
    fireEvent.click(receipts)
    expect(screen.queryAllByText('CLAIMED, NOT FOUND').length).toBe(1)
    expect(document.getElementById('hookr')).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Everything' }))
    expect(screen.getAllByText('What MVA did').length).toBe(11)
  })

  it('states the direction of MVA’s money from the Transfer logs', () => {
    const r = checked.receipts as Record<string, Parameters<typeof direction>[0]>
    // relayed payments out of MVA's wallet (x402 / Errand relayers)
    for (const h of [
      '0xe7a84b0f1f28a9f78eea69dd2b476816dece59ec4c531bc71263d95375fefe2b',
      '0x8f698a16f8cf38a0d5f267bc37d8988d9cdf380f79a31fbcb5f85646e070715f',
      '0xb218eac35d568a6ab42ab790e42bb52674582ffb8260f531a3350361928c970e',
      '0xbfda0f0726616a5078c832de2228da9df161f30fe43f42f8aaf4d31d555422ec',
      '0x910853f7fe1fafdbc82f3417d2f803f012d446b2ae37faefa8414ee954502c20',
    ])
      expect(direction(r[h])).toMatch(/^, paid from MVA’s wallet, relayed by 0x/)
    expect(direction(r['0x87f8951ac510b13a54224d1ee48ca1ab70e28e6956e75922a2eb7f2e9efbe600'])).toBe(', sent to MVA by another address')
    for (const m of Object.values(r)) if (m.sentByMva) expect(direction(m)).toBe(', sent by MVA')
    render(<App />)
    const raeto = document.getElementById('raeto')!
    expect(within(raeto).getByText(/paid from MVA’s wallet, relayed by 0x81da…2319/)).toBeTruthy()
    expect(within(raeto).queryByText(/sent to MVA/)).toBeNull()
  })

  it('has an index that jumps to each card', () => {
    render(<App />)
    const nav = screen.getByRole('navigation', { name: 'Places' })
    const hrefs = within(nav).getAllByRole('link').map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual(places.map((p) => `#${p.id}`))
    for (const v of ['Everything', /Receipts/, /Not found/]) {
      fireEvent.click(screen.getByRole('button', { name: v }))
      for (const h of hrefs) expect(document.querySelector(h!)).not.toBeNull()
    }
  })

  it('copies a hash and says so', async () => {
    let copied = ''
    Object.assign(navigator, { clipboard: { writeText: async (t: string) => void (copied = t) } })
    render(<App />)
    const first = places[0].receipts[0]
    const btn = screen.getByRole('button', { name: `Copy hash for ${first.label}` })
    fireEvent.click(btn)
    expect(await within(btn).findByText('Copied')).toBeTruthy()
    expect(copied).toBe(first.tx)
  })

  it('ends with the credit line and date', () => {
    render(<App />)
    expect(screen.getByText('Built by the IMD swarm, paid for by MVA from its own wallet on Robinhood Chain, 17 November 2026.')).toBeTruthy()
  })
})
