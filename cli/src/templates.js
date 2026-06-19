export function getTemplate(capability) {
  const cap = capability.split('—')[0].trim().toLowerCase();

  if (cap === 'bridge') return getBridgeTemplate();
  if (cap === 'swap') return getSwapTemplate();
  if (cap === 'send') return getSendTemplate();
  if (cap === 'unified balance') return getUnifiedBalanceTemplate();
}

function getBridgeTemplate() {
  return `'use client';
import { useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('');

  async function handleBridge() {
    setStatus('Bridging...');
    try {
      const res = await fetch('/api/bridge', { method: 'POST' });
      const data = await res.json();
      setStatus('Done: ' + data.txHash);
    } catch (e) {
      setStatus('Error: ' + e.message);
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Arc Bridge</h1>
      <p>Bridge USDC from Ethereum Sepolia → Arc Testnet</p>
      <button onClick={handleBridge}>Bridge USDC</button>
      {status && <p>{status}</p>}
    </main>
  );
}`;
}

function getSendTemplate() {
  return `'use client';
import { useState } from 'react';

export default function Home() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  async function handleSend() {
    setStatus('Sending...');
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, amount }),
      });
      const data = await res.json();
      setStatus('Done: ' + data.txHash);
    } catch (e) {
      setStatus('Error: ' + e.message);
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Arc Send</h1>
      <input placeholder="Recipient address" value={recipient} onChange={e => setRecipient(e.target.value)} style={{ display: 'block', marginBottom: '0.5rem', width: '100%', padding: '0.5rem' }} />
      <input placeholder="Amount (USDC)" value={amount} onChange={e => setAmount(e.target.value)} style={{ display: 'block', marginBottom: '1rem', width: '100%', padding: '0.5rem' }} />
      <button onClick={handleSend}>Send USDC</button>
      {status && <p>{status}</p>}
    </main>
  );
}`;
}

function getSwapTemplate() {
  return `'use client';
import { useState } from 'react';

export default function Home() {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  async function handleSwap() {
    setStatus('Swapping...');
    try {
      const res = await fetch('/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      setStatus('Done: ' + data.txHash);
    } catch (e) {
      setStatus('Error: ' + e.message);
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Arc Swap</h1>
      <p>Swap USDC → EURC on Arc Testnet</p>
      <input placeholder="Amount (USDC)" value={amount} onChange={e => setAmount(e.target.value)} style={{ display: 'block', marginBottom: '1rem', width: '100%', padding: '0.5rem' }} />
      <button onClick={handleSwap}>Swap</button>
      {status && <p>{status}</p>}
    </main>
  );
}`;
}

function getUnifiedBalanceTemplate() {
  return `'use client';
import { useState } from 'react';

export default function Home() {
  const [balance, setBalance] = useState(null);
  const [status, setStatus] = useState('');

  async function fetchBalance() {
    setStatus('Fetching...');
    const res = await fetch('/api/balance');
    const data = await res.json();
    setBalance(data.balance);
    setStatus('');
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Arc Unified Balance</h1>
      <p>View your combined USDC balance across all chains</p>
      <button onClick={fetchBalance}>Check Balance</button>
      {status && <p>{status}</p>}
      {balance !== null && <p>Balance: {balance} USDC</p>}
    </main>
  );
}`;
}