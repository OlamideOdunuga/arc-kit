'use client';
import { useState } from 'react';

export function ArcBridge({ kitKey }) {
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
    <div>
      <h2>Bridge USDC to Arc</h2>
      <p>Transfer USDC from Ethereum Sepolia to Arc Testnet</p>
      <button onClick={handleBridge}>Bridge</button>
      {status && <p>{status}</p>}
    </div>
  );
}