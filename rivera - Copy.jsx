const express = require('express');
const { ethers } = require('ethers');


const app = express();
const port = 3001;
const path = require('path');


const mntAddress = "0x2F9e0D413125275C4Ad785222c70D80901B21fB9";
const mntABI =require('./abisample.json'); 


const provider = new ethers.providers.JsonRpcProvider("https://rpc.mantle.xyz/");
const contract = new ethers.Contract(mntAddress, mntABI, provider);


let events=[];

  // event listener for "RangeChange" event
  contract.on("RangeChange", (tickLower, tickUpper) => {
    let info = {
        tickLower: tickLower,
        tickUpper: tickUpper,
         
    };

    //print all the events in console
    console.log(JSON.stringify(info, null, 4));
    //push all the data into events array
    events.push(info);

}
);

  app.get('/', (req, res) => {
    
    res.json(events);
    console.log("Testing");
  
    
  });
  

  // start the Express server
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
