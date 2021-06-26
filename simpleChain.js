const SHA256 = require("crypto-js/sha256")

/**
 * Simple block data model
 */
class Block{
  constructor(data){
    this.hash = "";
    this.height = 0;
    this.transactionBody = data;
    this.timestamp = 0;
    this.previousBlockHash = "";
  }
}

/**
 * Blockchain
 * Data model with function to support:
 * - createGenerisBlock();
 * - addBlock();
 */
class Blockchain{
  constructor(){
    this.chain = [];
    // Creating the Genesis block to the blockchain
    this.addNewBlock(new Block("Genesis block - First block in the chain ⛓️ !"));
  }

  // Blockchain functions

  // Adding block to the blockchain
  addNewBlock(newBlock){
    // Adding a height to the new block
    newBlock.height = this.chain.length;
    // Adding a timestamp (i.e. valid UTC timestamps to validate with external ressources)
    newBlock.timestamp = new Date().getTime().toString().slice(0,-3);
    // Adding the previous block hash if it exists
    if(this.chain.length > 0){
      newBlock.previousBlockHash = this.chain[this.chain.length - 1].hash;
    }
    // Setting the hash of the new block:
    //  Hashing the new block and returning it as a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Adding the new block to the chain
    this.chain.push(newBlock);
  }
}

const myBlockchain = new Blockchain();

const newBlock = () => new Block(`Block #${myBlockchain.chain.length + 1}`);

myBlockchain.addNewBlock(newBlock());
myBlockchain.addNewBlock(newBlock());

console.log(myBlockchain);