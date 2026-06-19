import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { getTemplate } from './templates.js';

export async function createProject() {
  console.log('\n🔵 Welcome to Arc App Kit Generator\n');

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: 'my-arc-app',
    },
    {
      type: 'select',
      name: 'capability',
      message: 'Which App Kit capability do you want to scaffold?',
      choices: [
        'Bridge — transfer USDC across chains',
        'Swap — exchange tokens on the same chain',
        'Send — wallet-to-wallet transfer',
        'Unified Balance — combine USDC from multiple chains',
      ],
    },
  ]);

  const projectPath = path.join(process.cwd(), answers.projectName);
  const cap = answers.capability.split('—')[0].trim().toLowerCase();

  // Create folder structure
  fs.mkdirSync(path.join(projectPath, 'app', 'api', cap), { recursive: true });

  // package.json
  const packageJson = {
    name: answers.projectName,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
    },
    dependencies: {
      next: '^14.2.0',
      react: '^18.3.0',
      'react-dom': '^18.3.0',
      '@circle-fin/app-kit': 'latest',
      '@circle-fin/adapter-viem-v2': 'latest',
      viem: '^2.0.0',
    },
  };
  fs.writeFileSync(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // next.config.js
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
`;
  fs.writeFileSync(path.join(projectPath, 'next.config.js'), nextConfig);

  // app/layout.js
  const layout = `import './globals.css';

export const metadata = {
  title: '${answers.projectName}',
  description: 'Built with arc-appkit',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;
  fs.writeFileSync(path.join(projectPath, 'app', 'layout.js'), layout);

  // app/globals.css
  const css = `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9f9f9; color: #111; }
main { max-width: 600px; margin: 4rem auto; padding: 2rem; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
h1 { font-size: 1.75rem; margin-bottom: 0.5rem; }
p { color: #555; margin-bottom: 1rem; }
input { display: block; width: 100%; padding: 0.6rem 0.8rem; margin-bottom: 0.75rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
button { background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 0.65rem 1.5rem; font-size: 1rem; cursor: pointer; }
button:hover { background: #1d4ed8; }
`;
  fs.writeFileSync(path.join(projectPath, 'app', 'globals.css'), css);

  // app/page.js (the UI — capability specific)
  const pageContent = getTemplate(answers.capability);
  fs.writeFileSync(path.join(projectPath, 'app', 'page.js'), pageContent);

  // app/api/[cap]/route.js (the server-side SDK call)
  const apiRoute = getApiRoute(cap, answers.projectName);
  fs.writeFileSync(
    path.join(projectPath, 'app', 'api', cap, 'route.js'),
    apiRoute
  );

  // .env.example
  const envContent = `# Get your Kit Key from https://console.circle.com
CIRCLE_API_KEY=your_circle_api_key_here
PRIVATE_KEY=your_wallet_private_key_here

# Arc Testnet RPC (pre-filled)
NEXT_PUBLIC_ARC_RPC=https://rpc.arc.testnet
`;
  fs.writeFileSync(path.join(projectPath, '.env.example'), envContent);

  // .gitignore
  const gitignore = `.env
.env.local
node_modules/
.next/
out/
`;
  fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignore);

  // README.md
  const readme = `# ${answers.projectName}

Scaffolded with [arc-appkit](https://github.com/your-username/arc-appkit-generator).

## Capability: ${answers.capability.split('—')[0].trim()}

## Setup

1. Copy the env file:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. Fill in your values in \`.env.local\`
   - Get your Circle API Key at https://console.circle.com
   - Add your wallet private key

3. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

4. Run locally:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## Arc Testnet

- RPC: https://rpc.arc.testnet
- Faucet: https://docs.arc.io/arc/references/connect-to-arc
- Docs: https://docs.arc.io/app-kit
`;
  fs.writeFileSync(path.join(projectPath, 'README.md'), readme);

  // Summary
  console.log(`\n✅ Project "${answers.projectName}" created!\n`);
  console.log('📁 Structure:');
  console.log(`   ${answers.projectName}/`);
  console.log(`   ├── app/`);
  console.log(`   │   ├── layout.js`);
  console.log(`   │   ├── page.js        ← your ${cap} UI`);
  console.log(`   │   ├── globals.css`);
  console.log(`   │   └── api/${cap}/route.js  ← SDK call`);
  console.log(`   ├── .env.example`);
  console.log(`   ├── .gitignore`);
  console.log(`   ├── next.config.js`);
  console.log(`   ├── README.md`);
  console.log(`   └── package.json`);
  console.log('\n👉 Next steps:');
  console.log(`   cd "${answers.projectName}"`);
  console.log(`   cp .env.example .env.local`);
  console.log(`   npm install`);
  console.log(`   npm run dev\n`);
}

