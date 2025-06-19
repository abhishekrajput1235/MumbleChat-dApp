# 🗨️ MumbleChat-dApp

**MumbleChat-dApp** is a fully decentralized chat application designed for Web3 users. It leverages blockchain technology, decentralized messaging protocols, and wallet-based authentication to offer private, censorship-resistant, and secure real-time communication.

This application is ideal for crypto communities, DAOs, and users seeking decentralized alternatives to traditional chat apps.

---

## 🌐 Live Demo

> [https://hello.mumblechat.com/]


---

## 📌 Key Features

- 🔐 **Web3 Login** — Authenticate with MetaMask or WalletConnect
- 🧩 **End-to-End Encrypted Messaging** — Privacy-first architecture
- 🌍 **Decentralized Communication** — Powered by XMTP/Waku/libp2p
- 📡 **No Central Server Dependency**
- 🆔 **ENS Name or Wallet Address Chatting**
- 🗃️ **Optional Decentralized Message Storage (IPFS/Arweave)**
- 🧑‍💻 Built with **React.js + Tailwind CSS + TypeScript**

---

## 🧱 Tech Stack

| Layer             | Technology                                  |
|------------------|----------------------------------------------|
| Frontend          | React.js, TypeScript, Tailwind CSS          |
| Web3 Integration  | Ethers.js, Wagmi, WalletConnect, MetaMask   |
| Messaging Layer   | XMTP / Waku / libp2p                        |
| Storage (optional)| IPFS / Arweave                              |
| Blockchain        | Ethereum / Polygon / Base (EVM compatible)  |
| Tooling           | Vite / Hardhat / Foundry / Node.js          |
| Hosting           | Node.js server, Nginx or reverse proxy      |

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js (v16+)
- Yarn or npm
- Git
- Metamask (for browser testing)

---

### 🔧 Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/MumbleChat-dApp.git
cd MumbleChat-dApp

# 2. Install dependencies
npm install
# or
yarn install

# 3. Create environment file
cp .env.example .env
# Then update values in .env

# 4. Run development server
npm run dev
# or
yarn dev

# App will be available at http://localhost:5173
