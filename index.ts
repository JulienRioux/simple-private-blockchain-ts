import SHA256 = require("crypto-js/sha256");

export const GENESIS_BLOCK_BODY = "Genesis block - First block in the chain ⛓️ !";

/** Helper function that create timestamp (i.e. valid UTC timestamps to validate with external ressources) */
export const createNewUtcDate = () => new Date().getTime().toString().slice(0,-3);

/** Helper function to hash a block using SHA256 */
export const hashBlock = (block: Block) => SHA256(JSON.stringify(block)).toString()

/**
 * Simple block data model
 */
export class Block{
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
    this.addNewBlock(GENESIS_BLOCK_BODY);
  }

  // Blockchain functions

  /** Adding block to the blockchain */
  addNewBlock(bodyData: string){
    const newBlock = new Block(bodyData);
    // Adding a height to the new block
    newBlock.height = this.chain.length;
    // Adding a timestamp
    newBlock.timestamp = createNewUtcDate();
    // Adding the previous block hash if it exists
    if(this.chain.length > 0){
      newBlock.previousBlockHash = this.chain[this.chain.length - 1].hash;
    }
    // Setting the hash of the new block:
    //  Hashing the new block and returning it as a string
    newBlock.hash = hashBlock(newBlock);
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
