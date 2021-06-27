"use strict";
exports.__esModule = true;
exports.Blockchain = exports.Block = exports.hashBlock = exports.createNewUtcDate = exports.GENESIS_BLOCK_BODY = void 0;
var SHA256 = require("crypto-js/sha256");
exports.GENESIS_BLOCK_BODY = "Genesis block - First block in the chain ⛓️ !";
/** HElper function that create timestamp (i.e. valid UTC timestamps to validate with external ressources) */
var createNewUtcDate = function () { return new Date().getTime().toString().slice(0, -3); };
exports.createNewUtcDate = createNewUtcDate;
/** Helper function to hash a block using SHA256 */
var hashBlock = function (block) { return SHA256(JSON.stringify(block)).toString(); };
exports.hashBlock = hashBlock;
/**
 * Simple block data model
 */
var Block = /** @class */ (function () {
    function Block(bodyData) {
        this.hash = "";
        this.height = 0;
        this.body = bodyData;
        this.timestamp = "0";
        this.previousBlockHash = "";
    }
    return Block;
}());
exports.Block = Block;
/**
 * Blockchain
 * Data model with function to support:
 * - addBlock();
 * - getLatestBlock();
 * - getBlockByHash();
 * - validateBlock();
 * - validateChain();
 */
var Blockchain = /** @class */ (function () {
    function Blockchain() {
        this.chain = [];
        // Creating the Genesis block to the blockchain
        this.addNewBlock(exports.GENESIS_BLOCK_BODY);
    }
    // Blockchain functions
    /** Adding block to the blockchain */
    Blockchain.prototype.addNewBlock = function (bodyData) {
        var newBlock = new Block(bodyData);
        // Adding a height to the new block
        newBlock.height = this.chain.length;
        // Adding a timestamp
        newBlock.timestamp = exports.createNewUtcDate();
        // Adding the previous block hash if it exists
        if (this.chain.length > 0) {
            newBlock.previousBlockHash = this.chain[this.chain.length - 1].hash;
        }
        // Setting the hash of the new block:
        //  Hashing the new block and returning it as a string
        newBlock.hash = exports.hashBlock(newBlock);
        // Adding the new block to the chain
        this.chain.push(newBlock);
    };
    /** Simply gets the last block added to the chain  */
    Blockchain.prototype.getLatestBlock = function () {
        return this.chain[this.chain.length - 1];
    };
    /** Getting the block inside the chain from an hash */
    Blockchain.prototype.getBlockByHash = function (hash) {
        return this.chain.find(function (block) { return block.hash === hash; });
    };
    /** Validate that the block has the right hash */
    Blockchain.prototype.validateBlock = function (blockToVerify) {
        // Saving the hash to verify before resetting the hash to an empty and running the sha256 hashing function
        var oldHash = blockToVerify.hash;
        var clonedBlockToVerify = Object.assign({}, blockToVerify);
        clonedBlockToVerify.hash = "";
        // comparing the 2 hashs to see if the data is the same
        var blockIsValid = SHA256(JSON.stringify(clonedBlockToVerify)).toString() === oldHash;
        if (!blockIsValid) {
            console.error("❌ INVALID BLOCK FOUND:");
            console.error(blockToVerify);
            return false;
        }
        return true;
    };
    /** Validate that the chain is valid */
    Blockchain.prototype.validateChain = function () {
        // First get the last block 
        var blockToValidate = this.getLatestBlock();
        // Validate each block until the genesis block and return if the chain is valid or not
        while (blockToValidate.height >= 0) {
            var isValidBlock = this.validateBlock(blockToValidate);
            // If the block is not valid, return that the chain is not valid
            if (!isValidBlock) {
                return false;
            }
            // If it's the genesis block, the chain is completely validated
            if (blockToValidate.height === 0) {
                return true;
            }
            // Otherwise, get the previous block and validate it
            var previousBlockHashToValidate = blockToValidate.previousBlockHash;
            var nextBlockToValidate = this.getBlockByHash(previousBlockHashToValidate);
            // If the next block didn't exist, the chain isn't valid
            if (!nextBlockToValidate) {
                return false;
            }
            // Change the block to validate
            blockToValidate = nextBlockToValidate;
        }
    };
    return Blockchain;
}());
exports.Blockchain = Blockchain;
