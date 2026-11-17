// Re-reads every transaction hash in src/data/places.ts from Robinhood Chain and writes
// src/data/receipts.json (block, time, sender, status, and which way MVA's tokens moved
// according to the Transfer logs: mvaTokenOut / mvaTokenIn). Fails if any hash is missing,
// failed, or does not involve MVA's wallet.
// Usage: node scripts/verify-receipts.mjs            (public RPC)
//        RPC_URL=<your endpoint> node scripts/verify-receipts.mjs
import fs from 'node:fs'
const RPC = process.env.RPC_URL || 'https://rpc.mainnet.chain.robinhood.com'
const WALLET = '0x33d6112f2f3bcd2a476bd9c13208e4c632be2d0a'
const src = fs.readFileSync(new URL('../src/data/places.ts', import.meta.url), 'utf8')
const hashes = [...new Set([...src.matchAll(/tx: '(0x[0-9a-f]{64})'/g)].map((m) => m[1]))]
let id = 0
async function rpc(method, params) {
  for (let i = 0; ; i++) {
    try {
      const r = await fetch(RPC, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method, params }) })
      const j = await r.json()
      if (j.error) throw new Error(JSON.stringify(j.error))
      return j.result
    } catch (e) {
      if (i >= 3) throw e
      await new Promise((r) => setTimeout(r, 800))
    }
  }
}
const out = {}
const problems = []
const blockTime = {}
for (const h of hashes) {
  const [tx, rc] = await Promise.all([rpc('eth_getTransactionByHash', [h]), rpc('eth_getTransactionReceipt', [h])])
  if (!tx || !rc) { problems.push(`${h}: not found`); continue }
  const bn = tx.blockNumber
  blockTime[bn] ??= parseInt((await rpc('eth_getBlockByNumber', [bn, false])).timestamp, 16)
  const fromMva = tx.from.toLowerCase() === WALLET
  const inLogs = rc.logs.some((l) => l.topics.some((t) => t.toLowerCase().endsWith(WALLET.slice(2))))
  const TRANSFER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
  const isMva = (topic) => !!topic && topic.toLowerCase().endsWith(WALLET.slice(2))
  const transfers = rc.logs.filter((l) => l.topics[0]?.toLowerCase() === TRANSFER && l.topics.length >= 3)
  const mvaTokenOut = transfers.some((l) => isMva(l.topics[1]))
  const mvaTokenIn = transfers.some((l) => isMva(l.topics[2])) || (!fromMva && tx.to?.toLowerCase() === WALLET && BigInt(tx.value) > 0n)
  if (rc.status !== '0x1') problems.push(`${h}: status ${rc.status}`)
  if (!fromMva && !inLogs) problems.push(`${h}: does not involve MVA's wallet`)
  out[h] = { block: parseInt(bn, 16), time: new Date(blockTime[bn] * 1000).toISOString().replace('.000Z', 'Z'), from: tx.from, to: tx.to, sentByMva: fromMva, mvaTokenOut, mvaTokenIn, status: 'success' }
}
const file = new URL('../src/data/receipts.json', import.meta.url)
fs.writeFileSync(file, JSON.stringify({ chainId: 4663, checkedAt: new Date().toISOString().slice(0, 10), rpc: 'https://rpc.mainnet.chain.robinhood.com', receipts: out }, null, 1) + '\n')
console.log(`checked ${hashes.length} hashes, ${Object.keys(out).length} found, ${problems.length} problems`)
if (problems.length) { console.error(problems.join('\n')); process.exit(1) }
