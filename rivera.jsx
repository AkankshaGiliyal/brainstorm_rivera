const express = require('express');
const { ethers } = require('ethers');
const MongoClient = require('mongodb').MongoClient;

// create an Express application
const app = express();
const port = 3000;

// define the address and ABI of the smart contract
const mntAddress = "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000";
const mntABI = require('./mnt.json'); // find the actual ABI file

// initialize Ethereum provider and contract instances
const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/mantle_testnet");
const contract = new ethers.Contract(mntAddress, mntABI, provider);

// mongoDB connection details
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'defiData';

// connect to MongoDB
MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Connected to MongoDB');

  // select the database
  const db = client.db(dbName);

  // function to convert event data to a format suitable for MongoDB
  function formatEventData(from, to, value) {
    return {
      from,
      to,
      value: ethers.utils.formatUnits(value, 18),
    };
  }

  // event listener for "Transfer" event
  contract.on("Transfer", async (from, to, value) => {
    const eventData = formatEventData(from, to, value);

    // insert the event data into MongoDB
    const eventsCollection = db.collection('events');
    await eventsCollection.insertOne(eventData);

    // print the event data to the console
    console.log(JSON.stringify(eventData, null, 4));
  });

  // API to fetch events data
  app.get('/getEventsData', async (req, res) => {
    try {
      const eventsCollection = db.collection('events');
      const eventsData = await eventsCollection.find().toArray();

      res.json({ events: eventsData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // API to fetch function data
  app.get('/getFunctionData', async (req, res) => {
    try {
      // Example: Call a function on the smart contract
      const decimal = await contract.decimals();

      // Store the result in MongoDB or send it as a response
      res.json({ decimal });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // start the Express server
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});