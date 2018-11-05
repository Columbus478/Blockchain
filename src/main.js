
const {Blockchain,Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('3bd2d90dfac46f4934997733e8137b55a528fe02a529f2257f846788ca70acdc');
// get your wallet's public key which is your address
const myWalletAddress = myKey.getPublic('hex');
 
  let samBlockChain = new Blockchain();
     //create new transactions---but they will be pending
     const trans1 = new Transaction(myWalletAddress,"To someone address",0);
     trans1.signTransaction(myKey);
     samBlockChain.addTransaction(trans1);
    
       console.log("====Before changes=====");
       console.log(JSON.stringify(samBlockChain,null,4));
       
     console.log("\nStarting the miner....");
     samBlockChain.minePendingTransaction(myWalletAddress);
     console.log('\nMy Balance is: '+ samBlockChain.getBalanceOfAddress(myWalletAddress));
     //Check if BlockChain is valid
        console.log('Is Blockchain valid?' + samBlockChain.isChainValid());
        console.log("\nStarting the miner again...");
     samBlockChain.minePendingTransaction(myWalletAddress);
     console.log('\nMy Balance is: '+ samBlockChain.getBalanceOfAddress(myWalletAddress));
     //Check if BlockChain is valid
        console.log('Is Blockchain valid?' + samBlockChain.isChainValid());

     


        /*console.log("Mining Block ......1");
       samBlockChain.addBlock(new Block(1,"02/11/2018",{token:20}));
       console.log("Mining Block ......2");
       samBlockChain.addBlock(new Block(2,"03/11/2018",{token:40}));
       console.log("Mining Block ......3");
       samBlockChain.addBlock(new Block(3,"04/11/2018",{token:60}));
       console.log("Mining Block ......4");
       samBlockChain.addBlock(new Block(4,"05/11/2018",{token:80}));*/


      /*console.log("====Before changes=====");
       console.log(JSON.stringify(samBlockChain,null,4));
      //Check if BlockChain is valid
        console.log('Is Blockchain valid?' + samBlockChain.isChainValid());

        //change the token(money) of the 2 block
        samBlockChain.chain[1].data.token = 100;
        //re-create the hash
        samBlockChain.chain[1].hash = samBlockChain.chain[1].createHash();
        
        console.log("====After changes=====");
         console.log(JSON.stringify(samBlockChain,null,4));
         //Check if BlockChain is valid  after making a change
         console.log('Is Blockchain valid?' + samBlockChain.isChainValid()); // false because a block as been updated
                                                                            // in the Blockchain*/
