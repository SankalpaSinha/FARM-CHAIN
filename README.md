# 🚜 FarmChain

_A transparent, blockchain-powered supply chain solution for the agricultural sector. Built for the T1-Hack25 Hyderabad Hackathon._

---

## 📹 Demo Video

**The most important part of our submission!** Watch a 2-minute walkthrough of our complete, working application.


---

## 🎯 The Problem

The modern agricultural supply chain is often a black box. Consumers lack trust in labels like "organic," farmers receive unfair prices due to a lack of verifiable data, and billions are lost to inefficiency and fraud. There is no single, trusted source of truth for a product's journey from farm to table.

## ✨ Our Solution

FarmChain leverages the **Avalanche blockchain** to create an immutable, transparent, and verifiable log for every product. Each key step in the supply chain—from harvest to storage to retail—is recorded as a transaction, creating a digital passport for the product that cannot be tampered with.

This restores trust for consumers, empowers farmers with verifiable data, and brings new efficiency to the entire ecosystem.

---

## 🚀 Key Features

* **Producer Dashboard:** Farmers can connect their Web3 wallet and register new products on the blockchain, creating the first link in the supply chain.
* **Retailer Dashboard:** Distributors and retailers can update the status of products in transit or storage, adding new links to the product's immutable history.
* **Consumer Verification:** Anyone can use a simple link (generated from a QR code) to view the complete, end-to-end journey of a product, verifying its authenticity and history.

---

## 🛠️ Technology Stack

* **Frontend:** React, TypeScript, Vite, TailwindCSS
* **Backend:** Node.js, Express.js
* **Blockchain:** Solidity, Ethers.js, Avalanche Fuji Testnet
* **Wallet:** Core Wallet (MetaMask compatible)

---

## Local Development

### 1. Backend Setup

```bash
# Navigate to the backend folder
cd FARM-CHAIN

# Install dependencies
npm install

# Run the server
node server.js

# Navigate to the frontend folder
cd FARM-CHAIN-FRONTEND

# Install dependencies
npm install

# Run the development server
npm run dev