function getApiRoute(cap, projectName) {
  const routes = {
    bridge: `import { AppKit } from '@circle-fin/app-kit';
import { ViemAdapter } from '@circle-fin/adapter-viem-v2';
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

export async function POST() {
  try {
    const account = privateKeyToAccount(process.env.PRIVATE_KEY);
    const arcRpc = process.env.NEXT_PUBLIC_ARC_RPC;

    const walletClient = createWalletClient({ account, transport: http(arcRpc) });
    const publicClient = createPublicClient({ transport: http(arcRpc) });

    const adapter = new ViemAdapter({ walletClient, publicClient });
    const kit = new AppKit({ apiKey: process.env.CIRCLE_API_KEY });

    const result = await kit.bridge({
      from: { adapter, chain: 'ETH-SEPOLIA' },
      to:   { adapter, chain: 'ARC' },
      amount: '1.00',
      token: 'USDC',
    });

    return Response.json({ txHash: result.transactionHash });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
`,
    swap: `import { AppKit } from '@circle-fin/app-kit';
import { ViemAdapter } from '@circle-fin/adapter-viem-v2';
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

export async function POST(request) {
  try {
    const { amount } = await request.json();
    const account = privateKeyToAccount(process.env.PRIVATE_KEY);
    const arcRpc = process.env.NEXT_PUBLIC_ARC_RPC;

    const walletClient = createWalletClient({ account, transport: http(arcRpc) });
    const publicClient = createPublicClient({ transport: http(arcRpc) });

    const adapter = new ViemAdapter({ walletClient, publicClient });
    const kit = new AppKit({ apiKey: process.env.CIRCLE_API_KEY });

    const result = await kit.swap({
      adapter,
      chain: 'ARC',
      fromToken: 'USDC',
      toToken: 'EURC',
      amount,
    });

    return Response.json({ txHash: result.transactionHash });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
`,
    send: `import { AppKit } from '@circle-fin/app-kit';
import { ViemAdapter } from '@circle-fin/adapter-viem-v2';
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

export async function POST(request) {
  try {
    const { recipient, amount } = await request.json();
    const account = privateKeyToAccount(process.env.PRIVATE_KEY);
    const arcRpc = process.env.NEXT_PUBLIC_ARC_RPC;

    const walletClient = createWalletClient({ account, transport: http(arcRpc) });
    const publicClient = createPublicClient({ transport: http(arcRpc) });

    const adapter = new ViemAdapter({ walletClient, publicClient });
    const kit = new AppKit({ apiKey: process.env.CIRCLE_API_KEY });

    const result = await kit.send({
      adapter,
      chain: 'ARC',
      to: recipient,
      amount,
      token: 'USDC',
    });

    return Response.json({ txHash: result.transactionHash });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
`,
    'unified balance': `import { AppKit } from '@circle-fin/app-kit';
import { ViemAdapter } from '@circle-fin/adapter-viem-v2';
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

export async function GET() {
  try {
    const account = privateKeyToAccount(process.env.PRIVATE_KEY);
    const arcRpc = process.env.NEXT_PUBLIC_ARC_RPC;

    const walletClient = createWalletClient({ account, transport: http(arcRpc) });
    const publicClient = createPublicClient({ transport: http(arcRpc) });

    const adapter = new ViemAdapter({ walletClient, publicClient });
    const kit = new AppKit({ apiKey: process.env.CIRCLE_API_KEY });

    const balance = await kit.getUnifiedBalance({ adapter });

    return Response.json({ balance: balance.total });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
`,
  };

  return routes[cap] || routes['send'];
}