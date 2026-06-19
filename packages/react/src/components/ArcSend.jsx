'use client';
import { useState } from 'react';

export function ArcSend({ kitKey }) {
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
    <div>
      <h2>Send USDC</h2>
      <input
        placeholder="Recipient address"
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
      />
      <input
        placeholder="Amount (USDC)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
      {status && <p>{status}</p>}
    </div>
  );
}