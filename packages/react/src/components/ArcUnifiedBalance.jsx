'use client';
import { useState } from 'react';

export function ArcUnifiedBalance({ kitKey }) {
  const [balance, setBalance] = useState(null);
  const [status, setStatus] = useState('');

  async function fetchBalance() {
    setStatus('Fetching...');
    try {
      const res = await fetch('/api/balance');
      const data = await res.json();
      setBalance(data.balance);
      setStatus('');
    } catch (e) {
      setStatus('Error: ' + e.message);
    }
  }

  return (
    <div>
      <h2>Unified Balance</h2>
      <p>Your combined USDC balance across all chains</p>
      <button onClick={fetchBalance}>Check Balance</button>
      {status && <p>{status}</p>}
      {balance !== null && <p>Balance: {balance} USDC</p>}
    </div>
  );
}