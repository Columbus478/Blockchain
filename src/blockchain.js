//Tutorial on: https://www.youtube.com/watch?v=zVqczFZr124
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
   constructor(fromAddress, toAddress,amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
   }
   calculateTransHash(){
    return SHA256(this.fromAddress+this.toAddress+this.amount).toString();
   }

   signTransaction(signingKey){
    //check if singing key is valid with the fromAddress
    if(signingKey.getPublic('hex') !== this.fromAddress){
         console.log("You can not sign transaction for other wallets");
    }
    const hashTrans = this.calculateTransHash();
    const sig = signingKey.sign(hashTrans,'base64');
    this.signature = sig.toDER('hex');
   }
   isTransactionValid(){
    if(this.fromAddress ===null) return true;
     //check if signature is correct or empty
     if(!this.signature || this.signature.length ===0){
      throw new Error("No signature in this transaction.");
      //if the signature is signed, check if it's with the right public key
      const publicKey = ec.keyFromPublic(this.fromAddress,'hex');
      return publicKey.verify(this.calculateTransHash(),this.signature); //verify by comparing the 
                                                                          //hashtrans with signature.
     }

    return true;
   }
}
class Block{
    
    constructor(timestamp,transaction,previousHash =''){
        //this.index = index; No index in real life case
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.previousHash = previousHash
        this.hash = this.createHash();
        this.nonce =0;
    }
    createHash(){
     return SHA256(this.timestamp+ this.previousHash +this.nonce).toString();
   }
   // Tutorial: Implementing Proof-of-Work in Javascript (Blockchain, part 2)
   //https://www.youtube.com/watch?v=HneatE69814
   //difficult is used to restrict the ease of access/creation to blocks(usually for 10mins)
    mineBlock(difficulty){
       while(this.hash.substring(0,difficulty) !==Array(difficulty+1).join("0")){
            this.nonce++; // hash will not be updated if a variable in the block doesn't change.
           this.hash = this.createHash(); //hash will change due the nonce update
        }
        console.log("Block mined: "+ this.hash);
    }
    //verify if all the transactions in this block is valid
    hasValidTransaction(){
      //loop throgh the transactions in this block
      for(const tranX of this.transaction){
        if(!tranX.isTransactionValid()){ return false}
      }
    return true;
    }
}
 
 
 
 
 class Blockchain{
     constructor(){
      //create an array that takes objects of block.
         this.chain = [this.creatParentBlock()];
         //add pending transaction for review and rewards
         this.PendingTransaction = [];
         this. miningReward = 100;
         //add difficult here
         this.difficulty =2;
         
     }
     
     creatParentBlock(){
     return new Block("01/11/2018","Genesis block","0");
    }
    getLastBlock(){
     return this.chain[this.chain.length-1];
    }
 
     /*addBlock(newBlock){
         newBlock.previousHash = this.getLastBlock().hash;
         newBlock.mineBlock(this.difficulty);
         this.chain.push(newBlock);
       }*/
       //Not adding Block---switch to mine pending transactions
       minePendingTransaction(miningRewardAddress){ // where address is the public key of a BitCoin user wallet's
           let block = new Block(Date.now(), this.PendingTransaction); // Note: in real life, Miners chose
            block.mineBlock(this.difficulty);                          // what pending transaction to add
            console.log("Block successfully mined.");
            //add block here.
            this.chain.push(block);

            this.PendingTransaction = [
              new Transaction(null,miningRewardAddress,this.miningReward) //null because the fromAd is System's.
            ];
       }

       addTransaction(Transaction){
        //check if there are fromAddress and toAddress
        if(!Transaction.fromAddress || !Transaction.toAddress){ 
          throw new Error("Transaction must include fromAddress and toAddress.");
          }
          if(!Transaction.isTransactionValid()){
            throw new Error("Can not add invalid Transaction to the chain.");
          }
        this.PendingTransaction.push(Transaction);
       }

       getBalanceOfAddress(address){
        let balance =0;
        //loop through the Blockchain to get the blocks
        for(const block of this.chain){
          //loop through the blocks to get the Transactions.
            for(const trans of block.transaction){

                if(trans.fromAddress === address) balance -= trans.amount;
                if(trans.toAddress === address) balance += trans.amount;
            }

        }
            return balance;
       }

       isChainValid(){

       	for (var i = 1; i < this.chain.length; i++) {
       		const currentBlock = this.chain[i];
       		const prevoiusBlock = this.chain[i-1]; 
          // check this chain to verify if the transactions in each block are valid
          if(!currentBlock.hasValidTransaction()){
            return false;
          }

       		if(currentBlock.hash !== currentBlock.createHash()){
       			return false;
       		}
       		
       		if(currentBlock.previousHash !== prevoiusBlock.createHash()){
       			return false;
       		} 
 		
        }
        return true;
  }
}
module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;