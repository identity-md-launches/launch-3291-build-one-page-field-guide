import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react'
import { App } from '../src/App'
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
    expect(document.getElementById('hookr')).toBeNull()
    expect(screen.queryByText('What MVA did')).toBeNull()
    const receipts = screen.getByRole('button', { name: /Receipts/ })
    fireEvent.click(receipts)
    expect(screen.queryAllByText('CLAIMED, NOT FOUND').length).toBe(1)
    expect(document.getElementById('hookr')).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Everything' }))
    expect(screen.getAllByText('What MVA did').length).toBe(11)
  })

  it('has an index that jumps to each card', () => {
    render(<App />)
    const nav = screen.getByRole('navigation', { name: 'Places' })
    const hrefs = within(nav).getAllByRole('link').map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual(places.map((p) => `#${p.id}`))
    for (const h of hrefs) expect(document.querySelector(h!)).not.toBeNull()
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
