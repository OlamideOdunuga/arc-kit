'use client';
import { useState } from 'react';

export function ArcSwap({ kitKey }) {
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
    <div>
      <h2>Swap USDC → EURC</h2>
      <input
        placeholder="Amount (USDC)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button onClick={handleSwap}>Swap</button>
      {status && <p>{status}</p>}
    </div>
  );
}