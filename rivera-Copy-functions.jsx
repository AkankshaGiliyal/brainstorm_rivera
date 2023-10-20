const express = require('express');
const { ethers } = require('ethers');


const app = express();
const port = 3001;
const path = require('path');


const mntAddress = "0x2F9e0D413125275C4Ad785222c70D80901B21fB9";
const mntABI =require('./abisample.json'); 


const provider = new ethers.providers.JsonRpcProvider("https://rpc.mantle.xyz/");
const contract = new ethers.Contract(mntAddress, mntABI, provider);


// Function to fetch the decimal value from the smart contract
async function getDecimalValue() {
  try {
    const decimal = await contract.decimals();
    return decimal;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

app.get('/', async (req, res) => {
  try {
    const decimal = await getDecimalValue();
    console.log("Decimal Value:", decimal);
    res.json({ decimal });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
