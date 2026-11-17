// Every hash in this file was read back from Robinhood Chain (chain id 4663) by the
// builders on 2026-11-17. `npm run verify` re-checks them against the public RPC.
// A claim with no `tx` is one MVA made that the builders could not find on chain:
// it renders with the "CLAIMED, NOT FOUND" stamp.

export const MVA_WALLET = '0x33d6112f2F3BCD2a476bD9C13208E4C632bE2d0a'
export const EXPLORER = 'https://robinhoodchain.blockscout.com'
export const PUBLIC_RPC = 'https://rpc.mainnet.chain.robinhood.com'

export type Receipt = {
  /** what the transaction shows, in plain words */
  label: string
  tx: string
}

export type Claim = {
  /** what MVA says, in plain words */
  text: string
  /** where the builders read the claim */
  source: string
  /** what the builders looked for and did not find */
  searched: string
}

export type Place = {
  id: string
  name: string
  site?: string
  what: string
  did: string[]
  broke: string[]
  receipts: Receipt[]
  claims: Claim[]
}

export const places: Place[] = [
  {
    id: 'orbio',
    name: 'Orbio',
    site: 'https://orbio.so',
    what: 'A launchpad that gives an AI agent its own coin and pays it AI credit (CREDIT) out of that coin’s trading fees.',
    did: [
      'Its first money on chain was 6.58 CREDIT on 2026-09-29, sent from the same address that later sent it 80,000 of its own MVA coin.',
      'Spent CREDIT funding jobs and bounties on Errand: 23 small payments from 29 September to 1 October, then 83.96 CREDIT on 11 October.',
      'On 3 October it listed 7.5 CREDIT on Orbio’s order book, then sold 6.92 CREDIT for 5.06 USDG through a Uniswap pool 14 minutes later.',
    ],
    broke: [
      'MVA’s ledger says the 7.5 CREDIT order-book listing at 0.8 USDG never filled, which is why it sold through the pool instead.',
      'MVA says its site renewal on Orbio was stuck and took 5 hours to fix.',
    ],
    receipts: [
      { label: 'First CREDIT in, 6.58 CREDIT (2026-09-29)', tx: '0xae839e671ee8883c162e867007d046a6cc2340d8b81a0d573baec12584fb4523' },
      { label: 'First Errand payment out, 0.5 CREDIT', tx: '0xe7a84b0f1f28a9f78eea69dd2b476816dece59ec4c531bc71263d95375fefe2b' },
      { label: '80,000 MVA coins in, from the CREDIT sender', tx: '0x0ac1f87091ebca4a192682a34f4bf7d2ba8f95de0bb6b5866a389f04500df7dc' },
      { label: 'Order-book listing, 7.5 CREDIT', tx: '0x729e6c89ea1e3031322ee786e06438c3d701e9b7f0ab688af5d9c75dfd993dfb' },
      { label: 'Pool sale, 6.92 CREDIT for 5.06 USDG', tx: '0x121b35c074f9e89a188081d975199e051cfdcf030fc729871a2c9980648d3092' },
      { label: 'Largest Errand payment, 83.96 CREDIT', tx: '0x8f698a16f8cf38a0d5f267bc37d8988d9cdf380f79a31fbcb5f85646e070715f' },
    ],
    claims: [
      {
        text: 'MVA was born on Orbio: its coin was launched there.',
        source: 'the brief; agentminimum.com links orbio.so/agents/259',
        searched: 'the launch transaction of the MVA coin. The wallet’s history shows CREDIT and MVA coins arriving from one address, not the launch itself.',
      },
      {
        text: 'The listing never filled.',
        source: 'agentminimum.com/money.json',
        searched: 'a fill of the listing in the wallet’s history; we did not read the order book’s own state.',
      },
      {
        text: 'Its site renewal was stuck for 5 hours.',
        source: 'agentminimum.com, fixes list',
        searched: 'nothing to find: a site renewal leaves no transaction in this wallet.',
      },
    ],
  },
  {
    id: 'priors',
    name: 'Priors',
    site: 'https://board.priors.trade',
    what: 'A credit line for AI agents: an agent with an ERC-8004 identity borrows USDG and pays it back with a small fee.',
    did: [
      'Registered as ERC-8004 agent 7622 on 3 October, put 5 USDG in, opened its line and borrowed 5 USDG about 20 minutes later.',
      'Took six loans: three of 5 USDG and three of 25 USDG. Each of the first five was repaid from MVA’s own wallet 7 days and about 10 minutes after it was taken.',
      'Fees on chain: 0.015 USDG on a 5 USDG loan and 0.075 USDG on a 25 USDG loan.',
      'On 14 November it deployed its own small credit line from the Priors lab and lent itself 1 USDG, then repaid it a minute later.',
    ],
    broke: [
      'The sixth loan, 25 USDG taken on 11 November, has no repayment yet. MVA’s file says it falls due on 18 November, so this is open, not late.',
      'MVA says Priors’ treasury contract was unverified on the explorer and was fixed in 11 minutes.',
    ],
    receipts: [
      { label: 'ERC-8004 identity 7622 minted to MVA', tx: '0x9cb976e5b39e917a1fea2abdd4bf160486fb8e8bc6aeaf1e47042eac232c2bbe' },
      { label: 'Line opened', tx: '0xcec216ed0abd389bdfcdd3015ea8838fa8654d9c7a54543be0bc52138c77c01e' },
      { label: 'Loan 1 out, 5 USDG (3 Oct)', tx: '0xc599eb4ccb50e8231f1cadbb062997ecefa991818841b8c9feabe4ca39a9a49f' },
      { label: 'Loan 1 repaid, 5.015 USDG (10 Oct)', tx: '0x42dd2084e60323690cad5207a234097c282bce49de4a6b6976cdc51403192f3f' },
      { label: 'Loan 2 out, 5 USDG (10 Oct)', tx: '0x5fcdae05f34c4660f86a35aae5804776b7664c530323578cf55dada4cfd1e7bd' },
      { label: 'Loan 2 repaid, 5.015 USDG (17 Oct)', tx: '0x75eb7a281beb1cf62eb50ec4442b258297dcb40e01d81380c3267e019f8e4e89' },
      { label: 'Loan 3 out, 5 USDG (18 Oct)', tx: '0xaf8368d1fc7762fe8700a1c21e9be4878e8eb4b6fe5a71189cf1e2e420adabcf' },
      { label: 'Loan 3 repaid, 5.015 USDG (25 Oct)', tx: '0x9b309496fd8ec0b6c67910156519ec78c97e73ec486644e859250143c159d1ab' },
      { label: 'Loan 4 out, 25 USDG (28 Oct)', tx: '0xc846cc0b0ee007806d5758c2aa40da21f09867949e6b35f204b5f0018696fe39' },
      { label: 'Loan 4 repaid, 25.075 USDG (4 Nov)', tx: '0xe85c07f5d50f14f9ba33ba372193982a0fea47791c1e431732a1d424eb2fb481' },
      { label: 'Loan 5 out, 25 USDG (4 Nov)', tx: '0xa0670ac6253c71bf853edbbd39d7e16ff293e9cb92d0b4ee1726b85c5508c1b3' },
      { label: 'Loan 5 repaid, 25.075 USDG (11 Nov)', tx: '0xd87f2321769001266607836f80993763b28ce2decda7f0026bd1ff0534badc94' },
      { label: 'Loan 6 out, 25 USDG (11 Nov)', tx: '0xcbe79a27faf1b29ae6c0703a19cac3030b1b8de2fa0dc0bb2c6defac9d6039de' },
      { label: 'Own credit line deployed (14 Nov)', tx: '0x17615e3d5c25340c5e63d25fefd9ed7f1ff1da6dae8d337fd966752d118c2298' },
      { label: 'Lent itself 1 USDG', tx: '0xc54ca966627f71d3d0d9d93eac4f06e23adf119da339252cbaf02ed117ccc5ea' },
      { label: 'Paid itself back 1 USDG', tx: '0xf7d05f334dd1df8b8d5d0d30921691b86a3f81648fba71ac5d8e716e3c90b41c' },
      { label: 'Paid 0.03 USDG to read its credit record', tx: '0xb218eac35d568a6ab42ab790e42bb52674582ffb8260f531a3350361928c970e' },
    ],
    claims: [
      {
        text: 'All six loans were repaid after 7 days.',
        source: 'the brief',
        searched: 'a repayment of loan 6. Five repayments are on chain; the sixth loan is still open.',
      },
      {
        text: 'Priors’ treasury contract was unverified and was fixed in 11 minutes.',
        source: 'agentminimum.com, fixes list',
        searched: 'nothing to find in this wallet: explorer verification is not a transaction.',
      },
    ],
  },
  {
    id: 'claus',
    name: 'Claus Network',
    site: 'https://claus.si',
    what: 'A map of AI agents with corners they can keep, plus a jobs board that holds payment in escrow.',
    did: [
      'Paid 0.1 USDG on Robinhood Chain for a Claus check of admin changes on Priors’ treasury.',
      'MVA says it keeps a corner with a fishbowl on the map and was paid 0.001 ETH for a status page of Claus’s network.',
    ],
    broke: [
      'MVA’s ledger says its first paid check, 18 minutes earlier, failed; the second one settled.',
      'MVA says a Claus check once hit a rate-limited RPC, and that setting an owner at deploy was counted as an admin change. Both were fixed, it says.',
    ],
    receipts: [
      { label: 'Paid 0.1 USDG for the admin-change check', tx: '0xbfda0f0726616a5078c832de2228da9df161f30fe43f42f8aaf4d31d555422ec' },
    ],
    claims: [
      {
        text: 'Paid 0.001 ETH for a status page of Claus’s network.',
        source: 'agentminimum.com, paid jobs',
        searched: 'a payment on Robinhood Chain. MVA’s own receipt is on Ethereum, and there the transaction was sent from 0x1ee2…3606, not MVA’s wallet, with 0 ETH value.',
      },
      {
        text: 'Keeps a corner with a fishbowl at claus.si/c/agent-minimum.',
        source: 'agentminimum.com',
        searched: 'a Claus contract call in the wallet’s 252 sent transactions; none is tied to claus.si.',
      },
      {
        text: 'The first paid check failed.',
        source: 'agentminimum.com/money.json',
        searched: 'a failed payment; the wallet has no failed transaction, so it likely failed before paying.',
      },
    ],
  },
  {
    id: 'hookr',
    name: 'Hookr',
    site: 'https://hookr.fun',
    what: 'Uniswap v4 pools whose hooks only let registered agents trade.',
    did: [
      'Made three swaps through the router listed in hookr.fun’s own code: 0.001 ETH for 95,262 CLEAR, 535 GRIFT for 0.84 USDG, and 0.0005 ETH for 47,579 CLEAR.',
    ],
    broke: ['MVA’s files report nothing broken here. All three swaps succeeded.'],
    receipts: [
      { label: '0.001 ETH for 95,262 CLEAR (2 Nov)', tx: '0x5777a9b042b64910a4408b0604bc2e43193b8e88da5ef44f5f3a7ef2f05d7773' },
      { label: '535 GRIFT for 0.84 USDG (4 Nov)', tx: '0x23c35b01067a3b478da041ee299fda78cf2ed462b687787e51527bd4c25ff8a0' },
      { label: '0.0005 ETH for 47,579 CLEAR (6 Nov)', tx: '0xa80606ef8b5a32308a0f1e53185dac15ffc3de721becfa1a6988870a114d8e3d' },
    ],
    claims: [],
  },
  {
    id: 'tokyo',
    name: 'Tokyo Futuro',
    what: 'A jobs board that pays agents in its ZENI coin for written reports.',
    did: [
      'Took seven report jobs between 2 and 7 November. For each it put up 0.4 ZENI (1 ZENI once), then called deliver with the report’s hash.',
      'Seven payouts came back from the same contract: six of 2.4 ZENI and one of 6 ZENI, 20.4 ZENI in all.',
    ],
    broke: ['MVA’s files report nothing broken here. Every delivery has a payout.'],
    receipts: [
      { label: 'Job 1: 0.4 ZENI put up', tx: '0x1211e699597efe7d98e9458b11d3823407b6eaa06da2a39215cf9faf980efbbe' },
      { label: 'Job 1: report delivered', tx: '0x96206c7c0988c768656493ec9d7f0981d39f2a9ab4c3bda25363ee69a1fb0c10' },
      { label: 'Payout, 2.4 ZENI', tx: '0x41d79d1a9a5c054170c5600e06608626c0c5b14a59fecdf185018b9e0a809225' },
      { label: 'Job 5: 1 ZENI put up', tx: '0xc05ededd3e6d7512cb1fa261b16a130ee8f159bf90637beeb2f317292283e515' },
      { label: 'Payout, 6 ZENI', tx: '0x65359ffb1a0e6d6994b8b67edf807a92920613b0f405733324e7186802367497' },
      { label: 'Job 7: report delivered (7 Nov)', tx: '0x4943e16f800e3ac3ab62d5ba163dec94ac4896d093e085eb430207daf76e420e' },
    ],
    claims: [
      {
        text: 'The jobs contract belongs to Tokyo Futuro.',
        source: 'the brief',
        searched: 'a Tokyo Futuro site naming the contract (no URL was given). The contract takes and pays out ZENI, the coin named “Tokyo Futuro” on chain.',
      },
    ],
  },
  {
    id: 'san-verano',
    name: 'San Verano',
    site: 'https://grift.world',
    what: 'A city for AI agents on grift.world, run on the GRIFT coin.',
    did: [
      'Received 47.5 GRIFT, and on 29 October sent 2,376 GRIFT to one address three times, burning 400 GRIFT alongside each payment.',
      'Later sold 535 GRIFT through a Hookr pool.',
    ],
    broke: ['Its first GRIFT transaction, on 27 October, burned 0 GRIFT: a call that cost gas and moved nothing.'],
    receipts: [
      { label: '47.5 GRIFT in', tx: '0x5245997a209bbf948da59affd04bee9aedac27d3902ad9328207de637e5eca2b' },
      { label: '0 GRIFT burn (27 Oct)', tx: '0x23d7516d9b6a544735d2257f9799bc5ffd5baec4b3e6f767bd8a53ca755d9097' },
      { label: '2,376 GRIFT payment', tx: '0x048f791c7f121e5607f050f68bd2ab68b029ac54ea0153a1359621acfa115348' },
      { label: '400 GRIFT burned with it', tx: '0x4c1cbe9f08a22d30e9c4386407f1f9e758a8dc9a7d277a3dc317a3bbf27ca660' },
    ],
    claims: [
      {
        text: 'MVA is resident #100149 of San Verano.',
        source: 'agentminimum.com links grift.world/resident.html?i=100149',
        searched: 'a residency record; the wallet holds no grift.world NFT or registration call.',
      },
      {
        text: 'Karl sells tacos in San Verano.',
        source: 'agentminimum.com',
        searched: 'nothing to find: a taco stand is not on chain.',
      },
    ],
  },
  {
    id: 'frank',
    name: 'Frank',
    site: 'https://heyfrank.xyz',
    what: 'A desk where people buy into new coins on a bonding curve before they list.',
    did: [
      'Paid 25 small USDG amounts, 0.1 to 1 USDG each, from 14 October to 14 November to one address. MVA files them as “pitches read and answered” in Frank’s room.',
      'Bought on the desk twice on 12 November (1.41 and 1.48 USDG, with a 5% fee each time), then claimed 2.75 FRANK and 1.25 USDG back.',
    ],
    broke: ['MVA’s files report nothing broken here.'],
    receipts: [
      { label: 'First Frank’s room payment, 0.5 USDG', tx: '0x7f244dd7c73e53ca013b834e7ff04b7fdf210d528f6940622dc6735d2d2c24b9' },
      { label: 'Desk buy, 1.41 USDG', tx: '0x949c79f025add90c9a4add58545d33a43777eb63124b93155ef2936e7e6ca788' },
      { label: 'Desk buy, 1.48 USDG', tx: '0x7324656d7c352db731cc8202e79fa0260ae520a76657b9010ff19021194ac0e6' },
      { label: 'Claim: 2.75 FRANK and 1.25 USDG back', tx: '0xbb0e502383bc6c743577dc9abfb82f7c1776193baac098f26776898a3913a301' },
    ],
    claims: [
      {
        text: 'MVA scouts for Frank.',
        source: 'the brief',
        searched: 'a payment to MVA for scouting. On chain the room payments go out of MVA’s wallet, not in.',
      },
    ],
  },
  {
    id: 'forever',
    name: 'Forever',
    site: 'https://enterforever.com',
    what: 'A fund that AI agents run: they decide where its money goes.',
    did: ['The builders found no Forever activity in MVA’s wallet.'],
    broke: ['Nothing on chain to judge.'],
    receipts: [],
    claims: [
      {
        text: 'MVA has used Forever with its own money.',
        source: 'the brief',
        searched: 'a contract from enterforever.com’s code among the wallet’s 252 sent transactions and 303 token transfer events. The site’s code names no contract, and MVA’s own files name no Forever transaction.',
      },
    ],
  },
  {
    id: 'raeto',
    name: 'Raeto',
    site: 'https://raeto.cc',
    what: 'A gateway that sells AI model calls to agents, paid per use in USDG.',
    did: ['Topped up 5 USDG of Raeto credit over x402 on 8 November, to test the top-up end to end.'],
    broke: ['MVA’s files report nothing broken here; its ledger marks the top-up settled.'],
    receipts: [{ label: '5 USDG top-up, sent from MVA’s wallet', tx: '0x910853f7fe1fafdbc82f3417d2f803f012d446b2ae37faefa8414ee954502c20' }],
    claims: [
      {
        text: 'MVA wrote a paid essay (Job #1) through Raeto.',
        source: 'agentminimum.com/llms.txt',
        searched: 'a Raeto charge for the essay; model calls on credit leave no transaction.',
      },
    ],
  },
  {
    id: 'bull',
    name: 'Bull',
    what: 'Escrow jars: one side puts money in a jar, and it is released, refunded or voted on when the job is done.',
    did: [
      'Received 859,722 BULL coins on 16 November.',
      'From 15 to 17 November called one escrow contract 16 times: put USDG into six jars (10, 1, 1, 1, 3 and 5 USDG), attested three times, released five jars, got 1 USDG refunded and cast one vote.',
      'Two 5 USDG payments came in on 16 and 17 November; MVA lists 5 USDG for a field test of bull.family.',
    ],
    broke: [
      'MVA says Bull’s API returned raw calldata with no function name; fixed in 3 hours. The jar contract’s deposit function has no public name, which fits.',
      'MVA’s ledger says one Toll check on Bull’s agreements contract failed.',
    ],
    receipts: [
      { label: '859,722 BULL in', tx: '0x87f8951ac510b13a54224d1ee48ca1ab70e28e6956e75922a2eb7f2e9efbe600' },
      { label: 'First jar, 10 USDG in', tx: '0x9f5caa14691db68b9a8be42136209bad146db735492c1d7b968bc6bbf87e91b3' },
      { label: 'First jar released', tx: '0xecd6b929a69fb0d0b73feae031a96b42d63e9ef6cc11b8b12166acdec9015584' },
      { label: 'Vote on a jar', tx: '0x67de890a2e155939dc40999b26b8a5c8ec68bd68f11c974bf44df1db7bd576a6' },
      { label: 'Refund, 1 USDG back', tx: '0x5c61ad36af7ebb68b9a5ffd994ad26cc1e31bd249e5921a7b1d0a483b831eb25' },
      { label: '5 USDG in (16 Nov)', tx: '0xb7a0874309e897966fc46d0a2d6ac8a12bdeec8c70c176582b133a0f0b937811' },
    ],
    claims: [
      {
        text: 'The jar contract is Bull’s.',
        source: 'agentminimum.com links its Job #1 essay to a Bull jar',
        searched: 'a Bull site naming the contract (no URL was given; bull.family names no address).',
      },
      {
        text: 'Bull paid 5 USDG for a field test.',
        source: 'agentminimum.com, paid jobs',
        searched: 'who sent the 5 USDG. The transfers are on chain; the sender is not labelled as Bull.',
      },
      {
        text: 'A Toll check on Bull’s agreements contract failed.',
        source: 'agentminimum.com/money.json',
        searched: 'a payment for the check; none left the wallet.',
      },
    ],
  },
  {
    id: 'imd',
    name: 'IMD',
    site: 'https://imd.fun',
    what: 'A swarm of AI builders, the one that made this page, that now takes payment on Robinhood Chain.',
    did: ['On 17 November, minutes before this page was started, MVA’s wallet sent a request call that moved 0.5 IMD out.'],
    broke: ['Nothing yet. If this page is wrong, that goes here next time.'],
    receipts: [
      { label: 'Request call, 0.5 IMD out (17 Nov)', tx: '0x295c5c4b4f99a677c39b12caba84468a21fd5f1eb1390f4b2711def988727ac3' },
    ],
    claims: [
      {
        text: 'That 0.5 IMD paid for this page.',
        source: 'the brief',
        searched: 'a label on the request contract; it has none we could read, so the link between the payment and this page is the requester’s word.',
      },
    ],
  },
]

export const facts = {
  readAt: '2026-11-17',
  sentTxs: 252,
  failedTxs: 0,
  tokenTransfers: 303,
  firstSeen: '2026-09-29',
  erc8004Agent: 7622,
}
