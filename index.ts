import SHA256 = require("crypto-js/sha256");

/**
 * Simple block data model
 */
class Block{
  // Defining the Block types
  hash: string;
  height: number;
  body: string; // In this exaple, the b./node_modules/.bin/tslint --initody will be a string
  timestamp: string;
  previousBlockHash: string;

  constructor(bodyData: string){ 
    this.hash = "";
    this.height = 0;
    this.body = bodyData;
    this.timestamp = "0";
    this.previousBlockHash = "";
  }
}


/**
 * Blockchain
 * Data model with function to support:
 * - addBlock();
 * - getLatestBlock();
 * - getBlockByHash();
 * - validateBlock();
 * - validateChain();
 */
export class Blockchain{
  chain: Block[]; 
  constructor(){
    this.chain = [];
    // Creating the Genesis block to the blockchain
    this.addNewBlock(new Block("Genesis block - First block in the chain ⛓️ !"));
  }

  // Blockchain functions

  /** Adding block to the blockchain */
  addNewBlock(newBlock: Block){
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

  /** Simply gets the last block added to the chain  */
  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  /** Getting the block inside the chain from an hash */
  getBlockByHash(hash: string){
    return this.chain.find(block => block.hash === hash);
  }

  /** Validate that the block has the right hash */
  validateBlock(blockToVerify: any){
    // Saving the hash to verify before resetting the hash to an empty and running the sha256 hashing function
    const oldHash = blockToVerify.hash;
    const clonedBlockToVerify = Object.assign({}, blockToVerify);
    clonedBlockToVerify.hash = "";
    // comparing the 2 hashs to see if the data is the same
    const blockIsValid = SHA256(JSON.stringify(clonedBlockToVerify)).toString() === oldHash;
    if(!blockIsValid) {
      console.error("❌ INVALID BLOCK FOUND:");
      console.error(blockToVerify);
      return false;
    }
    return true;
  }

  /** Validate that the chain is valid */
  validateChain(){
    // First get the last block 
    let blockToValidate = this.getLatestBlock();

    // Validate each block until the genesis block and return if the chain is valid or not
    while (blockToValidate.height >= 0) {
      const isValidBlock = this.validateBlock(blockToValidate);
      // If the block is not valid, return that the chain is not valid
      if(!isValidBlock){
        return false;
      }
      // If it's the genesis block, the chain is completely validated
      if(blockToValidate.height === 0){
        return true;
      }
      // Otherwise, get the previous block and validate it
      const previousBlockHashToValidate =  blockToValidate.previousBlockHash;
      const nextBlockToValidate = this.getBlockByHash(previousBlockHashToValidate);
      // If the next block didn't exist, the chain isn't valid
      if(!nextBlockToValidate){
        return false;
      }
      // Change the block to validate
      blockToValidate = nextBlockToValidate;
    }
  }
}

// // Creating the blockchain
// const myBlockchain = new Blockchain();

// // Simple function that create a new block with the block number as body
// const newBlock = () => new Block(`Block #${myBlockchain.chain.length + 1}`);

// // Adding 10 blocks to my blockchain
// for(let i = 0; i < 3; i++){
//   myBlockchain.addNewBlock(newBlock());
// }

// // Checking if the chain is valid and printing the output
// const chainIsValid = myBlockchain.validateChain();
// console.log(`The Chain is${chainIsValid ? '' : "n't"} valid ${chainIsValid ? '✅' : "❌"} `);