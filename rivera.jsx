const express = require('express');
const { ethers } = require('ethers');
//const MongoClient = require('mongodb').MongoClient;

// create an Express application
const app = express();
const port = 3000;
const path = require('path');

// define the address and ABI of the smart contract
const mntAddress = "0x2F9e0D413125275C4Ad785222c70D80901B21fB9";
const mntABI =require('./abisample.json'); // find the actual ABI file

// initialize Ethereum provider and contract instances
const provider = new ethers.providers.JsonRpcProvider("https://rpc.mantle.xyz/");
const contract = new ethers.Contract(mntAddress, mntABI, provider);

// mongoDB connection details
//const mongoUrl = 'mongodb://localhost:27017';
//const dbName = 'defiData';

// connect to MongoDB
//MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
 // if (err) {
  //  console.error(err);
   // return;
 // } 

 // console.log('Connected to MongoDB');

  // select the database
  //const db = client.db(dbName);

  // function to convert event data to a format suitable for MongoDB
  function formatEventData(tickLower, tickUpper) {
    return {
      tickLower,
      tickUpper,
    };
  }
  const eventDataarray=[];

  // event listener for "Transfer" event
  contract.on("RangeChange", async (tickLower, tickUpper) => {
    const eventData = formatEventData(tickLower, tickUpper);
    eventDataarray.push(eventData);

    // insert the event data into MongoDB
    //const eventsCollection = db.collection('events');
    //await eventsCollection.insertOne(eventData);

    // print the event data to the console
    console.log(JSON.stringify(eventData, null, 4));
  });

  app.get('/getEventsData', (req, res) => {
    
    res.json({ events: eventDataarray });
  
    
  });
  

  // API to fetch events data
  //app.get('/getEventsData', async (req, res) => {
   // try {
    //  const eventsCollection = db.collection('events');
    //  const eventsData = await eventsCollection.find().toArray();

     // res.json({ events: eventsData });
   // } catch (error) {
   //   console.error(error);
   //   res.status(500).json({ error: 'Internal Server Error' });
  //  }
  //});

  // API to fetch function data
  //app.get('/getFunctionData', async (req, res) => {
  //  try {
      // Example: Call a function on the smart contract
    //  const decimal = await contract.decimals();

      // Store the result in MongoDB or send it as a response
    //  res.json({ decimal });
  //  } catch (error) {
   //   console.error(error);
   //   res.status(500).json({ error: 'Internal Server Error' });
  //  }
  //});

  // start the Express server
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
//});
