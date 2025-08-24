const express = require('express');
const cors = require('cors');
const { ethers } = require("ethers");

const app = express();
const PORT = 4000;

// --- CONFIGURATION ---
const CONTRACT_ADDRESS = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8";
const CONTRACT_ABI = [ { "inputs": [ { "internalType": "uint256", "name": "_productId", "type": "uint256" }, { "internalType": "string", "name": "_status", "type": "string" }, { "internalType": "string", "name": "_location", "type": "string" }, { "internalType": "string", "name": "_sensorData", "type": "string" } ], "name": "addUpdate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "_productName", "type": "string" } ], "name": "createProduct", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "status", "type": "string" } ], "name": "ProductUpdated", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "_productId", "type": "uint256" } ], "name": "getProductHistory", "outputs": [ { "components": [ { "internalType": "uint256", "name": "timestamp", "type": "uint256" }, { "internalType": "string", "name": "status", "type": "string" }, { "internalType": "string", "name": "location", "type": "string" }, { "internalType": "string", "name": "sensorData", "type": "string" } ], "internalType": "struct ProductTracker.ProductUpdate[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "products", "outputs": [ { "internalType": "uint256", "name": "productId", "type": "uint256" }, { "internalType": "string", "name": "productName", "type": "string" }, { "internalType": "address", "name": "owner", "type": "address" } ], "stateMutability": "view", "type": "function" } ];
const PRIVATE_KEY = "0x78ce6ce47c87a1acb4d01aca7bb994a94c6500d32cfeb7fe95f2c6902ead20d8"; // <-- PASTE KEY HERE

// --- BOILERPLATE ---
const provider = new ethers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

app.use(cors());
app.use(express.json());

console.log("Backend server starting... Connected to contract:", CONTRACT_ADDRESS);
// --- API ENDPOINTS ---

// GET /api/products - Get all products, can filter by owner
app.get('/api/products', async (req, res) => {
    const { owner } = req.query;
    try {
        const productCountBigInt = await contract.products.length;
        const productCount = Number(productCountBigInt);
        
        const products = [];
        for (let i = 0; i < productCount; i++) {
            const p = await contract.products(i);
            const product = { id: Number(p.productId), name: p.productName, owner: p.owner };
            if (owner) {
                if (product.owner.toLowerCase() === owner.toLowerCase()) products.push(product);
            } else {
                products.push(product);
            }
        }
        res.status(200).json(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// POST /api/products - Create a new product
app.post('/api/products', async (req, res) => {
    const { productName } = req.body;
    try {
        const tx = await contract.createProduct(productName);
        await tx.wait();
        res.status(201).json({ message: "Product created successfully!", txHash: tx.hash });
    } catch (error) {
        console.error("Failed to create product:", error);
        res.status(500).json({ error: "Failed to create product" });
    }
});

// GET /api/products/:id - Get a single product's history
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const productDetails = await contract.products(id);
        const historyRaw = await contract.getProductHistory(id);
        const history = historyRaw.map(h => ({
            timestamp: new Date(Number(h.timestamp) * 1000).toLocaleString(),
            status: h.status,
            location: h.location,
            sensorData: h.sensorData,
        }));
        res.status(200).json({
            id: Number(productDetails.productId),
            name: productDetails.productName,
            owner: productDetails.owner,
            history: history
        });
    } catch (error) {
        console.error(`Failed to fetch history for product ${id}:`, error);
        res.status(500).json({ error: "Failed to fetch product history" });
    }
});

// POST /api/products/:id/updates - Add an update to a product's history
app.post('/api/products/:id/updates', async (req, res) => {
    const { id } = req.params;
    const { status, location } = req.body;
    try {
        const iotData = JSON.stringify({ temp: "15C", humidity: "60%" }); // Placeholder IoT data
        const tx = await contract.addUpdate(id, status, location, iotData);
        await tx.wait();
        res.status(200).json({ message: "Update added successfully!", txHash: tx.hash });
    } catch (error) {
        console.error(`Failed to add update for product ${id}:`, error);
        res.status(500).json({ error: "Failed to add update" });
    }
});

// --- SERVER START ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});